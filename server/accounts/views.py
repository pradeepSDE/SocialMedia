from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, ConnectionSerializer, PostSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, Connection, Post
from rest_framework import generics, permissions
from django.db.models import Q, Case, When, Value, IntegerField
from rest_framework.permissions import IsAuthenticated

# Create your views here.


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print(user, "user")
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            print(refresh, "refresh")
            print(access_token, "access_token")
            return Response({
                'refresh': str(refresh),
                'access': access_token,
                'username': user.username,
                'email': user.email,
                'mobile': user.profile.mobile if hasattr(user, 'profile') else '',
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        password = request.data.get('password')
        mobile = request.data.get('mobile')

        # Retrieve UserProfile based on the mobile number
        user_profile = UserProfile.objects.filter(mobile=mobile).first()

        # If a user profile is found, access the associated User and check the password
        if user_profile:
            user = user_profile.user  # Access the User instance associated with the UserProfile
            if user.check_password(password):  # Check password on the User model
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                response_data = {
                    'refresh': str(refresh),
                    'access': access_token,
                    'username': user.username,
                    'email': user.email,
                    'mobile': user_profile.mobile,  # Use user_profile to get mobile
                }
                return Response(response_data, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ConnectionListCreateView(generics.ListCreateAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Connection.objects.filter(from_user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = [
            {
                'id': conn.id,
                'to_user': conn.to_user.username,
                'to_user_id': conn.to_user.id,
                'created': conn.created,
            }
            for conn in queryset
        ]
        return Response(data)

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)


class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(
            Q(audience='public') |
            Q(audience='connections', user__connections_received__from_user=user) |
            Q(user=user)
        ).distinct().order_by('-created')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.GET.get('q', '')
        user = request.user
        connections = Connection.objects.filter(
            from_user=user).values_list('to_user', flat=True)
        users = User.objects.annotate(
            is_connected=Case(
                When(id__in=connections, then=Value(1)),
                default=Value(0),
                output_field=IntegerField()
            )
        ).filter(
            Q(username__icontains=query) | Q(email__icontains=query) | Q(
                profile__mobile__icontains=query)
        ).order_by('-is_connected', 'username')
        data = [
            {
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'mobile': u.profile.mobile if hasattr(u, 'profile') else '',
                'is_connected': u.is_connected
            }
            for u in users
        ]
        return Response(data)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        is_connected = Connection.objects.filter(
            from_user=request.user, to_user=user).exists()
        my_connections = set(Connection.objects.filter(
            from_user=request.user).values_list('to_user', flat=True))
        their_connections = set(Connection.objects.filter(
            from_user=user).values_list('to_user', flat=True))
        mutual_ids = my_connections & their_connections
        mutual_users = User.objects.filter(id__in=mutual_ids)
        other_ids = their_connections - mutual_ids
        other_users = User.objects.filter(id__in=other_ids)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "mobile": getattr(user.profile, 'mobile', ''),
            "is_connected": is_connected,
            "mutual_connections": [
                {"id": u.id, "username": u.username} for u in mutual_users
            ],
            "other_connections": [
                {"id": u.id, "username": u.username} for u in other_users
            ]
        })

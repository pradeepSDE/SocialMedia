from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, ConnectionSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, Connection
from rest_framework import generics, permissions
# Create your views here.


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)

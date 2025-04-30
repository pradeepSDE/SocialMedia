from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile
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
        # username = request.data.get('username')
        # email = request.data.get('email')
        password = request.data.get('password')
        mobile = request.data.get('mobile')
        user = UserProfile.objects.filter(mobile=mobile).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            response_data = {
                'refresh': str(refresh),
                'access': access_token,
                'username': user.username,
                'email': user.email,
                'mobile': user.profile.mobile,  
            }
            return Response(response_data, status=status.HTTP_200_OK)   
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
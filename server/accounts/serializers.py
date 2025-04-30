from rest_framework import serializers
from django.contrib.auth.models import User
from accounts.models import UserProfile  # import your profile model

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    mobile = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'mobile']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists"})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered"})
        if UserProfile.objects.filter(mobile=data['mobile']).exists():
            raise serializers.ValidationError({"mobile": "Mobile number already registered"})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')
        mobile = validated_data.pop('mobile')

        user = User.objects.create_user(**validated_data, password=password)
        UserProfile.objects.create(user=user, mobile=mobile)

        return user

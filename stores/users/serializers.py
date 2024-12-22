from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = "__all__"
        
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email",'phone_number', 'first_name', 'last_name', 'user_type', 'profile_pic','password']
        extra_kwargs = {"password":{"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user 
        raise serializers.ValidationError("Invalid email or password")
        
        
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetYourPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["password"]

class ChangeMyPasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    
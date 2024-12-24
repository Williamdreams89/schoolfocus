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
        email = data.get("email")
        password = data.get("password")

        # Authenticate the user
        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        # Check if the account is active
        if not user.is_account_active:
            raise serializers.ValidationError("Account is inactive")

        # Return the authenticated user
        data["user"] = user
        return data
        
        
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetYourPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["password"]

class ChangeMyPasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    
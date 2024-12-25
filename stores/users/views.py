from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import *
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Utils
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import views
from django.conf import settings
import jwt
from .utils import Utils
from sms import send_sms
import smtplib
from email.message import EmailMessage

def send_email(subject, body, to):
    email_msg = EmailMessage()
    email_msg.set_content(body)
    email_msg["subject"] = subject
    email_msg["to"] = to
    user = "schoolfocus311@gmail.com"
    password = "yjfu psrh xzkk gwow"
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(user, password)
    server.quit()


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserSignUpAPIView(generics.GenericAPIView):
    serializer_class = UserRegisterSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        serializer.save()
        user = User.objects.get(email=serializer.data["email"])
        token = RefreshToken.for_user(user)
        verification_token = str(token)
        current_site = get_current_site(request).domain
        relative_url = reverse("verify_email")
        abs_url = "{}{}?token={}".format(current_site,relative_url, verification_token)
        EMAIL_BODY = "Hello, {}\nUse this link to verify your email:\n{}".format(user.first_name, abs_url)
        EMAIL_SUBJECT = "Verify your email"
        EMAIL_TO = user.email
        SMS_RECIPIENT = user.phone_number
        send_sms(EMAIL_BODY, [SMS_RECIPIENT], fail_silently=False, connection=None)
        try:
            send_email(subject=EMAIL_SUBJECT, body=EMAIL_BODY, to=EMAIL_TO)
            print("Email verification successful")
            return Response({"message":"Email sent successfully!","email body": abs_url})
            # payload = {"EMAIL_SUBJECT": EMAIL_SUBJECT, "EMAIL_BODY":EMAIL_BODY, "EMAIL_TO":EMAIL_TO,}
        except Exception as e:
            return Response(f"Email Verification failed: {e}")
        # Utils.send_email(payload)
        
    
class VerifyEmailAPIView(views.APIView):
    """The APIView to verify the user"""
    token_param_config = openapi.Parameter("token", in_=openapi.IN_QUERY, description="Use your token", type=openapi.TYPE_STRING)
    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        """Get the token from the request, decypher it and verify the user"""
        try:
            token = request.GET.get("token")
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            user_id = payload["user_id"]
            if User.objects.filter(id=user_id).exists():
                user = User.objects.get(id=user_id)
                user.is_verified = True
                user.save()
                return Response('User email is verified', status=status.HTTP_200_OK)
            return Response("User with the stated email does not exist", status=status.HTTP_400_BAD_REQUEST)
        except jwt.DecodeError as error:
            return Response("Email cannot be used, has been tampered!", status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.ExpiredSignatureError as error:
            return Response("Token in email has been expired")
    
class UserLoginAPIView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        try:
            user = User.objects.get(email=serializer.data["email"])
            rToken = RefreshToken.for_user(user)
            access_token = str(rToken.access_token)
            return Response({"tokens":{"refresh_token": str(rToken), "access_token": access_token}, "username":user.full_name, "user_id":user.id, 'user_role':user.user_type, }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PasswordResetRequestAPIView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Sending Email Message if user actually exists
        if User.objects.filter(email=serializer.data["email"]).exists():
            user = User.objects.get(email=serializer.validated_data["email"])
            EMAIL_SUBJECT = "Reset Your Password"
            current_site = get_current_site(request).domain
            # Prepare pwd reset token and encode the user id
            token = PasswordResetTokenGenerator().make_token(user)
            uuidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            reversed_url = reverse("reset-password", kwargs={"token": token, "uuidb64": uuidb64})
            abs_url = "{}{}".format(current_site, reversed_url)
            EMAIL_BODY = f"Dear {user.full_name},\nPlease use the link below to reset your password: \n{abs_url}"
            EMAIL_TO = user.email
            payload = {"EMAIL_SUBJECT": EMAIL_SUBJECT, "EMAIL_BODY": EMAIL_BODY, "EMAIL_TO":EMAIL_TO}
            Utils.send_email(payload)
            return Response({"msg": "successful", "Email body": EMAIL_BODY}, status=status.HTTP_200_OK)
        return Response(f"User does not exist", status=status.HTTP_400_BAD_REQUEST)


class ResetYourPasswordAPIView(generics.GenericAPIView):
    serializer_class = ResetYourPasswordSerializer
    def post(self, request,token, uuidb64):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        try:
            id = force_str(urlsafe_base64_decode(uuidb64))
            user = User.objects.get(id = id)
            user.set_password(serializer.validated_data["password"])
            user.save()
            return Response("Password reset successfully", status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e))
        
class ChangeMyPasswordAPIView(generics.UpdateAPIView):
    serializer_class = ChangeMyPasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    model = User
    def get_object(self):
        return self.request.user
    def update(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        old_password = serializer.data["old_password"]
        new_password = serializer.data["new_password"]
        if self.get_object().check_password(old_password):
            self.get_object().set_password(new_password)
            self.get_object().save()
            return Response("Password changed")
        return Response("Sorry, password mismatch")


        
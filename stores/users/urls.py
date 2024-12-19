from django.urls import path
from .views import UserSignUpAPIView, UserLoginAPIView, PasswordResetRequestAPIView, ResetYourPasswordAPIView, ChangeMyPasswordAPIView, UserListAPIView

urlpatterns = [
    path('', UserListAPIView.as_view()),
    path("register/", UserSignUpAPIView.as_view(), name="register"),
    path("login/", UserLoginAPIView.as_view(), name="login"),
    path("password-reset-request/", PasswordResetRequestAPIView.as_view(), name="password-reset-request"),
    path("reset-password/<str:token>/<str:uuidb64>/", ResetYourPasswordAPIView.as_view(), name="reset-password"),
    path('change-my-pwd/', ChangeMyPasswordAPIView.as_view())
]
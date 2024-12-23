from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="School Management App",
      default_version='Version 1.0.0',
      description="For Student Academic Management",
      terms_of_service="https://willconsult.vercel.app",
      contact=openapi.Contact(email="danquahwilliam@gmail.com"),
      license=openapi.License(name="Ghana Software Developer Association."),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("users/", include("users.urls")),
    path("api/", include("api.urls")),
    path('',  schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('drf-login/', include("rest_framework.urls", namespace="rest_framework"))
]
from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'phone_number','first_name', 'last_name', 'user_type', 'profile_pic', 'date_created', 'is_verified','is_superuser']

admin.site.register(User, UserAdmin)
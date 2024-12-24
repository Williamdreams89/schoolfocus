from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'first_name', 'last_name', 'user_type', 'date_created', 'is_verified','is_superuser', 'is_account_active']

admin.site.register(User, UserAdmin)
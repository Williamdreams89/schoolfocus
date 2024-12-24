from django.contrib import admin
from .models import Student, GuadianOrParent

class StudentsAdmin(admin.ModelAdmin):
    list_display = [
                     'profile_pic',
                     'email',
                     'first_name',
                     'last_name',
                     'gender',
                     'registration_number',
                     'gender',
                     'is_account_active'
                    ]
class ParentAdmin(admin.ModelAdmin):
    list_display = [
                    'email',
                     'full_name',
                     'relationship',
                     'occupation',
                     'phone_number',
                     'is_account_active'
                    ]

admin.site.register(Student, StudentsAdmin)
admin.site.register(GuadianOrParent, ParentAdmin)
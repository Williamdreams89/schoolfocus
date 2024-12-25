from django.contrib import admin
from .models import Student, GuadianOrParent

class StudentsAdmin(admin.ModelAdmin):
    list_display = [
                    'id',
                     'index_number',
                     'profile_pic',
                     'email',
                     'first_name',
                     'last_name',
                     'gender',
                     'display_guardian',
                    ]
    def display_guardian(self, obj):
        # Join all parent names into a single string
        return ", ".join([f"{guardian.first_name} {guardian.last_name}" for guardian in obj.guardian.all()])
    display_guardian.short_description = 'Guardian'  # Column name in admin

class ParentAdmin(admin.ModelAdmin):
    list_display = [
                    'email',
                     'full_name',
                     'relationship',
                     'occupation',
                     'phone_number',
                    ]

admin.site.register(Student, StudentsAdmin)
admin.site.register(GuadianOrParent, ParentAdmin)
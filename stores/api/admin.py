from django.contrib import admin
from .models import Student, GuadianOrParent, Subject, StudentClass as Class

class StudentsAdmin(admin.ModelAdmin):
    list_display = [
                    'id',
                     'index_number',
                     'profile_pic',
                     'email',
                     'first_name',
                     'last_name',
                     'student_class',
                     'gender',
                     'display_guardian',
                     'registration_number'
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
    
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'code']

admin.site.register(Subject, SubjectAdmin)

class ClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'academic_year']

admin.site.register(Class, ClassAdmin)

admin.site.register(Student, StudentsAdmin)
admin.site.register(GuadianOrParent, ParentAdmin)
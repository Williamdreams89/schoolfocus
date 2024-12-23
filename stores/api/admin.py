from django.contrib import admin
from .models import Student

class StudentsAdmin(admin.ModelAdmin):
    list_display = ['surname', 'first_name', 'gender']

admin.site.register(Student, StudentsAdmin)
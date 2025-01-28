from django.contrib import admin
from .models import *

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
    list_display = ['name',]

class ResultAdmin(admin.ModelAdmin):
    list_display = ["student",'Class', "academic_year", "exam_session", "subject", "continuous_assessment", "exams_score", "grade", "score", "remarks"]

    def Class(self, obj):
        return obj.student.student_class.name
    
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]

class SkillAdmin(admin.ModelAdmin):
    list_display = ["id","name", "category"]

class SkillAssessmentAdmin(admin.ModelAdmin):
    list_display = ["student", "skill", "score", "exam_session", "academic_year"]


admin.site.register(StudentClass, ClassAdmin)
admin.site.register(SkillCategory, SkillCategoryAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(SkillAssessment, SkillAssessmentAdmin)
admin.site.register(Results, ResultAdmin)

admin.site.register(Student, StudentsAdmin)
admin.site.register(GuadianOrParent, ParentAdmin)
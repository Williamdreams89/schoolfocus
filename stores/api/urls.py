from django.urls import path
from .views import *

urlpatterns = [
    path('studentsList/', StudentListView.as_view(), name='student-list'),
    path('enroll-student/', EnrollStudentView.as_view(), name='enroll-student'),
    path('add-guardian/', AddGuadianOrParentView.as_view(), name=''),
    path('parentorguardian/', ParentOrGuardianView.as_view(), name=''),
    path('bulk-enroll-students/', BulkEnrollStudentsAPIView.as_view(), name='bulk-enroll-students'),
    path('student/<int:pk>/', StudentEditDetailsView.as_view()),
    path('api/guardians-multiple/', MultipleGuardianCreateView.as_view(), name='guardian-create'),
]

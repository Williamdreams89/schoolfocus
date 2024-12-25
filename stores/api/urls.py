from django.urls import path
from .views import EnrollStudentView, BulkEnrollStudentsAPIView, StudentSignUpAPIView, VerifyEmail, StudentLoginAPIView, StudentListView

urlpatterns = [
    path('studentsList/', StudentListView.as_view(), name='student-list'),
    path('enroll-student/', EnrollStudentView.as_view(), name='enroll-student'),
    path('bulk-enroll-students/', BulkEnrollStudentsAPIView.as_view(), name='bulk-enroll-students'),
    path('student/register/', StudentSignUpAPIView.as_view(), name='student-register'),
    path('student/verify/', VerifyEmail.as_view(), name='verify_email'),
    path('student/login/', StudentLoginAPIView.as_view(), name='student-login'),
]

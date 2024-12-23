from django.urls import path
from .views import EnrollStudentView, BulkEnrollStudentsAPIView

urlpatterns = [
    path('enroll-student/', EnrollStudentView.as_view(), name='enroll-student'),
    path('bulk-enroll-students/', BulkEnrollStudentsAPIView.as_view(), name='bulk-enroll-students'),
]

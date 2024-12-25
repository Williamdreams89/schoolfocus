from django.urls import path
from .views import *

urlpatterns = [
    path('studentsList/', StudentListView.as_view(), name='student-list'),
    path('enroll-student/', EnrollStudentView.as_view(), name='enroll-student'),
    path('add-guardian/', AddGuadianOrParentView.as_view(), name=''),
    path('bulk-enroll-students/', BulkEnrollStudentsAPIView.as_view(), name='bulk-enroll-students'),
]

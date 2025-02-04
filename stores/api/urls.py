from django.urls import path
from .views import *

urlpatterns = [
    path('student/<int:pk>/', StudentEditDetailsView.as_view(), name='student-list'),
    path('studentsList/<str:student_class_name>/<str:academic_year>/', StudentListView.as_view(), name='student-list'),
    path('enroll-student/', EnrollStudentView.as_view(), name='enroll-student'),
    path('add-guardian/', AddGuadianOrParentView.as_view(), name=''),
    path('parentorguardian/', ParentOrGuardianView.as_view(), name=''),
    path('bulk-enroll-students/', BulkEnrollStudentsAPIView.as_view(), name='bulk-enroll-students'),
    path('bulky-enroll-students/', BulkyEnrollStudentsAPIView.as_view(), name='bulk-enroll-students'),
    path('bulkyy-enroll-students/', BulkEnrollStudentsAPIViewThree.as_view(), name='bulk-enroll-students'),
    path('student/<int:pk>/', StudentEditDetailsView.as_view()),
    path('api/guardians-multiple/', MultipleGuardianCreateView.as_view(), name='guardian-create'),
    path("results/<str:student_class_name>/", StudentResultsAPIView.as_view(), name="student-results"),

    path("a_student_results/", StudentResultsAPIView.as_view(), name="student-results"),
    path("subject/", SubjectListView.as_view()),
    path(
        'results/review/<str:student_class>/<str:academic_year>/<str:exam_session>/',
        ResultsReviewAPIView.as_view(),
        name='results-review',
    ),
    path(
        'results/review_new/<str:student_class_name>/<int:academic_year>/<str:exam_session>/',
        ResultsSummaryView.as_view(),
        name='results-summary',
    ),
    path(
        'results/subjects/<str:student_class_name>/<str:academic_year>/<str:exam_session>/',
        SubjectsInResultsView.as_view(),
        name='subjects-in-results',
    ),
    path("class/", StudentClassAPIView.as_view()),
    path('indexer/', GenerateIndexNumberAPIView.as_view()),
    path('tags/', TagListCreateAPIView.as_view()),
    path(
        'results/per_subject/review/<str:academic_year>/<str:exam_session>/<str:class_name>/<str:subject_title>/',
        ResultDetailAPIView.as_view(),
        name='result-detail'
    ),
    path("skills/assessment/<str:student_class>/<str:academic_year>/<str:exam_session>/", SkillAssessmentAPIView.as_view()),
    path("skills/assessment/entry/<str:student_class>/<str:academic_year>/<str:exam_session>/", RecordAStudentSkillAssessmentAPIView.as_view()),
    path('subjects-by-class/', SubjectListByClassView.as_view(), name='subjects-by-class'),
]

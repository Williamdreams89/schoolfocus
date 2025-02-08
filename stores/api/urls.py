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

    path('academic-sessions/', AcademicSessionListView.as_view(), name='academic-session-list'),
    path('academic-sessions/<int:pk>/', AcademicSessionRetrieveView.as_view(), name='academic-session-retrieve'),
    path('academic-sessions/<int:pk>/update/', AcademicSessionUpdateView.as_view(), name='academic-session-update'),
    path('academic-term/', AcademicTermListView.as_view(), name='academic-term-list'),
    path('academic-term/<int:pk>/', AcademicTermRetrieveView.as_view(), name='academic-term-retrieve'),
    path('academic-term/<int:pk>/update/', AcademicTermUpdateView.as_view(), name='academic-term-update'),
    path("academic-terms-by-session/<int:session_id>/", AcademicTermsBySessionView.as_view(), name="academic-terms-by-session"),
    path("academic/settings/activate/<int:session_id>/<int:term_id>/", ActivateSessionAndTermView.as_view(), name="activate-session-term"),
    path("academic/inactive-sessions/", InactiveAcademicSessionsView.as_view(), name="inactive-sessions"),

    path('system-settings/', SystemSettingsListView.as_view(), name='system-settings-list'),
    path('system-settings/<int:pk>/', SystemSettingsRetrieveView.as_view(), name='system-settings-retrieve'),
    path('system-settings/<int:pk>/update/', SystemSettingsUpdateView.as_view(), name='system-settings-update'),
    path("system-settings/update/", SystemSettingsUpdateView.as_view(), name="system-settings-update"),


    path('system-images/', SystemImagesListView.as_view(), name='system-images-list'),
    path('system-images/<int:pk>/', SystemImagesRetrieveView.as_view(), name='system-images-retrieve'),
    path('system-images/<int:pk>/update/', SystemImagesUpdateView.as_view(), name='system-images-update'),

    path('email-settings/', EmailSettingsListView.as_view(), name='email-settings-list'),
    path('email-settings/<int:pk>/', EmailSettingsRetrieveView.as_view(), name='email-settings-retrieve'),
    path('email-settings/<int:pk>/update/', EmailSettingsUpdateView.as_view(), name='email-settings-update'),

    path('sms-settings/', SmsSettingsListView.as_view(), name='sms-settings-list'),
    path('sms-settings/<int:pk>/', SmsSettingsRetrieveView.as_view(), name='sms-settings-retrieve'),
    path('sms-settings/<int:pk>/update/', SmsSettingsUpdateView.as_view(), name='sms-settings-update'),

    path('user-privileges/', UserPrivilegesListView.as_view(), name='user-privileges-list'),
    path('user-privileges/<int:pk>/', UserPrivilegesRetrieveView.as_view(), name='user-privileges-retrieve'),
    path('user-privileges/<int:pk>/update/', UserPrivilegesUpdateView.as_view(), name='user-privileges-update'),
]

from django.urls import path
from .views import (
    AssignmentListCreateView, 
    AssignmentDetailView, 
    SubmissionListCreateView, 
    GradeSubmissionView,
    StudentPerformanceView
)

urlpatterns = [
    path('courses/<int:course_pk>/assignments/', AssignmentListCreateView.as_view(), name='assignment_list_create'),
    path('courses/<int:course_pk>/assignments/<int:pk>/', AssignmentDetailView.as_view(), name='assignment_detail'),
    path('courses/<int:course_pk>/assignments/<int:pk>/submissions/', SubmissionListCreateView.as_view(), name='submission_list_create'),
    path('courses/<int:course_pk>/assignments/<int:pk>/submissions/<int:submission_pk>/grade/', GradeSubmissionView.as_view(), name='grade_submission'),
    path('performance/', StudentPerformanceView.as_view(), name='student_performance'),
    path('performance/<int:student_id>/', StudentPerformanceView.as_view(), name='student_performance_detail'),
]


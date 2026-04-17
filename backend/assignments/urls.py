from django.urls import path

from backend.courses.urls import urlpatterns
from .views import AssignmentListCreateView, AssignmentViewOptionSet, SubmissionListCreateView, GradeSubmissionView


urlpatterns = [
     path('', AssignmentListCreateView.as_view(), name='assignment_list_create'),
     path('<int:pk>/', AssignmentViewOptionSet.as_view(), name='assignment_detail'),
     path('<int:pk>/submissions/', SubmissionListCreateView.as_view(), name='submission_list_create'),
     path('<int:pk>/submissions/<int:submission_pk>/grade/', GradeSubmissionView.as_view(), name='grade_submission'),
]

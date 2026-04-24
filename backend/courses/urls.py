from django.urls import path
from .views import CourseListCreateView, CourseDetailView, EnrollmentView, EnrollmentManageView, CourseCompleteView

urlpatterns = [
    path('', CourseListCreateView.as_view(), name='course_list_create'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('<int:pk>/complete/', CourseCompleteView.as_view(), name='course_complete'),
    path('enroll/', EnrollmentView.as_view(), name='enroll'),
    path('enrollments/', EnrollmentManageView.as_view(), name='enrollments'),
    path('enrollments/<int:pk>/', EnrollmentManageView.as_view(), name='enrollment_manage'),
]



from django.urls import path
from .views import MaterialListCreateView, MaterialUpdate

urlpatterns = [
    path('courses/<int:course_pk>/materials/', MaterialListCreateView.as_view(), name='material_list_create'),
    path('courses/<int:course_pk>/materials/<int:pk>/', MaterialUpdate.as_view(), name='material_update'),
]
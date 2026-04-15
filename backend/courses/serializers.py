from rest_framework import serializers
from .models import Course, Enrollment

class CourseSerializer(serializers.ModelSerializer):
     teacher_name = serializers.CharField(source = 'teacher.username', read_only = True)
     prerequisites = serializers.PrimaryKeyRelatedField(many = True,
                    queryset = Course.objects.all(), required = False)
     
     class Meta:
          model = Course
          fields = ['id', 'name', 'description', 'teacher', 'teacher_name',
                    'prerequisites', 'is_active', 'created_at']
          read_only_fields = ['created_at']

class EnrollmentSerializer(serializers.ModelSerializer):
     student_name = serializers.CharField(source = 'student.username', read_only = True)
     course_name = serializers.CharField(source = 'course.name', read_only = True)
     
     class Meta:
          model = Enrollment
          fields = ['id', 'student', 'student_name', 'course', 'course_name',
                    'status', 'applied_at']
          read_only_fields = ['applied_at', 'student']
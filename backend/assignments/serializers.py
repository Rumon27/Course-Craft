from rest_framework import serializers
from .models import Assignment, Submission

class AssignmentSerializer(serializers.ModelSerializer):
     course_name = serializers.CharField(source='course.name', read_only = True)

     class Meta:
          model = Assignment
          fields = ['id', 'course', 'course_name', 'title', 'description', 'due_date', 
                    'total_marks', 'created_at', 'updated_at']
          read_only_fields = ['created_at']
          
class SubmissionSerializer(serializers.ModelSerializer):
     student_name = serializers.CharField(source='student.username', read_only=True)
     assignment_title = serializers.CharField(source='assignment.title', read_only=True)

     class Meta:
          model = Submission
          fields = ['id', 'assignment', 'assignment_title', 'student', 'student_name', 
                    'text', 'file', 'status', 'mark_obtained', 'submitted_at']
          
          read_only_fields = ['student', 'submitted_at', 'status', 'mark_obtained']
          
     def validate(self, data):
          if not data.get('text') and not data.get('file'):
               raise serializers.ValidationError('Blank input is not permitted')
          return data
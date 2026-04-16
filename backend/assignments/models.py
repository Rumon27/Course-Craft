from django.db import models
from users.models import User
from courses.models import Course
# Create your models here.



class Assignment(models.Model):
     course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assignments")
     title = models.CharField(max_length=200)
     description = models.TextField()
     due_date = models.DateTimeField()
     total_marks = models.PositiveIntegerField(default=100)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     
     def __str__(self):
          return f"{self.title} - {self.course.name}"

class Submission(models.Model):
     STATUS_CHOICES = [
          ('submitted', 'Submitted'),
          ('graded', 'Graded'),

     ]

     
     assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
     student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="submissions")
     text = models.TextField(blank = True, null = True)
     file = models.FileField(upload_to='submissions/', blank = True, null = True)
     status = models.CharField(max_length = 20, choices=STATUS_CHOICES, default='submitted')
     mark_obtained = models.PositiveIntegerField(null=True, blank=True)
     submitted_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)
     
     class Meta:
          unique_together = ['assignment', 'student']
     
     def __str__(self):
          return f"{self.student.username} - {self.assignment.title}"
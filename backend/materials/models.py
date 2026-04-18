from pyexpat import model
from random import choices
from django.db import models
from users.models import User
from courses.models import Course
# Create your models here.

class Material(models.Model):
     MATERIAL_TYPES = [
          ('file', 'File'),
          ('link', 'Link')
     ]
     
     course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
     uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='materials')
     title = models.CharField(max_length=200)
     description = models.TextField(blank=True, null=True)
     material_type = models.CharField(max_length=10, choices=MATERIAL_TYPES)
     file = models.FileField(upload_to='materials/', blank=True, null=True) 
     link = models.URLField(blank=True, null=True)
     uploaded_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now= True)
     
     def __str__(self):
          return f"{self.title} - {self.course.name}"

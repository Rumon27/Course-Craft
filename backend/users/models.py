from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
     ROLE_CHOICES = (
          ('student', 'Student'),
          ('teacher', 'Teacher'),
          ('admin', 'Admin'),
     )
     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
     
     def __str__(self):
          return f"{self.username} ({self.role})"


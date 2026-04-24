from operator import truediv
from pyexpat import model
from django.db import models
from users.models import User

# Create your models here.

class Course(models.Model):
     name = models.CharField(max_length=200)
     description = models.TextField()
     teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null= True,
                                 blank = True, related_name='courses', 
                                 limit_choices_to={'role': 'teacher'})
     
     prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True, 
                                            related_name='required_for')
     
     is_active = models.BooleanField(default=True)
     
     created_at = models.DateTimeField(auto_now_add=True)
     
     is_completed = models.BooleanField(default=False)
     completed_at = models.DateTimeField(null=True, blank = True)
     
     def __str__(self):
          return self.name
     

class Enrollment(models.Model):
     STATUS_CHOICES = (
          ('pending', 'Pending'),
          ('approved', 'Approved'),
          ('rejected', 'Rejected'),
     )
     
     student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments',
                                 limit_choices_to={'role': 'student'})

     course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
     applied_at = models.DateTimeField(auto_now_add=True)

     class Meta:
          unique_together = ['student', 'course']

     def __str__(self):
          return f"{self.student.username} - {self.course.name} ({self.status})"


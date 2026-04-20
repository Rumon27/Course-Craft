from django.db import models
from users.models import User

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('assignment', 'Assignment'),
        ('material', 'Material'),
        ('global', 'Global'),
    ]
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient.username} - {self.title}"
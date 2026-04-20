from django.db.models.signals import post_save
from django.dispatch import receiver
from assignments.models import Assignment
from materials.models import Material
from courses.models import Enrollment
from .models import Notification

@receiver(post_save, sender=Assignment)
def notify_students_new_assignment(sender, instance, created, **kwargs):
    if created:
        enrollments = Enrollment.objects.filter(course=instance.course, status='approved')
        for enrollment in enrollments:
            Notification.objects.create(
                recipient=enrollment.student,
                title=f"New Assignment: {instance.title}",
                message=f"A new assignment '{instance.title}' has been posted in {instance.course.name}. Due: {instance.due_date}",
                notification_type='assignment'
            )

@receiver(post_save, sender=Material)
def notify_students_new_material(sender, instance, created, **kwargs):
    if created:
        enrollments = Enrollment.objects.filter(course=instance.course, status='approved')
        for enrollment in enrollments:
            Notification.objects.create(
                recipient=enrollment.student,
                title=f"New Material: {instance.title}",
                message=f"New study material '{instance.title}' has been added to {instance.course.name}.",
                notification_type='material'
            )
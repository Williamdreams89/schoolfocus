from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Student

@receiver(pre_save, sender=Student)
def generate_registration_number(sender, instance, **kwargs):
    if not instance.registration_number:  # Only generate if not already set
        last_id = Student.objects.all().count() + 1
        instance.registration_number = f"2024/{str(last_id).zfill(4)}"

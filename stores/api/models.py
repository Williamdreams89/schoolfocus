from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone as tz


class GuadianOrParent(models.Model):
    class RelationshipChoices(models.TextChoices):
        MOTHER = "mother", "Mother"
        FATHER = "father", "Father"
    email = models.EmailField(unique=True, blank=True, null=True)
    first_name = models.EmailField(unique=True, blank=True, null=True)
    last_name = models.EmailField(unique=True, blank=True, null=True)
    full_name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=100, choices = RelationshipChoices.choices)
    occupation = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=13)
    address = models.TextField()

    def __str__(self) -> str:
        return self.full_name
    
class Student(models.Model):
    # Guardian's Information
    guardian = models.ManyToManyField(GuadianOrParent, blank=True, null=True, related_name="parents")

    # Student Information 
    email = models.EmailField(unique=True, default="example@email.com")
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    student_email = models.EmailField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    nationality = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    blood_group = models.CharField(max_length=3, blank=True, null=True)
    id_or_birth_cert_number = models.CharField(max_length=100, verbose_name="N.ID or Birth Cert. No", blank=True, null=True)
    religion = models.CharField(max_length=100, blank=True, null=True)
    profile_pic = models.ImageField(upload_to='images/', blank=True, null=True)

    # Contact Information
    contact_phone = models.CharField(max_length=15)
    province_or_state = models.CharField(max_length=100, verbose_name="Province or State (of origin)", blank=True, null=True)
    zip_or_lga = models.CharField(max_length=100, verbose_name="ZIP or LGA (of origin)", blank=True, null=True)
    place_of_origin = models.CharField(max_length=100, verbose_name="Town (of origin)", blank=True, null=True)
    permanent_address = models.TextField(blank=True, null=True)
    residential_address = models.TextField(blank=True, null=True)

    date_added = models.DateTimeField(auto_now_add = True, null= True, blank=True)

    def __str__(self):
        return f"{self.first_name}"
    
    def index_number(self):
        if self.date_added:
            date = self.date_added.date().year
            return f"{date}/0000{self.id}"




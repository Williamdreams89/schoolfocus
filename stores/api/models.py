from django.db import models

class Student(models.Model):
    # Father's Information
    father_full_name = models.CharField(max_length=255)
    father_email = models.EmailField(max_length=255, blank=True, null=True)
    father_phone = models.CharField(max_length=15, blank=True, null=True)

    # Mother's Information
    mother_full_name = models.CharField(max_length=255)
    mother_email = models.EmailField(max_length=255, blank=True, null=True)
    mother_phone = models.CharField(max_length=15, blank=True, null=True)

    # Student Information
    student_email = models.EmailField(max_length=255, blank=True, null=True)
    surname = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    other_names = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    registration_number = models.CharField(max_length=50, unique=True)
    nationality = models.CharField(max_length=100)
    date_of_birth = models.DateField(blank=True, null=True)
    blood_group = models.CharField(max_length=3, blank=True, null=True)
    id_or_birth_cert_number = models.CharField(max_length=100, verbose_name="N.ID or Birth Cert. No")
    religion = models.CharField(max_length=100, blank=True, null=True)

    # Contact Information
    contact_phone = models.CharField(max_length=15)
    province_or_state = models.CharField(max_length=100, verbose_name="Province or State (of origin)")
    zip_or_lga = models.CharField(max_length=100, verbose_name="ZIP or LGA (of origin)")
    town_of_origin = models.CharField(max_length=100, verbose_name="Town (of origin)")
    permanent_address = models.TextField()
    residential_address = models.TextField()

    def __str__(self):
        return f"{self.surname} {self.first_name} ({self.registration_number})"

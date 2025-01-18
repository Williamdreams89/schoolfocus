from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone as tz


class GuadianOrParent(models.Model):
    class RelationshipChoices(models.TextChoices):
        MOTHER = "mother", "Mother"
        FATHER = "father", "Father"
        GUARDIAN = 'guardian', 'Guardian'
    email = models.EmailField( blank=True, null=True)
    first_name = models.CharField(max_length=100,blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    full_name = models.CharField(max_length=100, unique=True)
    relationship = models.CharField(max_length=100, choices = RelationshipChoices.choices)
    occupation = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=13, unique=True)
    address = models.TextField()
    date_added = models.DateTimeField(auto_now_add = True, blank=True, null=True)

    def __str__(self) -> str:
        return self.full_name
    
class AcademicYear(models.Model):
    year = models.CharField(max_length=9, unique=True)  # Example: "2024-2025"

    def __str__(self):
        return self.year
    
class StudentClass(models.Model):
    name = models.CharField(max_length=50)  # Example: "JS1"
    academic_year = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        self.academic_year = tz.now().year
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.academic_year}"
    
class Student(models.Model):
    # Guardian's Information
    guardian = models.ManyToManyField(GuadianOrParent, related_name="parents")

    # Student Information 
    email = models.EmailField(unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    student_email = models.EmailField(max_length=255, blank=True, null=True, unique=True)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    nationality = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    blood_group = models.CharField(max_length=3, blank=True, null=True)
    id_or_birth_cert_number = models.CharField(max_length=100, verbose_name="N.ID or Birth Cert. No", blank=True, null=True)
    religion = models.CharField(max_length=100, blank=True, null=True)
    profile_pic = models.ImageField(upload_to='images/', blank=True, null=True)
    registration_number = models.CharField(max_length=50, unique=True, blank=True, null=True)


    # Contact Information
    contact_phone = models.CharField(max_length=15)
    province_or_state = models.CharField(max_length=100, verbose_name="Province or State (of origin)", blank=True, null=True)
    zip_or_lga = models.CharField(max_length=100, verbose_name="ZIP or LGA (of origin)", blank=True, null=True)
    place_of_origin = models.CharField(max_length=100, verbose_name="Town (of origin)", blank=True, null=True)
    permanent_address = models.TextField(blank=True, null=True)
    residential_address = models.TextField(blank=True, null=True)

    date_added = models.DateTimeField(auto_now_add = True, null= True, blank=True)

    # Academic Information
    student_class = models.ForeignKey(StudentClass, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.first_name}"

    @property
    def full_name(self):
        return "{} {}".format(self.first_name, self.last_name)
    
    def index_number(self):
        if self.date_added:
            date = self.date_added.date().year
            return f"{date}/0000{self.id}"
        
class Subject(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=6)

    unique_together = ["title", "code"]

    def __str__(self):
        return self.title
    


class Results(models.Model):
    class ExamSession(models.TextChoices):
        FIRST_TERM = 'First Term'
        SECOND_TERM = 'Second Term'
        THIRD_TERM = 'Third Term'
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    academic_year = models.CharField(max_length=100, blank=True)
    exam_session = models.CharField(
        max_length=20, choices=ExamSession.choices,
        blank=True
    )
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT)
    continuous_assessment = models.FloatField(default=0.0)
    exams_score = models.FloatField(default=0.0)
    grade = models.CharField(max_length=2, blank=True)
    remarks = models.CharField(max_length=255, blank=True)
    absent = models.BooleanField(default=False)
    published = models.BooleanField(default=False)
    total_score = models.IntegerField(blank=True, default=0, null=True)

    class Meta:
        unique_together = ('student', 'subject', 'academic_year', 'exam_session')
        verbose_name_plural = "Results"
        

    @property
    def score(self):
        return self.continuous_assessment + self.exams_score
    
    def __str__(self):
        return f"{self.student.full_name} - {self.subject.title}: {self.score}"
    

    def save(self, *args, **kwargs):
        self.academic_year = tz.now().year
        self.total_score = self.score
        # Auto-generate grade and remarks based on score
        if self.score >= 90:
            self.grade = 'A+'
            self.remarks = 'Outstanding'
        elif self.score >= 80:
            self.grade = 'A'
            self.remarks = 'Excellent'
        elif self.score >= 70:
            self.grade = 'B'
            self.remarks = 'Very Good'
        elif self.score >= 60:
            self.grade = 'C'
            self.remarks = 'Good'
        elif self.score >= 50:
            self.grade = 'D'
            self.remarks = 'Satisfactory'
        else:
            self.grade = 'F'
            self.remarks = 'Needs Improvement'

        super().save(*args, **kwargs)
    




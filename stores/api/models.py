from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone as tz
from django.core.exceptions import ValidationError

class AcademiccSession(models.Model):
    _session = models.CharField(max_length=20, unique=True, default="Nothing")
    start_year = models.PositiveIntegerField(blank=True, null=True)
    end_year = models.PositiveIntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=False)
    academic_year = models.PositiveIntegerField(blank=True, null=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start_year','end_year', '_session', 'is_active'], name='unique_active_session')
        ]

    def save(self, *args, **kwargs):
        if self.start_year and self.end_year:
            self._session = f"{self.start_year} - {self.end_year}"
            self.academic_year = self.start_year
        else:
            self._session = "Undefined"

        if self.is_active:
            # Deactivate all other sessions
            AcademiccSession.objects.exclude(pk=self.pk).update(is_active=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self._session} ({self.start_year}-{self.end_year})"

    

class AcademicTerm(models.Model):
    term_name = models.CharField(max_length=50, blank=True, null=True)
    session = models.ForeignKey(AcademiccSession, on_delete=models.CASCADE, related_name='terms', default=1)
    is_active = models.BooleanField(default=False)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['term_name', 'session', 'is_active'], name='unique_active_term_per_session')
        ]

    def save(self, *args, **kwargs):
        if self.is_active:
            # Deactivate other terms within the same session
            AcademicTerm.objects.filter(session=self.session).exclude(pk=self.pk).update(is_active=False)

        super().save(*args, **kwargs)

class SystemSettings(models.Model):
    active_services = models.CharField(
        max_length=50,
        choices=[('portal_website', 'School Portal and Website'), ('portal_only', 'School Portal Only')],
        default='portal_website'
    )
    school_name = models.CharField(max_length=255, blank=True, null=True)
    school_motto = models.TextField(blank=True, null=True)
    mission = models.TextField(blank=True, null=True)
    vision = models.TextField(blank=True, null=True)
    core_values = models.TextField(blank=True, null=True)
    school_email = models.EmailField(blank=True, null=True)
    school_phone = models.CharField(max_length=20, blank=True, null=True)
    fees_support_contact = models.CharField(max_length=20, blank=True, null=True)
    school_address = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city_state = models.CharField(max_length=100, blank=True, null=True)
    currency_symbol = models.CharField(max_length=10, blank=True, null=True)
    absence_sms_to_parent = models.BooleanField(default=False, blank=True, null=True)
    head_staff_title = models.CharField(max_length=100, blank=True, null=True)
    school_website = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)


class ImageSettings(models.Model):
    school_logo = models.ImageField(upload_to='images/', blank=True, null=True)
    pale_education_logo = models.ImageField(upload_to='images/', blank=True, null=True)
    other_logo = models.ImageField(upload_to='images/', blank=True, null=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)


class EmailSettings(models.Model):
    smtp_server = models.CharField(max_length=255, blank=True, null=True)
    smtp_port = models.PositiveIntegerField(blank=True, null=True)
    email_username = models.CharField(max_length=255, blank=True, null=True)
    email_password = models.CharField(max_length=255, blank=True, null=True)
    use_tls = models.BooleanField(default=True, blank=True, null=True)
    use_ssl = models.BooleanField(default=False, blank=True, null=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)


class SMSSettings(models.Model):
    provider_name = models.CharField(max_length=255, blank=True, null=True)
    api_key = models.CharField(max_length=255, blank=True, null=True)
    sender_id = models.CharField(max_length=20, blank=True, null=True)
    enable_sms = models.BooleanField(default=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, blank=True)


class UserPrivilege(models.Model):
    role = models.CharField(max_length=50)
    can_access_system_settings = models.BooleanField(default=False)
    can_manage_sessions = models.BooleanField(default=False)
    can_send_emails = models.BooleanField(default=False)
    can_send_sms = models.BooleanField(default=False)
    can_manage_users = models.BooleanField(default=False)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, blank=True, null=True)


    def __str__(self):
        return self.role



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
    year = models.CharField(max_length=9, unique=True, blank=True, null=True)  # Example: "2024-2025"

    def __str__(self):
        return self.year

    def save(self, *args, **kwargs):
        self.year = tz.now().year
        super().save(*args, **kwargs)

class Tag(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)

class AcademicSession(models.Model):
    year_one = models.CharField(max_length=100, blank=True, null=True)
    session = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        self.name = f"{tz.now().year} - {tz.now().year}"
        super().save(*args, **kwargs)
    
class StudentClass(models.Model):
    name = models.CharField(max_length=50) 
    class_division = models.CharField(max_length=100, blank=True, null=True, default="A")
    academic_year = models.CharField(blank=True, default="2025", null=True, max_length=100)

    def save(self, *args, **kwargs):
        self.academic_year = tz.now().year    
    
    def __str__(self):
        return f"{self.name}"

class Subject(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=6)
    active_classes = models.ManyToManyField(StudentClass, related_name='subjects', blank=True)
    is_active = models.BooleanField(default=True, blank=True, null=True)

    def get_active_classes_count(self):
        return self.active_classes.count()

    unique_together = ["title", "code"]

    def __str__(self):
        return self.title

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
    admission_date = models.DateField(auto_now_add=True, blank=True, null=True)

    # Academic Information
    student_class = models.ForeignKey(StudentClass, on_delete=models.CASCADE)
    tag = models.ManyToManyField(Tag, blank=True, null=True)

    # Student Fee Status Tag
    debtor = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return "{} {}".format(self.first_name, self.last_name)
    
    @property
    def index_number(self):
        if self.date_added:
            year = self.date_added.year  # Extract the year from the date_added field
            # Dynamically pad the id to 4 digits
            return f"{year}/{str(self.id).zfill(4)}"
        return None
        


class SkillCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class SkillAssessment(models.Model):
    class ExamSession(models.TextChoices):
        FIRST_TERM = 'First Term'
        SECOND_TERM = 'Second Term'
        THIRD_TERM = 'Third Term'
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="assessments")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="assessments")
    score = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    academic_year = models.CharField(max_length=100, blank=True, default=tz.now().year)
    exam_session = models.CharField(
        max_length=20, choices=ExamSession.choices,
        blank=True,
        default=ExamSession.FIRST_TERM
    )

    def __str__(self):
        return f"{self.student.full_name} - {self.skill.name}: {self.score}"



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
    


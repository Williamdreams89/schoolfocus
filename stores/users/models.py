from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.conf import settings

"""
The main users for the application includes admin, teachers and students
"""

from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    """Overriding the default django model manager class for the user app"""
    def create_user(self, email, first_name, last_name, password=None, **extra_kwargs):
        if not email:
            raise ValueError("Email must not blank.")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user 
    
    def create_superuser(self, email, first_name, last_name, password, **extra_kwargs):
        user =self.create_user(email, first_name, last_name, password, **extra_kwargs)
        user.is_staff = True
        user.is_account_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user 
    


class User(AbstractBaseUser, PermissionsMixin):
    class UserTypeChoice(models.TextChoices):
        ADMIN = "Admin", "Admin" 
        TEACHER = "Teacher", "Teacher"
        STUDENT = "Student", "Student"
        PARENT = "Parent", "Parent"
        TESTUSER = "TestUser", "TestUser"
    email = models.EmailField(unique = True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    user_type = models.CharField(max_length=100, choices=UserTypeChoice.choices, default=UserTypeChoice.TESTUSER)
    is_staff =models.BooleanField(default=False)
    is_account_active =models.BooleanField(default=False)
    is_verified =models.BooleanField(default=False)
    date_created = models.DateField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name', 'user_type']

    @property
    def full_name(self):
        return "{} {}".format(self.first_name, self.last_name)
    
    @property
    def profile_image(self):
        if self.profile_pic:
            return self.profile_pic.url
        return None

    def __str__(self):
        return "{} at {}".format(self.full_name, self.user_type)
    

    @property
    def index_number(self):
        if self.user_type == "Student":
            if self.id in range(10):
                return "STUDID-{}-000{}".format( self.date_created.year, self.id)
            elif self.id in range(10, 100):
                return "STUDID-{}-00{}".format( self.date_created.year, self.id)
            elif self.id in range(100, 1000):
                return "STUDID-{}-0{}".format( self.date_created.year, self.id)
            else:
                return "STUDID-{}-{}".format( self.date_created.year, self.id)
        else:
            return "N/A"
    

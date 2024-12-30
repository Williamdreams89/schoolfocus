from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
import pandas as pd
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from sms import send_sms
import smtplib
from email.message import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
def send_email(subject, body, to):
    email_msg = EmailMessage()
    email_msg.set_content(body)
    email_msg["subject"] = subject
    email_msg["to"] = to
    user = "schoolfocus311@gmail.com"
    password = "yjfu psrh xzkk gwow"
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(user, password)
    server.quit()
from .serializers import FileUploadSerializer

import openpyxl

class StudentSignUpAPIView(generics.GenericAPIView):
    serializer_class = StudentRegisterSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        serializer.save()
        user = Student.objects.get(email=serializer.data["email"])
        token = RefreshToken.for_user(user)
        verification_token = str(token)
        current_site = get_current_site(request).domain
        relative_url = reverse("verify_email")
        abs_url = "{}{}?token={}".format(current_site,relative_url, verification_token)
        EMAIL_BODY = "Hello, {}\nUse this link to verify your email:\n{}".format(user.first_name, abs_url)
        EMAIL_SUBJECT = "Verify your email"
        EMAIL_TO = user.email
        # SMS_RECIPIENT = user.phone_number
        # send_sms(EMAIL_BODY, [SMS_RECIPIENT], fail_silently=False, connection=None)
        try:
            send_email(subject=EMAIL_SUBJECT, body=EMAIL_BODY, to=EMAIL_TO)
            print("Email verification successful")
            return Response({"message":"Email sent successfully!","email body": abs_url})
            # payload = {"EMAIL_SUBJECT": EMAIL_SUBJECT, "EMAIL_BODY":EMAIL_BODY, "EMAIL_TO":EMAIL_TO,}
        except Exception as e:
            return Response(f"Email Verification failed: {e}")
        # Utils.send_email(payload)

class VerifyEmail(APIView):
    pass
   

class StudentLoginAPIView(generics.GenericAPIView):
    serializer_class = StudentRegisterSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        try:
            user = Student.objects.get(email=serializer.data["email"])
            rToken = RefreshToken.for_user(user)
            access_token = str(rToken.access_token)
            return Response({"tokens":{"refresh_token": str(rToken), "access_token": access_token}, "username":user.full_name, "user_id":user.id, 'user_role':user.user_type, }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status = status.HTTP_500_INTERNAL_SERVER_ERROR)

class EnrollStudentView(generics.GenericAPIView):
    serializer_class = StudentSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        serializer.save()

        return Response({"message":"Student enrolled successfully", "data":serializer.data})

class AddGuadianOrParentView(generics.GenericAPIView):
    serializer_class = GuadianOrParentSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        serializer.save()

        return Response({"message":"Guadian added successfully", "data":serializer.data})





class BulkEnrollStudentsAPIView(GenericAPIView):
    """
    API endpoint to upload an Excel file and enroll students in bulk.
    """
    serializer_class = FileUploadSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            try:
                # Read the Excel file
                df = pd.read_excel(file)

                # Map the Excel columns to model fields
                field_mapping = {
                    "First Name": "first_name",
                    "Last Name": "last_name",
                    "Gender": "gender",
                    "Nationality": "nationality",
                    "Date of Birth (dd-mm-YYYY)": "date_of_birth",
                    "Blood Group": "blood_group",
                    "N.ID or Birth Cert. No": "id_or_birth_cert_number",  # Corrected field name
                    "Religion": "religion",
                    "Contact Phone": "contact_phone",
                    "Province or State (of origin)": "province_or_state",
                    "ZIP or LGA (of origin)": "zip_or_lga",
                    "Town (of origin)": "town_of_origin",  # Corrected field name
                    "Permanent Address": "permanent_address",
                    "Residential Address": "residential_address",
                }


                # Rename columns in the DataFrame to match the model fields
                df.rename(columns=field_mapping, inplace=True)

                # Iterate through rows and create Student objects
                students = [
                    Student(**row.dropna().to_dict())
                    for _, row in df.iterrows()
                ]

                # Bulk create the Student objects
                Student.objects.bulk_create(students)

                return Response({"message": "Students enrolled successfully!"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        return self.queryset.order_by("-date_added")

class ParentOrGuardianView(generics.ListCreateAPIView):
    serializer_class = GuadianOrParentSerializer
    queryset = GuadianOrParent.objects.all().order_by("-date_added")

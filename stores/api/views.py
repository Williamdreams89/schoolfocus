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
import pandas as pd
from .serializers import FileUploadSerializer

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



class EnrollStudentView(generics.GenericAPIView):
    serializer_class = NewStudentSerializer
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
                    "N.ID or Birth Cert. No": "id_or_birth_cert_number",
                    "Religion": "religion",
                    "Contact Phone": "contact_phone",
                    "Province or State (of origin)": "province_or_state",
                    "ZIP or LGA (of origin)": "zip_or_lga",
                    "Town (of origin)": "town_of_origin",
                    "Permanent Address": "permanent_address",
                    "Residential Address": "residential_address",
                }

                # Rename columns in the DataFrame to match the model fields
                df.rename(columns=field_mapping, inplace=True)

                students = []
                current_student_count = Student.objects.count()  # Get the current number of students in the database

                for index, row in df.iterrows():
                    student_data = row.dropna().to_dict()

                    # Generate a registration number
                    new_id = current_student_count + len(students) + 1
                    registration_number = f"2024/{str(new_id).zfill(4)}"
                    student_data["registration_number"] = registration_number

                    # Create a Student object
                    students.append(Student(**student_data))

                # Bulk create the Student objects
                Student.objects.bulk_create(students)

                return Response({"message": "Students enrolled successfully!"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class BulkyEnrollStudentsAPIView(GenericAPIView):
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
                    "N.ID or Birth Cert. No": "id_or_birth_cert_number",
                    "Religion": "religion",
                    "Contact Phone": "contact_phone",
                    "Province or State (of origin)": "province_or_state",
                    "ZIP or LGA (of origin)": "zip_or_lga",
                    # "Town (of origin)": "town_of_origin",
                    "Permanent Address": "permanent_address",
                    "Residential Address": "residential_address",
                    "Guardian Phone": "guardian_phone",
                    "Guardian Full Name": "guardian_full_name",
                    "Guardian Occupation": "guardian_occupation",
                    "Guardian Address": "guardian_address",
                    "Guardian Relationship": "guardian_relationship",
                }

                # Rename columns in the DataFrame to match the model fields
                df.rename(columns=field_mapping, inplace=True)

                students = []
                current_student_count = Student.objects.count()  # Get the current number of students in the database

                for index, row in df.iterrows():
                    student_data = row.dropna().to_dict()

                    # Process guardian data
                    guardian_data = {
                        "phone_number": student_data.pop("guardian_phone", None),
                        "full_name": student_data.pop("guardian_full_name", None),
                        "occupation": student_data.pop("guardian_occupation", None),
                        "address": student_data.pop("guardian_address", None),
                        "relationship": student_data.pop("guardian_relationship", None),
                    }

                    if guardian_data["phone_number"]:
                        # Get or create the guardian
                        guardian, created = GuadianOrParent.objects.get_or_create(
                            phone_number=guardian_data["phone_number"],
                            defaults=guardian_data
                        )
                    else:
                        guardian = None

                    # Generate a registration number
                    new_id = current_student_count + len(students) + 1
                    registration_number = f"2024/{str(new_id).zfill(4)}"
                    student_data["registration_number"] = registration_number

                    # Create a Student object
                    student = Student(**student_data)
                    student.save()  # Save student to generate an ID

                    # Add guardian to the student
                    if guardian:
                        student.guardian.add(guardian)

                    students.append(student)

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

class MultipleGuardianCreateView(APIView):
    def post(self, request):
        # Extract the list of guardians from the request
        guardians_data = request.data.get('guardians', [])

        # Validate and save each guardian
        serializer = GuadianOrParentSerializer(data=guardians_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Guardians added successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentEditDetailsView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    lookup_field = "pk"


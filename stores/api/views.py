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
from django.shortcuts import get_object_or_404

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

class BulkEnrollStudentsAPIViewThree(GenericAPIView):
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
                    "Permanent Address": "permanent_address",
                    "Residential Address": "residential_address",
                    "Guardian First Name": "guardian_first_name",
                    "Guardian Last Name": "guardian_last_name",
                    "Guardian Full Name": "guardian_full_name",
                    "Guardian Relationship": "guardian_relationship",
                    "Guardian Occupation": "guardian_occupation",
                    "Guardian Phone": "guardian_phone",
                    "Guardian Address": "guardian_address",
                }

                # Rename columns in the DataFrame to match the model fields
                df.rename(columns=field_mapping, inplace=True)

                # Get the current number of students in the database
                current_student_count = Student.objects.count()

                # Iterate through each row in the DataFrame
                for index, row in df.iterrows():
                    # Extract student data
                    student_data = row.dropna().to_dict()

                    # Extract guardian data
                    guardian_data = {
                        "first_name": row.get("guardian_first_name"),
                        "last_name": row.get("guardian_last_name"),
                        "full_name": row.get("guardian_full_name"),
                        "relationship": row.get("guardian_relationship"),
                        "occupation": row.get("guardian_occupation"),
                        "phone_number": row.get("guardian_phone"),
                        "address": row.get("guardian_address"),
                    }

                    # Remove NaN values from guardian_data
                    guardian_data = {k: v for k, v in guardian_data.items() if pd.notna(v)}

                    # Create or retrieve the guardian
                    guardian, created = GuadianOrParent.objects.get_or_create(
                        phone_number=guardian_data.get("phone_number"), defaults=guardian_data
                    )

                    # Generate a unique registration number
                    new_id = current_student_count + index + 1
                    registration_number = f"2024/{str(new_id).zfill(4)}"
                    student_data["registration_number"] = registration_number

                    # Create a Student object with valid fields
                    valid_fields = [field.name for field in Student._meta.get_fields()]
                    student = Student(**{k: v for k, v in student_data.items() if k in valid_fields})
                    student.save()

                    # Assign the guardian to the student
                    student.guardian.add(guardian)

                return Response(
                    {"message": "Students and their guardians were enrolled successfully!"},
                    status=status.HTTP_201_CREATED,
                )
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

class StudentResultsAPIView(APIView):
    def get(self, request, student_class_name, *args, **kwargs):
        """
        Fetch all students belonging to the inputted student class.
        """
        try:
            # Filter students by class
            students = Student.objects.filter(student_class__name=student_class_name)
            
            if not students.exists():
                return Response(
                    {"detail": "No students found in the specified class."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Serialize and return student data
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": "An error occurred.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, *args, **kwargs):
        """
        Save results for multiple students.
        """
        try:
            data = request.data
            if not isinstance(data, list):
                return Response(
                    {"detail": "Expected a list of results."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Validate each item in the list
            serializer = ResultsSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()  # Save all results in bulk
                return Response(
                    {"detail": "Results saved successfully.", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"detail": "An error occurred.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class StudentResultsAPIView(APIView):
    def get(self, request, student_class_name, *args, **kwargs):
        """
        Fetch all students belonging to the inputted student class.
        """
        try:
            # Filter students by class
            students = Student.objects.filter(student_class__name=student_class_name)
            
            if not students.exists():
                return Response(
                    {"detail": "No students found in the specified class."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Serialize and return student data
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": "An error occurred.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
    def post(self, request, student_class_name, *args, **kwargs):
        """
        Save results for multiple students in the specified class.
        """
        try:
            data = request.data
            if not isinstance(data, list):
                return Response(
                    {"detail": "Expected a list of results."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Validate and save results for students
            serializer = ResultsSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()  # Save results in bulk
                return Response(
                    {"detail": "Scores successfully saved!", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"detail": "An error occurred.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SubjectListAPIView(generics.ListCreateAPIView):
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all().order_by("title")

class ResultsReviewAPIView(generics.ListAPIView):
    serializer_class = ResultsSerializer
    queryset = Results.objects.all()

    def get_queryset(self):
        # Extract params from url
        student_class = self.kwargs.get("student_class")
        academic_year = self.kwargs.get("academic_year")
        exam_session = self.kwargs.get("exam_session")

        # Filter queryset based on the parameters
        qs = self.queryset.filter(
            student__student_class__name=student_class,
            academic_year=academic_year,
            exam_session=exam_session,
        )

        if not qs.exists():
            return None
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by("subject__title")

        if queryset is None:
            return Response({"detail": "No results found for the given parameters."}, status=404)

        # Compute total scores and rank
        sorted_queryset = sorted(queryset, key=lambda x: x.total_score, reverse=True)

        # Assign ranks and include in response
        for rank, result in enumerate(sorted_queryset, start=1):
            result.rank = rank
            result.save()

        serializer = self.get_serializer(sorted_queryset, many=True)

        return Response(serializer.data)
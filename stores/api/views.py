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
from collections import defaultdict
from django.utils import timezone
from django.db import transaction

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

    def post(self, request, *args, **kwargs):
        # Validate and serialize the input data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the validated data and create the student
        student = serializer.save()

        # Response data including the student details
        return Response(
            {
                "message": "Student enrolled successfully",
                "data": serializer.data,  # Serialized data of the student
            },
            status=status.HTTP_201_CREATED,
        )
    

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
                    "Student Class": "student_class",  # Added mapping for student class
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

                    # Fetch or create the student class
                    student_class_name = row.get("student_class")
                    if not student_class_name:
                        return Response(
                            {"error": f"Missing Student Class in row {index + 1}."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    student_class, created = StudentClass.objects.get_or_create(name=student_class_name)

                    # Create or retrieve the guardian
                    guardian, created = GuadianOrParent.objects.get_or_create(
                        phone_number=guardian_data.get("phone_number"), defaults=guardian_data
                    )

                    # Generate a unique registration number
                    new_id = current_student_count + index + 1
                    registration_number = f"2024/{str(new_id).zfill(4)}"
                    student_data["registration_number"] = registration_number

                    # Assign the StudentClass instance to student_class field
                    student_data["student_class"] = student_class  # Correctly assign the actual instance

                    # Create a Student object with valid fields
                    valid_fields = [field.name for field in Student._meta.get_fields()]
                    student = Student(
                        **{k: v for k, v in student_data.items() if k in valid_fields}
                    )
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
        # Extract path parameters from self.kwargs
        student_class_name = self.kwargs.get('student_class_name')
        student_class_division = self.kwargs.get('student_class_division')
        academic_year = self.kwargs.get('academic_year')

        # Filter queryset based on path parameters
        queryset = self.queryset.filter(
            student_class__name=student_class_name,
            # student_class__class_division=student_class_division,
            student_class__academic_year=academic_year
        )

        return queryset.order_by("date_added")


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


GRADE_POINTS = {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'E': 0.5,
    'F': 0.0,
}

from collections import defaultdict
from django.db.models import Sum, Count
from rest_framework.response import Response
from rest_framework.views import APIView


import random

class ResultsSummaryView(APIView):
    def get(self, request, student_class_name, academic_year, exam_session, *args, **kwargs):
        # Helper function for ordinal suffix
        def get_ordinal_suffix(rank):
            if 10 <= rank % 100 <= 20:
                return "th"
            elif rank % 10 == 1:
                return "st"
            elif rank % 10 == 2:
                return "nd"
            elif rank % 10 == 3:
                return "rd"
            else:
                return "th"

        # Helper function to generate random hex colors
        def generate_random_colors(n):
            return [f"#{random.randint(0, 0xFFFFFF):06x}" for _ in range(n)]

        # Fetch results
        results = Results.objects.filter(
            student__student_class__name=student_class_name,
            academic_year=academic_year,
            exam_session=exam_session,
            # published=True,
            # student__debtor = False
        ).select_related('student', 'subject')

        if not results.exists():
            return Response({"detail": "No results found for the specified class."}, status=404)

        # Group data by student
        student_data = defaultdict(lambda: {
            "id": None,
            "name": "",
            "dob": "",
            "index_number": "",
            "email": "",
            "scores": {},
            "gpa": 0.0,
            "rank_title": "",
            "attendance": 0,
            "principalRemark": "",
            "grand_total": 0,
            "total_score": 0,
            "subject_count": 0,
            "data": {}  # Placeholder for the chart data
        })

        for result in results:
            student = result.student
            full_name = f"{student.last_name.upper()} {student.first_name.upper()}"
            student_info = student_data[student.id]
            student_info["id"] = student.id
            student_info["name"] = full_name
            student_info["email"] = student.email
            student_info["index_number"] = student.index_number
            student_info["dob"] = student.date_of_birth

            total_score = result.total_score or (result.continuous_assessment + result.exams_score)
            student_info["scores"][result.subject.title] = {
                "continuous": result.continuous_assessment,
                "exams": result.exams_score,
                "total": total_score,
            }

            student_info["gpa"] += GRADE_POINTS.get(result.grade, 0.0)
            student_info["grand_total"] += total_score
            student_info["subject_count"] += 1

        # Process each student's data
        student_list = []
        for student_id, data in student_data.items():
            total_subjects = data["subject_count"]
            if total_subjects > 0:
                data["gpa"] = round(data["gpa"] / total_subjects, 2)
                data["average_score"] = round(data["grand_total"] / total_subjects, 2)

            # Prepare "data" key
            labels = list(data["scores"].keys())  # Subject titles
            total_scores = [score["total"] for score in data["scores"].values()]  # Corresponding scores
            background_colors = generate_random_colors(len(labels))  # Generate random colors

            data["data"] = {
                "labels": labels,
                "datasets": [
                    {
                        "label": "Exam Performance",
                        "data": total_scores,
                        "backgroundColor": background_colors,
                    }
                ],
            }

            student_list.append(data)

        # Sort by GPA, then by grand total as a tie-breaker
        student_list.sort(key=lambda x: (-x["gpa"], -x["grand_total"]))
        for rank, student in enumerate(student_list, start=1):
            ordinal_suffix = get_ordinal_suffix(rank)
            student["rank_title"] = f"{rank}{ordinal_suffix}"
            student["attendance"] = 95  # Replace with real logic
            student["principalRemark"] = "Excellent" if student["gpa"] > 3.5 else "Good"

        return Response(student_list)
    
    def post(self, request, student_class_name, academic_year, exam_session, *args, **kwargs):
        """
        Updates the 'published' field to True for all results where student__debtor=False.
        """
        updated_count = Results.objects.filter(
            student__student_class__name=student_class_name,
            academic_year=academic_year,
            exam_session=exam_session,
            student__debtor=False,
            # published=False,
        ).update(published=True)

        if updated_count == 0:
            return Response({"detail": "No results were updated."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": f"{updated_count} results have been successfully published."}, status=status.HTTP_200_OK)


class SubjectsInResultsView(APIView):
    def get(self, request, student_class_name, academic_year, exam_session, *args, **kwargs):
        # Fetch unique subjects from the Results model for the specified filters
        subjects = Results.objects.filter(
            student__student_class__name=student_class_name,
            academic_year=academic_year,
            exam_session=exam_session,
            # published=False,
        ).select_related('subject').values('subject__id', 'subject__title').distinct()

        if not subjects:
            return Response({"detail": "No subjects found for the specified filters."}, status=404)

        # Format the subjects for the response
        subject_list = [
            {
                "id": subject["subject__id"],
                "name": subject["subject__title"],
                # "subject_code": subject["subject__code"],
            }
            for subject in subjects
        ]

        return Response(subject_list, status=200)



class SubjectListView(APIView):
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Bulk create subjects
        subjects_data = request.data.get('subjects', [])
        created_subjects = []
        for subject in subjects_data:
            subject_name = subject.get('subject_name')
            subject_code = subject.get('subject_code')

            subject_instance, created = Subject.objects.get_or_create(
                subject_name=subject_name,
                subject_code=subject_code
            )
            created_subjects.append(subject_instance)
        return Response({'created_subjects': len(created_subjects)}, status=status.HTTP_201_CREATED)
    

# Fetch subjects based of student classes in active classes in the Subject model
class SubjectListByClassView(APIView):
    def get(self, request):
        class_name = request.query_params.get('class_name')
        
        if not class_name:
            return Response({"error": "class_name query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student_class = StudentClass.objects.get(name=class_name)
            subjects = Subject.objects.filter(active_classes=student_class, is_active=True)
            serializer = SubjectSerializer(subjects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except StudentClass.DoesNotExist:
            return Response({"error": "Student class not found"}, status=status.HTTP_404_NOT_FOUND)


class StudentClassAPIView(generics.ListCreateAPIView):
    serializer_class = ClassSerializer
    queryset = StudentClass.objects.all().order_by("name")

class GenerateIndexNumberAPIView(APIView):
    def get(self, request):
        last_student_id = Student.objects.last().id
        current_year = timezone.now().year
        new_id  = f"{current_year}/{str(last_student_id+1).zfill(4)}"
        return Response({"generated_id": new_id})

class TagListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    queryset = Tag.objects.all().order_by("title")

class ResultDetailAPIView(APIView):
    def get(self, request, academic_year, exam_session, class_name, subject_title):
        # Query the Results model
        results = Results.objects.filter(
            academic_year=academic_year,
            exam_session=exam_session,
            student__student_class__name=class_name,
            subject__title=subject_title
        ).select_related('student', 'subject')  # Optimize query

        # Format the response data
        response_data = []
        for result in results:
            response_data.append({
                "index_number": result.student.index_number,
                "name": f"{result.student.first_name} {result.student.last_name}",
                "scores": {
                    result.subject.title: {
                        "continuous": result.continuous_assessment,
                        "exams": result.exams_score,
                        "total": result.total_score,
                    }
                }
            })

        # Return the response
        return Response(response_data, status=status.HTTP_200_OK)
    

class ResultDetailAPIView(APIView):
    def get(self, request, academic_year, exam_session, class_name, subject_title):
        # Query the Results model
        results = Results.objects.filter(
            academic_year=academic_year,
            exam_session=exam_session,
            student__student_class__name=class_name,
            subject__title=subject_title
        ).select_related('student', 'subject')  # Optimize query

        # Format the response data
        response_data = []
        for result in results:
            response_data.append({
                "index_number": result.student.index_number,
                "id": result.student.id,
                "full_name": f"{result.student.first_name} {result.student.last_name}",
                "scores": {
                    result.subject.title: {
                        "continuous": result.continuous_assessment,
                        "exams": result.exams_score,
                        "total": result.total_score,
                    }
                }
            })

        # Return the response
        return Response(response_data, status=status.HTTP_200_OK)


class SkillAssessmentAPIView(APIView):
    def get(self, request, student_class, academic_year, exam_session):
        # Get students in the requested class
        students = Student.objects.filter(student_class__name=student_class)

        # Prepare response structure
        response_data = []

        for student in students:
            # Get all skill assessments for this student
            assessments = SkillAssessment.objects.filter(
                student=student,
                academic_year=academic_year,
                exam_session=exam_session
            ).select_related('skill__category')

            # Group assessments by skill categories
            skills_by_category = {}
            for assessment in assessments:
                category_name = assessment.skill.category.name
                if category_name not in skills_by_category:
                    skills_by_category[category_name] = {}
                skills_by_category[category_name][assessment.skill.name] = assessment.score

            # Append student data to response
            response_data.append({
                "id": student.id,
                "name": f"{student.last_name.upper()} {student.first_name.upper()}",
                "skills": skills_by_category
            })

        return Response(response_data)

    def post(self, request, student_class, academic_year, exam_session):
        # Validate that the required fields are in the request body
        if not isinstance(request.data, list):
            return Response({"error": "Invalid data format. Expected a list of students with skills."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                for student_data in request.data:
                    student_id = student_data.get("id")
                    skills = student_data.get("skills")

                    if not student_id or not skills:
                        return Response(
                            {"error": "'id' (student ID) and 'skills' are required for each student."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    # Validate student existence and class
                    try:
                        student = Student.objects.get(id=student_id, student_class__name=student_class)
                    except Student.DoesNotExist:
                        return Response(
                            {"error": f"Student with ID {student_id} not found in class {student_class}."},
                            status=status.HTTP_404_NOT_FOUND,
                        )

                    # Process each skill category and associated skills
                    for category_name, skills_data in skills.items():
                        try:
                            category = SkillCategory.objects.get(name=category_name)
                        except SkillCategory.DoesNotExist:
                            return Response(
                                {"error": f"Skill category '{category_name}' does not exist."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                        for skill_name, score in skills_data.items():
                            try:
                                skill = Skill.objects.get(name=skill_name, category=category)
                            except Skill.DoesNotExist:
                                return Response(
                                    {"error": f"Skill '{skill_name}' in category '{category_name}' does not exist."},
                                    status=status.HTTP_400_BAD_REQUEST,
                                )

                            # Create or update the SkillAssessment
                            assessment, created = SkillAssessment.objects.update_or_create(
                                student=student,
                                skill=skill,
                                academic_year=academic_year,
                                exam_session=exam_session,
                                defaults={"score": score},
                            )

                return Response({"message": "Skill assessments saved successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RecordAStudentSkillAssessmentAPIView(APIView):
    def post(self, request, student_class, academic_year, exam_session):
        # Validate that the required fields are in the request body
        student_id = request.data.get("id")
        skills = request.data.get("skills")

        if not student_id or not skills:
            return Response(
                {"error": "'id' (student ID) and 'skills' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                # Validate student existence and class
                try:
                    student = Student.objects.get(id=student_id, student_class__name=student_class)
                except Student.DoesNotExist:
                    return Response(
                        {"error": f"Student with ID {student_id} not found in class {student_class}."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                # Process each skill category and associated skills
                for category_name, skills_data in skills.items():
                    try:
                        category = SkillCategory.objects.get(name=category_name)
                    except SkillCategory.DoesNotExist:
                        return Response(
                            {"error": f"Skill category '{category_name}' does not exist."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    for skill_name, score in skills_data.items():
                        try:
                            skill = Skill.objects.get(name=skill_name, category=category)
                        except Skill.DoesNotExist:
                            return Response(
                                {"error": f"Skill '{skill_name}' in category '{category_name}' does not exist."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                        # Create or update the SkillAssessment
                        SkillAssessment.objects.update_or_create(
                            student=student,
                            skill=skill,
                            academic_year=academic_year,
                            exam_session=exam_session,
                            defaults={"score": score},
                        )

                return Response({"message": "Skill assessments saved successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# Academic Session Views
class AcademicSessionListView(generics.ListCreateAPIView):
    queryset = AcademiccSession.objects.all()
    serializer_class = AcademicSessionSerializer

class AcademicSessionRetrieveView(generics.RetrieveAPIView):
    queryset = AcademiccSession.objects.all()
    serializer_class = AcademicSessionSerializer

class AcademicSessionUpdateView(generics.UpdateAPIView):
    queryset = AcademicSession.objects.all()
    serializer_class = AcademicSessionSerializer

# Academic Term Views
class AcademicTermsBySessionView(generics.ListAPIView):
    serializer_class = AcademicTermSerializer

    def get_queryset(self):
        session_id = self.kwargs.get("session_id")  # Get session ID from URL
        return AcademicTerm.objects.filter(session_id=session_id)  # Filter terms

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"message": "No terms found for this session"}, status=status.HTTP_404_NOT_FOUND)
        return super().list(request, *args, **kwargs)
    
class AcademicTermListView(generics.ListAPIView):
    queryset = AcademicTerm.objects.all()
    serializer_class = AcademicTermSerializer

class AcademicTermRetrieveView(generics.RetrieveAPIView):
    queryset = AcademicTerm.objects.all()
    serializer_class = AcademicTermSerializer

class AcademicTermUpdateView(generics.UpdateAPIView):
    queryset = AcademicTerm.objects.all()
    serializer_class = AcademicTermSerializer

# System Settings Views
class SystemSettingsListView(generics.ListAPIView):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer

class SystemSettingsRetrieveView(generics.RetrieveAPIView):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer

class SystemSettingsUpdateView(generics.UpdateAPIView):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer

    def get_object(self):
        # Get the first available object
        obj = self.get_queryset().first()
        if obj is None:
            raise Http404("No system settings found")
        return obj

# System Images Views
class SystemImagesListView(generics.ListAPIView):
    queryset = ImageSettings.objects.all()
    serializer_class = SystemImagesSerializer

class SystemImagesRetrieveView(generics.RetrieveAPIView):
    queryset = ImageSettings.objects.all()
    serializer_class = SystemImagesSerializer

class SystemImagesUpdateView(generics.UpdateAPIView):
    queryset = ImageSettings.objects.all()
    serializer_class = SystemImagesSerializer

# Email Settings Views
class EmailSettingsListView(generics.ListAPIView):
    queryset = EmailSettings.objects.all()
    serializer_class = EmailSettingsSerializer

class EmailSettingsRetrieveView(generics.RetrieveAPIView):
    queryset = EmailSettings.objects.all()
    serializer_class = EmailSettingsSerializer

class EmailSettingsUpdateView(generics.UpdateAPIView):
    queryset = EmailSettings.objects.all()
    serializer_class = EmailSettingsSerializer

# SMS Settings Views
class SmsSettingsListView(generics.ListAPIView):
    queryset = SMSSettings.objects.all()
    serializer_class = SmsSettingsSerializer

class SmsSettingsRetrieveView(generics.RetrieveAPIView):
    queryset = SMSSettings.objects.all()
    serializer_class = SmsSettingsSerializer

class SmsSettingsUpdateView(generics.UpdateAPIView):
    queryset = SMSSettings.objects.all()
    serializer_class = SmsSettingsSerializer

# User Privileges Views
class UserPrivilegesListView(generics.ListAPIView):
    queryset = UserPrivilege.objects.all()
    serializer_class = UserPrivilegesSerializer

class UserPrivilegesRetrieveView(generics.RetrieveAPIView):
    queryset = UserPrivilege.objects.all()
    serializer_class = UserPrivilegesSerializer

class UserPrivilegesUpdateView(generics.UpdateAPIView):
    queryset = UserPrivilege.objects.all()
    serializer_class = UserPrivilegesSerializer


# Activations 
class InactiveAcademicSessionsView(generics.ListAPIView):
    queryset = AcademiccSession.objects.filter(is_active=False)  # Fetch only inactive sessions
    serializer_class = AcademicSessionSerializer

class ActivateSessionAndTermView(APIView):
    def post(self, request, session_id=None, term_id=None):
        if not session_id:
            return Response({"error": "session_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        response_data = {}

        try:
            with transaction.atomic():  # Ensures all or nothing commit
                # Deactivate all sessions before activating the new one
                AcademiccSession.objects.update(is_active=False)

                # Activate the selected session
                session = AcademiccSession.objects.get(id=session_id)
                session.is_active = True
                session.save()
                response_data["session"] = "Academic session activated successfully."

                if term_id:
                    # Deactivate all terms in the given session before activating the new one
                    AcademicTerm.objects.filter(session_id=session_id).update(is_active=False)

                    # Activate the selected term
                    term = AcademicTerm.objects.get(id=term_id, session_id=session_id)
                    term.is_active = True
                    term.save()
                    response_data["term"] = "Academic term activated successfully."

        except AcademiccSession.DoesNotExist:
            return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
        except AcademicTerm.DoesNotExist:
            return Response({"error": "Term not found or does not belong to the session."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(response_data, status=status.HTTP_200_OK)
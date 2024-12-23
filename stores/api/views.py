from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Student
from .serializers import StudentSerializer
import pandas as pd

from .serializers import FileUploadSerializer

import openpyxl

class EnrollStudentView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Student enrolled successfully", "student": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





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
                    "Father's Full Name": "father_full_name",
                    "Father's Email": "father_email",
                    "Father's Phone": "father_phone",
                    "Mother's Full Name": "mother_full_name",
                    "Mother's Email": "mother_email",
                    "Mother's Phone": "mother_phone",
                    "Student Email": "student_email",
                    "Surname": "surname",
                    "First Name": "first_name",
                    "Other Names": "other_names",
                    "Gender": "gender",
                    "Registration Number": "registration_number",
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

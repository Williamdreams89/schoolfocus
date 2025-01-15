from rest_framework import serializers
from .models import Student, GuadianOrParent, Results

class GuadianOrParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuadianOrParent
        fields = '__all__'  # Include all fields of the Student model

class StudentSerializer(serializers.ModelSerializer):
    guardians = GuadianOrParentSerializer(many=True, write_only=True)  # Accept a list of guardians during creation
    guardian_details = serializers.SerializerMethodField(read_only=True)  # Provide read-only details of guardians
    student_class_name = serializers.SerializerMethodField()

    def get_student_class_name(self, obj):
        return obj.student_class.name

    def get_guardian_details(self, obj):
        return [
            {
                "guardian_name": guardian.full_name,
                "guardian_phone": guardian.phone_number,
                "guardian_email": guardian.email,
                "guardian_relationship": guardian.relationship,
            }
            for guardian in obj.guardian.all()
        ]

    class Meta:
        model = Student
        fields = [
            "id", "email", "first_name", "last_name","full_name", "student_email", "registration_number",
            "index_number", "student_class", "student_class_name","gender", "nationality", "date_of_birth", "blood_group",
            "id_or_birth_cert_number", "religion", "profile_pic", "contact_phone",
            "province_or_state", "zip_or_lga", "place_of_origin", "permanent_address",
            "residential_address", "date_added", "guardians", "guardian_details"
        ]

    def create(self, validated_data):
        guardians_data = validated_data.pop("guardians", [])
        student = super().create(validated_data)
        for guardian_data in guardians_data:
            guardian, created = GuadianOrParent.objects.get_or_create(**guardian_data)
            student.guardian.add(guardian)
        return student


class NewStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

class ResultsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    student_class = serializers.CharField(source='student.student_class.name', read_only=True)  # Add this field
    score = serializers.ReadOnlyField()

    class Meta:
        model = Results
        fields = "__all__"


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith('.xlsx'):
            raise serializers.ValidationError("Only Excel files are allowed.")
        return value

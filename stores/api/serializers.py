from rest_framework import serializers
from .models import Student, GuadianOrParent

class StudentSerializer(serializers.ModelSerializer):
    guardian = serializers.SerializerMethodField()
    def get_guardian(self, obj):
        return [{"guardian_name":f"{guardian.first_name} {guardian.last_name}", "guardian_phone":guardian.phone_number, "guardian_email": guardian.email} for guardian in obj.guardian.all()]
    class Meta:
        model = Student
        fields = ["id", "email", "first_name", "last_name", "student_email",'registration_number', 'index_number', "gender", "nationality", "date_of_birth", "blood_group", "id_or_birth_cert_number", "religion", "profile_pic", "contact_phone", "province_or_state", "zip_or_lga", "place_of_origin", "permanent_address", "residential_address", "date_added", "guardian"]
class GuadianOrParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuadianOrParent
        fields = '__all__'  # Include all fields of the Student model

class StudentRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["student_email", 'first_name', 'last_name', 'user_type', 'password']
        extra_kwargs = {"password":{"write_only": True}}

    def create(self, validated_data):
        return Student.objects.create_user(**validated_data)


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith('.xlsx'):
            raise serializers.ValidationError("Only Excel files are allowed.")
        return value

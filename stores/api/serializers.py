from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
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

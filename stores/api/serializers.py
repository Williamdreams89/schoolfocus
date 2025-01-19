from rest_framework import serializers
from .models import Student, GuadianOrParent, Results, Subject

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
    # score = serializers.ReadOnlyField()
    subject_name = serializers.CharField(source= 'subject.title')
    rank = serializers.SerializerMethodField()

    def get_rank(self, obj):
        # Filter results based on academic year, exam session, and class
        academic_year = obj.academic_year
        exam_session = obj.exam_session
        student_class = obj.student.student_class

        # Get all results for the same academic year, session, and class
        queryset = Results.objects.filter(
            academic_year=academic_year,
            exam_session=exam_session,
            student__student_class=student_class
        ).order_by('-total_score')

        # Create a rank map
        rank_map = {result.id: rank + 1 for rank, result in enumerate(queryset)}

        # Return the rank of the current object
        return rank_map.get(obj.id)

    class Meta:
        model = Results
        fields = [
            'id', 'student_name','student_roll', 'student_class', 'academic_year', 
            'exam_session', 'continuous_assessment', 'exams_score', 'grade', 
            'remarks', 'absent', 'published', 'student', 'subject','subject_name','total_score', 'rank'
        ]
fields = "__all__"

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith('.xlsx'):
            raise serializers.ValidationError("Only Excel files are allowed.")
        return value

class SubjectSerializer(serializers.ModelSerializer):
    active_for = serializers.SerializerMethodField()
    class Meta:
        model = Subject
        fields = ['title', 'code', 'active_for']

    def get_active_for(self, obj):
        return obj.get_active_classes_count()
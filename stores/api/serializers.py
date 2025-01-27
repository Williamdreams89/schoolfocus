from rest_framework import serializers
from .models import Student, GuadianOrParent, Results, Subject, StudentClass, Tag, SkillAssessment

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
    student_class = serializers.CharField()  # Accept class name as input
    guardian = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=GuadianOrParent.objects.all()),
        write_only=True,
    )  # Accept a list of guardian IDs

    class Meta:
        model = Student
        fields = [
            'email', 'first_name', 'last_name', 'gender', 'contact_phone',
            'student_class', 'registration_number', 'date_of_birth',
            'profile_pic', 'admission_date', 'nationality', 'id_or_birth_cert_number',
            'religion', 'blood_group', 'permanent_address', 'residential_address',
            'guardian',
        ]

    def create(self, validated_data):
        # Extract the guardians and student_class from validated data
        guardians = validated_data.pop('guardian', [])
        class_name = validated_data.pop('student_class')

        # Get or create the StudentClass instance
        student_class, created = StudentClass.objects.get_or_create(name=class_name)

        # Create the student instance
        student = Student.objects.create(student_class=student_class, **validated_data)

        # Set the guardians for the student
        student.guardian.set(guardians)  # Assign many-to-many relationships

        return student

class ResultsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    student_class = serializers.CharField(source='student.student_class.name', read_only=True)  # Add this field
    # score = serializers.ReadOnlyField()
    subject_name = serializers.CharField(source= 'subject.title')
    rank = serializers.SerializerMethodField()

    def create(self, validated_data):
        # Pop the subject title from the validated data
        subject_title = validated_data.pop('subject')['title']

        # Retrieve the subject instance using the title
        try:
            subject = Subject.objects.get(title=subject_title)
        except Subject.DoesNotExist:
            raise serializers.ValidationError({"subject": f"Subject with title '{subject_title}' does not exist."})

        # Replace the subject key with the actual instance
        validated_data['subject'] = subject

        # Handle student lookup if needed
        student = validated_data.get('student')

        # Use update_or_create for saving the result
        result, created = Results.objects.update_or_create(
            student=student,
            subject=subject,
            academic_year=validated_data.get('academic_year'),
            exam_session=validated_data.get('exam_session'),
            defaults=validated_data
        )
        return result




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
            'remarks', 'absent', 'published', 'student','subject_name','total_score', 'rank'
        ]

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

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentClass 
        fields = "__all__"

class IndexNumberGeneratorSerializer(serializers.ModelSerializer):
    index_num = serializers.SerializerMethodField()

    def get_index_num(self, obj):
        return obj.index_number
    
    class Meta:
        model = Student
        fields = ['index_num']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class SkillAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillAssessment
        fields = "__all__"
# Generated by Django 5.0.6 on 2025-01-21 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_remove_studentclass_tags_student_admission_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentclass',
            name='class_division',
            field=models.CharField(blank=True, default='A', max_length=100, null=True),
        ),
    ]
# Generated by Django 5.0.6 on 2025-01-20 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_remove_studentclass_subjects_subject_active_classes'),
    ]

    operations = [
        migrations.AddField(
            model_name='subject',
            name='is_active',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
    ]

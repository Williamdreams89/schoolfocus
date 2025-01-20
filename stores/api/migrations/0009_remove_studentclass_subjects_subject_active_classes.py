# Generated by Django 5.0.6 on 2025-01-19 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_studentclass_subjects'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='studentclass',
            name='subjects',
        ),
        migrations.AddField(
            model_name='subject',
            name='active_classes',
            field=models.ManyToManyField(blank=True, related_name='subjects', to='api.studentclass'),
        ),
    ]
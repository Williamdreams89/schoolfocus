# Generated by Django 5.0.6 on 2025-01-21 00:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_academicsession_tag_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='studentclass',
            name='admission_date',
        ),
    ]

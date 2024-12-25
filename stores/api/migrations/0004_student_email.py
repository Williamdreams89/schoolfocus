# Generated by Django 5.0.6 on 2024-12-25 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_student_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='email',
            field=models.EmailField(default='example@email.com', max_length=254, unique=True),
        ),
    ]
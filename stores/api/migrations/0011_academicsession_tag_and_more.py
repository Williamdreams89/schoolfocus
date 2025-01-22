# Generated by Django 5.0.6 on 2025-01-21 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_subject_is_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='AcademicSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year_one', models.CharField(blank=True, max_length=100, null=True)),
                ('session', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='studentclass',
            name='academic_year',
        ),
        migrations.AddField(
            model_name='studentclass',
            name='admission_date',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='studentclass',
            name='class_division',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='academicyear',
            name='year',
            field=models.CharField(blank=True, max_length=9, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='studentclass',
            name='tags',
            field=models.ManyToManyField(blank=True, null=True, to='api.tag'),
        ),
    ]

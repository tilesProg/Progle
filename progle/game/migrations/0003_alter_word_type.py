# Generated by Django 5.1.3 on 2024-12-09 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_alter_dailyword_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='word',
            name='type',
            field=models.CharField(choices=[('language', 'Language'), ('framework', 'Framework'), ('database', 'Database'), ('library', 'Library')], max_length=50),
        ),
    ]

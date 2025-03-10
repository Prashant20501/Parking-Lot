# Generated by Django 5.1.4 on 2024-12-24 07:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Lot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.PositiveIntegerField()),
                ('type', models.CharField(choices=[('TW', 'Two_Wheeler'), ('FW', 'Four_Wheeler')], max_length=2)),
                ('is_available', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='ParkingHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vehicle_number', models.CharField(max_length=255)),
                ('vehicle_type', models.CharField(choices=[('TW', 'Two_Wheeler'), ('FW', 'Four_Wheeler')], max_length=2)),
                ('level', models.PositiveIntegerField()),
                ('in_time', models.DateTimeField()),
                ('out_time', models.DateTimeField(blank=True, null=True)),
                ('fee', models.PositiveBigIntegerField(blank=True, null=True)),
                ('lot', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='parkinglot.lot')),
            ],
        ),
        migrations.CreateModel(
            name='PreBookingHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vehicle_num', models.CharField(max_length=255)),
                ('vehicle_type', models.CharField(choices=[('TW', 'Two_Wheeler'), ('FW', 'Four_Wheeler')], max_length=2)),
                ('level', models.PositiveIntegerField()),
                ('in_time', models.DateTimeField()),
                ('out_time', models.DateTimeField()),
                ('fee', models.PositiveBigIntegerField(blank=True, null=True)),
                ('lot', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='parkinglot.lot')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

# Generated by Django 5.1.4 on 2024-12-24 11:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parkinglot', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkinghistory',
            name='lot',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='parkinglot.lot'),
        ),
        migrations.AlterField(
            model_name='prebookinghistory',
            name='lot',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='parkinglot.lot'),
        ),
    ]

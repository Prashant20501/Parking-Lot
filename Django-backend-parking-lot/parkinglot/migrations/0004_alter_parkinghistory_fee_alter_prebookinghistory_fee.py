from django.db import migrations, models
from django.contrib.auth import get_user_model

def create_superuser(apps, schema_editor):
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@g.com',
            password='password'
        )
    if not User.objects.filter(username='user').exists():
        User.objects.create_user(
            username='user',
            email='user@g.com',
            password='password'
        )

def create_parking_lots(apps, schema_editor):
    Lot = apps.get_model('parkinglot', 'Lot')
    levels = 5  
    lots_per_level = 10  

    for level in range(1, levels + 1):
        for _ in range(lots_per_level):
            Lot.objects.create(level=level, type='TW', is_available=True)
            Lot.objects.create(level=level, type='FW', is_available=True)

class Migration(migrations.Migration):

    dependencies = [
        ('parkinglot', '0003_rename_vehicle_num_prebookinghistory_vehicle_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parkinghistory',
            name='fee',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=8, null=True),
        ),
        migrations.AlterField(
            model_name='prebookinghistory',
            name='fee',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=8, null=True),
        ),
        migrations.RunPython(create_superuser),
        migrations.RunPython(create_parking_lots),
    ]
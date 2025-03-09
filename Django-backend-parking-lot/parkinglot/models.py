from django.db import models
from django.core.validators import MaxValueValidator,MinValueValidator
from django.contrib.auth.models import User

class Lot(models.Model):
    vehicle_choices=[
        ("TW","Two_Wheeler"),
        ("FW","Four_Wheeler")
    ]
    level=models.PositiveIntegerField()
    type=models.CharField(max_length=2,choices=vehicle_choices)
    is_available=models.BooleanField(default=True)

class ParkingHistory(models.Model):
    vehicle_choices=[
        ("TW","Two_Wheeler"),
        ("FW","Four_Wheeler")
    ]
    vehicle_number=models.CharField(max_length=255)
    vehicle_type=models.CharField(max_length=2,choices=vehicle_choices)
    lot=models.ForeignKey(Lot,on_delete=models.CASCADE)
    level=models.PositiveIntegerField()
    in_time=models.DateTimeField()
    out_time=models.DateTimeField(null=True,blank=True)
    fee=models.DecimalField(max_digits=8,decimal_places=2,null=True,blank=True,default=0)
    
class PreBookingHistory(models.Model):
    vehicle_choices=[
        ("TW","Two_Wheeler"),
        ("FW","Four_Wheeler")
    ]
    user=models.ForeignKey(User,on_delete=models.PROTECT)
    vehicle_number=models.CharField(max_length=255)
    vehicle_type=models.CharField(max_length=2,choices=vehicle_choices)
    lot=models.ForeignKey(Lot,on_delete=models.CASCADE)
    level=models.PositiveIntegerField()
    in_time=models.DateTimeField()
    out_time=models.DateTimeField()
    fee=models.DecimalField(max_digits=8,decimal_places=2,null=True,blank=True,default=0)
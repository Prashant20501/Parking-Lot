from django.contrib import admin
from . import models
# Register your models here.

@admin.register(models.Lot)
class LotManager(admin.ModelAdmin):
    list_display=["id","level","type","is_available"]
    list_editable=["is_available"]

@admin.register(models.ParkingHistory)
class ParkingHistoryAdmin(admin.ModelAdmin):
    list_display=["vehicle_number","vehicle_type","lot_id","level","in_time","out_time","fee"]

@admin.register(models.PreBookingHistory)
class PreBookingHistoryAdmin(admin.ModelAdmin):
    list_display=["user","vehicle_number","vehicle_type","lot_id","level","in_time","out_time","fee"]
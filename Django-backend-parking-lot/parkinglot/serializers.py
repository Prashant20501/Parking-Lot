from rest_framework import serializers
from .models import Lot,ParkingHistory,PreBookingHistory

class LotSerializer(serializers.ModelSerializer):
    class Meta:
        model=Lot
        fields='__all__'

class ParkingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model=ParkingHistory
        fields='__all__'

class PreBookingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model=PreBookingHistory
        fields='__all__'
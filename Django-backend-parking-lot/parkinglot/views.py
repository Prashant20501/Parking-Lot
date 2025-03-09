from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import Lot,ParkingHistory,PreBookingHistory
from .serializers import LotSerializer,ParkingHistorySerializer,PreBookingHistorySerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from datetime import datetime,timedelta
from .forms import BookingForm,AssignForm,ReleaseForm
from django.shortcuts import redirect
from django.contrib import messages
from decimal import Decimal
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.filters import SearchFilter
# Create your views here.

@permission_classes([IsAdminUser,IsAuthenticated])
class LotView(ModelViewSet):
    queryset=Lot.objects.all()
    serializer_class=LotSerializer  
class getLotsView(APIView):
    def get(self,request):
        avail_tw_count=Lot.objects.all().filter(is_available=True,type='TW').count()
        avail_fw_count=Lot.objects.all().filter(is_available=True,type='FW').count()
        if request.user and request.user.is_staff==True:
            data={}
            data["TW"]=avail_tw_count
            data["FW"]=avail_fw_count
            return Response(data)
        
        data={}
        data["TW"]="available" if avail_tw_count>0 else "not_available"
        data["FW"]="available" if avail_fw_count>0 else "not_available"
        return Response(data)

@permission_classes([IsAdminUser,IsAuthenticated])
class ParkingHistoryView(ModelViewSet):
    queryset=ParkingHistory.objects.all()
    serializer_class=ParkingHistorySerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields=["vehicle_number","lot","level"]
    ordering_fields =["vehicle_number","lot","level","in_time","out_time"]
    ordering=["vehicle_number"]
    
def get_prebooking(number):
    curr_time=timezone.now()
    prebooking=PreBookingHistory.objects.all()\
                .filter(vehicle_number=number,in_time__lt=curr_time,out_time__gt=curr_time)
    if len(prebooking)==0:
        return None
    else:
        pb=prebooking[0]
        return {
            "vehicle_number":number,
            "vehicle_type":pb.vehicle_type,
            "lot":pb.lot.id,
            "level":pb.level,
            "in_time":pb.in_time   
        }
        
#used to clean out the expired prebooking to release freezed lot
#moved in middleware

@permission_classes([IsAuthenticated,IsAdminUser])
class AssignLotView(APIView):
    def get(self,request):
        form=AssignForm()
        print(timezone.now())
        return render(request,"assign.html",{"form":form})
    def post(self,request):
        # checkup()
        form=AssignForm(request.POST)
        if form.is_valid():
            data=form.cleaned_data
            vehicle_number=request.data["vehicle_number"]
            vehicle_type=request.data["vehicle_type"]
            level=request.data["level"]
        else:
            return Response({"message":"Invalid data provided!"},status=status.HTTP_400_BAD_REQUEST)
        history=ParkingHistory.objects.all().filter(vehicle_number=vehicle_number,out_time__isnull=True)
        if len(history)!=0:
            return Response({"message":"Vehicle already in parking!"},status=status.HTTP_400_BAD_REQUEST)
        prebook=get_prebooking(request.data["vehicle_number"])
        if prebook is not None:
            history=ParkingHistorySerializer(data=prebook)
            history.is_valid(raise_exception=True)
            history.save()
            return Response(prebook,status=status.HTTP_200_OK)
        lot=Lot.objects.all().filter(type=vehicle_type,is_available=True,level=level).first()
        if not lot:
            return Response({"message":"No space available!"},status=status.HTTP_400_BAD_REQUEST)
        # print(lot)
        lot.is_available=False
        lot.save()
        data={
            "vehicle_number":vehicle_number,
            "vehicle_type":vehicle_type,
            "lot":lot.id,
            "level":lot.level,
            "in_time":timezone.now()
        }
        history=ParkingHistorySerializer(data=data)
        history.is_valid(raise_exception=True)
        history.save()
        return Response(data,status=status.HTTP_200_OK)
    
@permission_classes([IsAuthenticated,IsAdminUser])        
class ReleaseLotView(APIView):
    def get(self,request):
        form=ReleaseForm()
        return render(request,"release.html",{"form":form})
    def post(self,request):
        form=ReleaseForm(request.POST)
        if form.is_valid():
            data=form.cleaned_data
            vehicle_number=request.data["vehicle_number"]
        else:
            return Response({"message":"Invalid data!"},status=status.HTTP_400_BAD_REQUEST)
        history=ParkingHistory.objects.all().filter(vehicle_number=vehicle_number,out_time__isnull=True)
        if len(history)==0:
            return Response({"message":"No such vehicle in parking!"},status=status.HTTP_404_NOT_FOUND)
        history=history[0]
        history.out_time=timezone.now()
        fee_ph=10    #per hour fee
        fee=Decimal((((history.out_time-history.in_time).total_seconds())/(60*60))*fee_ph)
        history.fee+=fee
        history.save()
        lot=Lot.objects.all().get(pk=history.lot.id)
        lot.is_available=True
        lot.save()
        return Response({
            "vehicle_number": history.vehicle_number,
            "lot_id": history.lot.id,
            "in_time": history.in_time,
            "out_time": history.out_time,
            "fee": history.fee,
        },status=status.HTTP_200_OK)

@permission_classes([IsAdminUser,IsAuthenticated])
class PreBookingHistoryView(ModelViewSet):
    queryset=PreBookingHistory.objects.all()
    serializer_class=PreBookingHistorySerializer

#one person can make only one prebooking at a time
@permission_classes([IsAuthenticated]) 
class PreBookView(APIView):
    def get(self,request):
        form=BookingForm()
        return render(request,"booking.html",{"form":form}) 
    def post(self,request):
        # checkup()
        print(request.POST)
        form=BookingForm(request.POST)
        if not form.is_valid():
            print(form.errors)
            return Response({"message":"invalid data"},status=status.HTTP_400_BAD_REQUEST)
        data=form.cleaned_data
        id=request.user.id
        curr_time=timezone.now()
        prebooking=PreBookingHistory.objects.all().filter(user=id)
        if len(list(prebooking))!=0:
            # messages.error(request,"booking already exists!!")
            return Response({"message":"booking already exists!"},status=status.HTTP_400_BAD_REQUEST)
        lot=Lot.objects.all().filter(type=data["vehicle_type"],is_available=True,level=data["level"])
        if not lot:
            return Response({"message":"No space available!"},status=status.HTTP_400_BAD_REQUEST)
        lot=lot[0]
        lot.is_available=False
        lot.save()
        pre_booking_fee=100
        out={
            "vehicle_number":data["vehicle_number"],
            "vehicle_type":data["vehicle_type"],
            "lot":lot.id,
            "user":request.user.id,
            "level":lot.level,
            "in_time":data["in_time"],
            "out_time":data["out_time"],
            "fee":pre_booking_fee,
        }
        preBookingHistory=PreBookingHistorySerializer(data=out)
        if preBookingHistory.is_valid():
            preBookingHistory.save()  
            return Response(preBookingHistory.data,status=status.HTTP_200_OK)  
        # else:
        #     print(preBookingHistory.errors)
        return Response({"message":"Invalid data!"},status=status.HTTP_400_BAD_REQUEST)

#loop hole if a person does not cancels or vist the parking reservation
#we need a checkup everyday to check for the prebooking history and 
# cancel the booking if the in_time is passed
# @permission_classes([IsAuthenticated])
class CancelBookingView(APIView):
    def get(self,request):
        print(request)
        id=request.user.id
        prebooking=PreBookingHistory.objects.all().filter(user=id)
        if not prebooking:
            messages.error(request,"no pre-booking!")
            return Response({"message":"no pre-booking!"},status=status.HTTP_204_NO_CONTENT)
        prebooking=prebooking[0]
        out={
            "vehicle_number":prebooking.vehicle_number,
            "vehicle_type":prebooking.vehicle_type,
            "lot":prebooking.lot.id,
            "level":prebooking.level,
            "in_time":prebooking.in_time,
            "out_time":prebooking.out_time,
            "fee":prebooking.fee,
        }
        return Response(out,status=status.HTTP_200_OK)
        # return render(request,"cancelbooking.html",{"prebooking":prebooking.__dict__})
    def post(self,request):
        id=request.user.id
        prebooking=PreBookingHistory.objects.all().filter(user=id)
        if not prebooking:
            return Response({"error":"No booking to cancel!"},status=status.HTTP_204_NO_CONTENT)
        id=prebooking[0].lot.id
        lot=Lot.objects.all().get(pk=id)
        lot.is_available=True
        lot.save()
        prebooking[0].delete()
        return Response({"message:booking cancelled!"},status=status.HTTP_200_OK)
    
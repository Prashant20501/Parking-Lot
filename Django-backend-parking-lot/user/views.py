from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView,Response
from .forms import UserCredentialForm,LoginForm
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib.auth import authenticate,login,logout
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import permission_classes
from parkinglot.models import Lot
from django.views.decorators.csrf import csrf_exempt
# def pouplate(request):
#     lvl=5 
#     slots=10 
#     vehicle_types=["TW","FW"]  
#     for level in range(1,lvl+1):
#         for vehicle_type in vehicle_types:
#             for i in range(slots):
#                 lot=Lot(level=lvl,type=vehicle_type,is_available=True)
#                 lot.save()
#     return HttpResponse("Omk")

class SignupView(APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return Response({"message":"Logout to continue"},status=status.HTTP_400_BAD_REQUEST)
        # credentialForm=UserCredentialForm()
        # return render(request,"signup.html",{"credentialform":credentialForm,})
        return Response({"message":"ok"},status=status.HTTP_200_OK)
    def post(self,request):
        if request.user.is_authenticated:
            return Response({"message":"Logout to continue!"},status=status.HTTP_400_BAD_REQUEST)
        credentialForm=UserCredentialForm(request.POST)
        if credentialForm.is_valid():
            cre_data=credentialForm.cleaned_data
            if cre_data["password"]!=cre_data["confirm_password"]:
                return Response({"message":"The password and confirm password did not match!"},status=status.HTTP_400_BAD_REQUEST)
            try:
                user=User.objects.create_user(
                    username=cre_data["username"],
                    password=cre_data["password"],
                    first_name=cre_data["first_name"],
                    last_name=cre_data["last_name"]
                    )
            except:
                return Response({"message":"Provided username already exists!"},status=status.HTTP_400_BAD_REQUEST)
            user_data = {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff
            }
            return Response({"message": "User signed up successfully!", "data": user_data}, status=status.HTTP_201_CREATED)
        return Response({"message":"Invalid data provided!"},status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    @csrf_exempt
    def get(self,request):
        if request.user and request.user.is_authenticated:
            return Response({"message":"Logout to continue!"},status=status.HTTP_400_BAD_REQUEST)
        loginform=LoginForm()
        # return render(request,"login.html",{"form":loginform})
        return Response({"message":"ok"},status=status.HTTP_200_OK)
    @csrf_exempt
    def post(self,request):
        if request.user and request.user.is_authenticated:
            return Response({"message":"Logout to continue!"},status=status.HTTP_400_BAD_REQUEST)
        loginform=LoginForm(request.POST)
        if loginform.is_valid():
            user=authenticate(**loginform.cleaned_data)
            if not user:
                # messages.error(request,"Invalid credentials!")
                return Response({"message":"Invalid credentials"},status=status.HTTP_400_BAD_REQUEST)
            else:
                # messages.success(request,"Login Successful!")
                login(request,user)
                return Response({
                    "message": "Login successful!",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "is_staff": user.is_staff  
                    }
                    }, status=status.HTTP_200_OK)
        # messages.error(request,"Invalid credentials!")
        return Response({"message":"Invalid data!"},status=status.HTTP_400_BAD_REQUEST)
@permission_classes([IsAuthenticated])
class LogoutView(APIView):
    def get(self,request):
        logout(request)
        return Response({"message":"Logout Successful!"},status=status.HTTP_200_OK)
            
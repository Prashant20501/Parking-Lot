from django import forms
from datetime import datetime
from django.utils import timezone
class BookingForm(forms.Form):
    vehicle_choices=[
        ("TW","Two_Wheeler"),
        ("FW","Four_Wheeler")
    ]
    vehicle_number=forms.CharField(max_length=255)
    vehicle_type=forms.ChoiceField(choices=vehicle_choices)
    level=forms.IntegerField()
    in_time=forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={
            'type':'datetime-local',
            'class':'form-control',
            'placeholder':'Select check-in time'
        })
    )
    out_time=forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={
            'type':'datetime-local',
            'class':'form-control',
            'placeholder':'Select check-out time'
        })
    )
    def clean_out_time(self):
        out_time=self.cleaned_data.get("out_time")
        in_time=self.cleaned_data.get("in_time")
        if in_time and out_time:
            if out_time<in_time:
                raise forms.ValidationError("Out time should be greater than in time")
        return out_time
    def clean_in_time(self):
        in_time=self.cleaned_data.get("in_time")
        if in_time :
            if in_time<timezone.now():
                print(in_time)
                print(timezone.now())
                raise forms.ValidationError("Invalid time given!")
        return in_time

class AssignForm(forms.Form):
    vehicle_choices=[
        ("TW","Two_Wheeler"),
        ("FW","Four_Wheeler")
    ]
    vehicle_number=forms.CharField(max_length=255)
    vehicle_type=forms.ChoiceField(choices=vehicle_choices)
    level=forms.IntegerField()

class ReleaseForm(forms.Form):
    vehicle_number=forms.CharField(max_length=255)
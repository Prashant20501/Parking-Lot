from django import forms

class UserCredentialForm(forms.Form):
    username = forms.CharField(max_length=255)
    password = forms.CharField(max_length=255, widget=forms.PasswordInput)
    confirm_password=forms.CharField(max_length=255, widget=forms.PasswordInput)
    first_name = forms.CharField(max_length=255)
    last_name=forms.CharField(max_length=255)

class LoginForm(forms.Form):
    username = forms.CharField(max_length=255)
    password=forms.CharField(max_length=255,widget=forms.PasswordInput)
    
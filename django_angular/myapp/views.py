from django.shortcuts import render
from django.conf import settings

# Create your views here.

def home(req):
    return render(req, 'myapp/main.html', {'STATIC_URL': settings.STATIC_URL})

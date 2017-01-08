from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View, TemplateView
# Create your views here.

class HelloWorldView(View):
    
    def get(self, request, *args, **kwargs):
        return HttpResponse("Hello World!")

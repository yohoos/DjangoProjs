from django.shortcuts import render
from django.views.generic import View, TemplateView, FormView
from django.http import JsonResponse, HttpResponse

class IndexView(TemplateView):
    template_name = 'base.html'

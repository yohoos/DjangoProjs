from django.shortcuts import render
from rest_framework import viewsets
from .models import University, Student
from .serializers import UniversitySerializer, StudentSerializer


# Create your views here.
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

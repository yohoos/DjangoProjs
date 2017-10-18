from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from django.http import JsonResponse

from .serializers import *


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_by_company(self, company=None):
        try:
            company = Job.objects.raw('SELECT * FROM home_job WHERE company=%s LIMIT 1', [company])[0]
        except IndexError:
            raise NotFound("Company Not Found")
        serializer = JobSerializer(company)
        return JsonResponse(serializer.data)

from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from .serializers import *


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def current(self, request):
        try:
            current = Job.objects.raw('SELECT * FROM home_job WHERE current=%s', [True])[0]
        except IndexError:
            raise NotFound("No Current Company Exists. Get a job!")
        serializer = self.serializer_class(current)
        return Response(serializer.data)

    def old(self, request):
        old_jobs = Job.objects.raw('SELECT * FROM home_job WHERE current=%s', [False])
        serializer = self.serializer_class(old_jobs, many=True)
        return Response(serializer.data)


class CompanyJobViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    lookup_field = "company"


class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer

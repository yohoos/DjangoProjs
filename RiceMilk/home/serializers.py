from rest_framework import serializers

from .models import *


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '_all__'

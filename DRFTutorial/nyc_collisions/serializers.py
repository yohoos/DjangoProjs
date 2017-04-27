from .models import *
from rest_framework import serializers

class CollisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collision
        fields = '__all__'
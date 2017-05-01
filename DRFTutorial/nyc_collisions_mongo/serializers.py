from .models import *
from rest_framework_mongoengine import serializers

class CollisionSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Collision
        fields = '__all__'
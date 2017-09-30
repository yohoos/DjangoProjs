from rest_framework_mongoengine import serializers

from .models import *


class CollisionSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Collision
        fields = '__all__'

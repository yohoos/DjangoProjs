from rest_framework import viewsets
from .serializers import *
from .models import *


# Create your views here.
class CollisionViewSet(viewsets.ModelViewSet):
    queryset = Collision.objects.all()
    serializer_class = CollisionSerializer

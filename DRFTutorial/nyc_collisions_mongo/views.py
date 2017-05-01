from rest_framework_mongoengine import viewsets
from .serializers import *
from .models import *


# Create your views here.
class CollisionViewSet(viewsets.ModelViewSet):

    lookup_field = 'id'
    queryset = Collision.objects.all()
    serializer_class = CollisionSerializer

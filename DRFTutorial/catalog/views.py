from rest_framework import generics

from .models import Product
from .serializers import ProductSerializer
from .permissions import IsAdminOrReadOnly


class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAdminOrReadOnly, )

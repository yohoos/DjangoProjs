from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'collisions', CollisionViewSet)

urlpatterns = router.urls
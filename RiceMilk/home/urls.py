from django.conf.urls import url
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()
router.register(r'jobs', JobViewSet)

urlpatterns = [
    url(r'^jobs/company/(?P<company>[a-zA-Z0-9_\s]+)$', JobViewSet.get_by_company)
]

urlpatterns += router.urls

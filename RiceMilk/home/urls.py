from django.conf.urls import url
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()
router.register(r'jobs', JobViewSet, 'jobs')
router.register(r'tools', ToolViewSet, 'tools')
router.register(r'company', CompanyJobViewSet, 'company')

current_detail = JobViewSet.as_view({'get': 'current'})
old_list = JobViewSet.as_view({'get': 'old'})
company_detail = JobViewSet.as_view({'get': 'by_company'})

urlpatterns = [
    url(r'^jobs/current$', current_detail),
    url(r'^jobs/old$', old_list)
]

urlpatterns += router.urls

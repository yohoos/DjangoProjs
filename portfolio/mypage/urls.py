from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^tree_data/$', views.tree_data, name='tree_data'),
]

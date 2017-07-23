from django.conf.urls import url
from .views import *
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^$', home, name='home'),
    url(r'^login/$', auth_views.login, {'template_name': 'client/index.html'}, name='login'),
    url(r'^logout/$', auth_views.logout, {'template_name': 'client/index.html'}, name='logout'),
    url(r'^chrome_history/$', PlotView.as_view(), name='history'),
]

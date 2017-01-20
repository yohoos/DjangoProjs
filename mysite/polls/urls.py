from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.HelloWorldView.as_view()),
    url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail'),
    url(r'^(?P<question_id>[0-9]+)/results/$', views.results, name='results'),
    url(r'^({<question_id>[0-9]+)/vote/$', views.vote, name='vote'),
]

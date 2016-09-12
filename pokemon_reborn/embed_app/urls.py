from django.conf.urls import url
from embed_app.views import IndexView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
]

from django.shortcuts import render
from django.http import JsonResponse
from base.models import *
from urllib.parse import urlparse
from bkcharts import Donut
from bokeh.embed import components
from django.views import View
import pandas as pd


# Create your views here.

def home(request):
    return render(request, template_name='client/index.html')


class PlotView(View):
    model = Urls

    def get(self, request, *args, **kwargs):
        urls = self.model.objects.all()

        df = pd.DataFrame(list(urls.values()))
        df = df.loc[:, ['url', 'visit_count', 'typed_count']]
        df['url'] = df['url'].map(lambda x: urlparse(x).netloc)
        df = df.groupby(by='url', as_index=False).sum()
        df = df.sort_values(by=['visit_count', 'typed_count'], ascending=False).reset_index(drop=True)

        limit = 10

        top_results = df.loc[:limit].copy()
        top_results.loc[limit, 'url'] = 'others'
        top_results.loc[limit, ['visit_count', 'typed_count']] = \
            df.loc[limit:, ['visit_count', 'typed_count']].agg('sum')

        d = Donut(top_results, label='url', values='visit_count')

        script, div = components(d)
        return JsonResponse({'script': script, 'div': div})

from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'mypage/about_me.html')

def tree_data(request):
    return render(request, 'mypage/tree_data.html')

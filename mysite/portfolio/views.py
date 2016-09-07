from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'portfolio/about_me.html')

def projects(request):
    return render(request, 'portfolio/projects.html')

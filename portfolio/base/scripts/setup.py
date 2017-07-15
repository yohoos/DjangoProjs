import sys, os, django

sys.path.append('/home/yohoos/Desktop/DjangoProjs/portfolio')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "portfolio.settings")
django.setup()

print("Django Environment Setup Complete")

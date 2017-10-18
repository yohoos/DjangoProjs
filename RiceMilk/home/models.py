from django.db import models


# Create your models here.
class Job(models.Model):
    title = models.CharField(max_length=50)
    company = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    img = models.ImageField(upload_to="job_icons/")
    url = models.URLField()

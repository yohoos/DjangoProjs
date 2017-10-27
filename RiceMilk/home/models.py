from django.db import models
from django.db.models.signals import post_delete
from django.dispatch.dispatcher import receiver

LOCAL_APPS = [
    'home'
]


# Create your models here.
class Job(models.Model):
    title = models.CharField(max_length=50)
    company = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    img = models.ImageField(upload_to="job_icons/")
    url = models.URLField()
    current = models.BooleanField(default=False)


class Tool(models.Model):
    name = models.CharField(max_length=100)
    img = models.ImageField(upload_to="tool_icons/")
    favorite = models.BooleanField(default=False)
    work_related = models.BooleanField(default=False)



def delete_files(files_list):
    for file_ in files_list:
        if file_ and hasattr(file_, 'storage') and hasattr(file_, 'path'):
            # this accounts for different file storages (e.g. when using django-storages)
            storage_, path_ = file_.storage, file_.path
            storage_.delete(path_)


@receiver(post_delete)
def handle_files_on_delete(sender, instance, **kwargs):
    # presumably you want this behavior only for your apps, in which case you will have to specify them
    is_valid_app = sender._meta.app_label in LOCAL_APPS
    if is_valid_app:
        delete_files([getattr(instance, field_.name, None) for field_ in sender._meta.fields if
                      isinstance(field_, models.ImageField)])

# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-20 15:21
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('basic', '0002_remove_profile_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
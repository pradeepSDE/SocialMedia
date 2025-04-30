from django.contrib import admin
from django.contrib.auth.models import User
# Register your models here.
# admin.site.register(User)

from .models import UserProfile
admin.site.register(UserProfile)
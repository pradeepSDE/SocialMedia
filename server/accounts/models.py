from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    mobile = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.user.username


class Connection(models.Model):
    from_user = models.ForeignKey(
        User, related_name='connections_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(
        User, related_name='connections_received', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username}"

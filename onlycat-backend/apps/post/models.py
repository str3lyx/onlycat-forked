from django.db import models
from django.utils.translation import gettext_lazy as _
from frameworks.base.models import AbstractModel


class Post(AbstractModel):
    caption = models.TextField(blank=True)
    image = models.ImageField(upload_to='post/', null=True)


class PostUpdateLog(AbstractModel):
    class Actions(models.TextChoices):
        CREATED = 'created', 'Created'
        UPDATED = 'updated', 'Updated'
        DELETED = 'deleted', 'Deleted'

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=8, choices=Actions)
    detail = models.JSONField(null=True)


class PostView(AbstractModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='views')


class PostReaction(AbstractModel):
    class Reactions(models.TextChoices):
        LIKE = 'like', 'Like'
        DISLIKE = 'dislike', 'Dislike'

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    reaction = models.CharField(max_length=8, choices=Reactions)

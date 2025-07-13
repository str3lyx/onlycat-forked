from django.conf import settings
from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from django.utils import timezone
from django_currentuser.db.models import CurrentUserField
from typing import Self
from uuid import uuid4


class AbstractModelQuerySet[T: models.Model](models.QuerySet[T]):
    def actives(self):
        return self.filter(is_active=True)
    
    def inactives(self):
        return self.filter(is_active=False)


class AbstractModelManager[T: models.Model](models.Manager[T]):
    def get_queryset(self):
        return AbstractModelQuerySet(self.model, using=self._db)
    
    def actives(self):
        return self.get_queryset().actives()
    
    def inactives(self):
        return self.get_queryset().inactives()


class AbstractModel(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    is_active = models.BooleanField(editable=False, default=True)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = CurrentUserField(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='+')
    objects: AbstractModelManager[Self] = AbstractModelManager()

    @staticmethod
    def base_attrs():
        return ['id', 'is_active', 'created_at', 'created_by']
    
    def on_created(self):
        pass

    def on_updated(self):
        pass

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    class Meta:
        abstract = True
        ordering = ['-created_at']


@receiver(signals.post_save)
def post_save_callback(sender, instance, created, raw, using, update_fields, **kwargs):
    if not instance or hasattr(instance, '_dirty'):
        return
    
    instance._dirty = True
    func = 'on_created' if created else 'on_updated'
    getattr(sender, func, lambda *_: None)(instance)
    del instance._dirty

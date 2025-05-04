from django.db import models
from django.utils import timezone
from django_currentuser.db.models import CurrentUserField
from uuid import uuid4


class AbstractModelQuerySet(models.QuerySet):
    def actives(self):
        return self.filter(is_active=True)
    
    def inactives(self):
        return self.filter(is_active=False)


class AbstractModel(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    is_active = models.BooleanField(editable=False, default=True)
    created = models.DateTimeField(default=timezone.now)
    created_by = CurrentUserField(on_delete=models.CASCADE, related_name='+')
    objects: AbstractModelQuerySet = AbstractModelQuerySet.as_manager()

    @staticmethod
    def base_attrs():
        return ['id', 'is_active', 'created', 'created_by']

    class Meta:
        abstract = True
        ordering = ['-created']

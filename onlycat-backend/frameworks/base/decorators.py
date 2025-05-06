import typing
from django.dispatch import receiver
from django.db.models import signals
from functools import wraps
from .models import AbstractModel


def pre_create(func):
    @wraps(func)
    @receiver(signals.pre_save)
    def inner(sender, instance, **kwargs):
        instance.pk or func(instance)
    return inner


def post_create(func):
    @wraps(func)
    @receiver(signals.post_save)
    def inner(sender, instance, created, **kwargs):
        if not hasattr(instance, '_dirty'):
            instance._dirty = True
            instance.save()
            created and func(instance)
            del instance._dirty
    return inner


def pre_edit(func):
    @wraps(func)
    @receiver(signals.pre_save)
    def inner(sender, instance, **kwargs):
        instance.pk and func(instance)
    return inner


def post_edit(func):
    @wraps(func)
    @receiver(signals.post_save)
    def inner(sender, instance, created, **kwargs):
        if not hasattr(instance, '_dirty'):
            instance._dirty = True
            instance.save()
            created or func(instance)
            del instance._dirty
    return inner

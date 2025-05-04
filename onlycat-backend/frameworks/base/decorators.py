import typing
from django.dispatch import receiver
from django.db.models import signals
from functools import wraps

if typing.TYPE_CHECKING:
    from django.db.models import Model


def pre_create(func):
    def class_decorator(cls):
        @receiver(signals.pre_save, sender=cls)
        @wraps(func)
        def wrapper(instance: Model, **kwargs):
            instance.pk or func(instance, **kwargs)
        return cls
    return class_decorator


def post_create(func):
    def class_decorator(cls):
        @receiver(signals.post_save, sender=cls)
        @wraps(func)
        def wrapper(instance: Model, created: bool, **kwargs):
            created and func(instance, **kwargs)
        return cls
    return class_decorator


def pre_edit(func):
    def class_decorator(cls):
        @receiver(signals.pre_save, sender=cls)
        @wraps(func)
        def wrapper(instance: Model, **kwargs):
            instance.pk and func(instance, **kwargs)
        return cls
    return class_decorator


def post_edit(func):
    def class_decorator(cls):
        @receiver(signals.post_save, sender=cls)
        @wraps(func)
        def wrapper(instance: Model, created: bool, **kwargs):
            created or func(instance, **kwargs)
        return cls
    return class_decorator


def pre_delete(func):
    def class_decorator(cls):
        @receiver(signals.pre_delete, sender=cls)
        @wraps(func)
        def wrapper(instance: Model, created: bool, **kwargs):
            func(instance, **kwargs)
        return cls
    return class_decorator


def post_delete(func):
    def class_decorator(cls):
        @receiver(signals.post_delete, sender=cls)
        @wraps(func)
        def wrapper(instance: Model, created: bool, **kwargs):
            func(instance, **kwargs)
        return cls
    return class_decorator

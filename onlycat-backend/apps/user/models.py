from django.contrib.auth.models import UserManager, AbstractUser
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from typing import Self

from frameworks.base.models import AbstractModel, AbstractModelManager
from .enums import UserActions


class OnlyCatUserManager[T: models.Model](AbstractModelManager[T], UserManager[T]):
    pass


class OnlyCatUser(AbstractModel, AbstractUser):
    """User of onlycat_backend"""

    username = models.CharField(
        max_length=32,
        unique=True,
        validators=[ASCIIUsernameValidator()],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    email = models.EmailField()
    is_verified = models.BooleanField(default=False)
    date_joined = None
    objects: OnlyCatUserManager[Self] = OnlyCatUserManager()

    @property
    def fullname(self):
        return self.get_full_name()

    def on_created(self):
        from .utils.log import gen_create_log
        gen_create_log(self)

    def delete(self, *args, **kwargs):
        from .utils.log import gen_delete_log

        super().delete(*args, **kwargs)
        gen_delete_log(self)
        self.username = self.id.hex
        self.save()

    @staticmethod
    def base_attrs():
        return [
            "id",
            "is_active",
            "created_at",
            "created_by",
            "last_login",
            "is_superuser",
            "is_staff",
            "groups",
            "user_permissions",
        ]

    @staticmethod
    def profile_log_attrs():
        return ["first_name", "last_name"]


class UserAuditLog(AbstractModel):
    """Logs of user activities"""

    user = models.ForeignKey(OnlyCatUser, on_delete=models.CASCADE, related_name="logs")
    action = models.CharField(max_length=32, choices=UserActions)
    details = models.JSONField(null=True)

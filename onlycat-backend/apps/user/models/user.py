from django.contrib.auth.models import UserManager, AbstractUser
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from typing import Self

from frameworks.base.models import AbstractModel, AbstractModelManager
from .log import UserAuditLog, UserActions
from ..utils import email_activation_token_generator


class OnlyCatUserManager[T: models.Model](AbstractModelManager[T], UserManager[T]):
    pass


class OnlyCatUser(AbstractModel, AbstractUser):
    '''User of onlycat_backend'''

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
    
    def __gen_create_log(self):
        UserAuditLog.objects.create(
            user=self,
            action=UserActions.CREATED,
            created_at=self.created_at
        )
    
    def __gen_delete_log(self):
        UserAuditLog.objects.create(
            user=self,
            action=UserActions.DELETED
        )
    
    def __request_token(self):
        token = email_activation_token_generator.make_token(self)
        print(token)
        # self.email_user(
        #     subject='Email activation',
        #     message=token
        # )

        UserAuditLog.objects.create(
            user=self,
            action=UserActions.ACTIVATION_REQUEST,
            created_at=self.created_at,
            details={ 'for_email': self.email }
        )
    
    def on_created(self):
        self.__gen_create_log()
        self.__request_token()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.__gen_delete_log()
        self.username = self.id.hex
        self.save()
    
    @staticmethod
    def base_attrs():
        return ['id', 'is_active', 'created_at', 'created_by',
                'last_login', 'is_superuser', 'is_staff',
                'groups', 'user_permissions']

    @staticmethod
    def profile_log_attrs():
        return ['first_name', 'last_name']

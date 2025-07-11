from django.contrib.auth.models import UserManager, AbstractUser
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from typing import Self
from frameworks.base.models import AbstractModel, AbstractModelManager


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
    date_joined = None
    objects: OnlyCatUserManager[Self] = OnlyCatUserManager()

    @property
    def fullname(self):
        return self.get_full_name()
    
    def __gen_create_log(self):
        UserAuditLog.objects.create(
            user=self,
            action=UserAuditLog.Actions.CREATED,
            created_at=self.created_at
        )
    
    def __request_token(self):
        token = default_token_generator.make_token(self)
        print(token)
        # self.email_user(
        #     subject='Email activation',
        #     message=token
        # )

        UserAuditLog.objects.create(
            user=self,
            action=UserAuditLog.Actions.ACTIVATION_REQUEST,
            created_at=self.created_at,
            details={ 'for_email': self.email }
        )
    
    def on_created(self):
        self.__gen_create_log()
        self.__request_token()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.username = self.id.hex
        self.save()
    
    @staticmethod
    def base_attrs():
        return ['id', 'is_active', 'created_at', 'created_by',
                'last_login', 'is_superuser', 'is_staff',
                'groups', 'user_permissions']


class UserAuditLog(AbstractModel):
    '''Logs of user activities'''

    class Actions(models.TextChoices):
        CREATED = 'created', 'Created'
        UPDATED = 'updated', 'Updated'
        CHANGE_EMAIL = 'change_email', 'Email Update'
        CHANGE_PASSWORD = 'change_password', 'Change Password'
        DELETED = 'deleted', 'Deleted'
        # login
        LOGIN_SUCCESS = 'login_success', 'Login Success'
        LOGIN_FAILURE = 'login_failure', 'Login Failure'
        LOGOUT        = 'logout', 'Logout'
        # password
        PASSWORD_RESET_REQUEST = 'password_reset_request', 'Password Reset Request'
        PASSWORD_RESET_SUCCESS = 'password_reset_success', 'Password Reset Success'
        # activation
        ACTIVATION_REQUEST = 'activation_request', 'Email Activation Request'
        ACTIVATION_SUCCESS = 'activation_success', 'Email Activation Success'

    user = models.ForeignKey(OnlyCatUser, on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=32, choices=Actions)
    details = models.JSONField(null=True)

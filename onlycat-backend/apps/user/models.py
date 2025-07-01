from django.contrib.auth.models import UserManager, AbstractUser
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from frameworks.base.models import AbstractModel, AbstractModelQuerySet


class OnlyCatUserManager(UserManager):
    def get_queryset(self):
        return AbstractModelQuerySet(self.model, using=self._db)
    
    def actives(self):
        return self.get_queryset().actives()
    
    def inactives(self):
        return self.get_queryset().inactives()
    

class OnlyCatUser(AbstractModel, AbstractUser):
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
    objects: OnlyCatUserManager = OnlyCatUserManager()

    @property
    def fullname(self):
        return self.get_full_name()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.username = self.id.hex
        self.save()
    
    @staticmethod
    def base_attrs():
        return ['id', 'is_active', 'created', 'created_by',
                'last_login', 'is_superuser', 'is_staff',
                'groups', 'user_permissions']


class UserAuditLog(AbstractModel):
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

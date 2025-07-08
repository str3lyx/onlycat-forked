from django.contrib.auth.models import UserManager, AbstractUser
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from frameworks.base.models import AbstractModel, AbstractModelManager


class OnlyCatUserManager(AbstractModelManager, UserManager):
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


class UserToken(AbstractModel):
    '''Record of token use for E-mail activation and Password Recovering (Forgot Password Case)'''

    class Types(models.TextChoices):
        EMAIL_ACTIVATION = 'email_activation', _('Email Activation')
        PASSWORD_RESET = 'password_reset', _('Password Reset')

    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        EXPIRED = 'expired', _('Expired')
        ACTIVATED = 'activated', _('Activated')

    user = models.ForeignKey(OnlyCatUser, on_delete=models.CASCADE, related_name='tokens')
    for_email = models.EmailField()
    type = models.CharField(max_length=32, choices=Types)
    status = models.CharField(max_length=32, choices=Status, default=Status.PENDING)
    token = models.CharField(max_length=512)
    expired_at = models.DateTimeField(null=True)
    used_at = models.DateTimeField(null=True)

import typing
from django.db import models
from django.utils.translation import gettext_lazy as _
from frameworks.base.models import AbstractModel

if typing.TYPE_CHECKING:
    from .user import OnlyCatUser


class UserActions(models.TextChoices):
    CREATED = 'created', _('Created')
    UPDATED = 'updated', _('Updated')
    CHANGE_EMAIL = 'change_email', 'Email Update'
    CHANGE_PASSWORD = 'change_password', 'Change Password'
    DELETED = 'deleted', _('Deleted')
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


class UserAuditLog(AbstractModel):
    '''Logs of user activities'''

    user: 'OnlyCatUser' = models.ForeignKey('user.OnlyCatUser', on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=32, choices=UserActions)
    details = models.JSONField(null=True)

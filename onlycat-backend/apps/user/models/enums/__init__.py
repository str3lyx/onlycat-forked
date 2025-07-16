from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as _


class UserActions(TextChoices):
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
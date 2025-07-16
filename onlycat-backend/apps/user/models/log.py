import typing
from django.db import models
from frameworks.base.models import AbstractModel
from .enums import UserActions

if typing.TYPE_CHECKING:
    from .user import OnlyCatUser


class UserAuditLog(AbstractModel):
    '''Logs of user activities'''

    user: 'OnlyCatUser' = models.ForeignKey('user.OnlyCatUser', on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=32, choices=UserActions)
    details = models.JSONField(null=True)

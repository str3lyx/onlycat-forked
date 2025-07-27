from contextlib import contextmanager
from ..models import UserAuditLog, OnlyCatUser
from ..enums import UserActions


__PROFILE_FIELDS = ['first_name', 'last_name']


def gen_create_log(user: 'OnlyCatUser'):
    return UserAuditLog.objects.create(
        user=user,
        action=UserActions.CREATED,
        created_at=user.created_at,
        created_by=user.created_by,
        details={
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email,
            'is_verified': user.is_verified
        }
    )


def gen_delete_log(user: 'OnlyCatUser'):
    return UserAuditLog.objects.create(
        user=user,
        action=UserActions.DELETED
    )


def __get_fields(user: 'OnlyCatUser'):
    return { field: getattr(user, field, None) for field in __PROFILE_FIELDS }


def __get_update_data(old_data: dict[str, any], new_data: dict[str, any]):
    details = {'old_data': {}, 'new_data': {}}
    for field in __PROFILE_FIELDS:
        if old_data.get(field, None) != new_data.get(field, None):
            details['old_data'][field] = old_data.get(field, None)
            details['new_data'][field] = new_data.get(field, None)
    return details


@contextmanager
def gen_update_log(user: 'OnlyCatUser'):
    old = __get_fields(user)
    yield
    user.refresh_from_db()
    new = __get_fields(user)

    UserAuditLog.objects.create(
        user=user,
        action=UserActions.UPDATED,
        details=__get_update_data(old, new)
    )


def gen_password_change_log(user: 'OnlyCatUser'):
    return UserAuditLog.objects.create(
        user=user,
        action=UserActions.CHANGE_PASSWORD
    )


@contextmanager
def gen_email_change_log(user: 'OnlyCatUser'):
    old = user.email
    yield
    user.refresh_from_db()
    new = user.email

    UserAuditLog.objects.create(
        user=user,
        action=UserActions.CHANGE_EMAIL,
        details={
            'old_data': {'email': old},
            'new_data': {'email': new}
        }
    )


def gen_activation_request_log(user: 'OnlyCatUser'):
    return UserAuditLog.objects.create(
        user=user,
        action=UserActions.ACTIVATION_REQUEST,
        details={'for_email': user.email}
    )


def gen_activation_success_log(user: 'OnlyCatUser'):
    return UserAuditLog.objects.create(
        user=user,
        action=UserActions.ACTIVATION_SUCCESS,
    )


def gen_password_request_log(user: 'OnlyCatUser'):
    return UserAuditLog.objects.create(
        user=user,
        action=UserActions.PASSWORD_RESET_REQUEST,
        details={'for_email': user.email}
    )


def gen_password_success_log(user: 'OnlyCatUser'):
    return UserAuditLog.objects.create(
        user=user,
        action=UserActions.PASSWORD_RESET_SUCCESS,
    )

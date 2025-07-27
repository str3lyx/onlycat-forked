from ..enums import TokenTypes
from .log import (
    gen_activation_request_log,
    gen_password_request_log,
    gen_password_success_log,
    gen_activation_success_log,
)

import typing

if typing.TYPE_CHECKING:
    from ..models import OnlyCatUser


def gen_activation_token(user: "OnlyCatUser"):
    token = TokenTypes.EMAIL_ACTIVATION.generator.make_token(user)
    # TODO: send-email
    print(token)

    gen_activation_request_log(user)


def check_activation_token(user: "OnlyCatUser", token: str):
    if TokenTypes.EMAIL_ACTIVATION.generator.check_token(user, token):
        gen_activation_success_log(user)
        user.is_verified = True
        user.save()
        return True
    return False


def gen_password_reset_token(user: "OnlyCatUser"):
    token = TokenTypes.PASSWORD_RECOVER.generator.make_token(user)
    # TODO: send-email
    print(token)

    gen_password_request_log(user)


def check_password_reset_token(user: "OnlyCatUser", token: str):
    return TokenTypes.PASSWORD_RECOVER.generator.check_token(user, token)

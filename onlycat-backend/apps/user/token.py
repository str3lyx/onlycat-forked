from django.contrib.auth.tokens import PasswordResetTokenGenerator


class TokenGenerator(PasswordResetTokenGenerator):
    def __init__(self, key_salt: str):
        super().__init__()
        self.key_salt = key_salt

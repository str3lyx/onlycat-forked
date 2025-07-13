from django.contrib.auth.tokens import PasswordResetTokenGenerator


class TokenGenerator(PasswordResetTokenGenerator):
    def __init__(self, key_salt: str):
        super().__init__()
        self.key_salt = key_salt


email_activation_token_generator = TokenGenerator('email-activation-token-generator')
password_reset_token_generator = TokenGenerator('password-reset-token-generator')

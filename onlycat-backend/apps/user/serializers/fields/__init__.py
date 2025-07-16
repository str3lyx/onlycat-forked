from rest_framework import serializers
from ... import validators


class PasswordField(serializers.CharField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.write_only = True
        self.validators.append(validators.ASCIIPasswordValidator())
        self.style['input_type'] = 'password'

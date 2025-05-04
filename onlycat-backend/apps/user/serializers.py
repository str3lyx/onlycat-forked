from django.contrib.auth.hashers import make_password
from django.contrib.auth.validators import ASCIIUsernameValidator
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from . import models, validators


class PasswordField(serializers.CharField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.write_only = True
        self.validators.append(validators.ASCIIPasswordValidator())
        self.style['input_type'] = 'password'


class OnlyCatUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=16,
        validators=[
            ASCIIUsernameValidator(),
            UniqueValidator(queryset=models.OnlyCatUser.objects.actives())
        ]
    )
    fullname = serializers.CharField(read_only=True)
    password = PasswordField(read_only=True)
    email = serializers.EmailField(
        validators=[
            UniqueValidator(queryset=models.OnlyCatUser.objects.actives())
        ]
    )

    class Meta:
        model = models.OnlyCatUser
        fields = '__all__'
        read_only_fields = ['last_login', 'is_superuser', 'is_staff', 'created',
                            'created_by', 'groups', 'user_permissions']


class UserRegistrationSerializer(OnlyCatUserSerializer):
    password = PasswordField(min_length=8, max_length=16)

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    class Meta:
        fields = ['username', 'password']


class PasswordChangeSerializer(serializers.ModelSerializer):
    current_password = PasswordField(min_length=8, max_length=16)
    password = PasswordField(min_length=8, max_length=16)

    def validate_current_password(self, current_password):
        self.instance: models.OnlyCatUser
        if not self.instance.check_password(current_password):
            raise serializers.ValidationError('Mismatch password')
        return current_password

    def update(self, instance, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

    class Meta:
        model = models.OnlyCatUser
        fields = ['password']

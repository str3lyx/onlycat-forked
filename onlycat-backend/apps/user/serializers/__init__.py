from django.contrib.auth.hashers import make_password
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .. import models
from ..models.enums import UserActions
from .fields import PasswordField


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
    is_verified = serializers.BooleanField(read_only=True)

    class Meta:
        model = models.OnlyCatUser
        fields = '__all__'
        read_only_fields = models.OnlyCatUser.base_attrs()


class UserProfileEditSerializer(OnlyCatUserSerializer):
    username = serializers.CharField(read_only=True)
    password = None
    email = serializers.EmailField(read_only=True)

    def __get_update_data(self, instance, validated_data):
        details = {'old_data': {}, 'new_data': {}}
        for field in models.OnlyCatUser.profile_log_attrs():
            if (old := getattr(instance, field, None)) != validated_data.get(field, None):
                details['old_data'][field] = old
                details['new_data'][field] = validated_data.get(field, None)
        return details

    @transaction.atomic
    def update(self, instance, validated_data):
        details = self.__get_update_data(instance, validated_data)
        user = super().update(instance, validated_data)
        models.UserAuditLog.objects.create(
            user=user,
            action=UserActions.UPDATED,
            details=details
        )
        return user

    class Meta:
        model = models.OnlyCatUser
        exclude = ['password']
        read_only_fields = models.OnlyCatUser.base_attrs()


class UserRegistrationSerializer(OnlyCatUserSerializer):
    password = PasswordField(min_length=8, max_length=16)

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=16)
    password = PasswordField()

    class Meta:
        fields = ['username', 'password']


class PasswordChangeSerializer(serializers.ModelSerializer):
    current_password = PasswordField(min_length=8, max_length=16)
    password = PasswordField(min_length=8, max_length=16)

    def validate_current_password(self, current_password):
        self.instance: models.OnlyCatUser
        if not self.instance.check_password(current_password):
            raise serializers.ValidationError(_('Mismatch password'))
        return current_password

    def update(self, instance, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

    class Meta:
        model = models.OnlyCatUser
        fields = ['current_password', 'password']

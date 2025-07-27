from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.models import OnlyCatUser, UserActions


class UserRegisterTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_register_should_return_201(self):
        result = self.client.post(
            reverse("user-register"),
            {
                "username": "john.doe",
                "password": "Passw0rd",
                "email": "john.doe@example.com",
                "first_name": "John",
                "last_name": "Doe",
            },
        )

        assert result.status_code == status.HTTP_201_CREATED

        # check user info
        user = OnlyCatUser.objects.first()
        assert user is not None
        assert user.username == "john.doe"
        assert user.check_password("Passw0rd")
        assert user.first_name == "John"
        assert user.last_name == "Doe"
        assert user.fullname == "John Doe"
        assert user.is_verified is False
        assert user.email == 'john.doe@example.com'

        # check log
        created_log = user.logs.actives().filter(action=UserActions.CREATED).first()
        assert created_log is not None
        assert created_log.created_at == user.created_at
        assert created_log.created_by == user.created_by
        assert created_log.details['first_name'] == 'John'
        assert created_log.details['last_name'] == 'Doe'
        assert created_log.details['username'] == 'john.doe'
        assert created_log.details['email'] == 'john.doe@example.com'
        assert created_log.details['is_verified'] is False

        # check log
        activate_log = (
            user.logs.actives().filter(action=UserActions.ACTIVATION_REQUEST).first()
        )
        assert activate_log is not None
        assert activate_log.details["for_email"] == user.email

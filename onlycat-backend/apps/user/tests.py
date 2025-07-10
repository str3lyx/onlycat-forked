from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.models import OnlyCatUser, UserAuditLog, UserToken


class UserRegisterTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
    
    def test_user_register_should_return_201(self):
        result = self.client.post(
            reverse('user-register'),
            {
                'username': 'john.doe',
                'password': 'Passw0rd',
                'email': 'john.doe@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
            }
        )

        assert result.status_code == status.HTTP_201_CREATED

        # check user info
        user = OnlyCatUser.objects.first()
        assert user is not None
        assert user.username == 'john.doe'
        assert user.check_password('Passw0rd')
        assert user.first_name == 'John'
        assert user.last_name == 'Doe'
        assert user.fullname == 'John Doe'

        # check log
        log = UserAuditLog.objects.first()
        assert log is not None
        assert log.user == user
        assert log.action == UserAuditLog.Actions.CREATED
        assert log.created_at == user.created_at

        # check token
        token = UserToken.objects.first()
        assert token is not None
        assert token.user == user
        assert token.for_email == user.email
        # assert token.created_at == user.created_at
        assert token.type == UserToken.Types.EMAIL_ACTIVATION
        assert token.status == UserToken.Status.PENDING

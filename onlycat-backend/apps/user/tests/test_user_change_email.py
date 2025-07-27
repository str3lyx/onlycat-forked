from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.factories import OnlyCatUserFactory


class UserChangeEmailTestCase(TestCase):
    def setUp(self):
        self.user = OnlyCatUserFactory(
            email='john.doe@example.com',
            is_verified=True,
        )
        self.user.set_password("password")
        self.user.save()

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_change_email_should_success(self):
        assert self.user.is_verified is True

        response = self.client.post(
            reverse("change-email"),
            data={
                'current_password': 'password',
                'email': 'zhong.xina@example.com'
            }
        )

        assert response.status_code == status.HTTP_200_OK

        self.user.refresh_from_db()
        assert self.user.email == 'zhong.xina@example.com'
        assert self.user.is_verified is False
    
    def test_wrong_password_expect_400(self):
        response = self.client.post(
            reverse("change-email"),
            data={
                'current_password': 'wrongwrong',
                'email': 'zhong.xina@example.com'
            }
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST

        self.user.refresh_from_db()
        assert self.user.email == 'john.doe@example.com'
        assert self.user.is_verified is True

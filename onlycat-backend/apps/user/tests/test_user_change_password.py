from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.factories import OnlyCatUserFactory


class UserChangePasswordTestCase(TestCase):
    def setUp(self):
        self.user = OnlyCatUserFactory()
        self.user.set_password("password")
        self.user.save()

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_change_password_should_success(self):
        response = self.client.post(
            reverse("change-password"),
            data={
                'current_password': 'password',
                'password': 'changechange'
            }
        )

        assert response.status_code == status.HTTP_200_OK

        self.user.refresh_from_db()
        assert self.user.check_password('password') is False
        assert self.user.check_password('changechange') is True
    
    def test_wrong_password_expect_400(self):
        response = self.client.post(
            reverse("change-password"),
            data={
                'current_password': 'wrongwrong',
                'password': 'changechange'
            }
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST

        self.user.refresh_from_db()
        assert self.user.check_password('password') is True
        assert self.user.check_password('changechange') is False

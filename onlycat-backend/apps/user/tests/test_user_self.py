from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.user import factories
from apps.user.models import UserActions


class UserSelfTestCase(TestCase):
    def setUp(self):
        self.user = factories.OnlyCatUserFactory(
            username="john.doe",
            email="john.doe@example.com",
            first_name="John",
            last_name="Doe",
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_self_info(self):
        response = self.client.get(reverse("self"))
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data["fullname"] == "John Doe"
        assert data["first_name"] == "John"
        assert data["last_name"] == "Doe"
        assert data["username"] == "john.doe"
        assert data["email"] == "john.doe@example.com"
        assert "password" not in data

    def test_update_self_profile(self):
        response = self.client.patch(
            reverse("self"), data={"first_name": "Zhong", "last_name": "Xina"}
        )
        assert response.status_code == status.HTTP_200_OK

        log = self.user.logs.actives().filter(action=UserActions.UPDATED).first()
        assert log is not None
        assert log.details["old_data"]["first_name"] == "John"
        assert log.details["new_data"]["first_name"] == "Zhong"
        assert log.details["old_data"]["last_name"] == "Doe"
        assert log.details["new_data"]["last_name"] == "Xina"

        self.user.refresh_from_db()
        assert self.user.first_name == "Zhong"
        assert self.user.last_name == "Xina"
        assert self.user.fullname == "Zhong Xina"

    def test_delete_self(self):
        response = self.client.delete(reverse("self"))
        assert response.status_code == status.HTTP_204_NO_CONTENT

        log = self.user.logs.actives().filter(action=UserActions.DELETED).first()
        assert log is not None

    def test_inactive_self_do_action_expected_error(self):
        self.user.delete()

        response = self.client.get(reverse("self"))
        assert response.status_code == status.HTTP_403_FORBIDDEN

        response = self.client.patch(reverse("self"), data={})
        assert response.status_code == status.HTTP_403_FORBIDDEN

        response = self.client.delete(reverse("self"))
        assert response.status_code == status.HTTP_403_FORBIDDEN

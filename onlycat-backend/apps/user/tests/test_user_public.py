from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from uuid import uuid4
from apps.user import factories


class PublicUserTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.pk = uuid4()
        self.user = factories.OnlyCatUserFactory(
            id=self.pk,
            username="john.doe",
            email="john.doe@example.com",
            first_name="John",
            last_name="Doe",
        )

    def test_get_user_list(self):
        response = self.client.get(reverse("user-list"))
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data["count"] == 1
        assert data["results"][0]["fullname"] == "John Doe"
        assert data["results"][0]["first_name"] == "John"
        assert data["results"][0]["last_name"] == "Doe"
        assert data["results"][0]["username"] == "john.doe"
        assert data["results"][0]["email"] == "john.doe@example.com"
        assert "password" not in data["results"][0]

    def test_get_user_detail(self):
        response = self.client.get(reverse("user-detail", args=[self.pk]))
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data["fullname"] == "John Doe"
        assert data["first_name"] == "John"
        assert data["last_name"] == "Doe"
        assert data["username"] == "john.doe"
        assert data["email"] == "john.doe@example.com"
        assert "password" not in data

    def test_get_unexisted_user_expected_404_error(self):
        response = self.client.get(reverse("user-detail", args=[uuid4()]))
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_inactive_user_expected_404_error(self):
        self.user.delete()
        response = self.client.get(reverse("user-detail", args=[self.pk]))
        assert response.status_code == status.HTTP_404_NOT_FOUND

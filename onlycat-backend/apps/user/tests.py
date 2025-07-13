from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from uuid import uuid4

from apps.user import factories
from apps.user.models import OnlyCatUser
from apps.user.models.log import UserActions


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
        created_log = user.logs.actives().filter(action=UserActions.CREATED).first()
        assert created_log is not None
        assert created_log.created_at == user.created_at

        # check log
        activate_log = user.logs.actives().filter(action=UserActions.ACTIVATION_REQUEST).first()
        assert activate_log is not None
        assert activate_log.details['for_email'] == user.email


class PublicUserTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.pk = uuid4()
        self.user = factories.OnlyCatUserFactory(
            id=self.pk,
            username='john.doe',
            email='john.doe@example.com',
            first_name='John',
            last_name='Doe'
        )

    def test_get_user_list(self):
        response = self.client.get(reverse('user-list'))
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data['count'] == 1
        assert data['results'][0]['fullname'] == 'John Doe'
        assert data['results'][0]['first_name'] == 'John'
        assert data['results'][0]['last_name'] == 'Doe'
        assert data['results'][0]['username'] == 'john.doe'
        assert data['results'][0]['email'] == 'john.doe@example.com'
        assert 'password' not in data['results'][0]
    
    def test_get_user_detail(self):
        response = self.client.get(reverse('user-detail', args=[self.pk]))
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data['fullname'] == 'John Doe'
        assert data['first_name'] == 'John'
        assert data['last_name'] == 'Doe'
        assert data['username'] == 'john.doe'
        assert data['email'] == 'john.doe@example.com'
        assert 'password' not in data
    
    def test_get_unexisted_user_expected_404_error(self):
        response = self.client.get(reverse('user-detail', args=[uuid4()]))
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_get_inactive_user_expected_404_error(self):
        self.user.delete()
        response = self.client.get(reverse('user-detail', args=[self.pk]))
        assert response.status_code == status.HTTP_404_NOT_FOUND


class UserSelfTestCase(TestCase):
    def setUp(self):
        self.user = factories.OnlyCatUserFactory(
            username='john.doe',
            email='john.doe@example.com',
            first_name='John',
            last_name='Doe'
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_get_self_info(self):
        response = self.client.get(reverse('self'))
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data['fullname'] == 'John Doe'
        assert data['first_name'] == 'John'
        assert data['last_name'] == 'Doe'
        assert data['username'] == 'john.doe'
        assert data['email'] == 'john.doe@example.com'
        assert 'password' not in data
    
    def test_update_self_profile(self):
        response = self.client.patch(
            reverse('self'),
            data={
                'first_name': 'Zhong',
                'last_name': 'Xina'
            }
        )
        assert response.status_code == status.HTTP_200_OK

        log = self.user.logs.actives().filter(action=UserActions.UPDATED).first()
        assert log is not None

        self.user.refresh_from_db()
        assert self.user.first_name == 'Zhong'
        assert self.user.last_name == 'Xina'
        assert self.user.fullname == 'Zhong Xina'

    def test_delete_self(self):
        response = self.client.delete(reverse('self'))
        assert response.status_code == status.HTTP_204_NO_CONTENT

        log = self.user.logs.actives().filter(action=UserActions.DELETED).first()
        assert log is not None
    
    def test_inactive_self_do_action_expected_error(self):
        self.user.delete()

        response = self.client.get(reverse('self'))
        assert response.status_code == status.HTTP_404_NOT_FOUND

        response = self.client.patch(reverse('self'), data={})
        assert response.status_code == status.HTTP_404_NOT_FOUND

        response = self.client.delete(reverse('self'))
        assert response.status_code == status.HTTP_404_NOT_FOUND
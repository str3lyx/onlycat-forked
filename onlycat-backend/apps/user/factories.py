from factory import faker
from factory.django import DjangoModelFactory
from . import models


class OnlyCatUserFactory(DjangoModelFactory):
    username = faker.Faker('user_name')
    email = faker.Faker('safe_email')
    first_name = faker.Faker('first_name')
    last_name = faker.Faker('last_name')

    class Meta:
        model = models.OnlyCatUser

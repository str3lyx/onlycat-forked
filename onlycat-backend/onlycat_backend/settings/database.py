import os

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get('DB_NAME'),
        "USER": os.environ.get('DB_USER', 'postgres'),
        "PASSWORD": os.environ.get('DB_PASSWORD', 'postgres'),
        "HOST": os.environ.get('DB_HOST', '127.0.0.1'),
        "PORT": os.environ.get('DB_PORT', '5432'),
    }
}
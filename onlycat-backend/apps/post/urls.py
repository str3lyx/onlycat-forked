from rest_framework.routers import SimpleRouter
from rest_framework.urls import path
from . import views


router = SimpleRouter()
router.register('', views.PostViewset, basename='post')


urlpatterns = [
    *router.urls
]
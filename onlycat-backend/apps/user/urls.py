from rest_framework.routers import SimpleRouter
from rest_framework.urls import path
from . import views


router = SimpleRouter()
router.register('', views.PublicOnlyCatUserViewset, basename='user')


urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('sign-in/', views.SignInView.as_view(), name='user-signin'),
    path('sign-out/', views.SignOutView.as_view(), name='user-signout'),
    path('me/', views.PrivateOnlyCatUserView.as_view(), name='self'),
    path('me/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('me/change-email/', views.ChangeEmailView.as_view(), name='change-email'),
    *router.urls
]
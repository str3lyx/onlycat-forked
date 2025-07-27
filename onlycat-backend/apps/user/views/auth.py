from django.contrib.auth import authenticate, login, logout
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import views, generics, permissions, status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response

from .. import models, serializers
from ..utils.token import gen_activation_token


@extend_schema(summary=_('User Registration'), tags=['Authentication'])
class UserRegistrationView(generics.CreateAPIView):
    queryset = models.OnlyCatUser.objects.actives()
    serializer_class = serializers.UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        gen_activation_token(user)


@extend_schema(
    summary=_('Sign in'),
    request=serializers.SignInSerializer,
    responses={
        status.HTTP_200_OK: serializers.OnlyCatUserSerializer,
    },
    tags=['Authentication']
)
class SignInView(generics.GenericAPIView):
    queryset = models.OnlyCatUser.objects.actives()
    serializer_class = serializers.SignInSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        if not (user := authenticate(request, username=username, password=password)):
            raise AuthenticationFailed(_('Invalid credential: username/password mismatched'))
        
        login(request, user)
        return Response(data=serializers.OnlyCatUserSerializer(instance=user).data)


@extend_schema(
    summary=_('Sign out'),
    request=None,
    responses={
        status.HTTP_204_NO_CONTENT: None
    },
    tags=['Authentication']
)
class SignOutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

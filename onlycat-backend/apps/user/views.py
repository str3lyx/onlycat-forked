from django.contrib.auth import authenticate, login, logout
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import generics, views, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.response import Response
from . import models, serializers


class PublicOnlyCatUserViewset(viewsets.ReadOnlyModelViewSet):
    queryset = models.OnlyCatUser.objects.actives()
    serializer_class = serializers.OnlyCatUserSerializer
    permission_classes = [permissions.AllowAny]


class UserRegistrationView(generics.CreateAPIView):
    queryset = models.OnlyCatUser.objects.actives()
    serializer_class = serializers.UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class SignInView(generics.GenericAPIView):
    queryset = models.OnlyCatUser.objects.actives()
    serializer_class = serializers.SignInSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=serializers.SignInSerializer,
        responses={200: serializers.OnlyCatUserSerializer}
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        if not (user := authenticate(request, username=username, password=password)):
            raise AuthenticationFailed(_('Invalid credential: username/password mismatched'))
        #
        login(request, user)
        return Response(data=serializers.OnlyCatUserSerializer(instance=user).data)


class PrivateOnlyCatUserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.OnlyCatUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def delete(self, request, *args, **kwargs):
        self.get_object().delete()
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = serializers.PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    @extend_schema(responses={200: serializers.OnlyCatUserSerializer})
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        #
        response = serializers.OnlyCatUserSerializer(instance=self.get_object()).data
        return Response(data=response, status=status.HTTP_200_OK)


class SignOutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(request=None, responses={ 204: None })
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

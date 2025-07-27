from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .. import serializers
from ..utils import log


class PrivateOnlyCatUserView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_active:
            raise PermissionDenied
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return serializers.UserProfileEditSerializer
        return serializers.OnlyCatUserSerializer


@extend_schema(
    summary=_('User Change Password'),
    responses={200: serializers.OnlyCatUserSerializer}
)
class ChangePasswordView(generics.GenericAPIView):
    serializer_class = serializers.PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_active:
            raise PermissionDenied
        return self.request.user
    
    def perform_update(self, serializer):
        serializer.save()
        log.gen_password_change_log(self.get_object())
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        response = serializers.OnlyCatUserSerializer(instance=self.get_object()).data
        return Response(data=response, status=status.HTTP_200_OK)


@extend_schema(
    summary=_('User Change Email'),
    responses={200: serializers.OnlyCatUserSerializer}
)
class ChangeEmailView(generics.GenericAPIView):
    serializer_class = serializers.EmailChangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_active:
            raise PermissionDenied
        return self.request.user
    
    def perform_update(self, serializer):
        user = self.get_object()
        with log.gen_email_change_log(user):
            serializer.save()
            user.is_verified = False
            user.save()
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        response = serializers.OnlyCatUserSerializer(instance=self.get_object()).data
        return Response(data=response, status=status.HTTP_200_OK)

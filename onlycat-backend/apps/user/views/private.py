from django.contrib.auth import logout
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from .. import serializers


class PrivateOnlyCatUserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.OnlyCatUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_active:
            raise NotFound
        return self.request.user
    
    def delete(self, request, *args, **kwargs):
        self.get_object().delete()
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(summary=_('User Change Password'))
class ChangePasswordView(generics.GenericAPIView):
    serializer_class = serializers.PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if not self.request.user.is_active:
            raise NotFound
        return self.request.user
    
    @extend_schema(responses={200: serializers.OnlyCatUserSerializer})
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        response = serializers.OnlyCatUserSerializer(instance=self.get_object()).data
        return Response(data=response, status=status.HTTP_200_OK)
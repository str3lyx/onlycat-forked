from django.contrib.auth import authenticate, login, logout
from rest_framework import generics, views, viewsets, permissions, status
from rest_framework.exceptions import ValidationError
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

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        if not (user := authenticate(request, username=username, password=password)):
            raise ValidationError('Invalid credential: username/password mismatched')
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


class SignOutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

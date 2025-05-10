from rest_framework import viewsets, permissions
from frameworks.base.permissions import IsAuthorOrReadOnly
from . import models, serializers


class PostViewset(viewsets.ModelViewSet):
    queryset = models.Post.objects.actives()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.AllowAny]

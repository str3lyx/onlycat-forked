from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions
from .. import models, serializers


# @extend_schema(summary=_('Public'))
class PublicOnlyCatUserViewset(viewsets.ReadOnlyModelViewSet):
    queryset = models.OnlyCatUser.objects.actives()
    serializer_class = serializers.OnlyCatUserSerializer
    permission_classes = [permissions.AllowAny]

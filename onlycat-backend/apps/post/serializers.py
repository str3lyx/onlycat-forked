from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from . import models


class PostSerializer(serializers.ModelSerializer):

    def __check_both_caption_image_not_empty(self, caption='', image=None, **kwargs):
        if not (caption or image):
            msg = _('Either caption or image must not both be empty.')
            raise serializers.ValidationError({'caption': msg, 'image': msg})

    def validate(self, attrs):
        self.__check_both_caption_image_not_empty(**attrs)
        return attrs

    class Meta:
        model = models.Post
        fields = '__all__'
        read_only_fields = models.Post.base_attrs()

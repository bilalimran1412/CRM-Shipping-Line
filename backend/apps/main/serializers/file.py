from rest_framework import serializers
from main.models import File
from django.conf import settings


class FileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    thumb = serializers.SerializerMethodField(read_only=True)
    file_size = serializers.SerializerMethodField(read_only=True)

    def get_name(self, instance):
        if instance.file:
            return instance.file.name
        return None

    def get_thumb(self, instance):
        if instance.thumb:
            return f'{settings.APP_HOST}{instance.thumb.url}'
        return None

    def get_file_size(self, instance):
        if instance.file:
            return instance.file.size
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.file:
            representation['file'] = f'{settings.APP_HOST}{instance.file.url}'
        return representation

    class Meta:
        model = File
        fields = ('id', 'file', 'name', 'type', 'thumb', 'file_size')

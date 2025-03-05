from rest_framework import serializers
from django.contrib.auth.models import Permission, ContentType, Group
from ..models import GroupExtension


class GroupSerializer(serializers.ModelSerializer):
    title = serializers.CharField(write_only=True)

    def get_title(self, instance):
        if hasattr(instance, 'extension'):
            return instance.extension.title
        return None

    def create(self, validated_data):
        title = validated_data.pop('title', None)
        group = super().create(validated_data)
        if title:
            GroupExtension.objects.create(group=group, title=title)
        return group

    def update(self, instance, validated_data):
        title = validated_data.pop('title', None)
        group = super().update(instance, validated_data)
        if title:
            if hasattr(group, 'extension'):
                group.extension.title = title
                group.extension.save()
            else:
                GroupExtension.objects.create(group=group, title=title)
        return group

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        title = instance.extension.title if hasattr(instance, 'extension') else None
        instance_id = representation.pop('id')
        ordered_representation = {
            "id": instance_id,
            "title": title,
            **representation,
        }
        return ordered_representation

    class Meta:
        model = Group
        fields = (
            'id',
            'title',
            'name',
            'permissions',
        )


class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = (
            'id',
            'app_label',
            'model',
        )


class PermissionSerializer(serializers.ModelSerializer):
    content_type = ContentTypeSerializer()

    class Meta:
        model = Permission
        fields = (
            'id',
            'name',
            'content_type',
            'codename',
        )


class GroupDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    def get_title(self, instance):
        if hasattr(instance, 'extension'):
            return instance.extension.title
        return None

    class Meta:
        model = Group
        fields = (
            'id',
            'title',
            'name',
        )

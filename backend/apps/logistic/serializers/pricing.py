from rest_framework import serializers
from ..models import Pricing, PricingType
from core.utils.serializers import BaseModelSerializer
from main.serializers.file import FileSerializer
from django.db import transaction


class PricingTypeSerializer(BaseModelSerializer):
    class Meta:
        model = PricingType
        fields = (
            'id', 'name'
        )


class PricingSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        self.fields['type'] = PricingTypeSerializer()
        self.fields['file'] = FileSerializer()
        return super().to_representation(instance)

    def create(self, validated_data):
        try:
            with transaction.atomic():
                pricing = Pricing.objects.create(**validated_data)
                return pricing
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")

    def update(self, instance, validated_data):
        try:
            with transaction.atomic():
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                instance.save()
                return instance
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")

    class Meta:
        model = Pricing
        fields = (
            'id', 'type', 'date', 'file'
        )


class PricingListSerializer(BaseModelSerializer):
    type = PricingTypeSerializer()
    file = FileSerializer()

    class Meta:
        model = Pricing
        fields = (
            'id', 'type', 'date', 'file'
        )

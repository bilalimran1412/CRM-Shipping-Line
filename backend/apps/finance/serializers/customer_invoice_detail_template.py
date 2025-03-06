from rest_framework import serializers
from ..models import CustomerInvoiceDetailTemplate, CustomerInvoiceDetailTemplateItem
from core.utils.serializers import BaseModelSerializer
from django.db import transaction


class CustomerInvoiceDetailTemplateItemSerializer(BaseModelSerializer):
    class Meta:
        model = CustomerInvoiceDetailTemplateItem
        fields = (
            'id', 'description'
        )


class CustomerInvoiceDetailTemplateSerializer(BaseModelSerializer):
    items = CustomerInvoiceDetailTemplateItemSerializer(
        source='customerinvoicedetailtemplateitem_set',
        many=True,
        required=False
    )

    def create(self, validated_data):
        try:
            with transaction.atomic():
                template = CustomerInvoiceDetailTemplate.objects.create(
                    name=validated_data.get('name')
                )
                return template
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
        model = CustomerInvoiceDetailTemplate
        fields = (
            'id', 'name', 'items'
        )


class CustomerInvoiceDetailTemplateListSerializer(BaseModelSerializer):
    items = CustomerInvoiceDetailTemplateItemSerializer(
        source='customerinvoicedetailtemplateitem_set',
        many=True
    )

    class Meta:
        model = CustomerInvoiceDetailTemplate
        fields = (
            'id', 'name', 'items'
        )
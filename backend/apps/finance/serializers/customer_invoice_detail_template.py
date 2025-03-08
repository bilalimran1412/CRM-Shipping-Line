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
                items_data = validated_data.pop('customerinvoicedetailtemplateitem_set', [])
                template = CustomerInvoiceDetailTemplate.objects.create(
                    name=validated_data.get('name')
                )
                
                # Create template items
                for item_data in items_data:
                    CustomerInvoiceDetailTemplateItem.objects.create(
                        template=template,
                        **item_data
                    )
                    
                return template
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")

    def update(self, instance, validated_data):
        try:
            with transaction.atomic():
                items_data = validated_data.pop('customerinvoicedetailtemplateitem_set', [])
                
                # Update template fields
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                instance.save()
                
                # Clear existing items and create new ones
                instance.customerinvoicedetailtemplateitem_set.all().delete()
                for item_data in items_data:
                    CustomerInvoiceDetailTemplateItem.objects.create(
                        template=instance,
                        **item_data
                    )
                
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
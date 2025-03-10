from rest_framework import serializers
from django.db import transaction
from rest_framework.generics import get_object_or_404
from ..models import (
    CustomerInvoice, CustomerInvoiceItem, CustomerInvoicePayment,
    CustomerInvoiceDetailTemplate, CustomerInvoiceDetailTemplateItem
)
from core.utils.serializers import BaseModelSerializer, update_nested_instances
from ..serializers import CustomerSerializer

INVOICE_ITEM_UPDATE_FIELDS = [
    'description', 'currency', 'exchange_rate', 'amount_in_currency', 'amount_in_default'
]

INVOICE_PAYMENT_UPDATE_FIELDS = [
    'description', 'currency', 'exchange_rate', 'amount_in_currency', 'amount_in_default'
]

class CustomerInvoiceDetailTemplateItemSerializer(BaseModelSerializer):
    class Meta:
        model = CustomerInvoiceDetailTemplateItem
        fields = ('id', 'description')

class CustomerInvoiceDetailTemplateSerializer(BaseModelSerializer):
    items = CustomerInvoiceDetailTemplateItemSerializer(many=True, read_only=True)

    class Meta:
        model = CustomerInvoiceDetailTemplate
        fields = ('id', 'name', 'items')

class CustomerInvoiceItemSerializer(BaseModelSerializer):
    invoice = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CustomerInvoiceItem
        fields = (
            'id', 'invoice', 'description', 'currency', 'exchange_rate',
            'amount_in_currency', 'amount_in_default'
        )

class CustomerInvoicePaymentSerializer(BaseModelSerializer):
    invoice = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CustomerInvoicePayment
        fields = (
            'id', 'invoice', 'datetime', 'description', 'currency', 'exchange_rate',
            'amount_in_currency', 'amount_in_default'
        )

class CurrencySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SerializerMethodField()
    code = serializers.CharField(source='currency')
    icon = serializers.SerializerMethodField()

    def get_name(self, obj):
        currency_map = {
            'USD': 'US Dollar',
            'AED': 'UAE Dirham'
        }
        return currency_map.get(obj.currency, obj.currency)

    def get_icon(self, obj):
        return None

class CustomerInvoiceSerializer(BaseModelSerializer):
    items = CustomerInvoiceItemSerializer(many=True, required=False, source='customerinvoiceitem_set')
    payments = CustomerInvoicePaymentSerializer(many=True, required=False, source='customerinvoicepayment_set')
    balance = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    paid_in_default = serializers.DecimalField(source='total_paid_in_default', max_digits=10, decimal_places=2)
    customer = CustomerSerializer()

    def get_balance(self, obj):
        return obj.total_amount_in_default - obj.total_paid_in_default

    def get_currency(self, obj):
        return CurrencySerializer(obj).data

    def update(self, instance, validated_data):
        items = validated_data.pop('customerinvoiceitem_set', [])
        payments = validated_data.pop('customerinvoicepayment_set', [])

        try:
            with transaction.atomic():
                instance = get_object_or_404(CustomerInvoice, pk=instance.pk)
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                instance.save()

                # Handle items
                new_items, updated_items, deleted_items_ids = update_nested_instances(
                    instance.customerinvoiceitem_set.all(), items, CustomerInvoiceItem
                )
                
                for item in new_items:
                    item.invoice = instance

                if updated_items:
                    CustomerInvoiceItem.objects.bulk_update(updated_items, INVOICE_ITEM_UPDATE_FIELDS)
                if new_items:
                    CustomerInvoiceItem.objects.bulk_create(new_items)
                CustomerInvoiceItem.objects.filter(id__in=deleted_items_ids).delete()

                # Handle payments
                new_payments, updated_payments, deleted_payments_ids = update_nested_instances(
                    instance.customerinvoicepayment_set.all(), payments, CustomerInvoicePayment
                )

                for payment in new_payments:
                    payment.invoice = instance

                if updated_payments:
                    CustomerInvoicePayment.objects.bulk_update(updated_payments, INVOICE_PAYMENT_UPDATE_FIELDS)
                if new_payments:
                    CustomerInvoicePayment.objects.bulk_create(new_payments)
                CustomerInvoicePayment.objects.filter(id__in=deleted_payments_ids).delete()

        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")
        return instance

    class Meta:
        model = CustomerInvoice
        fields = (
            'id', 'name', 'template', 'customer', 'datetime',
            'data', 'status', 'items', 'payments',
            'total_amount_in_default', 'paid_in_default',
            'balance', 'currency'
        )

class CustomerInvoiceListSerializer(BaseModelSerializer):
    items = CustomerInvoiceItemSerializer(many=True, required=False, source='customerinvoiceitem_set')
    payments = CustomerInvoicePaymentSerializer(many=True, required=False, source='customerinvoicepayment_set')
    customer = CustomerSerializer()
    currency = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    paid_in_default = serializers.DecimalField(source='total_paid_in_default', max_digits=10, decimal_places=2)

    def get_balance(self, obj):
        return obj.total_amount_in_default - obj.total_paid_in_default

    def get_currency(self, obj):
        return CurrencySerializer(obj).data

    class Meta:
        model = CustomerInvoice
        fields = (
            'id', 'name', 'template', 'customer', 'datetime',
            'total_amount_in_default', 'paid_in_default',
            'balance', 'currency', 'status', 'items', 'payments'
        )

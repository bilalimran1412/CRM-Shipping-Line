from django.db import transaction
from rest_framework.generics import get_object_or_404
from ..models import Invoice, InvoiceVehicle, Vehicle
from main.serializers.file import FileSerializer
from core.utils.fields import TranslationField
from core.utils.serializers import BaseModelSerializer, TranslationSerializerMixin, update_nested_instances
from rest_framework import serializers
from ..serializers import (
	CustomerSerializer,
	DeliveryDestinationSerializer,
)

class CharacteristicsSerializer(serializers.Serializer):
	year = serializers.CharField(max_length=100, allow_null=True)
	color = serializers.CharField(max_length=100, allow_null=True)
	lot_id = serializers.CharField(max_length=100, required=False, allow_null=True)
	buyer_id = serializers.CharField(max_length=100, required=False, allow_null=True)
	
class VehicleSerializer(BaseModelSerializer):
	characteristics = CharacteristicsSerializer()

	def to_representation(self, instance):
		if self.context.get('detail', None):
			self.fields['customer'] = CustomerSerializer()
			self.fields['destination'] = DeliveryDestinationSerializer()

		return super().to_representation(instance)

	class Meta:
		model = Vehicle
		fields = (
			'id', 'manufacturer', 'model', 'vin', 'characteristics', 'customer', 'destination',
		)


class InvoiceVehicleSerializer(BaseModelSerializer):
	id = serializers.IntegerField(required=False)

	def to_representation(self, instance):
		if self.context.get('detail', None):
			self.fields['vehicle'] = VehicleSerializer(context={"detail": True})
		return super().to_representation(instance)

	class Meta:
		model = InvoiceVehicle
		fields = (
			'id', 'vehicle'
		)

class InvoiceSerializer(BaseModelSerializer):
	vehicles = InvoiceVehicleSerializer(many=True, required=False)

	def update(self, instance, validated_data):
		vehicles = validated_data.pop('vehicles', [])
		try:
			with transaction.atomic():
				instance = get_object_or_404(Invoice, pk=instance.pk)
				for attr, value in validated_data.items():
					setattr(instance, attr, value)
				instance.save()

				new_vehicles, updated_vehicles, deleted_vehicles_ids = update_nested_instances(
					instance.vehicles.all(), vehicles, InvoiceVehicle
				)

				for vehicle in new_vehicles:
					vehicle.invoice = instance

				if new_vehicles:
					InvoiceVehicle.objects.bulk_create(new_vehicles)

				deleted_vehicles = InvoiceVehicle.objects.filter(id__in=deleted_vehicles_ids)
				deleted_vehicles.delete()

		except Exception as e:
			raise serializers.ValidationError(f"An error occurred: {e}")
		return instance

	class Meta:
		model = Invoice
		fields = (
			'id', 'name', 'datetime', 'template', 'vehicles'
		)

class InvoiceListSerializer(BaseModelSerializer):
	vehicles = InvoiceVehicleSerializer(context={"detail": True}, many=True)
	count = serializers.SerializerMethodField()

	def get_count(self, obj):
		return obj.vehicles.count()

	class Meta:
		model = Invoice
		fields = (
			'id', 'name', 'datetime', 'template', 'vehicles', 'count'
		)


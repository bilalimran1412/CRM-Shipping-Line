from rest_framework import serializers
from django.db import transaction
from rest_framework.generics import get_object_or_404
from ..models import Shipment, ShipmentVehicle, Vehicle, ShipmentDocument, ShipmentCompany, ShipmentType
from ..serializers import (
	CustomerSerializer,
	DeliveryDestinationSerializer,
)
from core.utils.serializers import BaseModelSerializer, TranslationSerializerMixin, update_nested_instances
from main.serializers.file import FileSerializer
from ..signals.shipment import after_bulk_create
from core.utils.fields import TranslationField

SHIPMENT_DOCUMENTS_UPDATE_FIELDS = [
	'name', 'file',
]


class ShipmentCompanySerializer(BaseModelSerializer):
	def to_representation(self, instance):
		self.fields['icon'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = ShipmentCompany
		fields = (
			'id', 'name', 'icon',
		)


class ShipmentTypeSerializer(BaseModelSerializer, TranslationSerializerMixin):
	name = TranslationField(field_name='name')

	def to_representation(self, instance):
		self.fields['icon'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = ShipmentType
		fields = (
			'id', 'name', 'icon'
		)


class CharacteristicsSerializer(serializers.Serializer):
	year = serializers.CharField(max_length=100, allow_null=True)
	color = serializers.CharField(max_length=100, allow_null=True)
	lot_id = serializers.CharField(max_length=100, required=False, allow_null=True)
	buyer_id = serializers.CharField(max_length=100, required=False, allow_null=True)


class ShipmentDocumentSerializer(BaseModelSerializer):
	id = serializers.IntegerField(required=False)

	def to_representation(self, instance):
		self.fields['file'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = ShipmentDocument
		fields = (
			'id', 'name', 'file'
		)


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


class ShipmentVehicleSerializer(BaseModelSerializer):
	id = serializers.IntegerField(required=False)

	def to_representation(self, instance):
		if self.context.get('detail', None):
			self.fields['vehicle'] = VehicleSerializer(context={"detail": True})
		return super().to_representation(instance)

	class Meta:
		model = ShipmentVehicle
		fields = (
			'id', 'vehicle'
		)


class ShipmentSerializer(BaseModelSerializer):
	vehicles = ShipmentVehicleSerializer(many=True, required=False)
	documents = ShipmentDocumentSerializer(many=True, required=False)

	def update(self, instance, validated_data):
		vehicles = validated_data.pop('vehicles', [])
		documents = validated_data.pop('documents', [])
		try:
			with transaction.atomic():
				instance = get_object_or_404(Shipment, pk=instance.pk)
				for attr, value in validated_data.items():
					setattr(instance, attr, value)
				instance.save()

				new_vehicles, updated_vehicles, deleted_vehicles_ids = update_nested_instances(
					instance.vehicles.all(), vehicles, ShipmentVehicle
				)

				for vehicle in new_vehicles:
					vehicle.shipment = instance

				if new_vehicles:
					ShipmentVehicle.objects.bulk_create(new_vehicles)
					for vehicle in new_vehicles:
						after_bulk_create(sender=ShipmentVehicle, instance=vehicle, created=True)

				deleted_vehicles = ShipmentVehicle.objects.filter(id__in=deleted_vehicles_ids)
				deleted_vehicles.delete()

				new_documents, updated_documents, deleted_documents_ids = update_nested_instances(
					instance.documents.all(), documents, ShipmentDocument
				)
				for document in new_documents:
					document.shipment = instance

				if updated_documents:
					ShipmentDocument.objects.bulk_update(updated_documents, SHIPMENT_DOCUMENTS_UPDATE_FIELDS)
				if new_documents:
					ShipmentDocument.objects.bulk_create(new_documents)
				ShipmentDocument.objects.filter(id__in=deleted_documents_ids).delete()

		except Exception as e:
			raise serializers.ValidationError(f"An error occurred: {e}")
		return instance

	class Meta:
		model = Shipment
		fields = (
			'id', 'company', 'shipment_type', 'datetime', 'complete_datetime',
			'completed', 'extra_data', 'note', 'vehicles', 'documents'
		)


class ShipmentListSerializer(BaseModelSerializer):
	company = ShipmentCompanySerializer()
	shipment_type = ShipmentTypeSerializer()
	vehicles = ShipmentVehicleSerializer(context={"detail": True}, many=True)

	class Meta:
		model = Shipment
		fields = (
			'id', 'company', 'shipment_type', 'datetime', 'complete_datetime',
			'completed', 'extra_data', 'note', 'vehicles'
		)

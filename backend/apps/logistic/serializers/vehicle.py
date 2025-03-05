from django.db import transaction
from rest_framework import serializers
from rest_framework.generics import get_object_or_404
from ..models import Vehicle, DeliveryHistory, VehiclePhoto, VehicleDocument
from core.utils.serializers import update_nested_instances
from .customer import CustomerSerializer
from .destination import DeliveryDestinationSerializer
from .delivery_status import DeliveryStatusSerializer
from .vehicle_photo_category import VehiclePhotoCategorySerializer
from main.serializers.file import FileSerializer
from core.utils.serializers import BaseModelSerializer
from ..signals.vehicle import set_status_after_save

DELIVERY_HISTORY_UPDATE_FIELDS = [
	'status', 'datetime'
]
VEHICLE_PHOTOS_UPDATE_FIELDS = [
	'file',
]
VEHICLE_DOCUMENTS_UPDATE_FIELDS = [
	'name', 'file',
]


class CharacteristicsSerializer(serializers.Serializer):
	year = serializers.CharField(max_length=100, allow_null=True)
	color = serializers.CharField(max_length=100, allow_null=True)
	lot_id = serializers.CharField(max_length=100, required=False, allow_null=True)
	buyer_id = serializers.CharField(max_length=100, required=False, allow_null=True)


class DeliveryHistorySerializer(BaseModelSerializer):
	id = serializers.IntegerField(required=False)

	def to_representation(self, instance):
		if self.context.get('detail', None):
			self.fields['status'] = DeliveryStatusSerializer()
		return super().to_representation(instance)

	class Meta:
		model = DeliveryHistory
		fields = (
			'id', 'shipment', 'vehicle', 'status', 'datetime',
		)

		extra_kwargs = {"vehicle": {"required": False, "allow_empty": True, "allow_null": True}}


class VehicleDocumentSerializer(BaseModelSerializer):
	id = serializers.IntegerField(required=False)

	def to_representation(self, instance):
		self.fields['file'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = VehicleDocument
		fields = (
			'id', 'name', 'file'
		)


class VehiclePhotoSerializer(BaseModelSerializer):
	id = serializers.IntegerField(required=False)

	def to_representation(self, instance):
		self.fields['file'] = FileSerializer()
		if self.context.get('detail', None):
			self.fields['category'] = VehiclePhotoCategorySerializer()
		return super().to_representation(instance)

	class Meta:
		model = VehiclePhoto
		fields = (
			'id', 'category', 'file'
		)


class VehicleSerializer(BaseModelSerializer):
	characteristics = CharacteristicsSerializer()
	history = DeliveryHistorySerializer(many=True)
	photos = VehiclePhotoSerializer(many=True)
	documents = VehicleDocumentSerializer(many=True)

	def to_representation(self, instance):
		if self.context.get('detail', None):
			self.fields['status'] = DeliveryHistorySerializer(context={"detail": True})
			self.fields['customer'] = CustomerSerializer()
			self.fields['destination'] = DeliveryDestinationSerializer()
			self.fields['history'] = DeliveryHistorySerializer(many=True, context={"detail": True})
			self.fields['photos'] = VehiclePhotoSerializer(many=True, context={"detail": True})

		return super().to_representation(instance)

	def create(self, validated_data):
		history_items = validated_data.pop('history', [])
		photos = validated_data.pop('photos', [])
		documents = validated_data.pop('documents', [])
		try:
			with transaction.atomic():
				vehicle = Vehicle.objects.create(**validated_data)

				# Создание записей в истории
				for history in history_items:
					history['vehicle'] = vehicle
				DeliveryHistory.objects.bulk_create([DeliveryHistory(**history) for history in history_items])

				# Создание фотографий
				new_photos = [VehiclePhoto(vehicle=vehicle, **photo) for photo in photos]
				if new_photos:
					VehiclePhoto.objects.bulk_create(new_photos)

				# Создание документов
				new_documents = [VehicleDocument(vehicle=vehicle, **document) for document in documents]
				if new_documents:
					VehicleDocument.objects.bulk_create(new_documents)

				set_status_after_save(sender=Vehicle, instance=vehicle, created=True, save_status=True)

		except Exception as e:
			raise serializers.ValidationError(f"An error occurred: {e}")
		return vehicle

	def update(self, instance, validated_data):
		history_items = validated_data.pop('history', [])
		photos = validated_data.pop('photos', [])
		documents = validated_data.pop('documents', [])
		try:
			with transaction.atomic():
				instance = get_object_or_404(Vehicle, pk=instance.pk)
				for attr, value in validated_data.items():
					setattr(instance, attr, value)
				instance.save()

				new_history, updated_history, deleted_history_ids = update_nested_instances(
					instance.history.all(), history_items, DeliveryHistory
				)
				for history in new_history:
					history.vehicle = instance

				if updated_history:
					DeliveryHistory.objects.bulk_update(updated_history, DELIVERY_HISTORY_UPDATE_FIELDS)
				if new_history:
					DeliveryHistory.objects.bulk_create(new_history)
				DeliveryHistory.objects.filter(id__in=deleted_history_ids).delete()

				new_photos, updated_photos, deleted_photos_ids = update_nested_instances(
					instance.photos.all(), photos, VehiclePhoto
				)
				for photo in new_photos:
					photo.vehicle = instance

				if updated_photos:
					VehiclePhoto.objects.bulk_update(updated_photos, VEHICLE_PHOTOS_UPDATE_FIELDS)
				if new_photos:
					VehiclePhoto.objects.bulk_create(new_photos)
				VehiclePhoto.objects.filter(id__in=deleted_photos_ids).delete()

				new_documents, updated_documents, deleted_documents_ids = update_nested_instances(
					instance.documents.all(), documents, VehicleDocument
				)
				for document in new_documents:
					document.vehicle = instance

				if updated_documents:
					VehicleDocument.objects.bulk_update(updated_documents, VEHICLE_DOCUMENTS_UPDATE_FIELDS)
				if new_documents:
					VehicleDocument.objects.bulk_create(new_documents)
				VehicleDocument.objects.filter(id__in=deleted_documents_ids).delete()
				set_status_after_save(sender=Vehicle, instance=instance, created=False, save_status=True)

		except Exception as e:
			raise serializers.ValidationError(f"An error occurred: {e}")
		return instance

	class Meta:
		model = Vehicle
		fields = (
			'id', 'manufacturer', 'model', 'vin', 'characteristics', 'customer', 'destination', 'status',
			'history', 'photos', 'documents'
		)
		extra_kwargs = {
			"history": {"required": False, "allow_empty": True, "allow_null": True},
			"photos": {"required": False, "allow_empty": True, "allow_null": True},
			"documents": {"required": False, "allow_empty": True, "allow_null": True},
		}


class VehicleListSerializer(BaseModelSerializer):
	characteristics = CharacteristicsSerializer()
	customer = CustomerSerializer()
	destination = DeliveryDestinationSerializer()
	status = DeliveryHistorySerializer(context={"detail": True})

	class Meta:
		model = Vehicle
		fields = (
			'id', 'manufacturer', 'model', 'vin', 'characteristics', 'customer', 'destination', 'status',
		)

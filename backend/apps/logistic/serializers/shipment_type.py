from django.db import transaction
from rest_framework.generics import get_object_or_404
from rest_framework import serializers
from ..models import ShipmentType
from main.serializers.file import FileSerializer
from core.utils.fields import TranslationField
from core.utils.serializers import BaseModelSerializer, TranslationSerializerMixin
from .delivery_status import DeliveryStatusSerializer


class ShipmentTypeDetailSerializer(BaseModelSerializer, TranslationSerializerMixin):
	name = TranslationField(field_name='name')

	def to_representation(self, instance):
		self.fields['icon'] = FileSerializer()
		if self.context.get('detail', None):
			self.fields['initial_status'] = DeliveryStatusSerializer()
			self.fields['complete_status'] = DeliveryStatusSerializer()
		return super().to_representation(instance)

	class Meta:
		model = ShipmentType
		fields = (
			'id', 'name', 'initial_status', 'complete_status', 'icon'
		)


class ShipmentTypeSerializer(BaseModelSerializer, TranslationSerializerMixin):
	name = TranslationField(field_name='name')

	def to_representation(self, instance):
		self.fields['icon'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = ShipmentType
		fields = (
			'id', 'name', 'initial_status', 'complete_status', 'icon'
		)

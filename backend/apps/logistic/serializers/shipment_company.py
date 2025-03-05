from django.db import transaction
from rest_framework.generics import get_object_or_404
from ..models import ShipmentCompany
from main.serializers.file import FileSerializer
from .shipment_type import ShipmentTypeSerializer
from core.utils.serializers import BaseModelSerializer
from rest_framework import serializers


class ShipmentCompanySerializer(BaseModelSerializer):
	def to_representation(self, instance):
		if self.context.get('detail', None):
			self.fields['shipment_type'] = ShipmentTypeSerializer(many=True)
		self.fields['icon'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = ShipmentCompany
		fields = (
			'id', 'name', 'shipment_type', 'icon',
		)
		extra_kwargs = {"shipment_type": {"required": False, "allow_empty": True, "allow_null": True}}

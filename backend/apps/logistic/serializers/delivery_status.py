from django.db import transaction
from rest_framework.generics import get_object_or_404
from ..models import DeliveryStatus
from main.serializers.file import FileSerializer
from core.utils.fields import TranslationField
from core.utils.serializers import BaseModelSerializer, TranslationSerializerMixin


class DeliveryStatusSerializer(BaseModelSerializer, TranslationSerializerMixin):
	name = TranslationField(field_name='name')

	def to_representation(self, instance):
		self.fields['icon'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = DeliveryStatus
		fields = (
			'id', 'name', 'icon'
		)

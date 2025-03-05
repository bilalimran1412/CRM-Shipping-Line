from django.db import transaction
from rest_framework.generics import get_object_or_404
from ..models import DeliveryDestination
from main.serializers.file import FileSerializer
from core.utils.fields import TranslationField
from core.utils.serializers import BaseModelSerializer, TranslationSerializerMixin


class DeliveryDestinationSerializer(BaseModelSerializer, TranslationSerializerMixin):
	country = TranslationField(field_name='country', required=False)
	city = TranslationField(field_name='city', required=False)

	def to_representation(self, instance):
		self.fields['icon'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = DeliveryDestination
		fields = (
			'id',
			'country',
			# 'country_ru',
			# 'country_en',
			'city',
			# 'city_ru',
			# 'city_en',
			'icon'
		)

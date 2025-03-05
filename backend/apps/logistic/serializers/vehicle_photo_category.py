from django.db import transaction
from rest_framework.generics import get_object_or_404
from ..models import VehiclePhotoCategory
from main.serializers.file import FileSerializer
from core.utils.fields import TranslationField
from core.utils.serializers import BaseModelSerializer, TranslationSerializerMixin


class VehiclePhotoCategorySerializer(BaseModelSerializer, TranslationSerializerMixin):
	name = TranslationField(field_name='name')

	class Meta:
		model = VehiclePhotoCategory
		fields = (
			'id', 'name',
		)

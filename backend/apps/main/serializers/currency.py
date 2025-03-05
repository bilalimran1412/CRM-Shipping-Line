from rest_framework import serializers
from main.models import Currency, CurrencyRate
from django.conf import settings
from .file import FileSerializer


class CurrencySerializer(serializers.ModelSerializer):

	def to_representation(self, instance):
		self.fields['icon'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = Currency
		fields = ('id', 'name', 'code', 'icon')


class CurrencyRateSerializer(serializers.ModelSerializer):
	class Meta:
		model = CurrencyRate
		fields = ('id', 'base', 'target', 'rate', 'math_type')

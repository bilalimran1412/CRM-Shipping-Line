from rest_framework import serializers
from django.conf import settings


class TranslationField(serializers.Field):
	def __init__(self, field_name, *args, **kwargs):
		self.field_name = field_name
		kwargs['source'] = '*'
		super().__init__(*args, **kwargs)

	def bind(self, field_name, parent):
		super().bind(field_name, parent)
		self.parent = parent

	def to_representation(self, instance):
		translations = {
			"default": getattr(instance, f'{self.field_name}', None)
		}
		for lang_code, _ in settings.LANGUAGES:
			translations[lang_code] = getattr(instance, f'{self.field_name}_{lang_code}', None)
		return translations

	def to_internal_value(self, data):
		if not isinstance(data, dict):
			raise serializers.ValidationError('Expected a dictionary of translations')

		print(data)
		return data

	def run_validation(self, data=serializers.empty):
		if data is serializers.empty:
			return super().run_validation(data)
		if not isinstance(data, dict):
			self.fail('invalid')
		for lang_code, value in data.items():
			if lang_code == 'default':
				continue
			if lang_code not in dict(settings.LANGUAGES):
				raise serializers.ValidationError(f'Invalid language code: {lang_code}')
			if not isinstance(value, str):
				raise serializers.ValidationError(f'Invalid value type for language {lang_code}')

		return {self.field_name: data}

	def set_translations(self, instance, translations):
		for lang_code, value in translations.items():
			if lang_code == 'default':
				setattr(instance, self.field_name, value)
			else:
				setattr(instance, f'{self.field_name}_{lang_code}', value)

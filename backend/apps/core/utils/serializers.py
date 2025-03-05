from rest_framework.serializers import ModelSerializer
from core.utils.fields import TranslationField
from django.conf import settings

class BaseModelSerializer(ModelSerializer):
	# def update(self, instance, validated_data):
	# 	pass
	#
	# def create(self, validated_data):
	# 	pass
	pass


class TranslationSerializerMixin(ModelSerializer):

	def save(self, **kwargs):
		# Create or update the instance without saving to DB yet
		if self.instance:
			instance = self.instance
			for attr, value in self.validated_data.items():
				if not isinstance(self.fields[attr], TranslationField):
					setattr(instance, attr, value)
		else:
			instance = self.Meta.model(
				**{attr: value for attr, value in self.validated_data.items() if
				   not isinstance(self.fields[attr], TranslationField)}
			)

		# Set translation fields on the instance
		for field_name, field in self.fields.items():
			if isinstance(field, TranslationField):
				field_data = self.validated_data.get(field_name, {})
				field.set_translations(instance, field_data)

		# Now save the instance with all fields set
		instance.save()
		self.instance = instance
		return instance


class ValidatorSerializer(BaseModelSerializer, object):
	@classmethod
	def check(cls, data, many=False, context=None):
		serializer = cls(data=data, many=many, context=context or {})
		serializer.is_valid(raise_exception=True)
		return serializer.validated_data


def update_nested_instances(existing_instances, new_instances_data, model_class):
	existing_instances_dict = {instance.id: instance for instance in existing_instances}
	new_instances = []
	updated_instances = []

	for new_instance_data in new_instances_data:
		instance_id = new_instance_data.get('id')
		if instance_id and instance_id in existing_instances_dict:
			existing_instance = existing_instances_dict.pop(instance_id)
			for attr, value in new_instance_data.items():
				if getattr(existing_instance, attr) != value:
					setattr(existing_instance, attr, value)
					if existing_instance not in updated_instances:
						updated_instances.append(existing_instance)
		else:
			new_instances.append(model_class(**new_instance_data))

	return new_instances, updated_instances, existing_instances_dict.keys()

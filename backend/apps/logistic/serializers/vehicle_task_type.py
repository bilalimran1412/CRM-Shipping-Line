from rest_framework import serializers
from ..models import VehicleTaskType
from core.utils.serializers import BaseModelSerializer, TranslationSerializerMixin
from main.serializers.file import FileSerializer
from .customer import CustomerSerializer
from django.db import transaction
from core.utils.fields import TranslationField


class VehicleTaskTypeSerializer(BaseModelSerializer):
    name = TranslationField(field_name='name')

    def to_representation(self, instance):
        self.fields['icon'] = FileSerializer()
        self.fields['assigned_to'] = CustomerSerializer(many=True)
        return super().to_representation(instance)

    def create(self, validated_data):
        assigned_to = validated_data.pop('assigned_to', None)
        name = validated_data.pop('name', None)
        
        try:
            with transaction.atomic():
                validated_data['name'] = name['en']
                validated_data['name_en'] = name['en']
                validated_data['name_ru'] = name['ru']
                # Create the VehicleTaskType instance
                instance = VehicleTaskType.objects.create(**validated_data)
                
                # Handle the many-to-many relationship
                if assigned_to is not None:
                    instance.assigned_to.set(assigned_to)
                
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")
            
        return instance
        
    def update(self, instance, validated_data):
        assigned_to = validated_data.pop('assigned_to', None)
        name = validated_data.pop('name', None)
        
        try:
            with transaction.atomic():
                validated_data['name'] = name['en']
                validated_data['name_en'] = name['en']
                validated_data['name_ru'] = name['ru']
                # Update the basic fields
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                
                # Handle the many-to-many relationship
                if assigned_to is not None:
                    instance.assigned_to.set(assigned_to)
                    
                instance.save()
                
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")
            
        return instance

    class Meta:
        model = VehicleTaskType
        fields = (
            'id', 'name', 'assigned_to', 'icon'
        )


class VehicleTaskTypeListSerializer(BaseModelSerializer):
    icon = FileSerializer()
    assigned_to = CustomerSerializer(many=True)
    name = TranslationField(field_name='name')

    class Meta:
        model = VehicleTaskType
        fields = (
            'id', 'name', 'assigned_to', 'icon'
        )

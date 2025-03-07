from rest_framework import serializers
from ..models import VehicleTask, VehicleTaskType
from core.utils.serializers import BaseModelSerializer
from main.serializers.file import FileSerializer
from .customer import CustomerSerializer
from .vehicle import VehicleSerializer
from django.db import transaction


class VehicleTaskTypeSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        self.fields['icon'] = FileSerializer()
        self.fields['assigned_to'] = CustomerSerializer(many=True)
        return super().to_representation(instance)

    class Meta:
        model = VehicleTaskType
        fields = (
            'id', 'name', 'assigned_to', 'icon'
        )


class VehicleTaskSerializer(BaseModelSerializer):
    def to_representation(self, instance):
        self.fields['task_type'] = VehicleTaskTypeSerializer()
        self.fields['assigned_to'] = CustomerSerializer(many=True)
        self.fields['vehicle'] = VehicleSerializer()
        return super().to_representation(instance)

    def create(self, validated_data):
        assigned_to = validated_data.pop('assigned_to', [])
        try:
            with transaction.atomic():
                task = VehicleTask.objects.create(**validated_data)
                if assigned_to:
                    task.assigned_to.set(assigned_to)
                return task
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")

    def update(self, instance, validated_data):
        assigned_to = validated_data.pop('assigned_to', None)
        try:
            with transaction.atomic():
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                instance.save()
                
                if assigned_to is not None:
                    instance.assigned_to.set(assigned_to)
                return instance
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {e}")

    class Meta:
        model = VehicleTask
        fields = (
            'id', 'vehicle', 'task_type', 'assigned_to', 'note', 'status', 'created_at'
        )


class VehicleTaskListSerializer(BaseModelSerializer):
    task_type = VehicleTaskTypeSerializer()
    assigned_to = CustomerSerializer(many=True)
    vehicle = VehicleSerializer()

    class Meta:
        model = VehicleTask
        fields = (
            'id', 'vehicle', 'task_type', 'assigned_to', 'note', 'status', 'created_at'
        )

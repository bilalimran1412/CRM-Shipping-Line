from django.db import transaction
from rest_framework.generics import get_object_or_404
from rest_framework import serializers
from ..models import VehicleTask, VehicleTaskType
from core.utils.serializers import BaseModelSerializer, update_nested_instances
from main.serializers.file import FileSerializer
from .customer import CustomerSerializer
from .vehicle import VehicleSerializer
from user.models import User


class CustomerSerializer(BaseModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = User
        fields = (
			'id', 'first_name', 'last_name', 'full_name',
		)

class VehicleTaskTypeSerializer(BaseModelSerializer):
    assigned_to = CustomerSerializer(many=True, required=False)
    id = serializers.IntegerField(required=False)

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
    assigned_to = CustomerSerializer(many=True, required=False)
    task_type = VehicleTaskTypeSerializer(required=False)
    vehicle = VehicleSerializer(required=False)

    def to_representation(self, instance):
        if self.context.get('detail', None):
            self.fields['task_type'] = VehicleTaskTypeSerializer()
            self.fields['assigned_to'] = CustomerSerializer(many=True)
            self.fields['vehicle'] = VehicleSerializer()
        return super().to_representation(instance)

    def update(self, instance, validated_data):
        assigned_to = validated_data.pop('assigned_to', None)
        vehicle_data = validated_data.pop('vehicle', None)
        task_type_data = validated_data.pop('task_type', None)
        try:
            with transaction.atomic():
                instance = get_object_or_404(VehicleTask, pk=instance.pk)
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                instance.save()
                if assigned_to is not None:
                    instance.assigned_to.clear()
                    for user_data in assigned_to:
                        if isinstance(user_data, dict):
                            user_id = user_data.get('id')
                            if user_id:
                                instance.assigned_to.add(user_id)
                        else:
                            user_id = user_data.id if hasattr(user_data, 'id') else user_data
                            instance.assigned_to.add(user_id)
                if vehicle_data is not None:
                    if isinstance(vehicle_data, dict):
                        vehicle_id = vehicle_data.get('id')
                        if vehicle_id:
                            instance.vehicle_id = vehicle_id
                    else:
                        instance.vehicle = vehicle_data
                if task_type_data is not None:
                    if isinstance(task_type_data, dict):
                        task_type_id = task_type_data.get('id')
                        if task_type_id:
                            instance.task_type_id = task_type_id
                    else:
                        instance.task_type = task_type_data
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

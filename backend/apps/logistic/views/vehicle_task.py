from rest_framework import viewsets, status
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from logistic.models import VehicleTask, VehicleTaskType, Vehicle
from user.models import User
from core.utils.permission import action_permission
from core.utils.rest import ModelPermission, CustomPagination
from ..serializers import VehicleTaskSerializer, VehicleTaskListSerializer, VehicleTaskTypeSerializer, CustomerSerializer, VehicleSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from ..filterset import VehicleTaskFilterSet

EDIT_FORM_PERMISSION = action_permission('GET', 'vehicle_task.change_vehicle_task')

VEHICLE_TASK_STATUSES = [
    {
        'value': 'pending',
        'label': {'en': 'Pending', 'ru': 'Ожидается'},
        'color': 'warning'
    },
    {
        'value': 'in_process',
        'label': {'en': 'In process', 'ru': 'В процессе'},
        'color': 'info'
    },
    {
        'value': 'completed',
        'label': {'en': 'Completed', 'ru': 'Завершена'},
        'color': 'success'
    },
    {
        'value': 'cancelled',
        'label': {'en': 'Cancelled', 'ru': 'Отменена'},
        'color': 'error'
    }
]

class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_class = VehicleTaskFilterSet
	search_fields = ['note']
	ordering_fields = ['created_at', 'status']
	ordering = ['-created_at']

	def get_serializer_class(self):
		if self.action == 'list':
			return VehicleTaskListSerializer
		return VehicleTaskSerializer

	def get_queryset(self):
		return VehicleTask.objects.select_related(
			'task_type',
			'vehicle'
		).prefetch_related(
			'assigned_to',
			'task_type__assigned_to',
			'task_type__icon'
		)

	def form_data(self, mode, pk=None):
		customer_qs = User.objects.list()
		customer = CustomerSerializer(customer_qs, many=True)
		
		data = {
			"employees": customer.data,
			"status": VEHICLE_TASK_STATUSES
		}
		return data

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance = get_object_or_404(VehicleTask.objects.select_related(
			'task_type',
			'vehicle'
		), pk=pk)
		data = VehicleTaskSerializer(instance)
		data = {
			"data": data.data,
			**self.form_data('edit')
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='filter-data')
	def filter_form_data(self, request):
		return Response(self.form_data('filter'), status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='my/filter-data')
	def my_tasks_filter_data(self, request):
		return Response(self.form_data('filter'), status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='my')
	def my_tasks(self, request):
		queryset = self.get_queryset().filter(assigned_to=request.user)
		page = self.paginate_queryset(queryset)
		
		if page is not None:
			serializer = VehicleTaskListSerializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		
		serializer = VehicleTaskListSerializer(queryset, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)



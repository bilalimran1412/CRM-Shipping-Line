import datetime

from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from user.models import User
from ..filterset import VehicleFilterSet
from ..models import Vehicle, DeliveryDestination, DeliveryStatus, VehiclePhotoCategory, LogisticConfig
from ..serializers import (
	VehicleSerializer,
	DeliveryDestinationSerializer,
	DeliveryStatusSerializer,
	CustomerSerializer,
	VehiclePhotoCategorySerializer,
	VehicleListSerializer
)

CREATE_FORM_PERMISSION = action_permission('GET', 'installment.add_installment')
EDIT_FORM_PERMISSION = action_permission('GET', 'installment.change_installment')


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_class = VehicleFilterSet
	search_fields = [
		'manufacturer',
		'model',
		'vin',
		'characteristics__year',
		'characteristics__color',
		# 'characteristics__lot_id',
		# 'characteristics__buyer_id',
		'customer__full_name',
		'destination__country_ru',
		'destination__country_en',
		'destination__city_ru',
		'destination__city_en',
		'status__status__name_ru',
		'status__status__name_en',

	]

	serializer_class = VehicleSerializer

	def get_queryset(self):
		qs = Vehicle.objects.list()
		if self.action in ['list']:
			qs = Vehicle.objects.list()
		if self.action in ['retrieve']:
			qs = Vehicle.objects.detail()
		if self.request.user.has_perm('view_all_customer_vehicles'):
			return qs
		return qs.filter(customer=self.request.user)

	def get_serializer_class(self):
		if self.action == 'list':
			return VehicleListSerializer
		return self.serializer_class

	def get_serializer_context(self):
		context = super().get_serializer_context()

		if self.action in ['retrieve', 'list']:
			context['detail'] = True
			context['action'] = self.action

		return context

	def form_data(self, mode, pk=None):
		destinations_qs = DeliveryDestination.objects.list()
		destinations = DeliveryDestinationSerializer(destinations_qs, many=True)
		delivery_status_qs = DeliveryStatus.objects.list()
		delivery_status = DeliveryStatusSerializer(delivery_status_qs, many=True)
		vehicle_photo_category_qs = VehiclePhotoCategory.objects.list()
		vehicle_photo_category = VehiclePhotoCategorySerializer(vehicle_photo_category_qs, many=True)
		customer_qs = User.objects.all()
		customer = CustomerSerializer(customer_qs, many=True)
		data = {
			"destination": destinations.data,
			"status": delivery_status.data,
			"vehicle_photo_category": vehicle_photo_category.data,
			"customer": customer.data,
		}

		return data

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		if self.request.user.has_perm('view_all_customer_vehicles'):
			instance = get_object_or_404(Vehicle.objects.edit(), pk=pk)
		else:
			instance = get_object_or_404(Vehicle.objects.edit().filter(customer=self.request.user), pk=pk)
		data = VehicleSerializer(instance)
		data = {
			"data": data.data,
			**self.form_data('edit')
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='form-data', permission_classes=CREATE_FORM_PERMISSION)
	def create_form_data(self, request):
		data = {
			**self.form_data('create')
		}
		config_qs: LogisticConfig = LogisticConfig.objects.first()
		if config_qs:
			initial_status = config_qs.initial_status_id
		else:
			initial_status = ''

		data['data'] = {
			"history": [
				{
					"status": initial_status,
					"datetime": datetime.datetime.now()
				}
			]
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='filter-data')
	def filter_form_data(self, request):
		destination_qs = DeliveryDestination.objects.list()
		destination = DeliveryDestinationSerializer(destination_qs, many=True)
		delivery_status_qs = DeliveryStatus.objects.list()
		delivery_status = DeliveryStatusSerializer(delivery_status_qs, many=True)
		customer_qs = User.objects.all()
		customer = CustomerSerializer(customer_qs, many=True)
		data = {
			"destination": destination.data,
			"status": delivery_status.data,
			"customer": customer.data,
		}
		return Response(data, status=status.HTTP_200_OK)

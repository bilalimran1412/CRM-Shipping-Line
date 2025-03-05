from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from django.db.models import Q
from ..serializers import (
	ShipmentSerializer,
	ShipmentTypeSerializer,
	ShipmentCompanySerializer,
	VehicleSerializer,
	ShipmentListSerializer
)
from ..filterset import ShipmentFilterSet
from ..models import Shipment, ShipmentType, ShipmentCompany, Vehicle

CREATE_FORM_PERMISSION = action_permission('GET', 'logistic.add_shipment')
EDIT_FORM_PERMISSION = action_permission('GET', 'logistic.change_shipment')


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_class = ShipmentFilterSet
	search_fields = []

	serializer_class = ShipmentSerializer

	def get_queryset(self):
		if self.action == 'retrieve':
			return Shipment.objects.detail()
		return Shipment.objects.list()

	def get_serializer_class(self):
		if self.action == 'list':
			return ShipmentListSerializer
		if self.action == 'retrieve':
			pass
		return self.serializer_class

	def get_serializer_context(self):
		context = super().get_serializer_context()

		if self.action in ['retrieve', 'list']:
			context['detail'] = True

		return context

	def form_data(self, mode, pk=None, **kwargs):
		shipment_type_qs = ShipmentType.objects.list()
		shipment_type = ShipmentTypeSerializer(shipment_type_qs, many=True)
		data = {
			"shipment_type": shipment_type.data,
		}
		if mode == 'edit':
			shipment_company_qs = ShipmentCompany.objects.list().filter(shipment_type=kwargs['shipment_type'])
			shipment_company = ShipmentCompanySerializer(shipment_company_qs, many=True)
			data["company"] = shipment_company.data

		return data

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance: Shipment = get_object_or_404(Shipment.objects.detail(), pk=pk)
		data = ShipmentSerializer(instance, context={"detail": True, "exclude": ['company', 'shipment_type']})
		data = {
			"data": data.data,
			**self.form_data('edit', shipment_type=instance.shipment_type)
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='form-data', permission_classes=CREATE_FORM_PERMISSION)
	def create_form_data(self, request):

		data = {
			**self.form_data('create')
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['POST'], detail=True, url_path='search-vehicle')
	def search_vehicle(self, request, pk):
		vin = request.data.get('vin', None)
		shipment_type = request.data.get('shipment_type', None)
		vehicle_without_current_shipment_type = request.data.get('vehicle_without_current_shipment_type', None)
		q = Q()
		if vin:
			for item in set(vin.split(' ')):
				q |= Q(vin__icontains=f'{item}'.strip())
		else:
			return Response([], status=status.HTTP_200_OK)
		if vehicle_without_current_shipment_type:
			q &= (~Q(shipmentvehicle__shipment__shipment_type_id=shipment_type) | Q(shipmentvehicle__shipment_id=pk))
		vehicle_qs = Vehicle.objects.filter(q)
		vehicle = VehicleSerializer(vehicle_qs, many=True, context={"detail": True})
		data = vehicle.data
		return Response(data, status=status.HTTP_200_OK)

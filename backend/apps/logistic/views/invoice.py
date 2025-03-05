from rest_framework import viewsets
from rest_framework import permissions
from ..models import Invoice, Vehicle
from ..serializers.vehicle import VehicleSerializer
from ..serializers.invoice import InvoiceSerializer, InvoiceListSerializer
from core.utils.rest import ModelPermission, CustomPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from core.utils.permission import action_permission
from django.db.models import Q

CREATE_FORM_PERMISSION = action_permission('GET', 'logistic.add_invoice')
EDIT_FORM_PERMISSION = action_permission('GET', 'logistic.change_invoice')

class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [SearchFilter, OrderingFilter]
	search_fields = ['id', 'name']

	serializer_class = InvoiceSerializer
	
	def get_serializer_context(self):
		context = super().get_serializer_context()

		if self.action in ['retrieve', 'list']:
			context['detail'] = True

		return context

	def get_queryset(self):
		if self.action == 'retrieve':
			pass
		return Invoice.objects.list()
	
	def get_serializer_class(self):
		if self.action == 'list':
			return InvoiceListSerializer
		if self.action == 'retrieve':
			pass
		return self.serializer_class
	
	def form_data(self, mode, pk=None):

		data = {
			"templates": ['MultiStepForm'],
		}

		return data

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance: Invoice = get_object_or_404(Invoice.objects.list(), pk=pk)
		data = InvoiceSerializer(instance, context={"detail": True})
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
		return Response(data, status=status.HTTP_200_OK)


	@action(methods=['POST'], detail=True, url_path='search-vehicle')
	def search_vehicle(self, request, pk):
		vin = request.data.get('vin', None)
		q = Q()
		if vin:
			for item in set(vin.split(' ')):
				q |= Q(vin__icontains=f'{item}'.strip())
		else:
			return Response([], status=status.HTTP_200_OK)
		vehicle_qs = Vehicle.objects.filter(q)
		vehicle = VehicleSerializer(vehicle_qs, many=True, context={"detail": True})
		data = vehicle.data
		return Response(data, status=status.HTTP_200_OK)
from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from ..serializers import ShipmentCompanySerializer, ShipmentTypeSerializer
from ..filterset import ShipmentCompanyFilterSet
from ..models import ShipmentCompany, ShipmentType

CREATE_FORM_PERMISSION = action_permission('GET', 'logistic.add_shipmentcompany')
EDIT_FORM_PERMISSION = action_permission('GET', 'logistic.change_shipmentcompany')


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_class = ShipmentCompanyFilterSet
	search_fields = []

	serializer_class = ShipmentCompanySerializer

	def get_queryset(self):
		if self.action == 'retrieve':
			return ShipmentCompany.objects.detail()
		return ShipmentCompany.objects.list()

	def get_serializer_class(self):
		if self.action == 'retrieve':
			pass
		return self.serializer_class

	def get_serializer_context(self):
		context = super().get_serializer_context()

		if self.action == 'retrieve':
			context['detail'] = True

		return context

	def form_data(self, mode, pk=None):
		shipment_type_qs = ShipmentType.objects.list()
		shipment_type = ShipmentTypeSerializer(shipment_type_qs, many=True)
		data = {
			"shipment_type": shipment_type.data
		}

		return data

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance = get_object_or_404(ShipmentCompany.objects.list(), pk=pk)
		data = ShipmentCompanySerializer(instance)
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

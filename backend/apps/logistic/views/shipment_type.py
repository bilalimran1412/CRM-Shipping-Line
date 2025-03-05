from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from ..serializers import ShipmentTypeSerializer, ShipmentTypeDetailSerializer, DeliveryStatusSerializer
from ..filterset import ShipmentTypeFilterSet
from ..models import ShipmentType, DeliveryStatus

CREATE_FORM_PERMISSION = action_permission('GET', 'installment.add_installment')
EDIT_FORM_PERMISSION = action_permission('GET', 'installment.change_installment')


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_class = ShipmentTypeFilterSet
	search_fields = []

	serializer_class = ShipmentTypeSerializer
	def get_queryset(self):
		if self.action == 'retrieve':
			return ShipmentType.objects.detail()
		return ShipmentType.objects.list()

	def get_serializer_class(self):
		if self.action == 'retrieve':
			return ShipmentTypeDetailSerializer
		return self.serializer_class

	def get_serializer_context(self):
		context = super().get_serializer_context()

		if self.action == 'retrieve':
			context['detail'] = True

		return context

	def form_data(self, mode, pk=None):
		delivery_status_qs = DeliveryStatus.objects.list()
		delivery_status = DeliveryStatusSerializer(delivery_status_qs, many=True)
		data = {
			"status": delivery_status.data
		}

		return data

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance = get_object_or_404(ShipmentType.objects.list(), pk=pk)
		data = ShipmentTypeSerializer(instance, context={"detail": True})
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

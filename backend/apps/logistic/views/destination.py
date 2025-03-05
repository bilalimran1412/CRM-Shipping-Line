from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from ..serializers import DeliveryDestinationSerializer
from ..filterset import DeliveryDestinationFilterSet
from ..models import DeliveryDestination

CREATE_FORM_PERMISSION = action_permission('GET', 'installment.add_installment')
EDIT_FORM_PERMISSION = action_permission('GET', 'installment.change_installment')


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_class = DeliveryDestinationFilterSet
	search_fields = [
		'country_en',
		'country_ru',
		'city_en',
		'city_ru',
	]

	serializer_class = DeliveryDestinationSerializer

	def get_queryset(self):
		if self.action == 'retrieve':
			pass
		return DeliveryDestination.objects.list()

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
		data = {

		}

		return data

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance = get_object_or_404(DeliveryDestination.objects.list(), pk=pk)
		data = DeliveryDestinationSerializer(instance)
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

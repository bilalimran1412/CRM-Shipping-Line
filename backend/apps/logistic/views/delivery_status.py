from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from ..serializers import DeliveryStatusSerializer
from ..models import DeliveryStatus

EDIT_FORM_PERMISSION = action_permission('GET', 'logistic.change_deliverystatus')


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [SearchFilter, OrderingFilter]
	search_fields = []

	serializer_class = DeliveryStatusSerializer

	def get_queryset(self):
		if self.action == 'retrieve':
			pass
		return DeliveryStatus.objects.list()

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance = get_object_or_404(DeliveryStatus.objects.list(), pk=pk)
		data = DeliveryStatusSerializer(instance)
		data = {
			"data": data.data,
		}
		return Response(data, status=status.HTTP_200_OK)

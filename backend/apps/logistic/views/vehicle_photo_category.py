from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from ..serializers import VehiclePhotoCategorySerializer
from ..models import VehiclePhotoCategory

EDIT_FORM_PERMISSION = action_permission('GET', 'logistic.change_vehiclephotocategory')


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [SearchFilter, OrderingFilter]
	search_fields = []

	serializer_class = VehiclePhotoCategorySerializer

	def get_queryset(self):
		if self.action == 'retrieve':
			pass
		return VehiclePhotoCategory.objects.list()

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		instance = get_object_or_404(VehiclePhotoCategory.objects.list(), pk=pk)
		data = VehiclePhotoCategorySerializer(instance)
		data = {
			"data": data.data,
		}
		return Response(data, status=status.HTTP_200_OK)

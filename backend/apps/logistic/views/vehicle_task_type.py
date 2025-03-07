from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from logistic.models import VehicleTaskType
from core.utils.permission import action_permission
from core.utils.rest import ModelPermission, CustomPagination
from ..serializers import VehicleTaskTypeSerializer, VehicleTaskTypeListSerializer, CustomerSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from user.models import User
from rest_framework.generics import get_object_or_404

CREATE_FORM_PERMISSION = action_permission('GET', 'logistic.add_vehicletasktype')
EDIT_FORM_PERMISSION = action_permission('GET', 'logistic.change_vehicletasktype')

class ViewSet(viewsets.ModelViewSet):
    permission_classes = [ModelPermission]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return VehicleTaskTypeListSerializer
        return VehicleTaskTypeSerializer

    def get_queryset(self):
        return VehicleTaskType.objects.select_related(
            'icon'
        ).prefetch_related(
            'assigned_to'
        )

    def form_data(self, mode, pk=None):
        customer_qs = User.objects.list()
        customer = CustomerSerializer(customer_qs, many=True)
        
        data = {
            "employees": customer.data
        }
        return data

    @action(methods=['GET'], detail=False, url_path='filter-data')
    def filter_form_data(self, request, pk=None):
        return Response(self.form_data('filter'), status=HTTP_200_OK)

    @action(methods=['GET'], detail=False, url_path='form-data', permission_classes=CREATE_FORM_PERMISSION)
    def create_form_data(self, request):
        data = {
            **self.form_data('create')
        }
        return Response(data, status=HTTP_200_OK)

    @action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
    def edit_form_data(self, request, pk):
        instance = get_object_or_404(VehicleTaskType.objects.select_related(
            'icon'
        ).prefetch_related(
            'assigned_to'
        ), pk=pk)
        data = VehicleTaskTypeSerializer(instance)
        data = {
            "data": data.data,
            **self.form_data('edit')
        }
        return Response(data, status=HTTP_200_OK)


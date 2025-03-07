from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from logistic.models import Pricing, PricingType
from core.utils.permission import action_permission
from core.utils.rest import ModelPermission, CustomPagination
from ..serializers import PricingSerializer, PricingListSerializer, PricingTypeSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.generics import get_object_or_404

CREATE_FORM_PERMISSION = action_permission('GET', 'logistic.add_pricing')
EDIT_FORM_PERMISSION = action_permission('GET', 'logistic.change_pricing')

class ViewSet(viewsets.ModelViewSet):
    permission_classes = [ModelPermission]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['type__name']
    ordering_fields = ['created_at', 'date', 'type__name']
    ordering = ['-date']

    def get_serializer_class(self):
        if self.action == 'list':
            return PricingListSerializer
        return PricingSerializer

    def get_queryset(self):
        return Pricing.objects.select_related(
            'type',
            'file'
        )

    def form_data(self, mode, pk=None):
        pricing_types = PricingType.objects.all()
        types = PricingTypeSerializer(pricing_types, many=True)
        
        data = {
            "type": types.data
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
        instance = get_object_or_404(Pricing.objects.select_related(
            'type',
            'file'
        ), pk=pk)
        data = PricingSerializer(instance)
        data = {
            "data": data.data,
            **self.form_data('edit')
        }
        return Response(data, status=HTTP_200_OK)

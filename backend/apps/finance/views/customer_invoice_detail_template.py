from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.generics import get_object_or_404

from finance.models import CustomerInvoiceDetailTemplate, CustomerInvoiceDetailTemplateItem
from core.utils.permission import action_permission
from core.utils.rest import ModelPermission, CustomPagination
# Assuming you have these serializers in your serializers.py
from ..serializers import (
    CustomerInvoiceDetailTemplateSerializer, 
    CustomerInvoiceDetailTemplateListSerializer
)

CREATE_FORM_PERMISSION = action_permission('GET', 'customer_invoice_detail_template.add_customer_invoice_detail_template')
EDIT_FORM_PERMISSION = action_permission('GET', 'customer_invoice_detail_template.change_customer_invoice_detail_template')

class ViewSet(viewsets.ModelViewSet):
    permission_classes = [ModelPermission]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerInvoiceDetailTemplateListSerializer
        return CustomerInvoiceDetailTemplateSerializer

    def get_queryset(self):
        return CustomerInvoiceDetailTemplate.objects.prefetch_related(
            'customerinvoicedetailtemplateitem_set'
        )

    def form_data(self, mode, pk=None):
        # Add any common form data here that might be needed across different form endpoints
        data = {}
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
        instance = get_object_or_404(self.get_queryset(), pk=pk)
        data = self.get_serializer(instance)
        response_data = {
            "data": data.data,
            **self.form_data('edit')
        }
        return Response(response_data, status=HTTP_200_OK)

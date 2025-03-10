from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from core.utils.rest import ModelPermission, CustomPagination
from core.utils.permission import action_permission
from finance.models import CustomerInvoice, CustomerInvoiceDetailTemplate, CUSTOMER_INVOICE_STATUS
from finance.serializers import (
    CustomerInvoiceSerializer,
    CustomerInvoiceListSerializer,
)
from ..serializers import CustomerSerializer
from user.models import User
from main.models import Currency, CurrencyRate
from main.serializers.currency import CurrencySerializer, CurrencyRateSerializer
from ..filterset import CustomerInvoiceFilterSet
from datetime import datetime
from django.db.models import Q
from django.shortcuts import get_object_or_404
import json
from weasyprint import HTML
from django.conf import settings
import tempfile
from main.models import File, OneTimeLink
from django.template.loader import render_to_string
from django.core.files import File as DjangoFile

CREATE_FORM_PERMISSION = action_permission('GET', 'customer_invoice.add_customer_invoice')
EDIT_FORM_PERMISSION = action_permission('GET', 'customer_invoice.change_customer_invoice')


class ViewSet(viewsets.ModelViewSet):
    permission_classes = [ModelPermission]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'customer__full_name']
    filterset_class = CustomerInvoiceFilterSet
    serializer_class = CustomerInvoiceSerializer

    def get_queryset(self):
        qs = CustomerInvoice.objects.list()
        if self.action in ['list']:
            qs = CustomerInvoice.objects.list()
        if self.action in ['retrieve']:
            qs = CustomerInvoice.objects.detail()
        return qs.filter(customer=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerInvoiceListSerializer
        return self.serializer_class

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.action in ['retrieve', 'list']:
            context['detail'] = True
        return context

    def form_data(self, mode=None, pk=None):
        # Get all customers
        customers_qs = User.objects.list()
        customer_serializer = CustomerSerializer(customers_qs, many=True)
        
        # # Get currencies and rates
        currencies_qs = Currency.objects.all()
        currency_serializer = CurrencySerializer(currencies_qs, many=True)
        currency_rates_qs = CurrencyRate.objects.all()
        currency_rate_serializer = CurrencyRateSerializer(currency_rates_qs, many=True)
        
        # Get primary currency
        primary_currency = Currency.objects.first()
        primary_currency_serializer = CurrencySerializer(primary_currency)
        
        # Get detail templates
        detail_templates = CustomerInvoiceDetailTemplate.objects.prefetch_related('customerinvoicedetailtemplateitem_set').all()
        
        # Prepare detail templates data
        detail_templates_data = []
        for template in detail_templates:
            template_data = {
                'id': template.id,
                'name': template.name,
                'items': [{'id': item.id, 'description': item.description} for item in template.customerinvoicedetailtemplateitem_set.all()]
            }
            detail_templates_data.append(template_data)

        data = {
            "customer": customer_serializer.data,
            "currency": currency_serializer.data,
            "currency_rate": currency_rate_serializer.data,
            "detail_templates": detail_templates_data,
            "primary_currency": primary_currency_serializer.data
        }
        return data

    @action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
    def edit_form_data(self, request, pk):
        instance = self.get_object()
        data = self.get_serializer(instance, context={"detail": True})
        response_data = {
            "data": data.data,
            **self.form_data(mode='edit')
        }
        return Response(response_data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False, url_path='form-data', permission_classes=CREATE_FORM_PERMISSION)
    def create_form_data(self, request):
        data = {
            **self.form_data(mode='create')
        }
        return Response(data, status=status.HTTP_200_OK)
    
    @action(methods=['GET'], detail=False, url_path='filter-data')
    def filter_form_data(self, request):
        # Get all customers
        customers_qs = User.objects.list()
        customer_serializer = CustomerSerializer(customers_qs, many=True)
        
        # Get all statuses with translations
        statuses = [
            {
                "value": status[0],
                "label": {
                    "ru": status[1],
                    "en": status[0].replace('_', ' ').capitalize()
                }
            }
            for status in CUSTOMER_INVOICE_STATUS
        ]

        # Get all templates
        templates_qs = CustomerInvoiceDetailTemplate.objects.all()
        templates_data = [
            {"id": template.id, "name": template.name}
            for template in templates_qs
        ]

        data = {
            "customer": customer_serializer.data,
            "status": statuses,
            "template": templates_data,
        }
        return Response(data, status=status.HTTP_200_OK)
        
    @action(methods=['GET'], detail=False, url_path='my/filter-data')
    def my_customer_invoices_filter_data(self, request):
        statuses = [
            {"value": status[0], "label": status[1]}
            for status in CUSTOMER_INVOICE_STATUS
        ]
        data = {
            "status": statuses
        }
        return Response(data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False, url_path='my')
    def my_customer_invoices(self, request):
        queryset = self.get_queryset().filter(customer=request.user)
        
        # Add search functionality
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
            )
        
        # Add status filtering
        status = request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        # Add date range filtering
        date_start = request.query_params.get('date_start')
        date_end = request.query_params.get('date_end')
        
        if date_start:
            try:
                date_start = datetime.strptime(date_start, '%d/%m/%Y').date()
                queryset = queryset.filter(created_at__gte=date_start)
            except ValueError:
                pass
                
        if date_end:
            try:
                date_end = datetime.strptime(date_end, '%d/%m/%Y').date()
                queryset = queryset.filter(created_at__lte=date_end)
            except ValueError:
                pass
            
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = CustomerInvoiceListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CustomerInvoiceListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    	
    @action(methods=['GET'], detail=True, url_path='generate')
    def generate_customer_invoice(self, request, pk):
        # Get the customer invoice instance
        customer_invoice = get_object_or_404(CustomerInvoice.objects.list(), pk=pk)
        
        # Get the data field (it's already a dict)
        customer_invoice_data = customer_invoice.data or {}
        
        # Replace template variables in header
        header = customer_invoice_data.get('header', '')
        header = header.replace('[invoice_id]', str(customer_invoice.id))
        header = header.replace('[date]', customer_invoice.datetime.strftime('%Y-%m-%d'))
        header = header.replace('[customer]', customer_invoice.customer.full_name if customer_invoice.customer else '')
        
        # Convert newlines to HTML line breaks
        header = header.replace("\\n", '<br>')
        
        # Replace template variables in footer
        footer = customer_invoice_data.get('footer', '')
        footer = footer.replace("\\n", '<br>')
        
        customer_invoice_data['header'] = header
        customer_invoice_data['footer'] = footer
        
        # Get all customer invoice items
        customer_invoice_items = customer_invoice.customerinvoiceitem_set.all()
        
        # Get all payments
        customer_invoice_payments = customer_invoice.customerinvoicepayment_set.all()
        
        # Prepare context for template
        context = {
            'customer_invoice': customer_invoice,
            'customer_invoice_items': customer_invoice_items,
            'customer_invoice_payments': customer_invoice_payments,
            'header': customer_invoice_data.get('header', ''),
            'footer': customer_invoice_data.get('footer', ''),
            'customer_invoice_data': customer_invoice_data,
            'total_amount': customer_invoice.total_amount_in_default,
        }
        
        # Render the template to HTML
        html_string = render_to_string('customer_invoice.html', context)
        
        # Create PDF from HTML
        html = HTML(string=html_string)
        
        # Create a temporary file to save the PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            html.write_pdf(tmp_file.name)
            
            # Create a File instance with the PDF
            file_obj = File.objects.create(
                file=DjangoFile(open(tmp_file.name, 'rb'), name=f'customer_invoice_{pk}.pdf'),
                type='application/pdf'
            )
            
            # Create a one-time link for the file
            one_time_link = OneTimeLink.objects.create(
                file=file_obj,
                is_active=True
            )
        
        # Return the one-time link URL
        return Response({
            'file': f"{settings.BACKEND_URL}/api/v1/main/file/download/{one_time_link.token}/"
        }, status=status.HTTP_200_OK)
		
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
from django.template.loader import render_to_string
from django.http import HttpResponse
import json
from weasyprint import HTML
from django.conf import settings
import tempfile
from main.models import File, OneTimeLink
from django.core.files import File as DjangoFile

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
	
	@action(methods=['GET'], detail=True, url_path='generate')
	def generate_invoice(self, request, pk):
		# Get the invoice instance
		invoice = get_object_or_404(Invoice.objects.list(), pk=pk)
		
		# Get all vehicles related to this invoice
		vehicles = [iv.vehicle for iv in invoice.vehicles.all()]
		
		# Parse the JSON data field
		invoice_data = {}
		if invoice.data:
			try:
				invoice_data = json.loads(invoice.data)
				
				# Replace template variables in header
				header = invoice_data.get('header', '')
				header = header.replace('[invoice_id]', str(invoice.id))
				header = header.replace('[date]', invoice.created_at.strftime('%Y-%m-%d'))
				header = header.replace('[consignee]', invoice_data.get('consignee', '') or '')
				
				# Convert newlines to HTML line breaks
				header = header.replace("\\n", '<br>')
				
				# Replace template variables in footer
				footer = invoice_data.get('footer', '')
				# Convert newlines to HTML line breaks in footer as well
				footer = footer.replace("\\n", '<br>')
				
				invoice_data['header'] = header
				invoice_data['footer'] = footer
				print(header)
				print(footer)
				
			except json.JSONDecodeError:
				invoice_data = {
					'header': '',
					'footer': '',
					'consignee': ''
				}
		
		# Prepare context for template
		context = {
			'invoice': invoice,
			'vehicles': vehicles,
			'header': invoice_data.get('header', ''),
			'footer': invoice_data.get('footer', ''),
			'invoice_data': invoice_data
		}
		
		# Render the template to HTML
		html_string = render_to_string('invoice.html', context)
		
		# Create PDF from HTML
		html = HTML(string=html_string)
		
		# Create a temporary file to save the PDF
		with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
			html.write_pdf(tmp_file.name)
			
			# Create a File instance with the PDF
			file_obj = File.objects.create(
				file=DjangoFile(open(tmp_file.name, 'rb'), name=f'invoice_{pk}.pdf'),
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
		
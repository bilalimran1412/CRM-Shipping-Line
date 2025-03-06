from rest_framework import viewsets
from finance.models import CustomerInvoiceDetailTemplate
from core.utils.permission import action_permission

CREATE_FORM_PERMISSION = action_permission('GET', 'customer_invoice_detail_template.add_customer_invoice_detail_template')
EDIT_FORM_PERMISSION = action_permission('GET', 'customer_invoice_detail_template.change_customer_invoice_detail_template')

class ViewSet(viewsets.ModelViewSet):
	queryset = CustomerInvoiceDetailTemplate.objects.all()

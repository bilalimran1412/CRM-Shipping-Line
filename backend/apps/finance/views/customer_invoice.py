from rest_framework import viewsets
from finance.models import CustomerInvoice
from core.utils.permission import action_permission


CREATE_FORM_PERMISSION = action_permission('GET', 'customer_invoice.add_customer_invoice')
EDIT_FORM_PERMISSION = action_permission('GET', 'customer_invoice.change_customer_invoice')

class ViewSet(viewsets.ModelViewSet):
	queryset = CustomerInvoice.objects.all()
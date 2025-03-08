from django.db import models
from core.models import BaseModel
import datetime
from .querysets import CustomerInvoiceDetailTemplateQuerySet, CustomerInvoiceQuerySet

# Create your models here.

CUSTOMER_INVOICE_STATUS = [
	('unpaid', 'Unpaid'),
	('partially_paid', 'Partially paid'),
	('paid', 'Paid'),
]

CURRENCY_CHOICES = [
	('USD', 'USD'),
	('AED', 'AED'),
]

class CustomerInvoice(BaseModel):
	name = models.CharField(max_length=255)
	template = models.CharField(max_length=255, null=True, blank=True)
	customer = models.ForeignKey('user.User', on_delete=models.PROTECT)
	datetime = models.DateTimeField(default=datetime.datetime.now)
	data = models.JSONField(null=True, blank=True)
	total_amount_in_default = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	total_paid_in_default = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
	status = models.CharField(max_length=50, choices=CUSTOMER_INVOICE_STATUS, default='unpaid')

	objects = CustomerInvoiceQuerySet.as_manager()
	
	class Meta:
		permissions = (
			("view_my_invoices", "Can view assigned invoices"),
		)

class CustomerInvoiceDetailTemplate(BaseModel):
	name = models.CharField(max_length=255)

	objects = CustomerInvoiceDetailTemplateQuerySet.as_manager()

class CustomerInvoiceDetailTemplateItem(BaseModel):
	template = models.ForeignKey('CustomerInvoiceDetailTemplate', on_delete=models.CASCADE)
	description = models.TextField()

class CustomerInvoicePayment(BaseModel):
	invoice = models.ForeignKey('CustomerInvoice', on_delete=models.PROTECT)
	datetime = models.DateTimeField(default=datetime.datetime.now)
	description = models.TextField(null=True, blank=True)
	currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
	exchange_rate = models.DecimalField(max_digits=10, decimal_places=6, default=1.0)
	amount_in_currency = models.DecimalField(max_digits=10, decimal_places=2)
	amount_in_default = models.DecimalField(max_digits=10, decimal_places=2)

class CustomerInvoiceItem(BaseModel):
	invoice = models.ForeignKey('CustomerInvoice', on_delete=models.PROTECT)
	description = models.TextField(null=True, blank=True)
	currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
	exchange_rate = models.DecimalField(max_digits=10, decimal_places=6, default=1.0)
	amount_in_currency = models.DecimalField(max_digits=10, decimal_places=2)
	amount_in_default = models.DecimalField(max_digits=10, decimal_places=2)
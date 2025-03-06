from django.db import models
from core.models import BaseModel
import datetime

# Create your models here.

CUSTOMER_INVOICE_STATUS = [
	('unpaid', 'unpaid'),
	('partially_paid', 'partially_paid'),
	('paid', 'paid'),
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

class CustomerInvoiceDetailTemplate(BaseModel):
	name = models.CharField(max_length=255)

class CustomerInvoiceDetailTemplateItem(BaseModel):
	template = models.ForeignKey('CustomerInvoiceDetailTemplate', on_delete=models.CASCADE)
	description = models.TextField()
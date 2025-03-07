from django.db import models
from simple_history.models import HistoricalRecords
from core.models import BaseModel
from .querysets.vehicle import VehicleQuerySet
from .querysets.destination import DeliveryDestinationManager
from .querysets.shipment_type import ShipmentTypeManager
from .querysets.delivery_status import DeliveryStatusManager
from .querysets.shipment_company import ShipmentCompanyQuerySet
from .querysets.shipment import ShipmentQuerySet
from .querysets.vehicle_photo_category import VehiclePhotoCategoryManager
from .querysets.app_config import AppConfigQuerySet
from .querysets.invoice import InvoiceQuerySet
from .querysets.vehicle_task import VehicleTaskQuerySet
from .querysets.vehicle_task_type import VehicleTaskTypeQuerySet
from .querysets.pricing import PricingQuerySet
from .querysets.pricing_type import PricingTypeQuerySet
import datetime

SHIPMENT_STATUS = [
	('scheduled', 'scheduled'),
	('in_progress', 'in_progress'),
	('canceled', 'canceled'),
	('completed', 'completed'),
]
DELIVERY_STATUS_TYPE = [
	('initial', 'initial'),
	('complete', 'complete'),
]
TASK_STATUS = [
	('pending', 'pending'),
	('in_progress', 'in_progress'),
	('completed', 'completed'),
	('canceled', 'canceled'),
]


class Vehicle(BaseModel):
	manufacturer = models.CharField(max_length=50)
	model = models.CharField(max_length=50)
	vin = models.CharField(max_length=50)
	characteristics = models.JSONField(default=dict)
	customer = models.ForeignKey('user.User', on_delete=models.PROTECT, null=True, blank=True)

	destination = models.ForeignKey('DeliveryDestination', null=True, blank=True, on_delete=models.PROTECT)
	status = models.ForeignKey('DeliveryHistory', null=True, blank=True, on_delete=models.SET_NULL,
	                           related_name='vehicles')

	objects = VehicleQuerySet.as_manager()

	class Meta:
		ordering = ['-pk']
		permissions = (
			("view_all_customer_vehicles", "Can view all customer vehicles"),
		)


class DeliveryDestination(BaseModel):
	country = models.CharField(max_length=100)
	city = models.CharField(max_length=100)
	icon = models.ForeignKey('main.File', on_delete=models.PROTECT, blank=True, null=True)

	objects = DeliveryDestinationManager()

	def __str__(self):
		return f'{self.country}, {self.city}'


class Shipment(BaseModel):
	shipment_type = models.ForeignKey('ShipmentType', on_delete=models.PROTECT)
	company = models.ForeignKey('ShipmentCompany', on_delete=models.PROTECT, null=True, blank=True)
	datetime = models.DateTimeField(default=datetime.datetime.now)
	complete_datetime = models.DateTimeField(null=True, blank=True)
	completed = models.BooleanField(default=False)
	extra_data = models.JSONField(null=True, blank=True)
	note = models.TextField(null=True, blank=True)

	objects = ShipmentQuerySet.as_manager()

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self._datetime = self.datetime
		self._completed = self.completed
		self._complete_datetime = self.complete_datetime


class ShipmentDocument(BaseModel):
	name = models.CharField(max_length=255)
	shipment = models.ForeignKey('Shipment', on_delete=models.CASCADE, related_name='documents')
	file = models.ForeignKey('main.File', on_delete=models.PROTECT)


class ShipmentVehicle(BaseModel):
	shipment = models.ForeignKey('Shipment', on_delete=models.CASCADE, related_name='vehicles')
	vehicle = models.ForeignKey('Vehicle', on_delete=models.PROTECT)


class ShipmentCompany(BaseModel):
	name = models.CharField(max_length=50)
	shipment_type = models.ManyToManyField('ShipmentType')
	icon = models.ForeignKey('main.File', on_delete=models.PROTECT, blank=True, null=True)

	objects = ShipmentCompanyQuerySet.as_manager()


class ShipmentType(BaseModel):
	name = models.CharField(max_length=50)
	initial_status = models.ForeignKey('DeliveryStatus', on_delete=models.PROTECT)
	complete_status = models.ForeignKey('DeliveryStatus', on_delete=models.PROTECT,
	                                    related_name='complete_status', null=True, blank=True)

	icon = models.ForeignKey('main.File', on_delete=models.PROTECT, blank=True, null=True)

	objects = ShipmentTypeManager()


class DeliveryStatus(BaseModel):
	name = models.CharField(max_length=255)
	status_type = models.CharField(max_length=50, choices=DELIVERY_STATUS_TYPE, null=True, blank=True)
	icon = models.ForeignKey('main.File', on_delete=models.PROTECT, blank=True, null=True)

	objects = DeliveryStatusManager()


class DeliveryHistory(BaseModel):
	shipment = models.ForeignKey('Shipment', on_delete=models.CASCADE, null=True, blank=True)
	vehicle = models.ForeignKey('Vehicle', on_delete=models.PROTECT, related_name='history')
	status = models.ForeignKey('DeliveryStatus', on_delete=models.PROTECT)
	datetime = models.DateTimeField(default=datetime.datetime.now)


class VehiclePhotoCategory(BaseModel):
	name = models.CharField(max_length=255)

	objects = VehiclePhotoCategoryManager()


class VehiclePhoto(BaseModel):
	category = models.ForeignKey('VehiclePhotoCategory', on_delete=models.PROTECT)
	vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='photos')
	file = models.ForeignKey('main.File', on_delete=models.PROTECT)

	objects = VehiclePhotoCategoryManager()


class VehicleDocument(BaseModel):
	name = models.CharField(max_length=255)
	vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='documents')
	file = models.ForeignKey('main.File', on_delete=models.PROTECT)


class LogisticConfig(BaseModel):
	initial_status = models.OneToOneField('DeliveryStatus', on_delete=models.PROTECT)

	objects = AppConfigQuerySet()
	history = HistoricalRecords()

class Invoice(BaseModel):
	name = models.CharField(max_length=255)
	datetime = models.DateTimeField(default=datetime.datetime.now)
	data = models.TextField(null=True, blank=True)
	template = models.CharField(max_length=255, default="MultiVehicleInvoice", null=True, blank=True)

	objects = InvoiceQuerySet.as_manager()

class InvoiceVehicle(BaseModel):
	invoice = models.ForeignKey('Invoice', on_delete=models.CASCADE, related_name='vehicles')
	vehicle = models.ForeignKey('Vehicle', on_delete=models.PROTECT)

class VehicleTaskType(BaseModel):
	name = models.CharField(max_length=255)
	assigned_to = models.ManyToManyField('user.User')
	icon = models.ForeignKey('main.File', on_delete=models.PROTECT, blank=True, null=True)

	objects = VehicleTaskTypeQuerySet.as_manager()

class VehicleTask(BaseModel):
	vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='tasks')
	task_type = models.ForeignKey('VehicleTaskType', on_delete=models.PROTECT)
	assigned_to = models.ManyToManyField('user.User')
	note = models.TextField(null=True, blank=True)
	status = models.CharField(max_length=50, choices=TASK_STATUS, default='pending')

	objects = VehicleTaskQuerySet.as_manager

	class Meta:
		permissions = (
			("view_my_tasks", "Can view assigned tasks"),
		)

class PricingType(BaseModel):
	name = models.CharField(max_length=255)
	
	objects = PricingTypeQuerySet.as_manager()

	def __str__(self):
		return self.name

class Pricing(BaseModel):
	type = models.ForeignKey('PricingType', on_delete=models.PROTECT)
	date = models.DateField()
	file = models.ForeignKey('main.File', on_delete=models.PROTECT)

	objects = PricingQuerySet.as_manager()

	class Meta:
		ordering = ['-date']
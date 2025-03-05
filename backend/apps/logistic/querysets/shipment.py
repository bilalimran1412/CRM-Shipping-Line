from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Sum, IntegerField, FloatField, Value, Count, F, When, Case, Q, CharField, Exists, \
	DecimalField
from django.db.models.lookups import GreaterThan, LessThan, Exact
from django.db.models.functions import Coalesce, Round
from sql_util.utils import SubquerySum
from django.db.models import Prefetch


class ShipmentQuerySet(BaseQuerySet):

	def list(self):
		select = [
			'company',
			'company__icon',
			'shipment_type',
			'shipment_type__icon',
		]
		prefetch = [
			'vehicles',
			'vehicles__vehicle',
			'vehicles__vehicle__customer',
			'vehicles__vehicle__destination',
			'vehicles__vehicle__destination__icon',
		]
		return self.select_related(*select).prefetch_related(*prefetch)

	def detail(self):
		select = [
			'company',
			'company__icon',
			'shipment_type',
			'shipment_type__icon',
		]
		prefetch = [
			'vehicles',
			'vehicles__vehicle',
			'vehicles__vehicle__customer',
			'vehicles__vehicle__destination',
			'vehicles__vehicle__destination__icon',
			'documents',
			'documents__file',
		]
		return self.select_related(*select).prefetch_related(*prefetch)

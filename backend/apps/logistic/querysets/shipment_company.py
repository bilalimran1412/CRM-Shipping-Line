from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Sum, IntegerField, FloatField, Value, Count, F, When, Case, Q, CharField, Exists, \
	DecimalField
from django.db.models.lookups import GreaterThan, LessThan, Exact
from django.db.models.functions import Coalesce, Round
from sql_util.utils import SubquerySum
from django.db.models import Prefetch


class ShipmentCompanyQuerySet(BaseQuerySet):

	def list(self):
		select = [
			'icon',
		]
		prefetch = ['shipment_type']
		return self.select_related(*select).prefetch_related(*prefetch)

	def detail(self):
		select = [
			'icon',
		]
		prefetch = [
			'shipment_type',
			'shipment_type__icon',
		]
		return self.select_related(*select).prefetch_related(*prefetch)

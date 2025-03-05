from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Sum, IntegerField, FloatField, Value, Count, F, When, Case, Q, CharField, Exists, \
	DecimalField
from django.db.models.lookups import GreaterThan, LessThan, Exact
from django.db.models.functions import Coalesce, Round
from sql_util.utils import SubquerySum
from django.db.models import Prefetch


class VehicleQuerySet(BaseQuerySet):

	def list(self):
		select = [
			'customer',
			'destination',
			'destination__icon',
			'status',
			'status__status',
			'status__status__icon',
		]
		prefetch = [

		]
		return self.select_related(*select).prefetch_related(*prefetch)

	def detail(self):
		select = [
			'customer',
			'destination',
			'destination__icon',
			'status',
			'status__status',
			'status__status__icon',
		]
		prefetch = [
			'history',
			'history__status',
			'history__status__icon',
			'photos',
			'photos__category',
			'photos__file',
			'documents',
			'documents__file',
		]
		return self.select_related(*select).prefetch_related(*prefetch)

	def edit(self):
		select = [

		]
		prefetch = [
			'history',
			'photos',
			'photos__file',
			'documents',
			'documents__file',
		]
		return self.select_related(*select).prefetch_related(*prefetch)

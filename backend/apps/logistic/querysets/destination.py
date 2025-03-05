from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Sum, IntegerField, FloatField, Value, Count, F, When, Case, Q, CharField, Exists, \
	DecimalField
from django.db.models.lookups import GreaterThan, LessThan, Exact
from django.db.models.functions import Coalesce, Round
from sql_util.utils import SubquerySum
from django.db.models import Prefetch
from modeltranslation.manager import MultilingualQuerySet, MultilingualManager

class DeliveryDestinationQuerySet(BaseQuerySet, MultilingualQuerySet):

	def list(self):
		select = [
			'icon',
		]
		prefetch = []
		return self.select_related(*select).prefetch_related(*prefetch)



class DeliveryDestinationManager(MultilingualManager.from_queryset(DeliveryDestinationQuerySet)):
	pass

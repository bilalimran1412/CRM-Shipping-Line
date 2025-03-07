from django_filters import rest_framework as filters
from django_filters import filterset
from django.db.models import Q
from ..models import VehicleTask


class VehicleTaskFilterSet(filterset.FilterSet):
	assigned_to = filters.CharFilter(field_name="assigned_to", lookup_expr='exact')
	status = filters.CharFilter(field_name="status", lookup_expr='exact')

	def filter_vin(self, queryset, name, value):
		if value:
			q = Q()
			return queryset.filter(q).distinct()
		return queryset

	class Meta:
		model = VehicleTask
		fields = []

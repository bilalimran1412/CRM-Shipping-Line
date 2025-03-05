from django_filters import rest_framework as filters
from django_filters import filterset
from django.db.models import Q
from ..models import Vehicle


class VehicleFilterSet(filterset.FilterSet):
	customer = filters.CharFilter(field_name="customer", lookup_expr='exact')
	status = filters.CharFilter(field_name="status__status", lookup_expr='exact')
	destination = filters.CharFilter(field_name="destination", lookup_expr='exact')
	# year = filters.CharFilter(field_name="characteristics__year", lookup_expr='icontains')
	vin = filters.CharFilter(method="filter_vin")

	def filter_vin(self, queryset, name, value):
		if value:
			q = Q()
			for vin in set(value.split(' ')):
				q |= Q(vin__icontains=f'{vin}'.strip())
			return queryset.filter(q).distinct()
		return queryset

	class Meta:
		model = Vehicle
		fields = []

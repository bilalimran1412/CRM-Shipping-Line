from django_filters import rest_framework as filters
from django_filters import filterset
from django.db.models import Q
from ..models import CustomerInvoice


class CustomerInvoiceFilterSet(filterset.FilterSet):
	status = filters.CharFilter(field_name="status", lookup_expr='exact')

	def filter_vin(self, queryset, name, value):
		if value:
			q = Q()
			for vin in set(value.split(' ')):
				q |= Q(vin__icontains=f'{vin}'.strip())
			return queryset.filter(q).distinct()
		return queryset

	class Meta:
		model = CustomerInvoice
		fields = []

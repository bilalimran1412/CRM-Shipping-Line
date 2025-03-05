from django_filters import rest_framework as filters
from django_filters import filterset
from django.db.models import Q
from ..models import ShipmentCompany


class ShipmentCompanyFilterSet(filterset.FilterSet):
	class Meta:
		model = ShipmentCompany
		fields = []

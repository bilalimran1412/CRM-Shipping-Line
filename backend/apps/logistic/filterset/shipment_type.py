from django_filters import rest_framework as filters
from django_filters import filterset
from django.db.models import Q
from ..models import ShipmentType


class ShipmentTypeFilterSet(filterset.FilterSet):
	class Meta:
		model = ShipmentType
		fields = []

from django_filters import rest_framework as filters
from django_filters import filterset
from django.db.models import Q
from ..models import Shipment


class ShipmentFilterSet(filterset.FilterSet):
	class Meta:
		model = Shipment
		fields = []

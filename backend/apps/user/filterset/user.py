from django_filters import rest_framework as filters
from django_filters import filterset
from django.db.models import Q
from ..models import User, Group


class UserFilterSet(filterset.FilterSet):
    username = filters.CharFilter(field_name="username", lookup_expr='icontains')
    first_name = filters.CharFilter(field_name="first_name", lookup_expr='icontains')
    last_name = filters.CharFilter(field_name="last_name", lookup_expr='icontains')
    email = filters.CharFilter(field_name="email", lookup_expr='icontains')
    phone = filters.CharFilter(field_name="phone", lookup_expr='icontains')
    groups = filters.CharFilter(method='filter_groups')
    status = filters.CharFilter(method='filter_status')
    type = filters.CharFilter(method='filter_type')

    def filter_status(self, queryset, name, value):
        if value and value == 'active':
            return queryset.filter(is_active=True)
        if value and value == 'not-active':
            return queryset.filter(is_active=False)
        return queryset

    def filter_type(self, queryset, name, value):
        values = f'{value}'.split(',')
        q = Q()
        if 'staff' in values:
            q |= Q(is_staff=True)
        if 'superuser' in values:
            q |= Q(is_superuser=True)
        return queryset.filter(q)

    def filter_groups(self, queryset, name, value):
        values = f'{value}'.split(',')
        return queryset.filter(groups__in=values)

    class Meta:
        model = User
        fields = []


class GroupFilterSet(filterset.FilterSet):
    title = filters.CharFilter(field_name="extension__title", lookup_expr='icontains')
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')

    class Meta:
        model = Group
        fields = []

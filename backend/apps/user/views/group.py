from core.utils.rest import ModelPermission, CustomPagination
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Group
from core.utils.permission import action_permission
from ..serializers.group import GroupSerializer
from ..filterset.user import GroupFilterSet

EDIT_FORM_PERMISSION = action_permission('GET', 'auth.change_group')


class ViewSet(viewsets.ModelViewSet):
    permission_classes = [ModelPermission]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = GroupFilterSet
    serializer_class = GroupSerializer
    search_fields = ['name', 'extension__title']

    def get_queryset(self):
        return Group.objects.prefetch_related('extension')

    @action(detail=False, methods=['get'], url_path='permissions')
    def permissions(self, request):
        # Реализация логики
        return Response({}, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
    def edit_form_data(self, request, pk):
        groups_qs = Group.objects.select_related('extension')
        instance = get_object_or_404(groups_qs, pk=pk)
        group = GroupSerializer(instance)
        data = {
            "data": group.data,
        }
        return Response(data, status=status.HTTP_200_OK)

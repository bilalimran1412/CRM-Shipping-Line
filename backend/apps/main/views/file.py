from django.http import FileResponse
from core.utils.rest import ModelPermission, CustomPagination
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

from ..serializers.file import FileSerializer
from ..models import File, OneTimeLink


class ViewSet(viewsets.ModelViewSet):
    permission_classes = [ModelPermission]
    pagination_class = CustomPagination

    queryset = File.objects.all()
    serializer_class = FileSerializer


class DownloadFileView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, token):
        try:
            one_time_link = OneTimeLink.objects.get(token=token, is_active=True)
            one_time_link.is_active = False
            one_time_link.save()
            return FileResponse(one_time_link.file.file)
        except OneTimeLink.DoesNotExist:
            data = {
                'code': 'expired',
                'message': 'Invalid or expired link'
            }
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

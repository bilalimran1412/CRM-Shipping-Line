from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import file

app_name = 'main'

urlpatterns = [
    path('file/download/<uuid:token>/', file.DownloadFileView.as_view(), name='download-file'),
]

router = DefaultRouter()
register = router.register

register('file', file.ViewSet, 'file')

urlpatterns += router.urls

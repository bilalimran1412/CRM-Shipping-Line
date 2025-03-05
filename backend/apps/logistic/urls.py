from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *

app_name = 'logistic'

urlpatterns = [

]

router = DefaultRouter()
register = router.register

register('vehicle', vehicle.ViewSet, 'vehicle')
register('destination', destination.ViewSet, 'destination')
register('shipment-type', shipment_type.ViewSet, 'shipment-type')
register('delivery-status', delivery_status.ViewSet, 'delivery-status')
register('shipment', shipment.ViewSet, 'shipment')
register('shipment-company', shipment_company.ViewSet, 'shipment-company')
register('vehicle-photo-category', vehicle_photo_category.ViewSet, 'vehicle-photo-category')
register('invoice', invoice.ViewSet, 'invoice')

urlpatterns += router.urls

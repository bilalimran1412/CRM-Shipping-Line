from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *

app_name = 'logistic'

urlpatterns = [

]

router = DefaultRouter()
register = router.register

register('customer-invoice', customer_invoice.ViewSet, 'customer-invoice')
register('customer-invoice-detail-template', customer_invoice_detail_template.ViewSet, 'customer-invoice-detail-template')

urlpatterns += router.urls

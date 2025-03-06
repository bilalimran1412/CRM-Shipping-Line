from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Prefetch


class CustomerInvoiceQuerySet(BaseQuerySet):

    def list(self):
        select = [
            'customer',
            'customer__icon',
        ]
        prefetch = [
            'customerinvoiceitem_set',
            'customerinvoicepayment_set',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

    def detail(self):
        select = [
            'customer',
            'customer__icon',
        ]
        prefetch = [
            'customerinvoiceitem_set',
            'customerinvoicepayment_set',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

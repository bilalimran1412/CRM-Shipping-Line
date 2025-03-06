from core.querysets.base_queryset import BaseQuerySet
from django.db.models import Prefetch


class CustomerInvoiceDetailTemplateQuerySet(BaseQuerySet):

    def list(self):
        prefetch = [
            'customerinvoicedetailtemplateitem_set',
        ]
        return self.prefetch_related(*prefetch)

    def detail(self):
        prefetch = [
            'customerinvoicedetailtemplateitem_set',
        ]
        return self.prefetch_related(*prefetch)

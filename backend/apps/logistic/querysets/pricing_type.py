from core.querysets.base_queryset import BaseQuerySet


class PricingTypeQuerySet(BaseQuerySet):
    def list(self):
        return self

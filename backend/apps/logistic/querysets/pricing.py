from core.querysets.base_queryset import BaseQuerySet


class PricingQuerySet(BaseQuerySet):
    def list(self):
        select = [
            'type',
            'file',
        ]
        return self.select_related(*select)

    def detail(self):
        select = [
            'type',
            'file',
        ]
        return self.select_related(*select)

    def edit(self):
        select = [
            'type',
            'file',
        ]
        return self.select_related(*select)

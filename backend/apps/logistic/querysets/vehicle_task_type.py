from core.querysets.base_queryset import BaseQuerySet


class VehicleTaskTypeQuerySet(BaseQuerySet):
    def list(self):
        select = [
            'icon',
        ]
        prefetch = [
            'assigned_to',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

    def detail(self):
        select = [
            'icon',
        ]
        prefetch = [
            'assigned_to',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

    def edit(self):
        select = [
            'icon',
        ]
        prefetch = [
            'assigned_to',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

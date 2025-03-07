from core.querysets.base_queryset import BaseQuerySet


class VehicleTaskQuerySet(BaseQuerySet):
    def list(self):
        select = [
            'vehicle',
            'vehicle__customer',
            'vehicle__destination',
            'task_type',
            'task_type__icon',
        ]
        prefetch = [
            'assigned_to',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

    def detail(self):
        select = [
            'vehicle',
            'vehicle__customer',
            'vehicle__destination',
            'task_type',
            'task_type__icon',
        ]
        prefetch = [
            'assigned_to',
            'task_type__assigned_to',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

    def edit(self):
        select = [
            'vehicle',
            'task_type',
        ]
        prefetch = [
            'assigned_to',
        ]
        return self.select_related(*select).prefetch_related(*prefetch)

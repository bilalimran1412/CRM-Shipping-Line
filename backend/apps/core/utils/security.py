from rest_framework.throttling import SimpleRateThrottle


class AntiPerMinuteThrottle(SimpleRateThrottle):
    def get_cache_key(self, request, view):
        return f'{view.throttle_key}_minute_{self.scope}_{self.get_ident(request)}'

    def get_rate(self):
        return '1/min'


class AntiPerDayThrottle(SimpleRateThrottle):
    def get_cache_key(self, request, view):
        return f'{view.throttle_key}_day_{self.scope}_{self.get_ident(request)}'

    def get_rate(self):
        return '10/day'

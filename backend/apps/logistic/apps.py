from django.apps import AppConfig


class LogisticConfig(AppConfig):
	name = 'logistic'

	def ready(self):
		import logistic.signals.shipment
		import logistic.signals.vehicle

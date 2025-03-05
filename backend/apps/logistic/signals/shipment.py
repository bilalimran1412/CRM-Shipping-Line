from django.db.models.signals import post_save, post_delete, m2m_changed, pre_save
from django.dispatch import receiver
from ..models import ShipmentVehicle, DeliveryHistory, Shipment, Vehicle
from .vehicle import set_status_after_save


# Signal for bulk create
@receiver(post_save, sender=Shipment)
def change_completed_status(sender, instance: Shipment, created, **kwargs):
	if not created:
		is_changed = False
		status = instance.shipment_type.initial_status
		completed_status = instance.shipment_type.complete_status_id
		if instance._datetime != instance.datetime:
			is_changed = True
			DeliveryHistory.objects.filter(shipment=instance, status_id=status).update(
				datetime=instance.datetime)

		if instance._completed != instance.completed or instance._complete_datetime != instance.complete_datetime:
			is_changed = True
			DeliveryHistory.objects.filter(shipment=instance, status_id=completed_status).delete()
			if instance.completed:
				complete_datetime = instance.complete_datetime
				if completed_status:
					vehicles = []
					for vehicle in instance.vehicles.all():
						completed = DeliveryHistory(
							shipment=instance,
							vehicle=vehicle.vehicle,
							status_id=completed_status,
							datetime=complete_datetime,
						)
						vehicles.append(completed)
					DeliveryHistory.objects.bulk_create(vehicles)
		if is_changed:
			for vehicle in instance.vehicles.all():
				set_status_after_save(sender=Vehicle, instance=vehicle.vehicle, created=False, save_status=True)


# Signal for bulk create
@receiver(post_save, sender=ShipmentVehicle)
def after_bulk_create(sender, instance: ShipmentVehicle, created, **kwargs):
	if created:
		created_status = instance.shipment.shipment_type.initial_status_id
		completed_status = instance.shipment.shipment_type.complete_status_id
		datetime = instance.shipment.datetime
		if created_status:
			created_history = DeliveryHistory(
				shipment=instance.shipment,
				vehicle=instance.vehicle,
				status_id=created_status,
				datetime=datetime,
			)
			created_history.save()
		if instance.shipment.completed:
			complete_datetime = instance.shipment.complete_datetime
			if completed_status:
				completed_history = DeliveryHistory(
					shipment=instance.shipment,
					vehicle=instance.vehicle,
					status_id=completed_status,
					datetime=complete_datetime,
				)
				completed_history.save()
		else:
			DeliveryHistory.objects.filter(shipment=instance.shipment, vehicle=instance.vehicle,
			                               status_id=completed_status).delete()
		last_history = instance.vehicle.history.order_by('-datetime').first()
		instance.vehicle.status = last_history
		instance.vehicle.save()


# Signal for bulk delete
@receiver(post_delete, sender=ShipmentVehicle)
def after_bulk_delete(sender, instance: ShipmentVehicle, **kwargs):
	DeliveryHistory.objects.filter(shipment=instance.shipment, vehicle=instance.vehicle).delete()
	print(f"DeliveryHistory of {instance.vehicle} deleted.")
	last_history = instance.vehicle.history.order_by('-datetime').first()
	instance.vehicle.status = last_history
	instance.vehicle.save()

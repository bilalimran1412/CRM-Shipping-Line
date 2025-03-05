from django.db.models.signals import post_save, post_delete, m2m_changed, pre_save
from django.dispatch import receiver
from ..models import Vehicle


@receiver(pre_save, sender=Vehicle)
def set_status_after_save(sender, instance: Vehicle, **kwargs):
	if kwargs.get('save_status', None):
		last_history = instance.history.order_by('-datetime').first()
		instance.status = last_history
		instance.save()

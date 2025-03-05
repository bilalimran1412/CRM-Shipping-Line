from modeltranslation.translator import register, TranslationOptions

from .models import ShipmentType, DeliveryStatus, DeliveryDestination, VehiclePhotoCategory


@register(ShipmentType)
class ShipmentTypeTranslationOptions(TranslationOptions):
	fields = ('name',)


@register(DeliveryStatus)
class DeliveryStatusTranslationOptions(TranslationOptions):
	fields = ('name',)


@register(DeliveryDestination)
class DeliveryDestinationTranslationOptions(TranslationOptions):
	fields = ('country', 'city')


@register(VehiclePhotoCategory)
class VehiclePhotoCategoryTranslationOptions(TranslationOptions):
	fields = ('name',)

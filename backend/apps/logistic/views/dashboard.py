from user.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Count, Q, Sum
from ..models import Vehicle, DeliveryStatus, DeliveryDestination
from main.models import AppConfig, Currency
from finance.models import CustomerInvoice
from core.utils.rest import ModelPermission


class ViewSet(viewsets.ViewSet):

    def list(self, request):
        # Get primary currency (first currency in the system)
        primary_currency_obj = Currency.objects.first()
        primary_currency = {
            "id": primary_currency_obj.id if primary_currency_obj else None,
            "name": primary_currency_obj.name if primary_currency_obj else None,
            "code": primary_currency_obj.code if primary_currency_obj else None,
            "icon": {
                "id": primary_currency_obj.icon.id,
                "file": primary_currency_obj.icon.file.url if primary_currency_obj.icon and primary_currency_obj.icon.file else None,
                "name": primary_currency_obj.icon.file.name if primary_currency_obj.icon and primary_currency_obj.icon.file else None,
                "type": primary_currency_obj.icon.type if primary_currency_obj.icon else None,
                "thumb": primary_currency_obj.icon.thumb.url if primary_currency_obj.icon and primary_currency_obj.icon.thumb else None,
                "file_size": primary_currency_obj.icon.file.size if primary_currency_obj.icon and primary_currency_obj.icon.file else None
            } if primary_currency_obj and primary_currency_obj.icon else None
        } if primary_currency_obj else None

        # Get statuses with vehicle count
        statuses = DeliveryStatus.objects.annotate(
            vehicle_count=Count('deliveryhistory__vehicle', distinct=True)
        )
        statuses_data = [{
            "id": status.id,
            "name": {
                "en": status.name,
                "ru": status.name  # Add translation logic if needed
            },
            "icon": None,  # Add icon logic if needed
            "vehicle_count": status.vehicle_count
        } for status in statuses]

        # Get users by vehicles count
        customers = User.objects.filter(vehicle__isnull=False).distinct().annotate(
            total=Count('vehicle'),
            delivered=Count('vehicle', filter=Q(vehicle__status__status__status_type='complete')),
            not_delivered=Count('vehicle', filter=Q(vehicle__status__status__status_type='complete'))
        )
        
        customers_data = [{
            "id": customer.id,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "full_name": customer.full_name,
            "total": customer.total,
            "delivered": customer.delivered,
            "not_delivered": customer.not_delivered
        } for customer in customers]

        # Get unassigned vehicles count
        unassigned_vehicles = {
            "total": Vehicle.objects.filter(customer__isnull=True).count(),
            "delivered": Vehicle.objects.filter(customer__isnull=True, status__status__status_type='complete').count(),
            "not_delivered": Vehicle.objects.filter(customer__isnull=True, status__status__status_type='complete').count()
        }

        # Get user finances
        user_finances = User.objects.annotate(
            total_unpaid_invoice_amount=Sum('customerinvoice__total_amount_in_default',
                                          filter=Q(customerinvoice__status='unpaid')),
            total_paid_invoice_amount=Sum('customerinvoice__total_paid_in_default')
        ).filter(Q(total_unpaid_invoice_amount__gt=0) | Q(total_paid_invoice_amount__gt=0))

        finances_data = [{
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": user.full_name,
            "total_unpaid_invoice_amount": str(user.total_unpaid_invoice_amount or 0),
            "total_paid_invoice_amount": str(user.total_paid_invoice_amount or 0),
            "balance": str((user.total_unpaid_invoice_amount or 0) - (user.total_paid_invoice_amount or 0))
        } for user in user_finances]

        # Get vehicles by destination
        destinations = DeliveryDestination.objects.annotate(
            total=Count('vehicle'),
            delivered=Count('vehicle', filter=Q(vehicle__status__status__status_type='complete')),
            not_delivered=Count('vehicle', filter=Q(vehicle__status__status__status_type='complete'))
        )

        destinations_data = [{
            "id": dest.id,
            "country": {
                "en": dest.country,
                "ru": dest.country  # Add translation logic if needed
            },
            "city": {
                "en": dest.city,
                "ru": dest.city  # Add translation logic if needed
            },
            "icon": {
                "id": dest.icon.id,
                "file": dest.icon.file.url if dest.icon and dest.icon.file else None,
                "name": dest.icon.file.name if dest.icon and dest.icon.file else None,
                "type": dest.icon.type if dest.icon else None,
                "thumb": dest.icon.thumb.url if dest.icon and dest.icon.thumb else None,
                "file_size": dest.icon.file.size if dest.icon and dest.icon.file else None
            } if dest.icon else None,
            "total": dest.total,
            "delivered": dest.delivered,
            "not_delivered": dest.not_delivered
        } for dest in destinations]

        # Calculate additional totals
        total_vehicles = Vehicle.objects.count()
        total_shipments = Vehicle.objects.exclude(status__isnull=True).count()
        total_customers = User.objects.filter(vehicle__isnull=False).distinct().count()

        # Compile response
        response_data = {
            "message": "Welcome to the dashboard!",
            "user": request.user.username,
            "is_customer": not request.user.is_staff,
            "primary_currency": primary_currency,
            "total_vehicles": total_vehicles,
            "total_shipments": total_shipments,
            "total_customers": total_customers,
            "statuses_with_vehicle_count": {
                "statuses": statuses_data,
                "empty_status": 0
            },
            "users_by_vehicles_count": {
                "customers": customers_data,
                "unassociated_vehicles": unassigned_vehicles
            },
            "user_finances": finances_data,
            "vehicles_by_destination": {
                "destinations": destinations_data,
                "unassociated_vehicles": {
                    "total": Vehicle.objects.filter(destination__isnull=True).count(),
                    "delivered": Vehicle.objects.filter(destination__isnull=True, 
                                                     status__status__status_type='complete').count(),
                    "not_delivered": Vehicle.objects.filter(destination__isnull=True, 
                                                         status__status__status_type='complete').count()
                }
            }
        }

        return Response(response_data)


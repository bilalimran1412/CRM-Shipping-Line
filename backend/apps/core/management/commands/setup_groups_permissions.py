from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from user.models import GroupExtension

class Command(BaseCommand):
    help = 'Create default groups and assign permissions'

    def handle(self, *args, **options):
        # Define group permissions and titles
        group_permissions = {
            'Customer': {
                'title': 'Customer',
                'permissions': [
                    "logistic.view_pricing",
                    "logistic.view_vehicle",
                    "finance.view_my_invoices",
                    "logistic.view_dashboard",
                    "finance.generate_customer_invoice"
                ]
            },
            'Iran': {
                'title': 'Iran',
                'permissions': [
                    "logistic.view_dashboard",
                    "logistic.view_all_customer_vehicles",
                    "logistic.view_vehicle"
                ]
            },
            'Employee': {
                'title': 'Employee',
                'permissions': [
                    "finance.view_customerinvoicedetailtemplate",
                    "user.add_user",
                    "logistic.view_invoice",
                    "logistic.delete_invoice",
                    "finance.change_customerinvoicedetailtemplate",
                    "logistic.view_my_tasks",
                    "logistic.view_all_customer_vehicles",
                    "logistic.view_vehicle",
                    "logistic.view_dashboard",
                    "finance.change_customerinvoice",
                    "finance.generate_customer_invoice",
                    "user.delete_user",
                    "logistic.change_invoice",
                    "finance.view_customerinvoice",
                    "logistic.view_shipment",
                    "logistic.add_shipment",
                    "logistic.add_vehicletask",
                    "logistic.change_pricing",
                    "finance.delete_customerinvoice",
                    "logistic.view_pricing",
                    "logistic.delete_vehicletask",
                    "main.add_file",
                    "logistic.change_vehicle",
                    "user.change_user",
                    "logistic.delete_vehicle",
                    "logistic.add_invoice",
                    "logistic.add_pricing",
                    "logistic.change_shipment",
                    "logistic.change_vehicletask",
                    "finance.delete_customerinvoicedetailtemplate",
                    "logistic.delete_pricing",
                    "logistic.add_vehicle",
                    "finance.add_customerinvoicedetailtemplate",
                    "logistic.delete_shipment",
                    "user.view_user",
                    "finance.add_customerinvoice",
                    "user.change_profile",
                    "logistic.view_vehicletask"
                ]
            }
        }

        for group_name, group_data in group_permissions.items():
            # Create or get group
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(f'Created group "{group_name}"')
            else:
                self.stdout.write(f'Group "{group_name}" already exists')

            # Create or update GroupExtension
            group_extension, _ = GroupExtension.objects.get_or_create(
                group=group,
                defaults={'title': group_data['title']}
            )
            if not _:
                group_extension.title = group_data['title']
                group_extension.save()
            self.stdout.write(f'Set title "{group_data["title"]}" for group "{group_name}"')

            # Get permission objects
            permission_objects = []
            for perm in group_data['permissions']:
                app_label, codename = perm.split('.')
                try:
                    permission = Permission.objects.get(
                        codename=codename,
                        content_type__app_label=app_label,
                    )
                    permission_objects.append(permission)
                except Permission.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Permission "{perm}" does not exist'
                        )
                    )

            # Assign permissions to group
            group.permissions.set(permission_objects)
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully assigned permissions to group "{group_name}"'
                )
            )

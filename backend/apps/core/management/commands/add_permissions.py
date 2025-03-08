from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = "Add custom global permissions"

    def handle(self, *args, **kwargs):
        logistic_content_type, created = ContentType.objects.get_or_create(
            app_label="logistic", model="logistic_permissions"
        )

        permissions = [
            ("view_dashboard_own_data", "Can view own dashboard data"),
            ("view_dashboard", "Can view dashboard"),
        ]

        for codename, name in permissions:
            Permission.objects.get_or_create(
                codename=codename,
                name=name,
                content_type=logistic_content_type
            )

        self.stdout.write(self.style.SUCCESS("Successfully added custom permissions!"))

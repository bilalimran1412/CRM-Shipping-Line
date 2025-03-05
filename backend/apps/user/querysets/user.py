from django.contrib.auth import models
from django.db.models import Q
from django.utils.translation import gettext as _
from core.utils.helpers import integers_only


class UsersManager(models.UserManager):

    def list(self):
        select_related = ['avatar']
        prefetch_related = ['groups', 'groups__extension']
        query = self.select_related(*select_related).prefetch_related(*prefetch_related)
        return query.order_by('-id')

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError(_('The username must be set'))
        email = None if not email else self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(username, email, password, **extra_fields)

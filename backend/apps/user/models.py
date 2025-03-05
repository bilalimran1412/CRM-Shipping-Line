import binascii
import os
import random
from datetime import timedelta

from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext as _

from core.models import BaseModel
from core.utils.files import file_path
from user.querysets.user import UsersManager


class User(AbstractUser):
	phone = models.CharField(max_length=20, null=True, blank=True, verbose_name=_('Номер телефона'))
	avatar = models.ForeignKey('main.File', on_delete=models.PROTECT, null=True, blank=True)
	email = models.EmailField(null=True, blank=True, unique=True)
	address = models.CharField(max_length=255, null=True, blank=True)
	full_name = models.CharField(max_length=300, default='', blank=True)

	objects = UsersManager()

	def save(self, *args, **kwargs):
		self.full_name = f"{self.first_name}"
		if self.last_name:
			self.full_name = f"{self.full_name} {self.last_name}"
		instance = super().save(*args, **kwargs)
		return instance

	class Meta(AbstractUser.Meta):
		app_label = 'user'
		permissions = (
			("change_profile", "Can change profile"),
		)


class GroupExtension(models.Model):
	group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='extension')
	title = models.CharField(max_length=100)

	def __str__(self):
		return self.title


class Token(BaseModel):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='token')
	user_agent = models.CharField(max_length=255)
	ip_address = models.CharField(max_length=255)
	access_jti = models.CharField(max_length=255)
	refresh_jti = models.CharField(max_length=255)
	active = models.BooleanField(default=True)


class TokenLog(BaseModel):
	token = models.ForeignKey(Token, on_delete=models.CASCADE)
	log = models.JSONField(default=list)

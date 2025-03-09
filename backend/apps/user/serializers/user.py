from rest_framework import serializers
from ..models import User
from .group import GroupDetailSerializer
from main.serializers.file import FileSerializer
from core.utils.serializers import BaseModelSerializer
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions


class UserSerializer(BaseModelSerializer):
	username = serializers.CharField(required=True)
	first_name = serializers.CharField(required=True)
	password = serializers.CharField(write_only=True, required=True)

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

		if self.instance:
			self.fields['password'].allow_blank = True
			self.fields['password'].allow_null = True
			self.fields['password'].required = False

	def create(self, validated_data):
		password = validated_data.pop('password')
		groups = validated_data.pop('groups', [])
		
		instance = super().create(validated_data)
		
		# Set password
		instance.set_password(password)
		# Add groups
		if groups:
			instance.groups.set(groups)
		
		instance.save()
		return instance

	def update(self, instance, validated_data):
		print(validated_data)
		password = validated_data.pop('password', None)
		groups = validated_data.pop('groups', None)
		
		instance = super().update(instance, validated_data)
		
		if password:
			instance.set_password(password)
		
		if groups is not None:
			instance.user_permissions.clear()
			instance.groups.set(groups)
		
		instance.save()
		return instance

	def to_representation(self, instance):
		if not self.context.get('detail', None):
			self.fields['groups'] = GroupDetailSerializer(many=True)
		self.fields['avatar'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = User
		fields = (
			'id', 'username', 'first_name', 'last_name', 'full_name', 'email', 'phone', 'avatar', 'password',
			'is_staff', 'is_active',
			'is_superuser', 'groups')


class ProfileSerializer(BaseModelSerializer):
	username = serializers.CharField(read_only=True)
	first_name = serializers.CharField(required=True)

	def to_representation(self, instance):
		self.fields['avatar'] = FileSerializer()
		return super().to_representation(instance)

	class Meta:
		model = User
		fields = (
			'id', 'username', 'first_name', 'last_name', 'full_name', 'email', 'phone', 'avatar',
		)


class ChangePasswordSerializer(BaseModelSerializer):
	old_password = serializers.CharField(write_only=True)
	new_password = serializers.CharField(write_only=True)
	confirm_password = serializers.CharField(write_only=True)

	def validate_new_password(self, value):
		try:
			validate_password(password=value, user=self.instance)
		except exceptions.ValidationError as e:
			raise serializers.ValidationError(e.error_list)
		return value

	def validate_old_password(self, value):
		if not self.instance.check_password(value):
			raise serializers.ValidationError('Current password is wrong', 'wrong_password')
		return value

	def update(self, instance, validated_data):
		if validated_data['new_password'] != validated_data['confirm_password']:
			raise serializers.ValidationError({'passwords': 'not_matching'}, 'not_matching')

		if validated_data['new_password'] == validated_data['confirm_password'] and instance.check_password(
				validated_data['old_password']):
			instance.set_password(validated_data['new_password'])
			instance.save()
			return instance
		return instance

	class Meta:
		model = User
		fields = ['old_password', 'new_password', 'confirm_password']

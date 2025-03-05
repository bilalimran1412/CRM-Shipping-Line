from django.contrib.auth import authenticate
from rest_framework import serializers
from django.core import exceptions
from django.contrib.auth.password_validation import validate_password
from ..models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("Incorrect credentials", "incorrect_credentials")


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email alreay exists", 'unique')
        return value

    def validate_password(self, value):
        try:
            validate_password(password=value)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError(e.error_list)
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('User with this username already exist', 'unique')
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['password'],
            validated_data.get('email', None),
            first_name=validated_data['first_name'],
            last_name=validated_data.get('last_name', None),
            phone=validated_data.get('phone', None),
            is_active=True
        )
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password', 'phone')

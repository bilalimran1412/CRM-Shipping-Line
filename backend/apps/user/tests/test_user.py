import json

from core.tests.base_test import BaseTestCase
from rest_framework import status
from django.urls import reverse
from ..models import User


class UserTest(BaseTestCase):
    fixtures = ('users',)

    def setUp(self):
        self.username = "admin"
        self.password = "admin"
        self.auth_payload = {
            "username": self.username,
            "password": self.password,
        }
        self.create_payload = {
            "username": 'test_user',
            "password": 'Password@123#',
            "first_name": 'Test',
            "last_name": 'User',
            "email": 'test@mail.com',
            "phone": '+998931234567',
        }
        self.client.defaults['HTTP_USER_AGENT'] = 'Mozilla/5.0'

    def test_1_user_exist(self):
        self.assertEqual(User.objects.count(), 1)

    def test_2_login_user(self):
        url = reverse('user:login')
        response = self.client.post(url, self.auth_payload, format='json')
        tokens = json.loads(response.content)
        self.token = tokens['access']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_3_register_user(self):
        url = reverse('user:register')
        response = self.client.post(url, self.create_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_4_create_user_api(self):
        url = reverse('user:login')
        response = self.client.post(url, self.auth_payload, format='json')
        tokens = json.loads(response.content)
        self.token = tokens['access']

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        url = reverse('user:list')
        response = self.client.post(url, self.create_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_5_account_user_api(self):
        url = reverse('user:login')
        response = self.client.post(url, self.auth_payload, format='json')
        tokens = json.loads(response.content)
        self.token = tokens['access']

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        url = reverse('user:account')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

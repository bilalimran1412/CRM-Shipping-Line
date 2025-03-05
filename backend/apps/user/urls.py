from rest_framework.routers import DefaultRouter
import os
from django.urls import path
from .views import user, auth, group

app_name = 'user'

urlpatterns = [
    path('login/', auth.LoginAPI.as_view(), name='user-login'),
    path('register/', auth.RegisterAPI.as_view(), name='user-register'),
    path('account/', auth.AccountAPI.as_view(), name='user-account'),
]

router = DefaultRouter()
register = router.register

register('user', user.ViewSet, 'user')
register('group', group.ViewSet, 'group')

urlpatterns += router.urls

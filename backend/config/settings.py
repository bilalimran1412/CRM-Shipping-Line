"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import os
import sys
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-lao*rjj6b3&h#9nac#!3-#2ejep4a=ja0!nt11j!=!jmakxa84'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', False)

USE_HTTPS = False

ALLOWED_HOSTS = ['*']

TESTING = ('test' == sys.argv[1]) if sys.argv else False

# Append module dir
sys.path.append(os.path.join(BASE_DIR, 'apps'))

# Application definition

INSTALLED_APPS = [
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',

	'simple_history',
	'rest_framework',
	'debug_toolbar',
	'django_filters',
	'corsheaders',
	'django_celery_beat',
	'django_celery_results',
	'modeltranslation',

	'core',
	'user',
	'main',
	'logistic',
	'finance',

]

LANGUAGES = (
	('en', 'English'),
	('ru', 'Русский'),
)
MODELTRANSLATION_LANGUAGES = ('en', 'ru')

MODELTRANSLATION_DEFAULT_LANGUAGE = 'ru'

MODELTRANSLATION_FALLBACK_LANGUAGES = ('ru', 'en')

MODELTRANSLATION_TRANSLATION_FILES = (
	'logistic.translation',
)

MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',

	'simple_history.middleware.HistoryRequestMiddleware',
	'corsheaders.middleware.CorsMiddleware',
	'django.middleware.locale.LocaleMiddleware',
	'debug_toolbar.middleware.DebugToolbarMiddleware',
]

CORS_ORIGIN_WHITELIST = (
	'http://127.0.0.1',
	'http://localhost:3000',
)

INTERNAL_IPS = [
	"127.0.0.1",
]
ROOT_URLCONF = 'config.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.sqlite3',
		'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
	}
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

AUTH_USER_MODEL = 'user.User'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'files/static')
MEDIA_URL = '/files/uploads/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'files/uploads')

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.mail.ru')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', True)
EMAIL_PORT = os.environ.get('EMAIL_PORT', 2525)
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
SERVER_EMAIL = EMAIL_HOST_USER
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# DJANGO REST FRAMEWORK
REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework_simplejwt.authentication.JWTAuthentication',
		# 'apps.user.authentication.CustomJWTAuthentication',
		# 'user.utils.authentication.CustomTokenAuthentication',
		'rest_framework.authentication.SessionAuthentication',
	),
	'DEFAULT_FILTER_BACKENDS': (
		'django_filters.rest_framework.DjangoFilterBackend',
	),
	'EXCEPTION_HANDLER': 'core.utils.rest.custom_exception_handler',
	'DEFAULT_RENDERER_CLASSES': (
		'rest_framework.renderers.JSONRenderer',
		"core.utils.rest.CustomBrowsableAPIRenderer",
		# 'rest_framework.renderers.BrowsableAPIRenderer',  # disable on production
	),
	'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
	'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
	'PAGE_SIZE': 15,
}

SIMPLE_JWT = {
	# 'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
	# 'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
	'ACCESS_TOKEN_LIFETIME': timedelta(days=30),
	'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
	'ROTATE_REFRESH_TOKENS': False,
	'BLACKLIST_AFTER_ROTATION': True,
	'UPDATE_LAST_LOGIN': False,

	'ALGORITHM': 'HS256',
	'SIGNING_KEY': SECRET_KEY,
	'VERIFYING_KEY': None,
	'AUDIENCE': None,
	'ISSUER': None,

	'AUTH_HEADER_TYPES': ('Bearer', 'Basic', 'JWT'),
	'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
	'USER_ID_FIELD': 'id',
	'USER_ID_CLAIM': 'user_id',

	'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
	'TOKEN_TYPE_CLAIM': 'token_type',

	'JTI_CLAIM': 'jti',

	'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
	'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
	'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

FRONTEND_DOMAIN = os.environ.get('FRONTEND_DOMAIN', '')
BACKEND_DOMAIN = os.environ.get('BACKEND_DOMAIN', '')

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

DEBUG_TOOLBAR_CONFIG = {
	'IS_RUNNING_TESTS': False,
	'SHOW_TOOLBAR_CALLBACK': lambda r: True,
}

try:
	from .settings_dev import *
except ImportError:
	pass

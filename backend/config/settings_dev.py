DEBUG = True

USE_HTTPS = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'aslshipping',  # Replace with your database name
        'USER': 'postgres',  # Replace with your database user
        'PASSWORD': 'success@@2022',  # Replace with your database password
        'HOST': 'localhost',  # Set to your database host
        'PORT': 5432,
    }
}

APP_HOST = 'http://127.0.0.1:8000'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'bepul3055@gmail.com'
EMAIL_HOST_PASSWORD = 'allmovies'
SERVER_EMAIL = EMAIL_HOST_USER
CORS_ORIGIN_ALLOW_ALL = True

CELERY_BROKER_URL = 'amqp://myuser:mypassword@localhost:5672/myvhost'  # Используйте ваш брокер сообщений, например, Redis или RabbitMQ
CELERY_RESULT_BACKEND = 'django-db'
CELERY_CACHE_BACKEND = 'django-cache'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

CELERY_RESULT_EXTENDED = True

CELERY_TASK_DEFAULT_QUEUE = 'main'
CELERY_TASK_QUEUES = {
    'main': {
        'exchange': 'main',
        'routing_key': 'main',
    },
    'high_priority': {
        'exchange': 'multithread',
        'routing_key': 'multithread',
    },
}

CELERY_TASK_ROUTES = {
    'ceir.tasks.send_message': {'queue': 'multithread'},
    # 'app.tasks.default_task': {'queue': 'main'},
}

CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

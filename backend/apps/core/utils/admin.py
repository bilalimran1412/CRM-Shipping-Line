from django.contrib import admin
from django.db.models.base import ModelBase


def init_app_models_admin(models, custom_admin=None, model_blacklist=None):
    if model_blacklist is None:
        model_blacklist = []
    model_blacklist.append('BaseModel')
    if custom_admin is None:
        custom_admin = {}
    for model_name in dir(models):
        model = getattr(models, model_name)
        if isinstance(model, ModelBase):
            if model_name in model_blacklist:
                continue
            if hasattr(custom_admin, f'{model_name}Admin'):
                admin.site.register(model, getattr(custom_admin, f'{model_name}Admin'))
            else:
                admin.site.register(model)

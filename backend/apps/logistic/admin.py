from core.utils.admin import init_app_models_admin
from . import models

blacklist = []
init_app_models_admin(models, model_blacklist=blacklist)

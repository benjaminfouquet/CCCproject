from django.apps import AppConfig


class RestApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Rest_api'
    def ready(self):
        from dataUpdate import update
        update.start()
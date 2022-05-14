from django.contrib import admin

# Register your models here.
#from django.contrib import admin
from .models import heat_map, example_output, database_update_time, mainsuburb
admin.site.register(heat_map)
admin.site.register(database_update_time)
admin.site.register(example_output)
admin.site.register(mainsuburb)
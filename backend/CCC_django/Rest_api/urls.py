# Rest_api/urls.py
from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'heatmap', views.HeatMapViewSet)
router.register(r'exampleoutput', views.ExampleOutputViewSet)
router.register(r'exampleagg', views.ExampleAggViewSet)
router.register(r'aggmap', views.AggMapViewSet)
router.register(r'mainsuburb',views.MainSuburbViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
# serializers.py
from rest_framework import serializers

from .models import heat_map, example_output, example_agg,aggmap_new,mainsuburb

class sentiment_serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = heat_map
        fields = ('id', 'pos_sentiment','tweet_time')


class example_serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = example_output
        fields = '__all__'


class example_agg_serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = example_agg
        fields = '__all__'

class agg_map_serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = aggmap_new
        fields = ('display_order','crime_rate','sent_score','fav_food','no_offensive','region_full')

class main_suburb_serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = mainsuburb
        fields = '__all__'
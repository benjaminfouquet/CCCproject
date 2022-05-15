import re

from django.shortcuts import render
from rest_framework import viewsets
from dataUpdate import updateAPI
from .serializers import sentiment_serializer,example_serializer, example_agg_serializer,agg_map_serializer, main_suburb_serializer
from .models import heat_map,example_output,database_update_time,example_agg,aggmap_new,mainsuburb


class HeatMapViewSet(viewsets.ModelViewSet):
    queryset = heat_map.objects.all().order_by('id')
    serializer_class = sentiment_serializer


class ExampleOutputViewSet(viewsets.ModelViewSet):
    """
    import pandas as pd
    import os
    import re
    import datetime
    import random
    print(1)
    db_update_info = database_update_time.objects.get(db_name = 'example_output')

    time_update = db_update_info.update_time

    print(time_update)
    file_dir = 'Data_tools/results'
    file_list = os.listdir(file_dir)
    find_date = re.compile(r'(?<=sentiment_output_).*')
    update_flag = 0
    file_name = ''
    region_list = ['Melbourne','Carlton','Richmond','Docklands','North Melbourne']
    for file in file_list:
        #print(file)
        if find_date.search(file):
            file_name = file
            #print(file_name)
            last_update = find_date.search(file).group(0).strip('.csv')
            last_update = datetime.datetime.strptime(last_update,'%Y-%m-%d').date()
            if time_update < last_update:
                update_flag = 1
                print('here')
    now = datetime.datetime.now()
    if update_flag == 1:
        tmp_data = pd.read_csv(file_dir +'/' +file_name)
        example_output.objects.all().delete()
        # ensure fields are correctly
        # concatenate name and Product_id to make a new field a la Dr.Dee's answer
        example_bulk_add = []
        i = 0
        for _, row in tmp_data.iterrows():
            i+=1
            if i== 50:
                break
            tmp = example_output(
                id = row['id'],
                #longitude = row['coordinates'],
                longitude = 1,
                latitude = 1,
                language = row['lang'],
                pos_sentiment = row['pos'],
                neg_sentiment = row['neg'],
                neu_sentiment = row['neu'],
                compound_sentiment = row['compound'],
                #tweet_time = now,
                tweet_time = datetime.datetime.now() + datetime.timedelta(days= random.randint(-10,0),hours=random.randint(-12,12)),
                region_full = random.choice(region_list)
            )
            example_bulk_add.append(tmp)
        example_output.objects.bulk_create(example_bulk_add, ignore_conflicts=True)
        today = datetime.date.today()
        database_update_time.objects.filter(db_name='example_output').update(update_time = today)
    """
    queryset = example_output.objects.all().order_by('id')

    #queryset = example_output.objects.filter('tweet_time' > 1).order_by('id')
    serializer_class = example_serializer



class ExampleAggViewSet(viewsets.ModelViewSet):

    queryset = example_agg.objects.all().order_by('region_code')

    serializer_class = example_agg_serializer



class AggMapViewSet(viewsets.ModelViewSet):

    updateAPI.update_aggmap()
    queryset = aggmap_new.objects.all().order_by('display_order')

    serializer_class = agg_map_serializer


class MainSuburbViewSet(viewsets.ModelViewSet):
    updateAPI.update_mainsuburb()
    queryset = mainsuburb.objects.all().order_by('region_full')
    serializer_class = main_suburb_serializer
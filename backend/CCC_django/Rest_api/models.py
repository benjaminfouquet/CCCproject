from django.db import models

# Create your models here.
class heat_map(models.Model):
    id = models.CharField(primary_key=True, max_length=250)
    pos_sentiment = models.FloatField()
    neg_sentiment = models.FloatField()
    neu_sentiment = models.FloatField()
    compound_sentiment = models.FloatField()
    tweet_time = models.DateTimeField()

    def __str__(self):
        return self.id

    class Meta:
        db_table = 'heat_map'

class example_output(models.Model):
    id = models.CharField(primary_key=True, max_length=250)
    longitude = models.FloatField()
    latitude = models.FloatField()
    language = models.CharField(max_length=8)
    pos_sentiment = models.FloatField()
    neg_sentiment = models.FloatField()
    neu_sentiment = models.FloatField()
    compound_sentiment = models.FloatField()
    tweet_time = models.DateTimeField()
    region_full = models.CharField(max_length=250)
    def __str__(self):
        return self.id

    class Meta:
        db_table = 'example_output'


class example_agg(models.Model):
    region_code = models.AutoField(primary_key=True)
    #region_name = models.CharField(max_length=100)
#    longitude = models.FloatField()
#    latitude = models.FloatField()
#    language = models.CharField(max_length=8)
#    pos_sentiment = models.FloatField()
#    neg_sentiment = models.FloatField()
#    neu_sentiment = models.FloatField()
#    compound_sentiment = models.FloatField()
    no_offensive = models.IntegerField()
    region_full = models.CharField(max_length=250)
    def __str__(self):
        return self.id

    class Meta:
        db_table = 'example_agg'

class aggmap(models.Model):
    region_code = models.AutoField(primary_key=True)
    #display_order = models.IntegerField(primary_key=True)
    #region_name = models.CharField(max_length=100)
    crime_rate = models.FloatField()
    sent_score = models.FloatField()
    no_offensive = models.IntegerField()
    region_full = models.CharField(max_length=250)
    def __str__(self):
        return self.id

    class Meta:
        db_table = 'aggmap'

class aggmap_new(models.Model):
    #region_code = models.AutoField()
    display_order = models.IntegerField(primary_key=True)
    #region_name = models.CharField(max_length=100)
    crime_rate = models.FloatField()
    sent_score = models.FloatField()
    no_offensive = models.IntegerField()
    region_full = models.CharField(max_length=250)
    fav_food = models.CharField(max_length=250,null=True)
    def __str__(self):
        return self.id

    class Meta:
        db_table = 'aggmap_new'


class mainsuburb(models.Model):
    region_code = models.AutoField(primary_key=True)
    #region_name = models.CharField(max_length=100)
    crime_rate = models.FloatField()
    sent_score = models.FloatField()
    total_tweet = models.IntegerField()
    no_offensive = models.IntegerField()
    region_full = models.CharField(max_length=250)
    #offensive_by_hour = models
    offensive_by_hour = models.JSONField()
    word_freq = models.JSONField()
    word_freq_neg = models.JSONField()
    def __str__(self):
        return self.id

    class Meta:
        db_table = 'main_suburb'


class database_update_time(models.Model):
    db_name = models.CharField(primary_key=True, max_length=100)
    update_time = models.DateField()

    def __str__(self):
        return self.db_name

    class Meta:
        db_table = 'update_time'


import couchdb
import pandas as pd
import math
import datetime
import operator
import json
from collections import Counter



couch = couchdb.Server('http://admin:admin@172.26.134.93:5984/')
#db1 = couch['final_db']

db1 = couch['historical_with_cor']
main_list = ['CARLTON', 'DOCKLANDS', 'EAST MELBOURNE', 'KENSINGTON', 'FLEMINGTON', 'PARKVILLE', 'PORT MELBOURNE',
                 'SOUTHBANK',
                 'MELBOURNE', 'SOUTH MELBOURNE', 'SOUTH YARRA', 'WEST MELBOURNE', 'NORTH MELBOURNE', 'CARLTON NORTH']


def reform(dict):
    output_dict = []
    for (key, value) in dict:
        output_dict.append({"text": key, "value": value})
    return output_dict

# get offensive word dict
offensive_counter_suburb = {}
for item in db1.view('data_reduce/offensive_freq_by_suburb', group=True, group_level=2):
    suburb = item.key[0]
    word = item.key[1]
    count = item.value
    if not suburb in main_list:
        continue
    if word == 'off':
        continue
    if not suburb in offensive_counter_suburb.keys():
        offensive_counter_suburb[suburb] = {}
    offensive_counter_suburb[suburb][word] = count

offensive_output_dic = {}
for suburb, counter in offensive_counter_suburb.items():
    sub_output_dict = {}
    for k, v in counter.items():
        if (not (k.isdigit())) and (len(k) > 2):
            sub_output_dict[k] = v
    suburb_count = Counter(sub_output_dict)
    suburb_count = suburb_count.most_common(50)
    offensive_output_dic[suburb] = reform(suburb_count)

# get word freq grouped by sentiments

tweet_count_by_suburb = {}
for item in db1.view('data_reduce/suburb_tweet_count', group=True, group_level=1):
    suburb = item.key
    count = item.value
    tweet_count_by_suburb[suburb] = count
filter_word = ['cuisine', 'order', 'chef', 'dining', 'give', 'foodie', 'foody', 'gourmet', 'restaurant',
               'ant', 'ate', 'charity', 'devil', 'ethnic', 'give', 'gram', 'mask', 'quality']
# get food data
db2 = couch['historical_with_cor']
food_counter_sub = {}


def check(dict):
    new_dict = {}
    for key, value in dict.items():
        if not key in filter_word:
            new_dict[key] = value
    return new_dict


for item in db2.view('data_reduce/has_food', group=True, group_level=2):
    suburb = item.key[0]
    food_dict = item.key[1]
    times = item.value
    if not suburb in food_counter_sub.keys():
        food_counter_sub[suburb] = {}
    for country, word in food_dict.items():
        if not country in food_counter_sub[suburb].keys():
            food_counter_sub[suburb][country] = 0
        word = check(word)
        food_counter_sub[suburb][country] = food_counter_sub[suburb][country] + times * sum(word.values())
from collections import defaultdict

most_popular = defaultdict(str)
for suburb, dict in food_counter_sub.items():
    most_popular[suburb] = max(dict, key=dict.get)
a = most_popular['sb']

print(most_popular)

"""
# get no suburb
all_counter = {}
neg_counter = {}
for item in db1.view('data_reduce/word_freq_by_sub', group=True, group_level=2):
    word = item.key[0]
    sent = item.key[1]
    count = item.value
    if sent == 'neg':
        neg_counter[word]=count
    elif sent == 'all':
        all_counter[word]=count
all_output_dic = {}
for k, v in all_counter.items():
    if v > 5 and (not (k.isdigit())) and (len(k) > 3):
        all_output_dic[k] = v

neg_output_dic = {}
for k, v in neg_counter.items():
    if v > 5 and (not (k.isdigit())) and (len(k) > 3):
        neg_output_dic[k] = v

all_word_freq = dict(sorted(all_output_dic.items(), key=operator.itemgetter(1), reverse=True))
neg_word_freq = dict(sorted(neg_output_dic.items(), key=operator.itemgetter(1), reverse=True))

total_20 = list(all_word_freq.items())[:20]
neg_20 = list(neg_word_freq.items())[:20]
def reform(dict):
    output_dict = []
    for (key,value) in dict:
        output_dict.append({"text":key,"value":value})
    return output_dict

total_20 = reform(total_20)
neg_20 = reform(neg_20)

"""


# get_sub
all_counter_sub = {}
neg_counter_sub = {}

def reform(dict):
    output_dict = []
    for (key,value) in dict:
        output_dict.append({"text":key,"value":value})
    return output_dict

for item in db1.view('data_reduce/word_freq_by_sub', group=True, group_level=3):
    word = item.key[0]
    sent = item.key[1]
    suburb = item.key[2]
    if not suburb in main_list:
        continue
    if not suburb in all_counter_sub.keys():
        all_counter_sub[suburb] = {}
    if not suburb in neg_counter_sub.keys():
        neg_counter_sub[suburb] = {}

    count = item.value
    if sent == 'neg':
        neg_counter_sub[suburb][word]=count
    elif sent == 'all':
        all_counter_sub[suburb][word]=count


all_output_dic = {}
for suburb, counter in all_counter_sub.items():
    sub_output_dict = {}
    for k, v in counter.items():
        if v > 5 and (not (k.isdigit())) and (len(k) > 3):
            sub_output_dict[k] = v
    suburb_count = Counter(sub_output_dict)
    suburb_count = suburb_count.most_common(50)
    all_output_dic[suburb] = reform(suburb_count)

neg_output_dic = {}
for suburb, counter in neg_counter_sub.items():
    sub_output_dict = {}
    for k, v in counter.items():
        if v > 5 and (not (k.isdigit())) and (len(k) > 3):
            sub_output_dict[k] = v
    suburb_count = Counter(sub_output_dict)
    suburb_count = suburb_count.most_common(50)
    neg_output_dic[suburb] = sub_output_dict




print(1)

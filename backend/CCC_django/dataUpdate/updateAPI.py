import datetime

from Rest_api.models import aggmap_new,mainsuburb
import couchdb
import pandas as pd
import math
import operator
from collections import Counter

couch = couchdb.Server('http://admin:admin@172.26.134.93:5984/')


def get_view_from_couch():

    return 0


def update_mainsuburb():
    db1 = couch['historical_with_cor']


    # get_offensive count by hour
    main_list = ['CARLTON', 'DOCKLANDS', 'EAST MELBOURNE', 'KENSINGTON', 'FLEMINGTON', 'PARKVILLE', 'PORT MELBOURNE',
                 'SOUTHBANK',
                 'MELBOURNE', 'SOUTH MELBOURNE', 'SOUTH YARRA', 'WEST MELBOURNE', 'NORTH MELBOURNE', 'CARLTON NORTH']
    # get_offensive count by hour
    update_dict = {}
    all_by_hour = [0] * 24
    for item in db1.view('data_reduce/offensive_by_hour', group=True, group_level=2):
        if not item.key[0] in main_list:
            all_by_hour[item.key[1]] += item.value
        else:
            if not item.key[0] in update_dict.keys():
                update_dict[item.key[0]] = [0] * 24
            update_dict[item.key[0]][item.key[1]] = item.value
    offensive_by_hour = update_dict


    # get word freq grouped by sentiments
    db1 = couch['historical_with_cor']

    """
    # get no suburb
    all_counter = {}
    neg_counter = {}
    for item in db1.view('data_reduce/word_freq_by_sub', group=True, group_level=2):
        word = item.key[0]
        sent = item.key[1]
        count = item.value
        if sent == 'neg':
            neg_counter[word] = count
        elif sent == 'all':
            all_counter[word] = count
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

    """

    def reform(dict):
        output_dict = []
        for (key, value) in dict:
            output_dict.append({"text": key, "value": value})
        return output_dict

    #total_20 = reform(total_20)
    #neg_20 = reform(neg_20)


    # get with sub
    all_counter_sub = {}


    for item in db1.view('data_reduce/word_freq_by_sub', group=True, group_level=3):
        word = item.key[0]
        #sent = item.key[1]
        suburb = item.key[2]
        if not suburb in main_list:
            continue
        if not suburb in all_counter_sub.keys():
            all_counter_sub[suburb] = {}

        count = item.value
        #if sent == 'neg':
        all_counter_sub[suburb][word]=count
#        elif sent == 'all':
#            all_counter_sub[suburb][word]=count


    all_output_dic = {}
    for suburb, counter in all_counter_sub.items():
        sub_output_dict = {}
        for k, v in counter.items():
            if v > 5 and (not (k.isdigit())) and (len(k) > 3):
                sub_output_dict[k] = v
        suburb_count = Counter(sub_output_dict)
        suburb_count = suburb_count.most_common(50)
        all_output_dic[suburb] = reform(suburb_count)

    """
    neg_output_dic = {}
    for suburb, counter in neg_counter_sub.items():
        sub_output_dict = {}
        for k, v in counter.items():
            if v > 5 and (not (k.isdigit())) and (len(k) > 3):
                sub_output_dict[k] = v
        suburb_count = Counter(sub_output_dict)
        suburb_count = suburb_count.most_common(50)
        neg_output_dic[suburb] = reform(suburb_count)
    """

    #get total tweet
    tweet_count_by_suburb = {}
    for item in db1.view('data_reduce/suburb_tweet_count', group=True, group_level=1):
        suburb = item.key
        count = item.value
        tweet_count_by_suburb[suburb] = count

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




    # construct model
    mainsuburb.objects.all().delete()
    for suburb in main_list:
        agg_data = aggmap_new.objects.get(region_full=suburb)
        save_data = mainsuburb(
            crime_rate=agg_data.crime_rate,
            sent_score=agg_data.sent_score,
            no_offensive=agg_data.no_offensive,
            region_full=suburb,
            total_tweet=tweet_count_by_suburb[suburb],
            # offensive_by_hour = models
            offensive_by_hour=offensive_by_hour[suburb],
            word_freq=all_output_dic[suburb],
            word_freq_neg=offensive_output_dic[suburb]
            #word_freq=total_20, if all suburb
            #word_freq_neg=neg_20
        )
        save_data.save()
    print("I'm updating mainsuburb database, time: ", datetime.datetime.now())

def update_aggmap():
    # load update order
    import json
    file_name = 'Data_tools/updated_sub.json'
    suburb_index = {}
    with open(file_name, 'r') as f:
        line = f.readline()
        value_dict = json.loads(line)
        value_dict = value_dict['features']
        for index, single_line in enumerate(value_dict):
            name = single_line['properties']['name']
            suburb_index[name] = index + 1

    db1 = couch['final_db']

    # get offensive language count
    update_dict = []
    for item in db1.view('data_reduce/total_offensive_suburb', group=True, group_level=1):
        small_dict = {}
        small_dict['suburb'] = item.key
        small_dict['count'] = item.value
        update_dict.append(small_dict)
    offense = pd.DataFrame(update_dict)

    # get sentiment score
    update_dict = []
    for item in db1.view('data_reduce/get_sentiment_suburb', group=True, group_level=2):
        small_dict = {}
        small_dict['suburb'] = item.key[0]
        small_dict['sent'] = item.key[1]
        small_dict['count'] = item.value
        update_dict.append(small_dict)

    sentiment = pd.DataFrame(update_dict)
    sentiment_group = sentiment.groupby(['suburb'])
    output_dict = []
    # calculate crime score
    for suburb,df in sentiment_group:
        sent_count_dic = {'pos':0,'neg':0}
        for _,row in df.iterrows():
            sent_count_dic[row['sent']] += row['count']
        score = round((sent_count_dic["pos"] + 1) / (sent_count_dic["neg"] + 1), 4)
        log_score = round(math.log(score), 4)
        total = sent_count_dic["pos"] + sent_count_dic["neg"]
        one_suburb = {'name':suburb,'score':score,'log_score':log_score,'total':total}
        output_dict.append(one_suburb)
    sent = pd.DataFrame(output_dict)

    # get crime data
    crime_data = pd.read_csv('Data_tools/crime_rate_per_suburb.csv')

    # merge data
    sent = sent[['name', 'score']]
    b = pd.merge(sent, offense, how='inner', left_on='name', right_on='suburb')
    b = b[['name', 'count', 'score' ]]
    #b.to_csv('agg_map_use.csv', index=False)
    old_data = pd.read_csv('Data_tools/agg_map_use.csv')
    big_data = pd.merge(old_data, b, how='outer', on='name')
    big_data = big_data.fillna(0)
    #print(big_data.head())
    big_data['count'] = big_data['count_x'] + big_data['count_y']
    big_data['score'] = (big_data['count_x'] * big_data['scores'] + big_data['count_y'] * big_data['score']) / \
                      big_data['count']
    big_data = big_data[['name', 'count', 'score']]

    crime_data = crime_data[['name', 'crime_rate']]
    b = pd.merge(big_data, crime_data, how='inner', left_on='name', right_on='name')


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
    # construct data
    bulk_add = []
    for _, row in b.iterrows():
        if row['name'] in suburb_index:
            tmp = aggmap_new(
                crime_rate=row['crime_rate'],
                sent_score=row['score'],
                no_offensive=row['count'],
                region_full=row['name'],
                display_order=suburb_index[row['name']],
                fav_food = most_popular[row['name']]
            )
            bulk_add.append(tmp)
    aggmap_new.objects.all().delete()
    aggmap_new.objects.bulk_create(bulk_add, ignore_conflicts=True)
    #aggmap.save()
    print("I'm updating aggmap database, time: ", datetime.datetime.now())
    #return 0
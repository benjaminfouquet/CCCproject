import pandas as pd
import os
import re
import datetime
import random
#print(2)
update_flag = 0

try:
    db_update_info = database_update_time.objects.get(db_name = 'example_agg').delete()

    #time_update = db_update_info.update_time
except:
    time_update = datetime.date(2000,1,1)
    add_first_time = database_update_time(db_name='example_agg',update_time=datetime.date.today())
    add_first_time.save()
    update_flag = 1
#print(time_update)
file_dir = 'Data_tools/results'
file_list = os.listdir(file_dir)
find_date = re.compile(r'(?<=sentiment_output_).*')

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

if update_flag == 1:
    tmp_data = pd.read_csv(file_dir +'/' +file_name)
    example_agg.objects.all().delete()
    #tmp_data['region'] = tmp_data['lang'].apply(lambda x: random.choice(region_list))
    tmp_data['region'] = ''
    for i, row in tmp_data.iterrows():
        tmp_data.at[i, 'region'] = random.choice(region_list)
    group = tmp_data.groupby(['region'])
    use = group.size().reset_index(name='no_offensive')
    # ensure fields are correctly
    # concatenate name and Product_id to make a new field a la Dr.Dee's answer
    example_bulk_add = []
    for _, row in use.iterrows():

        tmp = example_agg(
            region_full = row['region'],
            no_offensive = row['no_offensive']
        )
        example_bulk_add.append(tmp)
    example_agg.objects.bulk_create(example_bulk_add, ignore_conflicts=True)
    today = datetime.date.today()
    database_update_time.objects.filter(db_name='example_agg').update(update_time = today)
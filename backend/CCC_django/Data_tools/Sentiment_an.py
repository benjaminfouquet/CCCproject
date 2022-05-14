import pandas as pd
crime_data = pd.read_csv('crime_rate_per_suburb.csv')
offense = pd.read_csv('results/offensive_suburb_groupping.csv')
sent = pd.read_csv('results/nighttime_suburb_groupping.csv')
offense = offense[['suburb','count']]
sent = sent[['Suburbs','scores']]
crime_data = crime_data[['name','crime_rate']]
a = pd.merge(sent,crime_data,how='inner',left_on='Suburbs',right_on='name')
b = pd.merge(a,offense,how='inner',left_on='Suburbs',right_on='suburb')
b = b[['name','count','scores','crime_rate']]
b.to_csv('agg_map_use.csv',index=False)
print(1)
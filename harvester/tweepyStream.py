import tweepy
from tweepy import OAuthHandler
import json
import sys
import couchdb
from datetime import datetime
import time
from preprocessing_main import update

consumerKey = "3CirA7v9lPeMTL9DDUyqXzrY8"
consumerSecret = "37ANHrC1JMVOHkwKn0HI89YbF61wK8tlY62M7wwVg1IszhePna"
bearerToken = "AAAAAAAAAAAAAAAAAAAAAOPnbQEAAAAAQeMO9rfx6eznKrq%2BdQ6qPJBFSqM%3DcOwa6QmcFEtKr56qTbqWeZ53VOrToAJR0e7Zx5VxYfTjGde3vb"
accessToken = "852492462849310721-0eCLz8dxk49FSiy4I5fQ9O3Yzg2AaHZ"
accessTokenSecret = "hgE8xW226bfmweWR1PV7gWz689K8b2feECkY3eltzwhM2"

auth = OAuthHandler(consumerKey, consumerSecret)

auth.set_access_token(accessToken, accessTokenSecret)

api = tweepy.API(auth = auth,
                     wait_on_rate_limit = True,
                     )

if api.verify_credentials() == False:
    print("The user credentials are invalid.")
else:
    print("The user credentials are valid.")

class tweetsJsonPrinter(tweepy.Stream):
    
    def on_status(self, status):
        try:
            twitterJson = status._json
            couch = couchdb.Server('http://admin:admin@172.26.134.93:5984/')
            db = couch['final_db']  # 改一下数据库名称
            twitterJson = update(twitterJson)
            db.save(twitterJson)
            '''
           with open('tweetsStream.json', 'w') as jsonFile:
                json.dump(twitterJson, jsonFile)
           
        ''' 
            return True
               
        except  Exception as exception:
            print("Error messaga: ", exception)

    def on_error(self, status_code):
        print(sys.stderr, 'Encountered error with status code:', status_code)
        
        if status_code == 420:
            return False
        if status_code == 401:
            return False

        time.sleep(60)
        return True # Don't kill the stream

    def on_timeout(self):
        print(sys.stderr, 'Timeout...')
        #time.sleep(60)

while True:
    stream = tweepy.Stream(consumer_key=consumerKey, consumer_secret=consumerSecret, access_token=accessToken, access_token_secret=accessTokenSecret)
    printer = tweetsJsonPrinter(consumer_key=consumerKey, consumer_secret=consumerSecret, access_token=accessToken, access_token_secret=accessTokenSecret)

    try:
        now = datetime.now()
        currentTime = now.strftime("%H:%M:%S")
        print('Start streaming, current time: ', currentTime)
        geoBox = [144.561475, -38.359848, 145.504926, -37.598882]
        printer.filter(locations=geoBox)
       
    except KeyboardInterrupt as e :
        print("Stopped.")
    finally:
        stream.disconnect()
        print('Done. Disconnected.')
        break
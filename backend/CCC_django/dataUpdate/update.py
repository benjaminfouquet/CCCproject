import random

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import  datetime
from dataUpdate import updateAPI

def start():
    scheduler = BackgroundScheduler()
    #iterval1 = random.randint(0,10)
    scheduler.add_job(updateAPI.update_aggmap,'interval',minutes=240)
    scheduler.add_job(updateAPI.update_mainsuburb, 'interval', minutes=239)

    scheduler.start()
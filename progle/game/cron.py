from django_cron import CronJobBase, Schedule
from datetime import date
from .models import DailyWord, Word
import random

class UpdateDailyWordCronJob(CronJobBase):
    schedule = Schedule(run_every_mins=1440)  # Runs every 24 hours (1440 minutes)
    code = 'game.update_daily_word'

    def do(self):
        # Set or update the daily word
        daily_word = DailyWord.set_daily_word()  # Call the method we defined earlier
        print(f"Daily word set to: {daily_word.name}")
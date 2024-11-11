from django.db import models
import random
from datetime import date

class Domain(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name  # This ensures only the name is displayed in admin

class Word(models.Model):
    TYPE_CHOICES = [
        ('programming_language', 'Programming Language'),
        ('framework', 'Framework'),
        ('database', 'Database')
    ]

    POPULARITY_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    name = models.CharField(max_length=100, unique=True)
    release_year = models.IntegerField()  # Changed from DateField to IntegerField
    last_update_year = models.IntegerField()  # Changed from DateField to IntegerField
    popularity_level = models.CharField(max_length=10, choices=POPULARITY_LEVEL_CHOICES)  # Updated to choices
    domain = models.ManyToManyField(Domain)  # Allows multiple domains
    creator = models.CharField(max_length=100)  # name of the person or company

    def __str__(self):
        return self.name
    
class DailyWord(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    date = models.DateField()

    @staticmethod
    def set_daily_word():
        today = date.today()

        # Try to get the existing daily word for today
        daily_word = DailyWord.objects.filter(date=today).first()

        # If no daily word exists for today, create one
        if not daily_word:
            # Ensure the new word is different from any existing word
            current_word = random.choice(Word.objects.all())
            daily_word = DailyWord.objects.create(date=today, word=current_word)
        else:
            # If a daily word exists, check if it's the same as the previous word
            current_word = random.choice(Word.objects.all())
            while daily_word.word == current_word:  # Ensure the word is different
                current_word = random.choice(Word.objects.all())
            
            # Update today's word with the new random word
            daily_word.word = current_word
            daily_word.save()

        return daily_word.word
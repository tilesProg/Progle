from django.urls import path
from . import views

app_name = 'game'  # This line defines the namespace

urlpatterns = [
    path('', views.index, name='index'),
    path('set-daily-word/', views.set_daily_word_manually, name='set_daily_word'),
    path('guess/', views.check_guess, name='check_guess'),  # This handles the guess submission
    path('get-word-suggestions/', views.get_word_suggestions, name='get_word_suggestions'),
]
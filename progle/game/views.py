from django.shortcuts import render, get_object_or_404
from .models import DailyWord, Word
from django.http import JsonResponse
from datetime import date
import json

def index(request):
    # Get today's daily word
    daily_word = DailyWord.set_daily_word()
    context = {
        'daily_word': daily_word,
    }
    return render(request, 'game/index.html', context)

def set_daily_word_manually(request):
    """Set the daily word manually."""
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        try:
            random_word = DailyWord.set_daily_word()  # Set the daily word using the static method
            return JsonResponse({
                'status': 'success',
                'message': f"Today's word has been set to {random_word.name}.",
                'new_word': random_word.name  # Return the new word to the client
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request.'})

def get_word_suggestions(request):
    query = request.GET.get('query', '').lower()
    guessed_words = request.GET.getlist('guessed_words[]')  # List of guessed words passed from the client

    # Query words based on the query and exclude guessed words
    words = Word.objects.filter(name__icontains=query).exclude(name__in=guessed_words).values_list('name', flat=True)

    return JsonResponse({'words': list(words)})

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from datetime import date
import json

def check_guess(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON with the user's guess
            guess_data = json.loads(request.body)
            guess_word = guess_data.get('guess')
            
            # Retrieve today's word
            today = date.today()
            daily_word_entry = get_object_or_404(DailyWord, date=today)
            daily_word = daily_word_entry.word  # Get the word of the day

            # Find the guessed word
            guessed_word = Word.objects.filter(name__iexact=guess_word).first()

            if not guessed_word:
                return JsonResponse({
                    'status': 'error',
                    'message': 'The guessed word is not in the database.'
                }, status=404)

            # Prepare feedback object for the response
            feedback = {
                'word': {
                    'value': guessed_word.name,
                    'match_level': 'green' if guessed_word.name == daily_word.name else 'red'
                },
                'type': {
                    'value': guessed_word.get_type_display(),  # Use the human-readable label for `type`
                    'match_level': 'green' if guessed_word.type == daily_word.type else 'red'
                },
                'release_year': {
                    'value': guessed_word.release_year,
                    'match_level': 'green' if guessed_word.release_year == daily_word.release_year else 'red',
                    'hint': ' ↑' if guessed_word.release_year < daily_word.release_year else ' ↓'
                },
                'last_update_year': {
                    'value': guessed_word.last_update_year,
                    'match_level': 'green' if guessed_word.last_update_year == daily_word.last_update_year else 'red',
                    'hint': ' ↑' if guessed_word.last_update_year < daily_word.last_update_year else ' ↓'
                },
                'popularity_level': {
                    'value': guessed_word.popularity_level,
                    'match_level': 'green' if guessed_word.popularity_level == daily_word.popularity_level else 'red'
                },
                'domains': {
                    'value': ', '.join([domain.name for domain in guessed_word.domain.all()]),
                    'match_level': 'green' if set(guessed_word.domain.all()) == set(daily_word.domain.all()) else 'yellow' if set(guessed_word.domain.all()) & set(daily_word.domain.all()) else 'red'
                },
                'creator': {
                    'value': guessed_word.creator,
                    'match_level': 'green' if guessed_word.creator == daily_word.creator else 'red'
                }
            }

            return JsonResponse({
                'status': 'success',
                'feedback': feedback,
                'message': 'Guess received and feedback generated!'
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Error processing the guess: {str(e)}'
            }, status=500)

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method.'
    }, status=400)

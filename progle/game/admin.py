from django.contrib import admin
from .models import Word, Domain, DailyWord
from django.utils.translation import gettext_lazy as _
from datetime import date

# Register the Domain model
admin.site.register(Domain)

class WordAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'release_year', 'last_update_year', 'popularity_level', 'get_domains', 'creator')
    list_filter = ('type', 'popularity_level', 'domain')
    search_fields = ('name', 'creator')

    def get_domains(self, obj):
        return ", ".join([domain.name for domain in obj.domain.all()])
    get_domains.short_description = 'Domains'

# Register the Word model with the custom WordAdmin interface
admin.site.register(Word, WordAdmin)

class DailyWordAdmin(admin.ModelAdmin):
    list_display = ('word', 'date')
    list_filter = ('date',)
    search_fields = ('word__name',)

    def get_queryset(self, request):
        """Override queryset to show only today's word or all words"""
        return super().get_queryset(request)

    def save_model(self, request, obj, form, change):
        """Override save_model to ensure only one DailyWord per day"""
        today = obj.date or date.today()

        # Check if a DailyWord entry already exists for today
        existing_daily_word = DailyWord.objects.filter(date=today).first()

        if existing_daily_word:
            # If it exists, just update the word
            existing_daily_word.word = obj.word
            existing_daily_word.save()
        else:
            # If it doesn't exist, create a new DailyWord
            super().save_model(request, obj, form, change)

        # Prevent saving a duplicate by overriding this behavior
        # No need to call super() in this case as we're handling the save manually

admin.site.register(DailyWord, DailyWordAdmin)

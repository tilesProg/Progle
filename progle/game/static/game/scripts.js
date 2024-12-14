document.addEventListener('DOMContentLoaded', () => {
    const guessForm = document.getElementById('guess-form');
    const guessInput = document.getElementById('guess');
    const themeToggle = document.getElementById('theme-toggle');
    const wordSuggestions = document.getElementById('word-suggestions');
    const guessedWords = new Set(); // Use a Set to keep track of unique guessed words
    const guessUrl = document.getElementById('js-data').getAttribute('data-guess-url');
    let enterPressed = false;  // Flag for preventing Enter key hold

    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        document.querySelector('.button').classList.add('dark-theme');
        const tabs = document.querySelectorAll('.feedback-box');
        tabs.forEach(tab => {
            tab.classList.add('dark-theme');
        });
    }

    guessInput.setAttribute('autocomplete', 'off');

    fetch('/set-daily-word/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({})
    })

    fetch('/get-word-suggestions/')
        .then(response => response.json())
        .then(data => {
            if (data.words && data.words.length) {
                updateDatalist(data.words);
            }
        })
        .catch(error => {
            console.error('Error fetching word suggestions:', error);
        });

    function updateDatalist(words) {
        wordSuggestions.innerHTML = '';
        words.forEach(word => {
            if (!guessedWords.has(word)) {
                const option = document.createElement('option');
                option.value = word;
                wordSuggestions.appendChild(option);
            }
        });
    }

    themeToggle.addEventListener('click', function () {
        const tabs = document.querySelectorAll('.feedback-box');
        tabs.forEach(tab => {
            tab.classList.toggle('dark-theme');
        });
        document.body.classList.toggle('dark-theme');
        document.querySelector('.button').classList.toggle('dark-theme');
        
        // Save theme preference
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDark);
    });

    guessInput.addEventListener('input', () => {
        const query = guessInput.value.trim().toLowerCase();
        if (query) {
            fetch(`/get-word-suggestions/?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data.words && data.words.length) {
                        const filteredWords = data.words.filter(word => word.toLowerCase().startsWith(query));
                        if (filteredWords.length) {
                            updateDatalist(filteredWords);
                        } else {
                            wordSuggestions.innerHTML = '';
                        }
                    } else {
                        wordSuggestions.innerHTML = '';
                    }
                })
                .catch(error => {
                    console.error('Error fetching filtered word suggestions:', error);
                });
        } else {
            wordSuggestions.innerHTML = '';
        }
    });

    if (guessForm) {
        guessForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (enterPressed) {  // Prevent multiple form submissions
                return;
            }
            enterPressed = true;  // Lock the form submission

            const guess = guessInput.value.trim();

            if (!guess) {
                enterPressed = false;  // Reset flag
                return;
            }

            if (guessedWords.has(guess)) {  // Check if the word has already been guessed
                enterPressed = false;  // Reset flag
                return;
            }

            const isValidGuess = wordSuggestions.querySelector(`option[value="${guess}"]`);
            if (!isValidGuess) {
                enterPressed = false;  // Reset flag
                return;
            }

            fetch(guessUrl, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ guess: guess })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    guessedWords.add(guess);  // Add the guess to the set of guessed words
                    updateFeedbackBoxes(data.feedback);
                    guessInput.value = '';  // Clear the input field after a successful guess
                    
                    // Check if all feedback matches are green (correct guess)
                    const allGreen = Object.values(data.feedback).every(item => item.match_level === 'green');
                    
                    if (allGreen) {
                        // Disable the form
                        guessForm.disabled = true;
                        guessInput.disabled = true;
                        document.querySelector('.button').disabled = true;
                        
                        // Optional: Add visual feedback
                        document.querySelector('.text-slogan').textContent = "Congratulations! You found today's word!";
                    }
                }
                enterPressed = false;  // Reset flag after processing
            })
            .catch(error => {
                enterPressed = false;  // Reset flag in case of error
            });
        });
    }

    function updateFeedbackBoxes(feedback) {
        const feedbackElements = {
            word: document.getElementById('feedback-word'),
            type: document.getElementById('feedback-type'),
            release_year: document.getElementById('feedback-release-year'),
            last_update_year: document.getElementById('feedback-last-update-year'),
            popularity_level: document.getElementById('feedback-popularity-level'),
            domains: document.getElementById('feedback-domains'),
            creator: document.getElementById('feedback-creator')
        };
    
        for (const key in feedback) {
            const box = feedbackElements[key];
            const result = feedback[key];
            
            if (box) {
                box.textContent = result.value;
                box.classList.remove('green', 'yellow', 'red');
                box.classList.add(result.match_level);
    
                if (result.hint) {
                    box.textContent += ` ${result.hint}`;
                }
            }
        }

        addGuessToTable(feedback);
    }

    function addGuessToTable(feedback) {
        const guessesTable = document.getElementById('guesses-table');
        const feedbackHeader = document.getElementById('feedback-header');
    
        if (guessesTable.children.length === 0) {
            feedbackHeader.style.display = 'flex';
        }
    
        const guessRow = document.createElement('div');
        guessRow.classList.add('guess-row');
        guessRow.style.display = 'flex';
        guessRow.style.justifyContent = 'center';
        guessRow.style.marginTop = '10px';

        for (const key in feedback) {
            const result = feedback[key];
        
            if (result) {
                const box = document.createElement('div');
                box.classList.add('feedback-box', result.match_level); 
                if (document.body.classList.contains('dark-theme')) {
                    box.classList.add('dark-theme');
                }
                box.textContent = result.value;

                // Only add hint arrows for incorrect year guesses
                if ((key === 'release_year' || key === 'last_update_year') && result.match_level !== 'green') {
                    box.textContent += ` ${result.hint || ''}`;
                }

                guessRow.appendChild(box);
            }
        }

        guessesTable.insertBefore(guessRow, guessesTable.firstChild);
    }    

    guessInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (enterPressed) {  // Prevent submission if Enter is already held down
                event.preventDefault();
                return;
            }

            const query = guessInput.value.trim();
            const validOptions = wordSuggestions.querySelectorAll('option');
            if (validOptions.length === 0) {
                event.preventDefault();
                return;
            }

            const firstValidOption = validOptions[0].value;
            guessInput.value = firstValidOption;
            guessForm.requestSubmit();
        }
    });

    guessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            enterPressed = false;  // Reset flag when Enter is released
        }
    });
});

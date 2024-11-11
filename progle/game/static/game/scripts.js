document.addEventListener('DOMContentLoaded', () => {
    const guessForm = document.getElementById('guess-form');
    const guessInput = document.getElementById('guess');
    const wordSuggestions = document.getElementById('word-suggestions');
    const guessedWords = new Set(); // Use a Set to keep track of unique guessed words
    const guessUrl = document.getElementById('js-data').getAttribute('data-guess-url');
    let enterPressed = false;  // Flag for preventing Enter key hold

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
                box.textContent = result.value;
    
                if (key === 'release_year' || key === 'last_update_year') {
                    box.textContent += ` ${result.hint || ''}`;
                }
    
                guessRow.appendChild(box);
            }
        }
    
        // Insert the new row at the top of the table
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

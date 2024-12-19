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
                document.body.classList.toggle('dark-theme');
        const svgContainer = document.getElementById('svg-container');

        document.querySelector('.button').classList.toggle('dark-theme');

        const tabs = document.querySelectorAll('.feedback-box');
            tabs.forEach(tab => {
                tab.classList.toggle('dark-theme');
            });

        // Измените SVG в зависимости от темы
        if (document.body.classList.contains('dark-theme')) {
            svgContainer.innerHTML = `
                <svg class="svg-icon" height="800px" width="800px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"  xml:space="preserve">
                <style type="text/css">
	                .st0{fill:#727272;}
                </style>
                <g>
	                <path class="st0" d="M202.946,92.729h-0.008c-0.008,0-0.008,0.008-0.016,0.008L202.946,92.729z"/>
	                <path class="st0" d="M202.922,419.264L202.922,419.264c0.016,0,0.024,0.008,0.033,0.008L202.922,419.264z"/>
	                <path class="st0" d="M309.07,92.737c-0.008,0-0.008-0.008-0.017-0.008h-0.008L309.07,92.737z"/>
	                <path class="st0" d="M495.642,324.649c-15.665-9.534-28.264-21.412-36.986-33.183c-4.353-5.96-7.608-11.706-9.755-17.477
		c-2.164-5.771-3.287-11.566-3.287-17.912v-0.049v-0.09c0-6.361,1.123-12.165,3.287-17.936c2.147-5.754,5.402-11.509,9.755-17.46
		c8.722-11.771,21.321-23.657,36.986-33.191c3.567-2.172,5.173-6.516,3.894-10.468c-1.278-3.959-5.148-6.517-9.287-6.181
		c-3.844,0.304-7.632,0.452-11.37,0.443c-14.017,0.008-27.084-2.124-38.126-5.607c-7.009-2.254-13.001-5.009-18.133-8.394
		c-5.14-3.402-9.451-7.443-13.19-12.567l-0.008-0.008c-3.722-5.132-6.239-10.452-7.895-16.362c-1.664-5.91-2.426-12.452-2.426-19.78
		v-0.106v-0.033c0.098-14.64,3.312-31.7,10.41-48.643c1.624-3.853,0.385-8.28-3-10.755c-3.394-2.459-7.984-2.271-11.156,0.45
		c-13.944,11.977-29.183,20.256-43.086,24.88l0.057-0.016c-7.919,2.582-15.165,3.902-22.018,3.902
		c-5.32-0.008-10.435-0.771-15.682-2.484l-0.017-0.008c-6.008-1.951-11.19-4.787-16.018-8.623c-4.82-3.82-9.296-8.673-13.64-14.632
		c-8.541-11.91-15.985-27.576-20.19-45.43C263.804,2.861,260.181,0,256,0c-4.189,0-7.804,2.861-8.762,6.927
		c-4.197,17.854-11.657,33.52-20.19,45.43c-4.345,5.96-8.821,10.812-13.64,14.632c-4.837,3.836-10.001,6.672-16.01,8.623
		l-0.017,0.008c-5.246,1.713-10.377,2.476-15.689,2.484c-6.845,0-14.084-1.328-22.019-3.902l0.066,0.016
		c-13.927-4.624-29.166-12.903-43.077-24.88c-3.181-2.721-7.779-2.909-11.165-0.45c-3.385,2.475-4.622,6.902-3,10.755
		c7.083,16.944,10.296,33.986,10.41,48.643v0.139c0,7.328-0.778,13.87-2.426,19.78c-1.664,5.91-4.188,11.23-7.91,16.362
		l-0.008,0.008c-3.73,5.124-8.033,9.165-13.173,12.567c-5.131,3.386-11.132,6.14-18.14,8.394c-11.042,3.484-24.1,5.616-38.126,5.616
		c-3.722,0-7.517-0.148-11.362-0.452c-4.148-0.336-8.009,2.222-9.287,6.181c-1.295,3.951,0.32,8.296,3.894,10.468
		c15.657,9.534,28.265,21.42,36.978,33.191c4.345,5.952,7.591,11.706,9.763,17.46c2.164,5.763,3.271,11.55,3.287,17.896v0.107v0.098
		c-0.016,6.344-1.123,12.124-3.287,17.895c-2.172,5.762-5.418,11.509-9.763,17.469l0.033-0.058
		c-8.713,11.78-21.33,23.699-37.011,33.241c-3.574,2.164-5.189,6.517-3.894,10.468c1.278,3.958,5.148,6.525,9.296,6.189
		c3.837-0.311,7.632-0.459,11.362-0.459c14.018,0,27.076,2.14,38.118,5.615c7.008,2.263,13.009,5,18.14,8.394
		c5.14,3.41,9.444,7.443,13.173,12.583h0.008c3.722,5.115,6.246,10.436,7.91,16.354c1.648,5.919,2.426,12.452,2.426,19.788v0.139
		c-0.114,14.657-3.328,31.691-10.41,48.636c-1.622,3.86-0.385,8.288,3,10.754c3.386,2.451,7.984,2.279,11.165-0.45
		c13.903-11.952,29.133-20.248,43.036-24.871c7.927-2.558,15.149-3.902,21.985-3.894c5.32,0,10.443,0.779,15.689,2.492l0.025,0.008
		c6.009,1.942,11.173,4.779,16.018,8.607c4.828,3.844,9.312,8.706,13.656,14.673l-0.041-0.041
		c8.542,11.903,16.01,27.576,20.207,45.447c0.958,4.058,4.574,6.918,8.762,6.918c4.181,0,7.804-2.861,8.764-6.918
		c4.204-17.862,11.648-33.535,20.19-45.438c4.345-5.951,8.82-10.804,13.64-14.64c4.828-3.828,10.009-6.665,16.018-8.607l0.017-0.008
		c5.246-1.713,10.378-2.492,15.682-2.5c6.853,0,14.075,1.344,21.994,3.902c13.902,4.624,29.117,12.92,43.036,24.871
		c3.189,2.73,7.78,2.902,11.173,0.45c3.385-2.467,4.624-6.894,3-10.754c-7.099-16.944-10.312-33.987-10.41-48.636v-0.139
		c0-7.336,0.762-13.87,2.426-19.788c1.656-5.918,4.173-11.239,7.895-16.354h0.008c3.738-5.14,8.05-9.172,13.19-12.583
		c5.132-3.394,11.124-6.131,18.133-8.394c11.042-3.475,24.109-5.615,38.126-5.615c3.73,0,7.526,0.148,11.362,0.459
		c4.148,0.344,8.017-2.23,9.296-6.189C500.815,331.166,499.208,326.813,495.642,324.649z M435.326,329.297l-0.058,0.024
		c-8.206,2.648-15.764,6.017-22.576,10.518c-6.804,4.5-12.829,10.132-17.821,17.009l0.008-0.008
		c-4.992,6.829-8.501,14.272-10.698,22.109c-2.188,7.829-3.082,16.043-3.082,24.633v0.254v0.024
		c0.074,9.206,1.214,19.002,3.434,29.06c-8.878-5.214-17.853-9.312-26.584-12.214l-0.049-0.016
		c-9.247-3.017-18.387-4.796-27.592-4.796c-7.116,0-14.223,1.074-21.256,3.377c-8.066,2.599-15.288,6.566-21.665,11.632
		c-6.386,5.09-11.96,11.222-17.01,18.19l-0.057,0.049c-5.337,7.484-10.205,16.076-14.321,25.527
		c-4.106-9.452-8.976-18.043-14.337-25.527l-0.033-0.049c-5.074-6.968-10.632-13.107-17.017-18.19
		c-6.386-5.066-13.6-9.042-21.69-11.64c-7.025-2.296-14.132-3.37-21.24-3.37c-9.189,0.008-18.33,1.779-27.576,4.796l-0.057,0.016
		c-8.73,2.903-17.698,7.001-26.592,12.214c2.238-10.058,3.369-19.854,3.443-29.06v-0.172v-0.041v-0.066
		c0-8.583-0.893-16.797-3.091-24.633c-2.18-7.828-5.697-15.28-10.68-22.109l0.008,0.008c-4.993-6.877-11.018-12.509-17.83-17.009
		c-6.804-4.501-14.378-7.87-22.584-10.518l-0.05-0.024c-8.771-2.763-18.485-4.665-28.748-5.664
		c7.738-6.837,14.452-14.108,19.928-21.51l0.04-0.066c5.05-6.935,9.19-14.091,12.059-21.723c2.869-7.624,4.443-15.714,4.434-24.231
		v-0.098v-0.05v-0.057v-0.091c-0.008-8.475-1.574-16.542-4.434-24.141c-2.869-7.631-7.009-14.796-12.059-21.739l-0.04-0.05
		c-5.492-7.394-12.19-14.664-19.936-21.51c10.271-0.991,19.984-2.893,28.756-5.656l0.05-0.024
		c8.205-2.648,15.78-6.026,22.584-10.526c6.812-4.501,12.837-10.132,17.83-17.01l-0.008,0.008c4.983-6.837,8.5-14.272,10.68-22.1
		c2.198-7.845,3.091-16.05,3.091-24.633v-0.205v-0.074c-0.074-9.189-1.205-19.01-3.443-29.06
		c8.894,5.205,17.863,9.296,26.592,12.206l0.057,0.024c9.247,3.017,18.387,4.787,27.585,4.787
		c7.107,0.008,14.214-1.074,21.247-3.377c8.082-2.599,15.296-6.574,21.674-11.64c6.385-5.074,11.943-11.214,17.017-18.182
		l0.024-0.049c5.37-7.476,10.222-16.076,14.346-25.526c4.116,9.451,8.984,18.051,14.321,25.526l0.057,0.049
		c5.05,6.968,10.624,13.108,17.01,18.182c6.377,5.066,13.599,9.041,21.665,11.64c7.033,2.304,14.14,3.386,21.256,3.377
		c9.205,0,18.337-1.77,27.592-4.787l0.049-0.024c8.731-2.91,17.706-7.001,26.584-12.206c-2.221,10.05-3.361,19.871-3.434,29.06
		v0.279c0,8.583,0.894,16.805,3.082,24.633c2.197,7.828,5.706,15.272,10.698,22.1l-0.008-0.008
		c4.984,6.877,11.017,12.517,17.821,17.01c6.812,4.5,14.378,7.877,22.576,10.526l0.058,0.024c8.779,2.763,18.484,4.665,28.748,5.648
		c-7.73,6.845-14.427,14.124-19.92,21.518l-0.041,0.058c-5.074,6.943-9.206,14.107-12.075,21.739
		c-2.852,7.575-4.402,15.608-4.418,24.043v0.148c0,0.016-0.008,0.033-0.008,0.073v0.099v0.04v0.017v0.041
		c0.008,8.492,1.566,16.575,4.426,24.182c2.869,7.64,7.001,14.805,12.075,21.74l0.041,0.066c5.492,7.402,12.189,14.673,19.92,21.51
		C453.81,324.632,444.105,326.534,435.326,329.297z"/>
	            <path class="st0" d="M309.046,419.271h0.008c0.008-0.008,0.008-0.008,0.017-0.008L309.046,419.271z"/>
	            <path class="st0" d="M256,119.248c-75.53,0-136.748,61.226-136.757,136.757c0.008,75.522,61.226,136.756,136.757,136.756
		c75.539,0,136.757-61.234,136.757-136.756C392.756,180.474,331.538,119.248,256,119.248z M339.268,339.265
		C317.93,360.586,288.551,373.76,256,373.76s-61.931-13.174-83.26-34.495c-21.322-21.321-34.486-50.718-34.495-83.26
		c0.008-32.544,13.173-61.924,34.495-83.262c21.33-21.329,50.709-34.495,83.26-34.495s61.931,13.166,83.269,34.495
		c21.314,21.321,34.486,50.718,34.486,83.262C373.755,288.548,360.582,317.944,339.268,339.265z"/>
            </g>
            </svg>
            `;
        } else {
            svgContainer.innerHTML = `
                <svg class="svg-icon" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.8a9.796 9.796 0 0 1-1.245-19.513l1.286-.163-.843.984a8.285 8.285 0 0 0 8.519 13.383l1.252-.347-.696 1.096A9.755 9.755 0 0 1 12 21.8zM9.647 3.526a8.796 8.796 0 1 0 9.031 14.196 9.048 9.048 0 0 1-1.178.078A9.293 9.293 0 0 1 9.647 3.526z" fill="#727272"/>
                    <path fill="none" d="M0 0h24v24H0z"/>
                </svg>
            `;
        }

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

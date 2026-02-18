const generateBtn = document.getElementById('generate-btn');
const numberDisplay = document.querySelector('.number-display');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

// Theme Toggle logic
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    updateThemeButtonText();
    
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

function updateThemeButtonText() {
    themeBtn.textContent = body.classList.contains('dark-theme') ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}
updateThemeButtonText();

function generateLottoNumbers() {
    // Clear previous results
    numberDisplay.innerHTML = '';
    
    // Generate 5 games
    for (let gameIndex = 0; gameIndex < 5; gameIndex++) {
        const gameRow = document.createElement('div');
        gameRow.classList.add('game-row');
        numberDisplay.appendChild(gameRow);
        
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach((number, numIndex) => {
            // Staggered animation for all balls across all games
            setTimeout(() => {
                const numberDiv = document.createElement('div');
                numberDiv.classList.add('number');
                numberDiv.textContent = number;
                gameRow.appendChild(numberDiv);
            }, (gameIndex * 6 + numIndex) * 50);
        });
    }
}

generateBtn.addEventListener('click', generateLottoNumbers);

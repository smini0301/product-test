const generateBtn = document.getElementById('generate-btn');
const numberDisplay = document.querySelector('.number-display');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

// Theme Toggle logic
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        themeBtn.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeBtn.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeBtn.textContent = 'Light Mode';
}

function generateLottoNumbers() {
    numberDisplay.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const numberDiv = document.createElement('div');
            numberDiv.classList.add('number');
            numberDiv.textContent = number;
            numberDisplay.appendChild(numberDiv);
        }, index * 300);
    });
}

generateBtn.addEventListener('click', generateLottoNumbers);

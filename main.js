const generateBtn = document.getElementById('generate-btn');
const numberDisplay = document.querySelector('.number-display');

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

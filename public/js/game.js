// Tab Switching
function showGame(gameId) {
    document.querySelectorAll('.game-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(gameId).classList.add('active');
    event.target.classList.add('active');
}

// --- Tic Tac Toe Logic ---
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttCurrentPlayer = 'X';
let tttActive = true;
let widthTtt; // Will be initialized when DOM is ready

function initTTT() {
    widthTtt = document.getElementById('tttGrid');
    if (!widthTtt) return; // Guard clause

    widthTtt.innerHTML = '';
    tttBoard.forEach((val, idx) => {
        const cell = document.createElement('div');
        cell.classList.add('ttt-cell');
        cell.innerText = val;
        cell.onclick = () => makeMove(idx);
        widthTtt.appendChild(cell);
    });
}

function makeMove(idx) {
    if (!tttActive || tttBoard[idx] !== '') return;

    tttBoard[idx] = tttCurrentPlayer;
    const cells = document.querySelectorAll('.ttt-cell');
    if (cells[idx]) {
        cells[idx].innerText = tttCurrentPlayer;
        cells[idx].classList.add('taken');
    }

    if (checkTTTWin()) {
        const resultEl = document.getElementById('tttResult');
        if (resultEl) {
            resultEl.innerText = `Player ${tttCurrentPlayer} Wins!`;
            resultEl.className = 'game-result'; // Reset color
        }
        tttActive = false;
    } else if (!tttBoard.includes('')) {
        const resultEl = document.getElementById('tttResult');
        if (resultEl) {
            resultEl.innerText = "It's a Draw!";
            resultEl.className = 'game-result draw';
        }
        tttActive = false;
    } else {
        tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkTTTWin() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]           // Diagonals
    ];
    return wins.some(w => {
        return tttBoard[w[0]] &&
            tttBoard[w[0]] === tttBoard[w[1]] &&
            tttBoard[w[1]] === tttBoard[w[2]];
    });
}

function resetTTT() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttCurrentPlayer = 'X';
    tttActive = true;
    const resultEl = document.getElementById('tttResult');
    if (resultEl) resultEl.innerText = '';
    initTTT();
}

// --- Hangman Logic ---
let hmWord = '';
let hmGuessed = [];
let hmMistakes = 0;
const maxMistakes = 6;
const parts = ['hm-head', 'hm-body', 'hm-arm-l', 'hm-arm-r', 'hm-leg-l', 'hm-leg-r'];

async function initHangman() {
    const btn = document.querySelector("button[onclick='resetHangman()']");
    if (btn) {
        btn.innerText = "Loading...";
        btn.disabled = true;
    }

    try {
        const res = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await res.json();
        hmWord = data[0].toUpperCase();
    } catch (err) {
        console.log("Using fallback words");
        const fallback = ['JAVASCRIPT', 'NODEJS', 'EXPRESS', 'REACT', 'PYTHON', 'HTML', 'CSS', 'SERVER'];
        hmWord = fallback[Math.floor(Math.random() * fallback.length)];
    }

    if (btn) {
        btn.innerText = "New Word";
        btn.disabled = false;
    }

    hmGuessed = [];
    hmMistakes = 0;
    updateHangmanUI();
    generateKeyboard();
    const resultEl = document.getElementById('hmResult');
    if (resultEl) resultEl.innerText = '';
}

function generateKeyboard() {
    const keyboard = document.getElementById('hmKeyboard');
    if (!keyboard) return;

    keyboard.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const btn = document.createElement('button');
        btn.classList.add('key');
        btn.innerText = char;
        btn.onclick = () => handleGuess(char, btn);
        keyboard.appendChild(btn);
    }
}

function handleGuess(char, btn) {
    btn.disabled = true;
    if (hmWord.includes(char)) {
        hmGuessed.push(char);
    } else {
        hmMistakes++;
    }
    updateHangmanUI();
    checkHangmanOver();
}

function updateHangmanUI() {
    // Word
    const wordEl = document.getElementById('hmWord');
    if (wordEl) {
        wordEl.innerText = hmWord
            .split('')
            .map(l => hmGuessed.includes(l) ? l : '_')
            .join(' ');
    }

    // Drawing
    parts.forEach((id, idx) => {
        const partEl = document.getElementById(id);
        if (partEl) {
            partEl.style.display = idx < hmMistakes ? 'block' : 'none';
        }
    });
}

function checkHangmanOver() {
    const resultEl = document.getElementById('hmResult');
    const wordEl = document.getElementById('hmWord');

    if (hmMistakes >= maxMistakes) {
        if (resultEl) {
            resultEl.innerText = `Game Over! Word was ${hmWord}`;
            resultEl.className = 'game-result loss';
        }
        disableKeyboard();
    } else if (wordEl && !wordEl.innerText.includes('_')) {
        if (resultEl) {
            resultEl.innerText = 'You Won!';
            resultEl.className = 'game-result';
        }
        disableKeyboard();
    }
}

function disableKeyboard() {
    document.querySelectorAll('.key').forEach(b => b.disabled = true);
}

function resetHangman() {
    initHangman();
}

// --- Rock Paper Scissors Logic ---
function playRPS(choice) {
    const choices = ['rock', 'paper', 'scissors'];
    const icons = { 'rock': '🪨', 'paper': '📄', 'scissors': '✂️' };
    const compChoice = choices[Math.floor(Math.random() * 3)];

    const compChoiceEl = document.getElementById('rpsCompChoice');
    if (compChoiceEl) compChoiceEl.innerText = icons[compChoice];

    const resultEl = document.getElementById('rpsResult');
    if (!resultEl) return;

    if (choice === compChoice) {
        resultEl.innerText = "It's a Draw!";
        resultEl.className = 'game-result draw';
    } else if (
        (choice === 'rock' && compChoice === 'scissors') ||
        (choice === 'paper' && compChoice === 'rock') ||
        (choice === 'scissors' && compChoice === 'paper')
    ) {
        resultEl.innerText = "You Win!";
        resultEl.className = 'game-result';
    } else {
        resultEl.innerText = "Computer Wins!";
        resultEl.className = 'game-result loss';
    }
}

// Initialize Games
document.addEventListener('DOMContentLoaded', () => {
    initTTT();
    initHangman();
});

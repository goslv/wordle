const dictionary = [
    'perro','abajo', 'abeja', 'actor', 'casas', 'cosas', 'dando', 'fruta', 'gatos','huevo', 'islas', 'joven', 'llave', 'mango', 'nubes', 'ojota', 'queso','raton', 'salto', 'pasas', 'sopas', 'color','rosas','ropas','tropa','parto','pedro','papas','beber','cobro','arroz'
];

const state = {
    secret: dictionary[0],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
    keyboard: {}
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;
    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function drawKeyboard(container) {
    const keys = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('');
    keys.forEach(key => {
        const button = document.createElement('div');
        button.className = 'key';
        button.id = `key${key}`;
        button.textContent = key;
        button.onclick = () => handleKeyClick(key);
        container.appendChild(button);
        state.keyboard[key] = button;
    });
}

function handleKeyClick(key) {
    const e = { key: key.toLowerCase() };
    if (key === 'ENTER') {
        e.key = 'Enter';
    }
    if (key === 'BACKSPACE') {
        e.key = 'Backspace';
    }
    document.body.onkeydown(e);
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert('No es una palabra válida');
                }
            }
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }
        updateGrid();
    };
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        const keyButton = state.keyboard[letter.toUpperCase()];

        if (letter === state.secret[i]) {
            box.classList.add('right');
            if (keyButton) keyButton.classList.add('right');
        } else if (state.secret.includes(letter)) {
            box.classList.add('wrong');
            if (keyButton) keyButton.classList.add('wrong');
        } else {
            box.classList.add('empty');
            if (keyButton) keyButton.classList.add('empty');
        }
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    if (isWinner) {
        alert('¡Felicidades! Adivinaste la palabra');
    } else if (isGameOver) {
        alert(`Que pena, la palabra correcta era ${state.secret}, ¡Suerte en tu próximo intento!`);
    }
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if (state.currentCol === 5)
        return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0)
        return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function startUp() {
    const game = document.getElementById('game');
    drawGrid(game);
    const keyboard = document.getElementById('keyboard');
    drawKeyboard(keyboard);
    registerKeyboardEvents();
}

startUp();

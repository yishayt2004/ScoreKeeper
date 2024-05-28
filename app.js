const p1 = {
    score: 0,
    button: document.querySelector('#p1Button'),
    display: document.querySelector('#p1Display'),
    nameInput: document.querySelector('#p1NameInput'),
    wins: 0
};
const p2 = {
    score: 0,
    button: document.querySelector('#p2Button'),
    display: document.querySelector('#p2Display'),
    nameInput: document.querySelector('#p2NameInput'),
    wins: 0
};

const resetButton = document.querySelector('#reset');
const winningScoreSelect = document.querySelector('#playto');
const timerInput = document.querySelector('#timerInput');
const startTimerButton = document.querySelector('#startTimer');
const timerDisplay = document.querySelector('#timerDisplay');
const winModal = document.querySelector('#winModal');
const winMessage = document.querySelector('#winMessage');
const closeModalButton = document.querySelector('#closeModal');
const updateNamesButton = document.querySelector('#updateNames');
const leaderboard = document.querySelector('#leaderboard');
const gameSection = document.querySelector('#game');
const generateReportButton = document.querySelector('#generateReport');

let winningScore = 3;
let isGameOver = false;
let gameTimer = null;
let gamesPlayed = [];

function updateScores(player, opponent) {
    if (!isGameOver) {
        player.score += 1;
        if (player.score === winningScore) {
            isGameOver = true;
            player.display.classList.add('is-winning');
            opponent.display.classList.add('is-losing');
            player.button.disabled = true;
            opponent.button.disabled = true;
            winMessage.textContent = `${player.nameInput.value} Wins!`;
            winModal.classList.add('is-active');
            playSound('win');
            player.wins += 1;
            updateLeaderboard(player.nameInput.value, opponent.nameInput.value);
        } else {
            playSound('score');
        }
        player.display.textContent = player.score;
        updateBackground();
    }
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    clearInterval(gameTimer);
    gameTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerDisplay.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(gameTimer);
            timerDisplay.textContent = "Time's Up!";
            p1.button.disabled = true;
            p2.button.disabled = true;
            playSound('timeout');
        }
    }, 1000);
}

function updateLeaderboard(winner, loser) {
    const gameRecord = `${winner} defeated ${loser}`;
    gamesPlayed.push(gameRecord);
    leaderboard.innerHTML = gamesPlayed.map(game => `<p>${game}</p>`).join('');
}

function updateBackground() {
    if (p1.score > p2.score) {
        gameSection.style.backgroundColor = '#dff0d8';
    } else if (p2.score > p1.score) {
        gameSection.style.backgroundColor = '#f2dede';
    } else {
        gameSection.style.backgroundColor = '';
    }
}

p1.button.addEventListener('click', function () {
    updateScores(p1, p2);
});
p2.button.addEventListener('click', function () {
    updateScores(p2, p1);
});

winningScoreSelect.addEventListener('change', function () {
    winningScore = parseInt(this.value);
    reset();
});

resetButton.addEventListener('click', reset);

startTimerButton.addEventListener('click', function () {
    const timerValue = parseInt(timerInput.value) * 60;
    startTimer(timerValue);
});

closeModalButton.addEventListener('click', function () {
    winModal.classList.remove('is-active');
});

updateNamesButton.addEventListener('click', function () {
    p1.button.textContent = `+1 ${p1.nameInput.value}`;
    p2.button.textContent = `+1 ${p2.nameInput.value}`;
});

generateReportButton.addEventListener('click', function () {
    generateReport();
});

function reset() {
    isGameOver = false;
    for (let p of [p1, p2]) {
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('is-winning', 'is-losing');
        p.button.disabled = false;
    }
    clearInterval(gameTimer);
    timerDisplay.textContent = "5:00";
    timerInput.value = 5;
    updateBackground();
}

function playSound(type) {
    let audioUrl;
    switch (type) {
        case 'score':
            audioUrl = 'https://www.soundjay.com/button/beep-07.wav';
            break;
        case 'win':
            audioUrl = 'https://www.soundjay.com/human/cheering-01.wav';
            break;
        case 'timeout':
            audioUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
            break;
    }
    const audio = new Audio(audioUrl);
    audio.play();
}

function generateReport() {
    const reportWindow = window.open('', '_blank');
    const reportHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tournament Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                h1, h2 {
                    text-align: center;
                }
                .stats, .games {
                    margin: 20px 0;
                }
                .games p {
                    margin: 5px 0;
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                }
                .stats p {
                    font-size: 1.2em;
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <h1>Tournament Report</h1>
            <div class="stats">
                <h2>Statistics</h2>
                <p><strong>Total Games Played:</strong> ${gamesPlayed.length}</p>
                <p><strong>${p1.nameInput.value} Wins:</strong> ${p1.wins}</p>
                <p><strong>${p2.nameInput.value} Wins:</strong> ${p2.wins}</p>
            </div>
            <div class="games">
                <h2>Games Details</h2>
                ${gamesPlayed.map((game, index) => `<p>Game ${index + 1}: ${game}</p>`).join('')}
            </div>
        </body>
        </html>
    `;
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
}

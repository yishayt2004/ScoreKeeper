const p1add = document.querySelector('#p1add');
const p2add = document.querySelector('#p2add');
const p1 = document.querySelector('#p1');
const p2 = document.querySelector('#p2');

let p1score = 0;
let p2score = 0;
let winningScore = 5;
let gameOver = false;

p1add.addEventListener('click', function() {
    if (!gameOver) {
    if (p1score !== winningScore) {
    p1score += 1;
    if (p1score === winningScore) {
        gameOver = true;
        p1.style.color = 'green';
        p2.style.color = 'red';
    }
    p1.textContent = p1score;
    }
        }
});

p2add.addEventListener('click', function() {
    if (!gameOver) {
        if (p2score !== winningScore) {
            p2score += 1;
            if (p2score === winningScore) {
                gameOver = true;
                p2.style.color = 'green';
                p1.style.color = 'red';
            }
            p2.textContent = p2score;
        }
    }

});
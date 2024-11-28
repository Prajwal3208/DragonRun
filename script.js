let score = 0;
let cross = true;
let gameOverFlag = false;

const audio = new Audio('bgmusic.mp3');
const audiogo = new Audio('gameov.mp3');

document.addEventListener('keydown', () => {
    if (!audio.playing) {
        audio.loop = true;
        audio.play().catch((err) => console.log("Audio autoplay blocked:", err));
    }
});

document.onkeydown = function (e) {
    if (gameOverFlag) return; // Prevent actions after game over

    const player = document.querySelector('.player');
    let playerX = parseInt(window.getComputedStyle(player, null).getPropertyValue('left'));

    if (e.keyCode == 38) { // Jump
        if (!player.classList.contains('animatePlayer')) {
            player.classList.add('animatePlayer');
            setTimeout(() => player.classList.remove('animatePlayer'), 700);
        }
    } else if (e.keyCode == 39 && playerX < window.innerWidth - 223) { // Move right
        player.style.left = playerX + 112 + "px";
    } else if (e.keyCode == 37 && playerX > 0) { // Move left
        player.style.left = playerX - 112 + "px";
    }
};

const gameLoop = setInterval(() => {
    if (gameOverFlag) return; // Stop game loop if game over

    const player = document.querySelector('.player');
    const gameOver = document.querySelector('.gameOver');
    const obstacle = document.querySelector('.obstacle');

    const dx = parseInt(window.getComputedStyle(player, null).getPropertyValue('left'));
    const dy = parseInt(window.getComputedStyle(player, null).getPropertyValue('top'));

    const ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    const oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));

    // Simplified collision detection
    if (
        dx < ox + 100 &&    // Player's right side is past the obstacle's left side
        dx + 113 > ox &&    // Player's left side is past the obstacle's right side
        dy < oy + 10 &&    // Player's bottom side is past the obstacle's top side
        dy + 150 > oy       // Player's top side is past the obstacle's bottom side
    ) {
        gameOver.innerHTML = "Game Over - Reload to Play Again";
        gameOverFlag = true;

        obstacle.classList.remove('obstacleAni'); // Stop the obstacle
        audio.pause();
        audiogo.play();
        setTimeout(() =>{
            audiogo.pause();
        }, 1000);
        clearInterval(gameLoop); // Stop game loop
    }

    // Scoring and speed adjustment
    else if (dx + 223 > ox && dx < ox + 150 && cross) {
        score += 1;
        updateScore(score);
        cross = false;

        setTimeout(() => {
            cross = true;
        }, 1000);

        // Gradually reduce obstacle animation speed
        setTimeout(() => {
            const aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
            const newDur = Math.max(1.5, aniDur - 0.2); // Slow down decrement and set minimum duration
            obstacle.style.animationDuration = newDur + 's';
            console.log('New animation duration:', newDur);
        }, 500);
    }
}, 10);

function updateScore(score) {
    const scoreCount = document.querySelector('#scoreCount');
    scoreCount.innerHTML = "Your Score: " + score;
}

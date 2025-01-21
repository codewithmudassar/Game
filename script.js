const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to be fully responsive
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load car images
const playerCarImg = new Image();
playerCarImg.src = 'player-car.png'; // Replace with your car image

const opponentCarImg = new Image();
opponentCarImg.src = 'opponent-car.png'; // Replace with your opponent car image

// Game variables
let playerCar = { x: canvas.width / 2 - 25, y: canvas.height - 70, width: 50, height: 70, };
let opponentCars = [];
let speed = 6;
let score = 0;
let isPaused = false;

// Add opponent cars periodically
function addOpponentCar() {
    const x = Math.random() * (canvas.width - 50);
    opponentCars.push({ x, y: -100, width: 45, height: 70 });
}
setInterval(() => {
    if (!isPaused) addOpponentCar();
}, 2000);

// Check for collisions
function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Update game state
function update() {
    if (isPaused) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw road markings
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 2, i);
        ctx.lineTo(canvas.width / 2 - 2, i + 20);
        ctx.stroke();
    }

    // Draw player car
    ctx.drawImage(playerCarImg, playerCar.x, playerCar.y, playerCar.width, playerCar.height);

    // Move and draw opponent cars
    opponentCars.forEach(car => {
        car.y += speed;
        ctx.drawImage(opponentCarImg, car.x, car.y, car.width, car.height);
    });

    // Check collisions
    for (let car of opponentCars) {
        if (checkCollision(playerCar, car)) {
            showGameOverModal();
            resetGame();
            return;
        }
    }

    // Update score
    score++;
    document.getElementById('score').textContent = `Score: ${score}`;

    // Remove cars that have moved off-screen
    opponentCars = opponentCars.filter(car => car.y < canvas.height);
}

// Reset game
function resetGame() {
    playerCar.x = canvas.width / 2 - 25;
    playerCar.y = canvas.height - 120;
    opponentCars = [];
    score = 0;
    isPaused = false;
}

// Show Game Over Modal
function showGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    const finalScoreText = document.getElementById('final-score');
    finalScoreText.textContent = `Your Score: ${score}`;
    modal.style.display = 'flex';

    // Pause the game while the modal is visible
    isPaused = true;
}

// Close the modal and restart the game
document.getElementById('restart-modal-btn').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to index.html after pressing Play Again
});

// Main game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Pause and restart functionality
document.getElementById('pause-btn').addEventListener('click', () => {
    isPaused = !isPaused;
});
document.getElementById('restart-btn').addEventListener('click', resetGame);

// Move car with buttons
document.getElementById('left-btn').addEventListener('click', () => {
    if (playerCar.x > 0) playerCar.x -= 20;
});
document.getElementById('right-btn').addEventListener('click', () => {
    if (playerCar.x < canvas.width - playerCar.width) playerCar.x += 20;
});

// Move car with keyboard
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && playerCar.x > 0) playerCar.x -= 20;
    if (e.key === 'ArrowRight' && playerCar.x < canvas.width - playerCar.width) playerCar.x += 20;
});

// Start the game
gameLoop();

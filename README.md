# Realmfall
This is the web page for Realmfall
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS Arcade Racer</title>
    <style>
        body {
            margin: 0;
            background: #222;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            color: white;
            overflow: hidden;
        }
        #gameContainer {
            position: relative;
        }
        canvas {
            border: 4px solid #fff;
            background: #444;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        #ui {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 20px;
            font-weight: bold;
            text-shadow: 2px 2px 4px #000;
            pointer-events: none;
        }
    </style>
</head>
<body>

<div id="gameContainer">
    <div id="ui">Score: <span id="scoreVal">0</span></div>
    <canvas id="gameCanvas" width="400" height="600"></canvas>
</div>

<script>
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreVal = document.getElementById("scoreVal");

// Game State Variables
let score = 0;
let gameOver = false;
let gameSpeed = 5;
let roadStripesY = 0;

// Player Car Settings
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 120,
    width: 40,
    height: 70,
    speed: 6,
    movingLeft: false,
    movingRight: false
};

// Traffic Obstacles Array
let obstacles = [];
const obstacleSpawnInterval = 90; // Frame loop pacing
let frameCount = 0;

// Keyboard Input Listeners
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") player.movingLeft = true;
    if (e.key === "ArrowRight" || e.key === "d") player.movingRight = true;
    if (gameOver && e.key === " ") restartGame();
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") player.movingLeft = false;
    if (e.key === "ArrowRight" || e.key === "d") player.movingRight = false;
});

// Create Random Oncoming Cars
function spawnObstacle() {
    const laneWidth = canvas.width / 3;
    const randomLane = Math.floor(Math.random() * 3); // 3-lane setup
    
    obstacles.push({
        x: randomLane * laneWidth + (laneWidth - 40) / 2,
        y: -70,
        width: 40,
        height: 70,
        color: `hsl(${Math.random() * 360}, 80%, 50%)` // Randomized vehicle colors
    });
}

// Collision Logic
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Reset Game Loop
function restartGame() {
    obstacles = [];
    score = 0;
    gameSpeed = 5;
    gameOver = false;
    player.x = canvas.width / 2 - 20;
    scoreVal.innerText = score;
    gameLoop();
}

// Main Game Loop Engine
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = "20px Arial";
        ctx.fillText("Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 20);
        return;
    }

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Moving Road Lines (Creates scrolling illusion)
    ctx.fillStyle = "#fff";
    roadStripesY += gameSpeed;
    if (roadStripesY >= 40) roadStripesY = 0;
    
    for (let y = roadStripesY - 40; y < canvas.height; y += 40) {
        ctx.fillRect(canvas.width / 3, y, 6, 20);
        ctx.fillRect((canvas.width / 3) * 2, y, 6, 20);
    }

    // 3. Move and Constrain Player Car
    if (player.movingLeft && player.x > 10) player.x -= player.speed;
    if (player.movingRight && player.x < canvas.width - player.width - 10) player.x += player.speed;

    // Draw Player Car (Blue Sports Car Body)
    ctx.fillStyle = "#0077ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Wheels
    ctx.fillStyle = "#000";
    ctx.fillRect(player.x - 4, player.y + 10, 4, 15);
    ctx.fillRect(player.x + player.width, player.y + 10, 4, 15);
    ctx.fillRect(player.x - 4, player.y + 45, 4, 15);
    ctx.fillRect(player.x + player.width, player.y + 45, 4, 15);

    // 4. Update Obstacles Handling
    frameCount++;
    if (frameCount % obstacleSpawnInterval === 0) {
        spawnObstacle();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.y += gameSpeed;

        // Draw Obstacle Car
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        // Wheels
        ctx.fillStyle = "#000";
        ctx.fillRect(obs.x - 4, obs.y + 10, 4, 15);
        ctx.fillRect(obs.x + obs.width, obs.y + 10, 4, 15);
        ctx.fillRect(obs.x - 4, obs.y + 45, 4, 15);
        ctx.fillRect(obs.x + obs.width, obs.y + 45, 4, 15);

        // Check for Crashes
        if (checkCollision(player, obs)) {
            gameOver = true;
        }

        // Clean up passed cars and update score
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            scoreVal.innerText = score;
            
            // Gradually scale up difficulty
            if (score % 5 === 0) {
                gameSpeed += 0.5;
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

// Start Game Initializer
gameLoop();
</script>

</body>
</html>

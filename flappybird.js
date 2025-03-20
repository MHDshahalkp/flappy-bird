//board
let board;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;

let bird = {
    x: 0.1, // Percentage of screen width (initial bird position)
    y: 0.5, // Percentage of screen height (initial bird position)
    width: birdWidth,
    height: birdHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeGap = 150; // Gap between top and bottom pipes
let velocityX = -2;

let topPipeImg;
let bottomPipeImg;

let birdImg;  // Declare birdImg globally

let velocityY = 0; //bird jump speed 
let gravity = 0.4;

let gameOver = false;

let score = 0;

let pipeInterval;  // Variable to store the interval for placing pipes

window.onload = function () {
    board = document.getElementById('board');
    context = board.getContext('2d'); 

    window.addEventListener('resize', resizeCanvas); // Add resize event listener
    resizeCanvas(); // Initial canvas size setting

    // Load images
    birdImg = new Image();
    birdImg.src = 'Images/flappybird.png';
    birdImg.onload = function () {
        topPipeImg = new Image();
        topPipeImg.src = 'Images/toppipe (1).png';
        bottomPipeImg = new Image();
        bottomPipeImg.src = 'Images/bottompipe.png';

        requestAnimationFrame(update);
        pipeInterval = setInterval(placePipe, 2250); // Start placing pipes every 2.5 seconds
        document.addEventListener('keydown', moveBird);
        document.addEventListener('keydown', resetGame); // Add reset functionality
    }
};

// Dynamically resize the canvas based on window size
function resizeCanvas() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    bird.x = board.width * 0.1; // Relative to screen width
    bird.y = board.height * 0.5; // Relative to screen height

    // Adjust pipe dimensions based on screen size
    pipeWidth = board.width * 0.05; // Relative to screen width
    pipeHeight = board.height * 0.8; // Adjust the height relative to screen height
    pipeGap = board.height * 0.2; // Adjust gap between pipes based on screen height
}

// Update function for game loop
function update() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    context.clearRect(0, 0, board.width, board.height); 

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Apply gravity to current bird.
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }
    
    // Draw pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    requestAnimationFrame(update);
    displayScore();  // Updated score display
}

// Function to display score with a gradient effect and custom font
function displayScore() {
    // Semi-transparent background for the score
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(10, 10, 200, 60); // Background box for the score

    // Gradient text for the score
    let gradient = context.createLinearGradient(0, 0, 0, 50);
    gradient.addColorStop(0, 'gold');
    gradient.addColorStop(1, 'orange');

    // Custom font and styling
    context.fillStyle = gradient; // Use gradient for score color
    context.font = '48px "Press Start 2P", sans-serif'; // Retro font for style
    context.textAlign = 'center'; 
    context.textBaseline = 'middle';
    context.shadowColor = 'black';  // Shadow effect for text
    context.shadowOffsetX = 3;     // Horizontal shadow
    context.shadowOffsetY = 3;     // Vertical shadow
    context.shadowBlur = 5;        // Shadow blur

    context.fillText(Math.round(score), 110, 40); // Draw the score text in the center
}

// Function to display "Game Over" message with final score
function displayGameOver() {
    context.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Dark background for Game Over
    context.fillRect(0, 0, board.width, board.height); // Full screen background

    context.fillStyle = 'white'; // White text for "Game Over"
    context.font = '48px "Press Start 2P", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER', board.width / 2, board.height / 2 - 50);

    context.fillStyle = 'gold'; // Gold color for final score
    context.font = '36px "Press Start 2P", sans-serif';
    context.fillText('Score: ' + Math.round(score), board.width / 2, board.height / 2 + 50);
}

// Function to reset the game
function resetGame(e) {
    if (e.code == 'Space' || e.code == 'KeyR') { // Reset on Space or R key
        if (gameOver) {
            // Reset game variables
            gameOver = false;
            score = 0;
            bird.y = board.height * 0.5; // Reset bird position based on screen height
            velocityY = -1; // Reset bird speed
            pipeArray = []; // Clear pipes

            // Stop generating pipes and restart after reset
            clearInterval(pipeInterval);
            pipeInterval = setInterval(placePipe, 2250); // Start generating pipes again

            requestAnimationFrame(update); // Restart the game loop
        }
    }
}

function placePipe() {
    if (gameOver) {
        return;
    }
    // Randomly generate the height of the top pipe (move them even higher)
    let topPipeY = Math.random() * (board.height - pipeHeight - pipeGap - 400); // Further reduce the range to move pipes higher

    let topPipe = {
        img: topPipeImg,
        x: board.width, // Start pipes from the right edge
        y: topPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    let bottomPipe = {
        img: bottomPipeImg,
        x: board.width,
        y: topPipeY + pipeHeight + pipeGap, // Position the bottom pipe below the gap
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == 'Space' || e.code == 'Arrowup' || e.code == 'keyX') {
        velocityY = -6.1;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Game setup
const board = document.getElementById("board");
const rollDiceBtn = document.getElementById("rollDice");
const diceResult = document.getElementById("diceResult");
const turnIndicator = document.getElementById("turnIndicator");
const winnerMessage = document.getElementById("winnerMessage");

const players = [
    { name: "Player 1", position: 1, color: "red" },
    { name: "Player 2", position: 1, color: "blue" }
];

let currentPlayerIndex = 0;

// Snakes and Ladders Mapping
const snakes = { 97:86, 94:83, 88:67, 72:63, 65:45, 69:49, 53:32, 57:48, 34:24, 37:17, 14:2, 19:7};
const ladders = { 1:22, 15:36, 20:39, 54:74, 71:91, 76:95, 80:99, 20:29 };

// Dynamically create the board (10x10)
for (let i = 100; i > 0; i--) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = i;
    cell.dataset.cell = i;
    board.appendChild(cell);
}

// Handle Dice Roll
rollDiceBtn.addEventListener("click", () => {
    let roll = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `🎲 Roll: ${roll}`;
    
    movePlayer(roll);
});

// Move player based on dice roll
function movePlayer(roll) {
    let player = players[currentPlayerIndex];
    let newPosition = player.position + roll;

    // Check if the player reached 100 or beyond
    if (newPosition >= 100) {
        player.position = 100;
        updateBoard();
        winnerMessage.textContent = `🎉 ${player.name} Wins! 🎉`;
        rollDiceBtn.disabled = true;
        return;
    }

    // Animate player movement
    animatePlayerMove(player.position, newPosition, player, () => {
        // Check for ladders first
        if (ladders[newPosition]) {
            let ladderTop = ladders[newPosition];
            setTimeout(() => {
                animatePlayerMove(newPosition, ladderTop, player, updateBoard);
            }, 500); // Delay before moving up
            player.position = ladderTop;
        }
        // Check for snakes
        else if (snakes[newPosition]) {
            let snakeTail = snakes[newPosition];
            setTimeout(() => {
                animatePlayerMove(newPosition, snakeTail, player, updateBoard);
            }, 500); // Delay before moving down
            player.position = snakeTail;
        } else {
            player.position = newPosition;
        }

        updateBoard();

        // Switch turns
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        turnIndicator.textContent = `Turn: ${players[currentPlayerIndex].name}`;
    });
}

// Animate movement between positions
function animatePlayerMove(from, to, player, callback) {
    let steps = Math.abs(to - from);
    let stepSize = (to > from) ? 1 : -1; // Determine direction

    let interval = setInterval(() => {
        from += stepSize;
        player.position = from;
        updateBoard();

        if (from === to) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 200); // Speed of animation
}

// Update board to reflect player positions
function updateBoard() {
    document.querySelectorAll(".player").forEach(p => p.remove());

    players.forEach((player) => {
        let cell = document.querySelector(`[data-cell="${player.position}"]`);
        if (cell) {
            let playerPiece = document.createElement("div");
            playerPiece.classList.add("player");
            playerPiece.style.backgroundColor = player.color;
            cell.appendChild(playerPiece);
        }
    });
}

// Initial board update
updateBoard();

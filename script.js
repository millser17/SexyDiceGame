let rollCount = 0;
let songIndex = 0;
let currentPlayer = 1;

let player1Name = "Player 1";
let player2Name = "Player 2";

const songs = [
    "./music/song1.mp3",
    "./music/song2.mp3"
];

const output = document.getElementById("output");
const counter = document.getElementById("counter");
const player = document.getElementById("player");
const activePlayer = document.getElementById("activePlayer");

const setup = document.getElementById("setup");
const game = document.getElementById("game");

function updatePlayerDisplay() {

    if (currentPlayer === 1) {
        activePlayer.textContent =
            `Current Player: ${player1Name}`;
    } else {
        activePlayer.textContent =
            `Current Player: ${player2Name}`;
    }
}

function switchPlayer() {

    if (currentPlayer === 1) {
        currentPlayer = 2;
    } else {
        currentPlayer = 1;
    }

    updatePlayerDisplay();
}

function playSong() {

    songIndex++;

    if (songIndex >= songs.length) {
        songIndex = 0;
    }

    player.src = songs[songIndex];
    player.play();
}

function rollDice() {

    const d1 =
        Math.floor(Math.random() * 6) + 1;

    const d2 =
        Math.floor(Math.random() * 6) + 1;

    const total = d1 + d2;

    const playerName =
        currentPlayer === 1
            ? player1Name
            : player2Name;

    const hardRoll =
        d1 === d2 &&
        [4, 6, 8, 10].includes(total);

    rollCount++;

    if (hardRoll) {

        output.textContent =
            `${playerName} rolled HARD ${total}! (${d1}+${d2})`;

    } else {

        output.textContent =
            `${playerName} rolled ${d1} + ${d2} = ${total}`;

    }

    counter.textContent =
        `Roll Count: ${rollCount}`;

    if (rollCount % 7 === 0) {
        playSong();
    }

    switchPlayer();
}

document
    .getElementById("startBtn")
    .addEventListener("click", () => {

        player1Name =
            document.getElementById("p1").value ||
            "Player 1";

        player2Name =
            document.getElementById("p2").value ||
            "Player 2";

        songIndex =
            parseInt(
                document.getElementById("songSelect").value
            );

        setup.style.display = "none";
        game.style.display = "block";

        currentPlayer = 1;

        updatePlayerDisplay();

        player.src = songs[songIndex];
        player.play();
    });

document
    .getElementById("rollBtn")
    .addEventListener("click", rollDice);

document.addEventListener("keydown", (e) => {

    if (
        e.code === "Space" &&
        game.style.display !== "none"
    ) {
        e.preventDefault();
        rollDice();
    }

});

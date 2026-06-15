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
  const name = currentPlayer === 1 ? player1Name : player2Name;
  activePlayer.textContent = `Player: ${name}`;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updatePlayerDisplay();
}

function rollDice() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const total = d1 + d2;

  rollCount++;

  output.textContent = `Rolled: ${d1} + ${d2} = ${total}`;
  counter.textContent = `Roll count: ${rollCount}`;

  // switch turns every roll
  switchPlayer();

  // every 7 rolls play a song
  if (rollCount % 7 === 0) {
    playSong();
  }
}

function playSong() {
  player.src = songs[songIndex];
  player.play();

  songIndex++;
  if (songIndex >= songs.length) songIndex = 0;
}

document.getElementById("rollBtn").addEventListener("click", rollDice);

// spacebar support
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    rollDice();
  }
});

document.getElementById("startBtn").addEventListener("click", () => {
  player1Name = document.getElementById("p1").value || "Player 1";
  player2Name = document.getElementById("p2").value || "Player 2";

  setup.style.display = "none";
  game.style.display = "block";

  currentPlayer = 1;
  updatePlayerDisplay();

  // unlock audio on mobile
  player.play().then(() => {
    player.pause();
    player.currentTime = 0;
  }).catch(() => {});
});

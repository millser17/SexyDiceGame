let rollCount = 0;
let songIndex = 0;

const songs = [
  "./music/song1.mp3",
  "./music/song2.mp3"
];

const output = document.getElementById("output");
const counter = document.getElementById("counter");
const player = document.getElementById("player");

function rollDice() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const total = d1 + d2;

  rollCount++;

  output.textContent = `Rolled: ${d1} + ${d2} = ${total}`;
  counter.textContent = `Roll count: ${rollCount}`;

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

// optional keyboard support
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    rollDice();
  }
});

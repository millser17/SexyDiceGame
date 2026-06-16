window.addEventListener("DOMContentLoaded", () => {

const allSongs = [
    { name: "Song 1", file: "./music/song1.mp3" },
    { name: "Song 2", file: "./music/song2.mp3" },
    { name: "Song 3", file: "./music/song3.mp3" }
];

// STATE
let queue = [];
let used = [];

let rollCount = 0;
let currentPlayer = 1;

let player1Name = "Player 1";
let player2Name = "Player 2";

let player1Song = null;
let player2Song = null;

// ELEMENTS
const p1Song = document.getElementById("p1Song");
const p2Song = document.getElementById("p2Song");

const output = document.getElementById("output");
const counter = document.getElementById("counter");
const activePlayer = document.getElementById("activePlayer");

const nowPlaying = document.getElementById("nowPlaying");
const queueList = document.getElementById("queueList");

const player = document.getElementById("player");

const setup = document.getElementById("setup");
const game = document.getElementById("game");

// INIT DROPDOWNS
function fillDropdowns() {

    p1Song.innerHTML = "";
    p2Song.innerHTML = "";

    allSongs.forEach((song, i) => {

        const o1 = document.createElement("option");
        o1.value = i;
        o1.textContent = song.name;
        p1Song.appendChild(o1);

        const o2 = document.createElement("option");
        o2.value = i;
        o2.textContent = song.name;
        p2Song.appendChild(o2);
    });
}

fillDropdowns();

// QUEUE UI
function renderQueue() {
    queueList.innerHTML = "";
    queue.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s.name;
        queueList.appendChild(li);
    });
}

function setNowPlaying(song) {
    nowPlaying.textContent = song ? song.name : "None";
}

// SONG ENGINE
function getNextSong() {

    const next = allSongs.find(s => !used.includes(s));

    if (!next) return null;

    used.push(next);
    return next;
}

function addToQueue(song) {

    if (!song) return;

    queue.push(song);
    renderQueue();
}

function playNext() {

    if (queue.length === 0) {
        const next = getNextSong();
        if (next) addToQueue(next);
    }

    const song = queue.shift();
    if (!song) return;

    player.src = song.file;

    const playPromise = player.play();
    if (playPromise) {
        playPromise.catch(() => {});
    }

    setNowPlaying(song);
    renderQueue();
}

// GAME LOGIC
function updatePlayer() {

    activePlayer.textContent =
        currentPlayer === 1 ? player1Name : player2Name;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayer();
}

function rollDice() {

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;

    const name =
        currentPlayer === 1 ? player1Name : player2Name;

    const hard =
        d1 === d2 && [4,6,8,10].includes(total);

    output.textContent =
        hard
        ? `${name} rolled HARD ${total}! (${d1}+${d2})`
        : `${name} rolled ${d1} + ${d2} = ${total}`;

    rollCount++;
    counter.textContent = `Rolls: ${rollCount}`;

    if (total === 5 || rollCount % 7 === 0) {
        const next = getNextSong();
        addToQueue(next);
    }

    switchPlayer();
}

// START GAME
document.getElementById("startBtn").addEventListener("click", () => {

    player1Name = document.getElementById("p1").value || "Player 1";
    player2Name = document.getElementById("p2").value || "Player 2";

    const p1 = parseInt(p1Song.value);
    const p2 = parseInt(p2Song.value);

    player1Song = allSongs[p1];
    player2Song = allSongs[p2];

    used = [player1Song, player2Song];

    queue = [player1Song, player2Song];

    setup.style.display = "none";
    game.style.display = "block";

    currentPlayer = 1;
    updatePlayer();

    renderQueue();
    playNext();
});

// EVENTS
document.getElementById("rollBtn").addEventListener("click", rollDice);

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && game.style.display !== "none") {
        e.preventDefault();
        rollDice();
    }
});

player.addEventListener("ended", playNext);

});

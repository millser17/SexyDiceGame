window.addEventListener("DOMContentLoaded", () => {

// -------------------- SONG LIBRARY --------------------

const allSongs = [
    { name: "Song 1", file: "./music/song1.mp3" },
    { name: "Song 2", file: "./music/song2.mp3" },
    { name: "Song 3", file: "./music/song3.mp3" }
];

// -------------------- STATE --------------------

let availableSongs = [...allSongs];
let usedSongs = [];
let playQueue = [];

let rollCount = 0;
let currentPlayer = 1;

let player1Name = "Player 1";
let player2Name = "Player 2";

let player1Song = null;
let player2Song = null;

// -------------------- ELEMENTS --------------------

const p1SongSelect = document.getElementById("p1Song");
const p2SongSelect = document.getElementById("p2Song");

const output = document.getElementById("output");
const counter = document.getElementById("counter");
const activePlayer = document.getElementById("activePlayer");

const nowPlaying = document.getElementById("nowPlaying");
const queueList = document.getElementById("queueList");

const player = document.getElementById("player");

const setup = document.getElementById("setup");
const game = document.getElementById("game");

// -------------------- INIT DROPDOWNS --------------------

function populateSongDropdowns() {

    p1SongSelect.innerHTML = "";
    p2SongSelect.innerHTML = "";

    allSongs.forEach((song, index) => {

        const opt1 = document.createElement("option");
        opt1.value = index;
        opt1.textContent = song.name;
        p1SongSelect.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = index;
        opt2.textContent = song.name;
        p2SongSelect.appendChild(opt2);
    });
}

populateSongDropdowns();

// -------------------- QUEUE SYSTEM --------------------

function updateQueueUI() {

    queueList.innerHTML = "";

    playQueue.forEach(song => {

        const li = document.createElement("li");
        li.textContent = song.name;
        queueList.appendChild(li);
    });
}

function updateNowPlaying(song) {

    nowPlaying.textContent = song ? song.name : "None";
}

// -------------------- SONG ENGINE --------------------

function getNextUnusedSong() {
    return availableSongs.shift() || null;
}

function addSongToQueue(song) {

    if (!song) return;

    playQueue.push(song);
    usedSongs.push(song);

    updateQueueUI();
}

function playNextSong() {

    if (playQueue.length === 0) {

        const next = getNextUnusedSong();
        if (next) addSongToQueue(next);
    }

    const song = playQueue.shift();

    if (!song) return;

    player.src = song.file;
    player.play();

    updateNowPlaying(song);
    updateQueueUI();
}

// -------------------- GAME LOGIC --------------------

function updatePlayerDisplay() {

    const name =
        currentPlayer === 1 ? player1Name : player2Name;

    activePlayer.textContent = `Current Player: ${name}`;
}

function switchPlayer() {

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerDisplay();
}

function rollDice() {

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;

    const name =
        currentPlayer === 1 ? player1Name : player2Name;

    let text = "";

    if (d1 === d2 && [4,6,8,10].includes(total)) {
        text = `${name} rolled HARD ${total}! (${d1}+${d2})`;
    } else {
        text = `${name} rolled ${d1} + ${d2} = ${total}`;
    }

    output.textContent = text;

    rollCount++;
    counter.textContent = `Rolls: ${rollCount}`;

    if (total === 5 || rollCount % 7 === 0) {
        const next = getNextUnusedSong();
        if (next) addSongToQueue(next);
    }

    switchPlayer();
}

// -------------------- START GAME --------------------

document.getElementById("startBtn").addEventListener("click", () => {

    player1Name = document.getElementById("p1").value || "Player 1";
    player2Name = document.getElementById("p2").value || "Player 2";

    const p1Index = parseInt(p1SongSelect.value);
    const p2Index = parseInt(p2SongSelect.value);

    player1Song = allSongs[p1Index];
    player2Song = allSongs[p2Index];

    availableSongs = allSongs.filter(s =>
        s !== player1Song && s !== player2Song
    );

    playQueue.push(player1Song);
    playQueue.push(player2Song);

    setup.style.display = "none";
    game.style.display = "block";

    currentPlayer = 1;
    updatePlayerDisplay();

    updateQueueUI();

    playNextSong();
});

// -------------------- EVENTS --------------------

document.getElementById("rollBtn").addEventListener("click", rollDice);

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && game.style.display !== "none") {
        e.preventDefault();
        rollDice();
    }
});

player.addEventListener("ended", playNextSong);

});

import * as wasm from "wasm-number-game";

const SLOTS = 20;
const LOW = 1;
const HIGH = 1000;

const startButton = document.getElementById("start-button");
const nextOutput = document.getElementById("next");
const gameSummary = document.getElementById("game-summary");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");
const slots = Array.from(document.getElementsByClassName("slot"));

let game;

function updateGame() {
  nextOutput.innerText = game.next();

  for (let i = 0; i < slots.length; ++i) {
    const s = game.slot(i);

    slots[i].disabled = !s.enabled;
    slots[i].innerText = s.render();
  }

  const numFilled = game.num_filled();
  progressLabel.innerText = `${numFilled}/${SLOTS}`;
  progressBar.innerText = progressLabel.innerText;
  progressBar.value = numFilled;

  const numAvailable = game.num_available();
  if (numAvailable == 0) {
    endGame();
  }
}

function startGame() {
  startButton.style.display = "none";
  gameSummary.style.display = "flex";

  game = wasm.Game.new(SLOTS, LOW, HIGH);

  for (const slot of slots) {
    slot.addEventListener("click", step);
  }

  updateGame();
}

function endGame() {
  startButton.style.display = "block";
}

function step(e) {
  const idx = slots.indexOf(e.target);
  game.step(idx);
  updateGame();
}

startButton.addEventListener("click", startGame);

slots.forEach((slot) => {
  slot.disabled = true;
  slot.innerText = "";
});

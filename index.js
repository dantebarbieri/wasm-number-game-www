import * as wasm from "wasm-number-game";

const startButton = document.getElementById("start-button");
const nextOutput = document.getElementById("next");
const gameSummary = document.getElementById("game-summary");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");
const slots = document.getElementsByClassName("slot");

function startGame() {
  startButton.style.display = "none";

  gameSummary.style.display = "flex";

  getNextRandom();

  for (const slot of slots) {
    slot.disabled = false;
    slot.addEventListener("click", step);
  }
}

function endGame() {
  startButton.style.display = "block";
}

function step(e) {
  e.target.disabled = true;
  e.target.innerText = nextOutput.innerText;
  getNextRandom();
  let s = slots.length;
  for (; s > 0; --s) {
    if (
      slots[s - 1].innerText &&
      +slots[s - 1].innerText < +nextOutput.innerText
    ) {
      break;
    }
  }

  let t = 0;
  if (!(slots[0].innerText && slots[0].innerText > nextOutput.innerText)) {
    for (; t + 1 < slots.length; ++t) {
      if (
        slots[t + 1].innerText &&
        +slots[t + 1].innerText > +nextOutput.innerText
      ) {
        break;
      }
    }
  }

  let any = false;
  for (let i = 0; i < slots.length; ++i) {
    slots[i].disabled = !(s <= i && i <= t);
    any ||= !slots[i].disabled;
  }

  if (!any) {
    endGame();
  }
}

function getNextRandom() {
  nextOutput.innerText = wasm.next(1, 1000);

  progressLabel.innerText = `${getNumberFilledSlots()}/${slots.length}`;
  progressBar.innerText = progressLabel.innerText;
  progressBar.value = getNumberFilledSlots();
}

function getNumberFilledSlots() {
  let acc = 0;

  for (const slot of slots) {
    if (slot.innerText) {
      acc++;
    }
  }

  return acc;
}

// Attach click event to the start button
startButton.addEventListener("click", startGame);

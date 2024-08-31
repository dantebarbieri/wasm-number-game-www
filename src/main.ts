import * as wasm from "wasm-number-game";

const SLOTS = 20;
const LOW = 1;
const HIGH = 1000;
const INITIAL_STATS: GameStats = {
  totalGames: 0,
  totalFilled: 0,
  totalWins: 0,
  minFilled: null,
  maxFilled: null,
};

const startButton = document.getElementById(
  "start-button",
) as HTMLButtonElement;
const resetButton = document.getElementById(
  "reset-button",
) as HTMLButtonElement;
const nextOutput = document.getElementById("next") as HTMLOutputElement;
const gameSummary = document.getElementById("game-summary") as HTMLDivElement;
const progressLabel = document.getElementById(
  "progress-label",
) as HTMLLabelElement;
const progressBar = document.getElementById(
  "progress-bar",
) as HTMLProgressElement;
const slots = Array.from(
  document.getElementsByClassName("slot"),
) as HTMLButtonElement[];
const totalGames = document.getElementById("games") as HTMLSpanElement;
const totalWins = document.getElementById("wins") as HTMLSpanElement;
const averageFilled = document.getElementById("mean") as HTMLSpanElement;
const minFilled = document.getElementById("worst") as HTMLSpanElement;
const maxFilled = document.getElementById("best") as HTMLSpanElement;

let game: wasm.Game;
let gameStats: GameStats;

interface GameStats {
  totalGames: number;
  totalWins: number;
  totalFilled: number;
  minFilled: number | null;
  maxFilled: number | null;
}

function initializeGameStats() {
  let storedStats = localStorage.getItem("gameStats");
  gameStats = storedStats === null ? INITIAL_STATS : JSON.parse(storedStats);
  updateStatsUI();
}

function resetGameStats() {
  if (
    confirm("Are you sure you want to reset your stats? You cannot undo this.")
  ) {
    gameStats = INITIAL_STATS;
    localStorage.setItem("gameStats", JSON.stringify(gameStats));
    updateStatsUI();
  }
}

function updateGameStats(numFilled: number) {
  ++gameStats.totalFilled;
  gameStats.maxFilled = Math.max(gameStats.maxFilled ?? 0, numFilled);

  updateStatsUI();
}

function updateEndGameStats(numFilled: number) {
  gameStats.totalGames += 1;
  gameStats.minFilled = Math.min(gameStats.minFilled ?? SLOTS, numFilled);
  if (numFilled === SLOTS) {
    gameStats.totalWins += 1;
  }

  localStorage.setItem("gameStats", JSON.stringify(gameStats));
  updateStatsUI();
}

function updateStatsUI() {
  const avgFilled =
    gameStats.totalGames > 0
      ? gameStats.totalFilled / gameStats.totalGames
      : gameStats.totalFilled;

  totalGames.textContent = gameStats.totalGames.toString();
  totalWins.textContent = gameStats.totalWins.toString();
  averageFilled.textContent = avgFilled.toFixed(2);
  minFilled.textContent = gameStats.minFilled?.toString() ?? null;
  maxFilled.textContent = gameStats.maxFilled?.toString() ?? null;
}

function updateGame(): void {
  nextOutput.textContent = game.next()?.toString() ?? null;

  for (let i = 0; i < slots.length; ++i) {
    const s = game.slot(i);

    slots[i].disabled = !s.enabled;
    slots[i].textContent = s.render();
  }

  const numFilled = game.num_filled();
  progressLabel.textContent = `${numFilled}/${SLOTS}`;
  progressBar.textContent = progressLabel.textContent;
  progressBar.value = numFilled;

  const numAvailable = game.num_available();
  if (numAvailable === 0) {
    endGame();
  }
}

function startGame(): void {
  startButton.style.display = "none";
  gameSummary.style.display = "flex";

  game = wasm.Game.new(SLOTS, LOW, HIGH);

  for (const slot of slots) {
    slot.addEventListener("click", step);
  }

  updateGame();
}

function endGame(): void {
  startButton.style.display = "block";
  updateEndGameStats(game.num_filled());
}

function step(e: Event): void {
  const target = e.target as HTMLButtonElement;
  const idx = slots.indexOf(target);
  game.step(idx);
  updateGame();
  updateGameStats(game.num_filled());
}

startButton.addEventListener("click", startGame);

resetButton.addEventListener("click", resetGameStats);

slots.forEach((slot) => {
  slot.disabled = true;
  slot.textContent = null;
});

initializeGameStats();

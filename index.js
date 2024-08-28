import * as wasm from "wasm-number-game";

const startButton = document.getElementById("start-button");
const gameSummary = document.getElementById("game-summary");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");

// Function to start the game
function startGame() {
  // Hide the start button
  startButton.style.display = "none";

  // Show the game summary section
  gameSummary.style.display = "block";

  progressLabel.innerText = "0/20";
  progressBar.innerText = progressLabel.innerText;
  progressBar.value = 0;

  // Example: Simulate game over after some time
  setTimeout(endGame, 5000); // Game lasts 5 seconds for example
}

// Function to end the game
function endGame() {
  // Show the start button again
  startButton.style.display = "block";

  // The game summary remains visible
}

// Attach click event to the start button
startButton.addEventListener("click", startGame);

wasm.greet();

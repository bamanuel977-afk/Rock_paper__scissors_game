let userWins = 0;
let computerWins = 0;

const choiceButtons = document.querySelectorAll(".choice");
const userScore = document.getElementById("user-score");
const computerScore = document.getElementById("computer-score");
const resultText = document.getElementById("result");
const movesText = document.getElementById("moves");
const resetButton = document.getElementById("reset-button");

// Show the correct emoji for each move
function getEmoji(choice) {
  if (choice === "rock") {
    return "🪨";
  } else if (choice === "paper") {
    return "📄";
  } else {
    return "✂️";
  }
}

// Play one round
async function playGame(choice) {
  // Prevent clicking multiple buttons while waiting
  choiceButtons.forEach((button) => {
    button.disabled = true;
  });

  resultText.textContent = "Playing...";
  movesText.textContent = "Waiting for the computer...";

  try {
    // Send the player's choice to Python
    const response = await fetch("/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        choice: choice,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    // Display both choices
    movesText.textContent =
      "You: " +
      getEmoji(data.user_choice) +
      " " +
      data.user_choice.toUpperCase() +
      " | Computer: " +
      getEmoji(data.computer_choice) +
      " " +
      data.computer_choice.toUpperCase();

    // Update the result and scoreboard
    resultText.textContent = data.result;

    if (data.result === "You win!") {
      userWins++;
    } else if (data.result === "Computer wins!") {
      computerWins++;
    }

    userScore.textContent = userWins;
    computerScore.textContent = computerWins;
  } catch (error) {
    resultText.textContent = "Error!";
    movesText.textContent = error.message;
  } finally {
    // Allow the player to choose again
    choiceButtons.forEach((button) => {
      button.disabled = false;
    });
  }
}

// Connect every move button to the game
choiceButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const choice = this.dataset.choice;
    playGame(choice);
  });
});

// Start a new match
resetButton.addEventListener("click", function () {
  userWins = 0;
  computerWins = 0;

  userScore.textContent = 0;
  computerScore.textContent = 0;

  resultText.textContent = "Your game starts here!";
  movesText.textContent = "Make your first move.";
});

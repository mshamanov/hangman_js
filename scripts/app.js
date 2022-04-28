const hangman = new Hangman(5);
const hintedLetters = [];

initGame();

function initGame() {
  document.addEventListener("click", () => {
    focusOnUserInput();
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Tab") {
      e.preventDefault();
      openHint();
    }
  });

  guessInputEl.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });


  hintBtnEl.addEventListener("click", (e) => {
    openHint();
  });

  newGameBtn.addEventListener("click", (e) => {
    startNewGame();
  });

  guessFormEl.addEventListener("submit", (e) => {
    e.preventDefault();

    if (hangman.status !== Hangman.STATUS_PLAYING) {
      return;
    }

    makeGuess();
  });

  showOverlayDialog();
}

async function resetGame(timeout = 0) {
  if (timeout > 0) {
    await Promise.all(createLoadingDots(timeout));
  }

  onReset();
}

function startNewGame() {
  hideOverlayDialog();
  resetGame(1000);
}

function makeGuess() {
  const wordGuessed = hangman.makeGuess(guessInputEl.value);

  if (wordGuessed) {
    onGuessed();
  } else if (!hangman.hasAvailableAttempts()) {
    onGameOver();
  } else {
    onMistake();
  }
}

function openHint() {
  const hintedIndex = hangman.openHint();

  if (hintedIndex !== undefined) {
    updateQuizWord();
    updateScoreCircle();
    updateHints();
  }
}

function onReset() {
  clearUserInput();
  enableAllActions();
  hangman.reset();
  reRender();
}

function onGuessed() {
  showCorrectSign();
  animateScoreCircle().then(() => {
    updateScore();
    resetGame(2000);
  });
}

function onMistake() {
  showIncorrectSign();
  updateAttempts();
}

function onGameOver() {
  showGameOverSign();
  disableAllActions();
  showOverlayDialog();
}
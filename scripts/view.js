// scores
const scoreEl = document.querySelector('#score');
const scoreCircleEl = document.querySelector('#score-circle');

// form
const quizBoxEl = document.querySelector('#quiz-box');
const quizWordEl = document.querySelector('#quiz-word');
const guessFormEl = document.querySelector('#guess-form');
const guessInputEl = document.querySelector('#user-input');
const attemptsEl = document.querySelector('#attempts-left');
const hintsEl = document.querySelector('#hints-left');

// buttons
const newGameBtn = document.querySelector('#new-game-btn');
const hintBtnEl = document.querySelector('#hint-btn');
const guessBtnEl = document.querySelector('#guess-btn');

// signs
const leftSignEl = document.querySelector("#sign-left");
const rightSignEl = document.querySelector("#sign-right");

// overlay
const overlayEl = document.querySelector("#overlay");

function clearUserInput() {
    guessInputEl.value = "";
}

function focusOnUserInput() {
    guessInputEl.focus();
}

function updateScore() {
    scoreEl.textContent = `Баллы: ${hangman.totalScore}`;
}

function updateScoreCircle() {
    showElement(scoreCircleEl);
    scoreCircleEl.textContent = `+${hangman.scoreStrategy.current}Б`;
}

function updateQuizWord() {
    const currentWord = hangman.userWord;

    quizWordEl.innerHTML = "";

    const p = document.createElement("p");
    for (let i = 0; i < currentWord.length; i++) {
        const span = document.createElement("span");
        if (hangman.hinted.includes(i)) {
            span.classList.add("red");
        }
        span.textContent = currentWord[i];
        p.appendChild(span);
    }

    quizWordEl.appendChild(p);
}

function updateAttempts() {
    attemptsEl.textContent = `Попыток: ${hangman.attemptsLeft}`;
}

function updateHints() {
    if (hangman.hintsLeft === 0) {
        disable(hintBtnEl);
    }

    hintsEl.innerHTML = "";

    const totalHintsSpan = document.createElement("span");
    totalHintsSpan.textContent = `Подсказок: ${hangman.hintsLeft}`;

    let reducerSpan = null;
    if (hangman.scoreStrategy.reducer > 0) {
        reducerSpan = document.createElement("span");
        reducerSpan.classList.add("red");
        reducerSpan.textContent = ` (-${hangman.scoreStrategy.reducer} баллов)`;
    }

    hintsEl.appendChild(totalHintsSpan);

    if (reducerSpan !== null) {
        hintsEl.appendChild(reducerSpan);
    }
}

function showCorrectSign() {
    showSign("right", "up");
}

function showIncorrectSign() {
    showSign("left", "down");
}

function showGameOverSign() {
    showSign("both", "gameover", 1000);
}

function showSign(position, type, ms = 500) {
    let sign;

    if (type === "up") {
        sign = "👍🏻";
    } else if (type === "down") {
        sign = "👎🏻";
    } else {
        sign = "❌";
    }

    const elements = [];

    if (position === "left") {
        elements.push(leftSignEl);
    } else if (position === "right") {
        elements.push(rightSignEl);
    } else {
        elements.push(leftSignEl);
        elements.push(rightSignEl);
    }

    elements.forEach(el => el.textContent = sign);

    const toggle = () => elements.forEach(el => el.classList.toggle("hidden"));
    toggle();
    setTimeout(toggle, ms);
}

async function animateScoreCircle() {
    return new Promise(resolve => {
        addClassToElement(scoreCircleEl, "score-circle-animate");
        setTimeout(() => {
            removeClassFromElement(scoreCircleEl, "score-circle-animate");
            hideElement(scoreCircleEl);
            resolve(null);
        }, 500);
    });
}

function showOverlayDialog() {
    showElement(overlayEl);
    addClassToElement(overlayEl, "appear");
}

function hideOverlayDialog() {
    hideElement(overlayEl);
    removeClassFromElement(overlayEl, "appear");
}

function hideElement(element) {
    addClassToElement(element, "hidden");
}

function showElement(element) {
    removeClassFromElement(element, "hidden");
}

function addClassToElement(element, className) {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
    }
}

function removeClassFromElement(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

function disable(element) {
    element.setAttribute("disabled", "");
}

function enable(element) {
    element.removeAttribute("disabled");
}

function enableAllActions() {
    enable(guessInputEl);
    enable(guessBtnEl);
    enable(hintBtnEl);
}

function disableAllActions() {
    disable(guessInputEl);
    disable(guessBtnEl);
    disable(hintBtnEl);
}

function reRender() {
    updateScore();
    updateScoreCircle();
    updateQuizWord();
    updateAttempts();
    updateHints();
    focusOnUserInput()
}

function createLoadingDots(timeout) {
    function loadingDotSample(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (quizWordEl.textContent.length >= 3) {
                    quizWordEl.textContent = "";
                }
                quizWordEl.textContent += ".";
                resolve(null);
            }, ms);
        });
    }

    const promises = [];

    for (let i = 0; i <= timeout; i += 200) {
        promises.push(loadingDotSample(i));
    }

    return promises;
}
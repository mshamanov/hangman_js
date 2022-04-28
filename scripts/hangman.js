class Hangman {
    static STATUS_PLAYING = 'playing';
    static STATUS_FINISHED = 'finished';
    static STATUS_FAILED = 'failed';

    constructor() {
        this.totalScore = 0;
        this.hinted = [];
    }

    makeGuess(word) {
        if (this.status !== Hangman.STATUS_PLAYING) {
            return;
        }

        if (this.quizWord === word) {
            this.status = Hangman.STATUS_FINISHED;
            this.setScore(this.totalScore + this.scoreStrategy.current);
            return true;
        } else {
            this.attemptsLeft--;
        }

        if (!this.hasAvailableAttempts()) {
            this.status = Hangman.STATUS_FAILED;
        }

        return false;
    }

    hasAvailableAttempts() {
        return this.attemptsLeft > 0;
    }

    openHint() {
        if (this.status !== Hangman.STATUS_PLAYING || this.hintsLeft === 0) {
            return;
        }

        this.hintsLeft--;

        if (this.quizWord === this.userWord) {
            return undefined;
        }

        let randomIdx;

        do {
            randomIdx = Math.floor(Math.random() * this.quizWord.length);
        } while (this.hinted.includes(randomIdx));

        const validLetter = this.quizWord[randomIdx];
        const puzzleAsArray = this.userWord.split("");

        let swapIndex = puzzleAsArray.findIndex((l, idx) => l === validLetter && !this.hinted.includes(idx));

        if (swapIndex === -1) {
            throw new Error("invalid state");
        }

        const temp = puzzleAsArray[randomIdx];
        puzzleAsArray[randomIdx] = puzzleAsArray[swapIndex];
        puzzleAsArray[swapIndex] = temp;

        this.userWord = puzzleAsArray.join("");

        if (this.scoreStrategy.current > 10) {
            this.scoreStrategy.current -= this.scoreStrategy.reducer;
        }

        this.hinted.push(randomIdx);
        return randomIdx;
    }

    setScore(score = 0) {
        this.totalScore = score;
    }

    reset() {
        const calcNumberOfHints = () => {
            return this.userWord.length < 6 ? 0 : Math.floor(this.userWord.length / 3);
        };

        const createScoreStrategy = () => {
            return this.quizWord.length > 4 ? {
                current: 30,
                reducer: 5
            } : {
                current: 10,
                reducer: 0
            };
        }

        this.hinted.length = 0;
        this.quizWord = randomWord().toUpperCase();
        this.userWord = shuffle(this.quizWord);

        this.scoreStrategy = createScoreStrategy();
        this.hintsLeft = calcNumberOfHints();
        this.attemptsLeft = 3;

        this.status = Hangman.STATUS_PLAYING;
    }

    newGame() {
        this.reset();
        this.setScore(0);
    }
}
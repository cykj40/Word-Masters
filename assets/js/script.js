const ANSWER_LENGTH = 5;
const ROUNDS = 6;
const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");

// Init function so i can use async/await
async function init() {
    let currentRow = 0;
    let currentGuess = "";
    let done = false;
    let isLoading = true;

    // Get the Word of the day from the API
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const { word: wordRes } = await res.json();
    const word = wordRes.toUpperCase();
    const wordParts = word.split("");
    isLoading = false;
    setLoading(isLoading);

    // user adds a letter to the guess
    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            current = currentGuess.substring(0, currentGuess.length - 1) + letter;

    }
    letters[curerntRow * ANSWER_LENGTH + currentGuess.length - 1].innerText = letter;
    }
    // user tries to enter a guess
    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) 
        return;
    }

    // check api to see if its a valid word
    isLoading = true;
    setLoading(isLoading);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ word: currentGuess }),
});
const { validword } = await res.json();
isLoading = false;
setLoading(isLoading);

// if not valid mark word as invalid
if (!validWord) {
    markInvalidWord();
    return;
}

const guessParts = currentGuess.split("");
const map = makeMap(wordParts);
let allRight = true;

// first pass, check for correct letters and mark them
for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
    }
}

// second pass, check for correct letters in the wrong place
for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (guessParts[i] === wordParts[i]) {

    } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
        allRight = false;
        letters[currentRow * ANSWER_LENGTH + i].classList.add("almost");
        map[guessParts[i]]--;
    } else {
        allRight = false;
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
    }
}

currentRow++;
currentGuess = "";
if (allRight) {
    alert("You win!");
    document.querySelector(".brand").classList.add("winner");
    done = true;
} else if (currentRow === ROUNDS) {
    alert(`You lose! The word was ${word}`);
    done = true;
}
}

// user hits backspace, if the length is 0, then do nothing
function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
}

// let the user know that guess wasnt a real word
function markInvalidWord() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
        letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
        setTimeout(
            () => letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),
            10
        );

    }
}

// listening for event keys and routing them to the correct function
document.addEventListener("keydown", function handleKeyPress(event) {
    if (done || isLoading) {
        return;
    }
    const action = event.key;

    if (action === "Enter") {
        commit();
    } else if (action === "Backspace") {
        backspace();
    } else if (isLetter(action)) {
        addLetter(action.toUpperCase());

    } else {
    }

});


// check if a key is a letter
function isLetter(letter) {
    return /^[A-Za-z]$/.test(letter);
}

// show the loadfing spinner when needed
function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]]++;
        } else {
            obj[array[i]] = 1;
        }
    }
    return obj;

}

init();
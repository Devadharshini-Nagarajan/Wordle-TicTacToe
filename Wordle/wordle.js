let chosenWord = "abbey";

let guessesTotal = 6;
let wordCount = 5;

let currentHistory = [];
let currentRow = 0;
let currentColumn = 0;
let colorMapping = {};
let startGame = true;
let keyboardPattern = {
  "first-row": ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  "second-row": ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  "third-row": ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
};
let currentHistoryColor = [];

initiateGame();

function initiateGame() {
  currentHistory = setBaseForGame(guessesTotal, wordCount);
  updateUI();
  updateKeyboard();

  document.addEventListener("keyup", (e) => {
    let key = e.key;
    if (startGame) {
      console.log(currentColumn);
      if (key === "Backspace" && currentColumn > 0) {
        console.log("backspace");
        currentHistory[currentRow][currentColumn - 1] = "";
        currentColumn--;
      }
      if (key == "Enter" && currentColumn >= wordCount) {
        console.log("enter");
        checkGameLogic();
      }
      if (currentColumn === wordCount) {
        console.log("column end");
        return;
      }
      if (key.match(/^[a-zA-Z]+$/) && key.length === 1) {
        console.log("key", key);
        // on key
        currentHistory[currentRow][currentColumn] = key;
        currentColumn++;
      }
      updateUI();
    }
  });
}

function checkGameLogic() {
  if (currentHistory[currentRow].join("") === chosenWord) {
    updateBothSections()
    setTimeout(() => alert("Hurray!!! You found the word " + chosenWord.toUpperCase()), 2000);
  } else {
    if (currentRow === guessesTotal - 1) {
      alert("Oops! Game over");
      updateBothSections()
      return;
    }
    updateBothSections()
    currentRow++;
    currentColumn = 0;
  }
}


function updateBothSections() {
  colorLogic();
  updateKeyboard();
  updateUI();
}

function onKeySelected(letterKey) {
  document.dispatchEvent(new KeyboardEvent("keyup", { key: letterKey }));
}

function updateUI() {
  let board = document.getElementById("game-board");
  board.innerHTML = "";
  currentHistory.forEach((row, rowIndex) => {
    let rowDiv = document.createElement("div");
    rowDiv.className = "letter-row";

    row.forEach((el, i) => {
      let box =
        "<div class='letter-box' style='background-color:" +
        getBoxColor(el, i, rowIndex) +
        "'>" +
        el +
        "</div>";
      rowDiv.insertAdjacentHTML("beforeend", box);
    });

    board.appendChild(rowDiv);
  });
}

function setBaseForGame(guesses, letters) {
  let finalArr = [];
  [...Array(guesses)].forEach((guess) => {
    let val = [];
    [...Array(letters)].forEach((el) => {
      val.push("");
    });
    finalArr.push(val);
  });
  return finalArr;
}

function updateKeyboard() {
  let keyboardDiv = document.getElementById("keyboard-pattern");
  keyboardDiv.innerHTML = "";
  Object.keys(keyboardPattern).forEach((rowkey, index) => {
    let rowDiv = document.createElement("div");
    rowDiv.className = rowkey;

    keyboardPattern[rowkey].forEach((letterKey) => {
      let btn =
        "<button class='keyboard-button' style='background-color:" +
        getKeypadColor(letterKey) +
        "'onclick=onKeySelected('" +
        letterKey +
        "')>" +
        letterKey +
        "</button>";
      rowDiv.insertAdjacentHTML("beforeend", btn);
    });
    keyboardDiv.appendChild(rowDiv);
  });
}

function getKeypadColor(letter) {
  if (letter.length === 1) {
    let fullString = currentHistory.map((e) => e.join("")).join("");
    if (fullString.includes(letter) && chosenWord.includes(letter))
      return "#6aaa64"; // green
    if (fullString.includes(letter) && !chosenWord.includes(letter))
      return "#86888a"; // yellow
  } else {
    return "lightgrey";
  }
}

function getBoxColor(letter, index, rowIndex) {
  if (letter && rowIndex <= currentRow) {
    if(currentHistoryColor[rowIndex]) {
      return currentHistoryColor[rowIndex][index];
    }
  }
}

function getCounts(arr, isInitial) {
  let counts = {};
  for (const num of arr) {
    counts[num] = isInitial ? 0 : counts[num] ? counts[num] + 1 : 1;
  }
  return counts;
}

function resetGame() {
  currentHistory = setBaseForGame(guessesTotal, wordCount);
  currentHistoryColor = [];
  currentRow = 0;
  currentColumn = 0;
  updateKeyboard();
  updateUI();
}
const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

function colorLogic() {
  let word = currentHistory[currentRow].join("");
  let finalArr = ["", "", "", "", ""];
  let countChosenWord = getCounts([...chosenWord], false);
  let countWord = getCounts([...word], true);

  for (i = 0; i <= word.length - 1; i++) {
    if (chosenWord[i] === word[i]) {
      finalArr[i] = "#6aaa64"; // green
      countWord[word[i]] = countWord[word[i]] + 1;
    }
  }

  for (i = 0; i <= word.length; i++) {
    if (finalArr[i] === "") {
      if (countWord[word[i]] < countChosenWord[word[i]]) {
        finalArr[i] = "#86888a"; // yellow
        countWord[word[i]] = countWord[word[i]] + 1;
      } else {
        finalArr[i] = "lightgrey";
      }
    }
  }
  currentHistoryColor.push(finalArr);
}

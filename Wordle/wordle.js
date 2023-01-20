let chosenWord = "arour";

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
let currentHistoryColor = []

initiateGame();

function initiateGame() {
  currentHistory = setBaseForGame(guessesTotal, wordCount);
  currentHistoryColor = setBaseForGame(guessesTotal, wordCount);
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
    updateKeyboard();
    alert("you found it");
    resetGame();
  } else {
    if (currentRow === guessesTotal - 1) {
      alert("Game over");
      resetGame();
      return;
    }
    colorLogic();
    currentRow++;
    currentColumn = 0;
    updateKeyboard();
  }
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
      return "#6aaa64";
    if (fullString.includes(letter) && !chosenWord.includes(letter))
      return "#86888a";
  } else {
    return "lightgrey";
  }
}

function getBoxColor(letter, index, rowIndex) {
  if (letter && rowIndex < currentRow) {
    if (!chosenWord.includes(letter)) {
      // not founf
      return "#86888a"; // gray
    } else {
      // letter found
      let chosenWordinArr = [...chosenWord];
      let isAtSameIndex = chosenWordinArr[index] === letter;
      let counts = getCounts(chosenWordinArr);
      for (const num of chosenWordinArr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      console.log('c',getCounts(currentHistory[rowIndex].join(''))[letter], getCounts(chosenWordinArr)[letter])
      if (isAtSameIndex) {
        return "#6aaa64"; // green
      }
        // else if(!isAtSameIndex && getCounts(currentHistory[rowIndex].join(''))[letter] <= getCounts(chosenWordinArr)[letter]) {
        //   return "#6aaa64";  // green
        // }
      else return "#c9b458"; // yellow
    }
  }
}

function getCounts(arr) {
  let counts = {};
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  return counts;
}

function resetGame() {
  currentHistory = setBaseForGame(guessesTotal, wordCount);
  currentRow = 0;
  currentColumn = 0;
  updateKeyboard();
}
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
function colorLogic() {
    let answer = [];
    let chosenWordinArr = [...chosenWord];

    // if(rowIndex < currentColumn) {
        let word = currentHistory[currentRow];
        let result = word.map((letter,i) => {
            answer.push(letter);
            let blockClass = 'blockGrey';
            if(chosenWordinArr.includes(letter)) {
                if(chosenWordinArr[i] === letter) {
                    blockClass = ' blockGreen';
                } else {
                    if(countOccurrences(chosenWordinArr, letter) > 0) {
                        if(countOccurrences(answer, letter) <= countOccurrences(chosenWordinArr,letter)){
                            blockClass = ' blockGold';
                        } else {
                            blockClass = ' blockGrey';
                        }
                    }
                }
            } 
            return blockClass;
        })
        console.log(result)
    // }
}
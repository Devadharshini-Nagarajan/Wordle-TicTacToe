// variables
let history = [];
let turn = "";
let winner = "";
let matchStatus = ""; // draw, win , ""
let beginGame = false;
let isOffline = false;

let gridValue = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let turnSpan = document.getElementById("whosTurn");
let startGameButton = document.getElementById("startGame");
let matchStatusDiv = document.getElementById("matchStatus");

initiateGame();
callAPILogic();

// functions
function initiateGame() {
  turnSpan.innerHTML = "";
  turnSpan.hidden = true;
  matchStatusDiv.innerHTML = "";
  startGameButton.hidden = false;
  renderBlock();
}

function renderBlock() {
  var myTableDiv = document.getElementById("myDynamicTable");
  myTableDiv.innerHTML = "";
  var table = document.createElement("TABLE");
  table.border = "1";

  var tableBody = document.createElement("TBODY");
  table.appendChild(tableBody);

  gridValue.forEach((row, rowIndex) => {
    let tr = document.createElement("tr");
    tableBody.appendChild(tr);
    row.forEach((el, columnIndex) => {
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(el ? el : ""));
      td.onclick = () => onTdSelected(rowIndex, columnIndex);
      tr.appendChild(td);
    });
  });
  myTableDiv.appendChild(table);
}

function onTdSelected(rowIndex, columnIndex) {
  if (!gridValue[rowIndex][columnIndex] && beginGame) {
    gridValue[rowIndex][columnIndex] = turn;
    checkGameLogic();
  }
}

function checkGameLogic() {
  if (!matchStatus) {
    if (isOffline) {
      let allHasValue = gridValue
        .join()
        .split(",")
        .every((el) => ["X", "O"].includes(el));
      const winCombos = [
        ["00", "01", "02"],
        ["10", "11", "12"],
        ["20", "21", "22"],
        ["00", "10", "20"],
        ["01", "11", "21"],
        ["02", "12", "22"],
        ["20", "11", "02"],
        ["00", "11", "22"],
      ];

      winCombos.forEach((el) => {
        if (
          gridValue[el[0][0]][el[0][1]] === gridValue[el[1][0]][el[1][1]] &&
          gridValue[el[1][0]][el[1][1]] === gridValue[el[2][0]][el[2][1]] &&
          ["X", "O"].includes(gridValue[el[1][0]][el[1][1]])
        ) {
          history.push(turn);
          matchStatus = turn + " won the game";
          renderHistoryTable();
        }
      });
      if (!matchStatus) {
        if (allHasValue) {
          matchStatus = "Match draw";
          history.push("draw");
          renderHistoryTable();
        }
      }
      if (matchStatus === "") {
        turnSwap();
      } else {
        turnSpan.innerHTML = "";
      }

      matchStatusDiv.innerHTML = matchStatus;
      renderBlock();
    } else {
      callAPILogic();
    }
  }
}

function startGame() {
  beginGame = true;
  turn = "X";
  turnSpan.hidden = false;
  turnSpan.innerHTML = "X Turn";
  startGameButton.hidden = true;
}

function turnSwap() {
  if (turn === "X") turn = "O";
  else turn = "X";
  turnSpan.innerHTML = turn + "  Turn";
}

function resetGame() {
  gridValue = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  winner = "";
  turn = "";
  matchStatus = "";
  beginGame = false;
  initiateGame();
}

function renderHistoryTable() {
  var table = document
    .getElementById("historyTable")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = "";
  history.forEach((el) => {
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(1);
    cell1.innerHTML = el === "X" ? "1" : "0";
    cell2.innerHTML = el === "O" ? "1" : "0";
    cell3.innerHTML = el === "draw" ? "1" : "0";
  });
  document.getElementById("noHistory").innerHTML = "";

  const counts = {};

  for (const num of history) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
}

function callAPILogic() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/grids", true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      const res = JSON.parse(xhttp.responseText);
      history = res.history;
      matchStatus = res.matchStatus;
      if (matchStatus === "") {
        turnSwap();
      } else {
        turnSpan.innerHTML = "";
      }
      matchStatusDiv.innerHTML = matchStatus;
      renderBlock();
      renderHistoryTable();
    }
    if (xhttp.status === 0) {
      isOffline = true;
      checkGameLogic();
    }
  };

  xhttp.send(JSON.stringify({ data: { gridValue: gridValue, turn: turn } }));
}

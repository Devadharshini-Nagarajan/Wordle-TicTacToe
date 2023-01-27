var express = require("express");
var router = express.Router();

let history = [];

router.post("/grids", function (req, res, next) {

  let gridValue = req.body.data.gridValue;
  let turn = req.body.data.turn;
  let matchStatus = "";
  if (gridValue && turn !== "") {
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
      }
    });
    if (!matchStatus) {
      if (allHasValue) {
        matchStatus = "Match draw";
        history.push("draw");
      }
    }
    let finalsJson = {
      matchStatus: matchStatus,
      history: history
    };
    res.json(finalsJson);
  } else {
    let finalsJson = {
      matchStatus: "",
      history: history
    };
    res.json(finalsJson);
  }
});

module.exports = router;

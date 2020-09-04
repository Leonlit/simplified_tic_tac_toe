let turn, board, currentWinner;

let closeBtn = document.getElementById("close");
let gameOverMenu= document.getElementById("gameOver");
let winnerTeam = document.getElementById("winTeam");
let boardTable = document.getElementsByTagName("table")[0];
let cells = document.querySelectorAll("td");
let restartBtn = document.getElementById("restart");

const TEAM_ICON = ["O","X"];

const TEAM_NAME = ["Player_1", "Player_2"];

const SOLUTIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

window.onload = () => {
  gameInit();
}

function stopGame () {
  for (let cellIndex=0; cellIndex < cells.length; cellIndex++){
    cells[cellIndex].removeEventListener ("click", cellsClicked);
  }
}

function gameInit () {
  turn = 0;
  currentWinner = null;
  board = new Array(9);

  restartBtn.style.display = "none";

  for (let cellIndex=0; cellIndex < cells.length; cellIndex++){
    cells[cellIndex].innerHTML = "";
    board.fill(null);
    cells[cellIndex].addEventListener ("click", cellsClicked);
  }
}

let closeGameOverMenu = () => gameOverMenu.style.display = "none";

function gameOver (result) {
  winnerTeam.innerHTML = result;
  gameOverMenu.style.display = "block";
  restartBtn.style.display = "block";
}

function addArea (newBoard, index, symbol) {
  if (currentWinner == null) {
      if (newBoard[index] == null) {
        newBoard[index] = symbol;
        let cell = document.getElementById(index);
        cell.innerHTML = symbol;
        return true;
      }else {
        return false;
      }
  }
}

function cellsClicked (event) {
  let cellAvailable = addArea(board, event.target.id, TEAM_ICON[turn]);
  if (cellAvailable) {
    currentWinner = checkWinner(board, TEAM_ICON[turn]);
    if (currentWinner) {
      let extra = currentWinner === "Draw" ? "" : " Win"
      gameOver(currentWinner + extra);
    }
    turn = turn == 0 ? 1 : 0;
  }
}

function checkWinner (tempBoard, icon) {
  let plays = tempBoard.reduce((accu, curr, index)=> (curr === icon)? accu.concat(index): accu, []);

  for (let winableMove of SOLUTIONS) {
    if (winableMove.every(element=> plays.indexOf(element) != -1)) {
      return TEAM_NAME[turn];
    }
  }
  
  if (getEmptyCellsSize(tempBoard) == 0) {
    return "Draw";
  }
  return null;
}

function getEmptyCellsSize (tempBoard) {
    return tempBoard.reduce((accu, curr, index)=> (curr === null)? accu.concat(index): accu, []).length;
}
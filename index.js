let turn, board = new Array(9), currentWinner;

let gameOverMenu= document.getElementById("gameOver"),    //The game over menu
  winnerTeam = document.getElementById("winTeam"),        //The winner team that win the current round
  restartBtn = document.getElementById("restart"),        //The restart button for the game
  closeBtn = document.getElementById("close"),            //The close button inside the game over menu
  cells = document.querySelectorAll("td");                //The grid cells

//The players icon and their names 
const TEAM_ICON = ["O","X"];
const TEAM_NAME = ["Player_1", "Player_2"];

//All possible solution
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

//initialise the game when the window loaded
window.onload = () => {
  gameInit();
}

function gameInit () {
  turn = 0;                 //first player = 0, second player = 1
  currentWinner = null;     //reset the winner variable value
  board.fill(null);         //resetting the board array with null

  //just in case previously the restart button is shown (right after a game is finished),
  //hide the restart button
  restartBtn.style.display = "none";

  //loop through the grid cells, and assign empty string into their innerHTML as
  //well as adding event listener to detect the click event on the cells
  for (let cellIndex=0; cellIndex < cells.length; cellIndex++){
    cells[cellIndex].innerHTML = "";
    cells[cellIndex].addEventListener ("click", cellsClicked);
  }
}

//closing the game over menu
let closeGameOverMenu = () => gameOverMenu.style.display = "none";

//displaying the game over menu
function gameOver (result) {
  winnerTeam.innerHTML = result;
  gameOverMenu.style.display = "block";
  restartBtn.style.display = "block";
}

//adding icon into an cells if its a valid cells (the cell is empty)
function addArea (newBoard, index, symbol) {
  //if there's currently a winner found, prevent the players to add any icons
  if (currentWinner == null) {
    //if the content of the index is null means that it's a valid cells for the current player
    //change the array value at the position clicked by player to his/her icon
    //get the grid cell element and change the content of the cell on the page of the cell 
    //with the player icon
    if (newBoard[index] == null) {
      newBoard[index] = symbol;
      let cell = document.getElementById(index);
      cell.innerHTML = symbol;
      return true;
    }else {
      //if the cell is not a valid cell (occupied or currently the game is over)
      //return false to its caller
      return false;
    }
  }
}

//when a cell is clicked
function cellsClicked (event) {
  //first try inserting the player icon into the cell
  let cellAvailable = addArea(board, event.target.id,  TEAM_ICON[turn]);
  //if the inserting is succesfull, then we'll check if there's a winner after the step
  //just now. If there's a winner for the game, then the gameOver function will be triggered
  //if there's no winner, change the player turn for the next turn.
  if (cellAvailable) {
    currentWinner = checkWinner(board, TEAM_ICON[turn]);
    if (currentWinner) {
      let extra = currentWinner === "Draw" ? "" : " Win"
      gameOver(currentWinner + extra);
    }
    turn = turn == 0 ? 1 : 0;
  }
}

//checking for winner for the current game
function checkWinner (tempBoard, icon) {
  //getting the position in the grid cells that contains the icon of the current player turn
  let plays = tempBoard.reduce((accu, curr, index)=> (curr === icon)? accu.concat(index): accu, []);
  //Then for every possible solutions, check if the elements are in the array of the player plays
  for (let winableMove of SOLUTIONS) {
    if (winableMove.every(element=> plays.indexOf(element) != -1)) {
      return TEAM_NAME[turn];
    }
  }
  //if there's no winner for the current round but there's no more empty cells in the grid, this means that 
  //the current match is a draw.
  if (getEmptyCellsSize(tempBoard) == 0) {
    return "Draw";
  }
  //But if there's still empty cells left, we can return null to indicate the match isn't over yet
  return null;
}

//checking for empty cells
function getEmptyCellsSize (tempBoard) {
  return tempBoard.some(curr => (curr === null));
}
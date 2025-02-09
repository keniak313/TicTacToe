///--- Game Logic ---///

function gameboard() {
  let board = [];
  const createBoard = () => {
    const arr = [];

    for (let i = 0; i <= 2; i++) {
      arr[i] = [];
      for (let j = 0; j <= 2; j++) {
        arr[i][j] = "";
      }
    }
    return (board = arr);
  };

  createBoard();

  let freeCells = 9;
  const getGameboard = () => board;
  const selectCell = (x, y) => board[x][y];
  const checkCell = (x, y) => {
    if (board[x][y] === "") {
      console.log(`Cell: "${x} ${y}" is Free`);
      freeCells--;
      return true;
    } else {
      console.log(`Cell: "${x} ${y}" is Occupied`);
      return false;
    }
  };
  const markCell = (x, y, marker) => (board[x][y] = marker);
  const getFreeCells = () => freeCells;
  const resetCells = () => (freeCells = 9);

  return {
    getGameboard,
    selectCell,
    markCell,
    checkCell,
    getFreeCells,
    createBoard,
    resetCells,
  };
}

function createPlayer(name, marker) {
  let score = 0;
  const getScore = () => score;
  const giveScore = () => score++;
  const resetScore = () => (score = 0);
  return { name, marker, score, getScore, giveScore, resetScore };
}

const gameController = (function () {
  const playerOne = createPlayer("Player One", "X");
  const playerTwo = createPlayer("Player Two", "O");

  const players = [playerOne, playerTwo];

  const board = gameboard();

  let win = false;
  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    activePlayerUI();
    console.log(`Switching active player to: ${getActivePlayer().name}`);
  };

  const getActivePlayer = () => activePlayer;

  const getGameStatus = () => win;

  const getPlayerOneScore = () => playerOne.getScore();
  const getPlayerTwoScore = () => playerTwo.getScore();

  const checkGameStatus = () => {
    const name = getActivePlayer().name;
    const marker = getActivePlayer().marker;
    const getBoard = board.getGameboard();
    const cellUi = document.querySelectorAll(".cell");

    //Check Rows
    for (let i = 0; i <= 2; i++) {
      const rows = getBoard[i].every((value) => value === marker);
      if (rows) {
        win = true;
        const cellsX = document.querySelectorAll(`button[data-id-x='${i}']`);
        cellsX.forEach((cell) => {
          console.log(`cell ${cell.dataset.marker}, marker: ${marker}`);
          if (cell.dataset.marker === marker) {
            cell.classList.add("won");
          }
        });
      }
    }
    //Check Columns
    for (let i = 0; i <= 2; i++) {
      const columns = [getBoard[0][i], getBoard[1][i], getBoard[2][i]].every(
        (value) => value === marker
      );
      if (columns) {
        win = true;
        const cellsX = document.querySelectorAll(`button[data-id-y='${i}']`);
        cellsX.forEach((cell) => {
          console.log(`cell ${cell.dataset.marker}, marker: ${marker}`);
          if (cell.dataset.marker === marker) {
            cell.classList.add("won");
          }
        });
      }
    }

    //Check Diagonal
    if (
      getBoard[0][0] === marker &&
      getBoard[1][1] === marker &&
      getBoard[2][2] === marker
    ) {
      cellUi.forEach((cell) => {
        const cX = cell.dataset.idX;
        const cY = cell.dataset.idY;
        if (
          (cX === "0" && cY === "0") ||
          (cX === "1" && cY === "1") ||
          (cX === "2" && cY === "2")
        ) {
          cell.classList.add("won");
          console.log(cell);
        }
      });
      win = true;
    } else if (
      getBoard[0][2] === marker &&
      getBoard[1][1] === marker &&
      getBoard[2][0] === marker
    ) {
      cellUi.forEach((cell) => {
        const cX = cell.dataset.idX;
        const cY = cell.dataset.idY;
        if (
          (cX === "0" && cY === "2") ||
          (cX === "1" && cY === "1") ||
          (cX === "2" && cY === "0")
        ) {
          cell.classList.add("won");
          console.log(cell);
        }
      });
      win = true;
    }

    if (win) {
      getActivePlayer().giveScore();
      winStatusUI(getActivePlayer().marker);
      console.log(
        `${name} Wins, Current Score: ${getActivePlayer().getScore()}`
      );
      updateDialog(getActivePlayer());
      switchActivePlayer();
      return true;
    } else {
      return false;
    }
  };

  const clearBoard = () => {
    switchActivePlayer();
    board.createBoard();
    board.resetCells();
    win = false;
  };

  const resetGame = () => {
    switchActivePlayer();
    clearBoard();
    activePlayer = players[0];
    playerOne.resetScore();
    playerTwo.resetScore();
  };

  const playRound = (x, y) => {
    console.log(`Active player: ${getActivePlayer().name}`);
    if (board.checkCell(x, y)) {
      board.markCell(x, y, getActivePlayer().marker);
      console.log(
        `Placing ${activePlayer.name} marker "${activePlayer.marker}" onto ${x} ${y}`
      );
      if (board.getFreeCells() === 0) {
        updateDialog("Game Over");
      }
      checkGameStatus();
      switchActivePlayer();
    }
    console.log(board.getGameboard());
    console.log(`---`);
  };

  return {
    playRound,
    getActivePlayer,
    getGameStatus,
    getPlayerOneScore,
    getPlayerTwoScore,
    clearBoard,
    resetGame,
  };
})();

///--- Variables ---///

const container = document.querySelector(".container");
const cellNode = document.createElement("button");
const dialog = document.querySelector("dialog");

const blockUi = document.querySelector("blocker");
const blockerText = document.querySelector(".blockerText");
const blockerIcon = document.querySelector(".blockerIcon");

const leftBar = document.querySelector(".left");
const rightBar = document.querySelector(".right");

const playerOneScoreText = document.querySelector(".playerOneScore");
const playerTwoScoreText = document.querySelector(".playerTwoScore");

const clearButton = document.querySelector(".clear");
const resetButton = document.querySelector(".reset");

const iconXmark = document.createElement("i");
iconXmark.classList.add("fa-solid");
iconXmark.classList.add("fa-circle-radiation"); //Player One (X) Icon

const iconOmark = document.createElement("i");
iconOmark.classList.add("fa-solid");
iconOmark.classList.add("fa-heart"); //Player Two (O) Icon

cellNode.classList.add("cell");
cellNode.setAttribute("data-id-x", "0");
cellNode.setAttribute("data-id-y", "0");
cellNode.setAttribute("data-marker", "");

///--- UI ---///

function updateDialog(input) {
  console.log(input);
  blockerIcon.textContent = "";
  if (input.marker === "X") {
    blockerIcon.appendChild(iconXmark.cloneNode(true));
    blockerText.textContent = " Wins!";
  } else if (input.marker === "O") {
    blockerIcon.appendChild(iconOmark.cloneNode(true));
    blockerText.textContent = " Wins!";
  } else {
    blockerIcon.textContent = "";
    blockerText.textContent = input;
  }
  blockUi.setAttribute(`shown`, true);
  blockUi.classList.add("blockerAnim");
  blockUi.addEventListener("animationend", () => {
    blockUi.setAttribute(`shown`, false);
    blockUi.classList.remove("blockerAnim");
  });
}

function createBordUI() {
  updateDialog("Get Ready!");
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const arr = gameboard().getGameboard();
  let cellsCreated = 0;
  async function load() {
    for (let i = 0; i < 3; i++) {
      cellNode.setAttribute("data-id-x", i);
      for (let j = 0; j < 3; j++) {
        cellNode.setAttribute("data-id-y", j);
        container.appendChild(cellNode.cloneNode(true));
        cellsCreated++;
        await timer(100);
      }
    }
    //return cellsCreated;
  }
  load();
  // load().then(() => {
  // })
}

function init() {
  const player = gameController.getActivePlayer();
  playerOneScoreText.textContent = gameController.getPlayerOneScore();
  playerTwoScoreText.textContent = gameController.getPlayerTwoScore();
  activePlayerUI();
}

function updateScore() {
  playerOneScoreText.textContent = gameController.getPlayerOneScore();
  playerTwoScoreText.textContent = gameController.getPlayerTwoScore();
}

function clearBoardUI() {
  leftBar.classList.remove("activeWon");
  rightBar.classList.remove("activeWon");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function activePlayerUI() {
  if (gameController.getActivePlayer().marker === "X") {
    leftBar.classList.add("activePlayer");
    rightBar.classList.remove("activePlayer");
  } else {
    leftBar.classList.remove("activePlayer");
    rightBar.classList.add("activePlayer");
  }
}

function winStatusUI(marker) {
  if (marker === "X") {
    leftBar.classList.add("activeWon");
    rightBar.classList.remove("activeWon");
  } else {
    leftBar.classList.remove("activeWon");
    rightBar.classList.add("activeWon");
  }
}

///--- Input ---///

let cursorX = 1;
let cursorY = 1;

function inputHandler() {
  container.addEventListener("click", (e) => {
    if (!gameController.getGameStatus()) {
      //const element = document.elementFromPoint(e.clientX, e.clientY);
      const element = document.activeElement;
      const player = gameController.getActivePlayer();
      const x = element.dataset.idX;
      const y = element.dataset.idY;
      if (element.dataset.marker === "") {
        element.dataset.marker = player.marker;
        gameController.playRound(x, y);
        if (player.marker === "X") {
          element.appendChild(iconXmark.cloneNode());
        } else {
          element.appendChild(iconOmark.cloneNode());
        }
        updateScore();
        activePlayerUI();
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    const setFocus = () => {
      container.querySelectorAll("button").forEach((b) => {
        if (
          b.dataset.idX === cursorX.toString() &&
          b.dataset.idY === cursorY.toString()
        ) {
          b.focus();
        }
      });
    };
    if (e.code === "Tab") {
      const element = document.activeElement;
      if (element.classList.contains("cell")) {
        cursorX = Number(element.dataset.idX);
        cursorY = Number(element.dataset.idY);
        setFocus();
      }
    }
    switch (e.code) {
      case "ArrowLeft":
        cursorY > 0 ? (cursorY -= 1) : null;
        setFocus();
        break;
      case "ArrowRight":
        cursorY < 2 ? (cursorY += 1) : null;
        setFocus();
        break;
      case "ArrowUp":
        cursorX > 0 ? (cursorX -= 1) : null;
        setFocus();
        break;
      case "ArrowDown":
        cursorX < 2 ? (cursorX += 1) : null;
        setFocus();
        break;
    }
    console.log(`X: ${cursorX}, Y:${cursorY}`);
  });

  clearButton.addEventListener("click", () => {
    gameController.clearBoard();
    clearBoardUI();
    createBordUI();
  });

  resetButton.addEventListener("click", () => {
    gameController.resetGame();
    gameController.clearBoard();
    updateScore();
    activePlayerUI();
    clearBoardUI();
    createBordUI();
  });
}

init();
createBordUI();
inputHandler();
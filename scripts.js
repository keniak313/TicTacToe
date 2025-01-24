function gameboard () {

    let board = [];
    const createBoard = () => {
        const arr = [];

        for(let i = 0; i <= 2; i++){
            arr[i] = []
            for(let j = 0; j <= 2; j++){
                arr[i][j] = "";
            }
        }
        return board = arr;
    };

    createBoard();

    let freeCells = 9;
    const getGameboard = () => board;
    const selectCell = (x, y) => board[x][y];
    const checkCell = (x,y) => {
        if(board[x][y] === ""){
            console.log(`Cell: "${x} ${y}" is Free`)
            freeCells--;
            return true;
        }else{
            console.log(`Cell: "${x} ${y}" is Occupied`)
            return false;
        }
    }
    const markCell = (x, y, marker) => board[x][y] = marker;
    const getFreeCells = () => freeCells;
    const resetCells = () => freeCells = 9;
    
    return {getGameboard, selectCell, markCell, checkCell, getFreeCells, createBoard, resetCells};
};

function createPlayer (name, marker){
    let score = 0;
    const getScore = () => score;
    const giveScore = () => score++;
    const resetScore = () => score = 0;
    return {name, marker, score, getScore, giveScore, resetScore};
}

const gameController = (function() {

    const playerOne = createPlayer("Player One", "X");
    const playerTwo = createPlayer("Player Two", "O");

    const players = [
        playerOne, playerTwo    
    ]

    const board = gameboard();

    let win = false;
    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        activePlayerUI();
        console.log(`Switching active player to: ${getActivePlayer().name}`)
    }

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
        for(let i = 0; i <= 2; i++){
            const rows = getBoard[i].every(value => value === marker);
            if(rows){
                win = true;
                const cellsX = document.querySelectorAll(`button[data-id-x='${i}']`);
                cellsX.forEach(cell => {
                    console.log(`cell ${cell.dataset.marker}, marker: ${marker}`);
                    if(cell.dataset.marker === marker){
                        cell.classList.add("won"); 
                    }});   
            };
        }
        //Check Columns
        for(let i = 0; i <= 2; i++){
            const columns = [getBoard[0][i], getBoard[1][i], getBoard[2][i]].every(value => value === marker);
            if(columns){
                win = true;
                const cellsX = document.querySelectorAll(`button[data-id-y='${i}']`);
                cellsX.forEach(cell => {
                    console.log(`cell ${cell.dataset.marker}, marker: ${marker}`);
                    if(cell.dataset.marker === marker){
                        cell.classList.add("won"); 
                    }});
            }
        }

        //Check Diagonal
        if(getBoard[0][0] === marker && getBoard[1][1] === marker && getBoard[2][2] === marker){
            cellUi.forEach((cell) => {
                const cX = cell.dataset.idX;
                const cY = cell.dataset.idY;
                if(cX === "0" && cY === "0" || cX === "1" && cY === "1" || cX === "2" && cY === "2"){
                    cell.classList.add("won");
                    console.log(cell);
                };
            });
            win = true;
        }else if(getBoard[0][2] === marker && getBoard[1][1] === marker && getBoard[2][0] === marker){
            cellUi.forEach((cell) => {
                const cX = cell.dataset.idX;
                const cY = cell.dataset.idY;
                if(cX === "0" && cY === "2" || cX === "1" && cY === "1" || cX === "2" && cY === "0"){
                    cell.classList.add("won");
                    console.log(cell);
                };
            });
            win = true;
        }

        if(win){
            getActivePlayer().giveScore();
            winStatusUI(getActivePlayer().marker);
            console.log(`${name} Wins, Current Score: ${getActivePlayer().getScore()}`)
            switchActivePlayer(); 
            return true;
        }else{
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
    }

    const playRound = (x, y) => {
        console.log(`Active player: ${getActivePlayer().name}`)
        if(board.checkCell(x, y)){
            board.markCell(x, y, getActivePlayer().marker);
            console.log(
                `Placing ${activePlayer.name} marker "${activePlayer.marker}" onto ${x} ${y}`
            );
            checkGameStatus();
            switchActivePlayer(); 
        }
        console.log(board.getGameboard());
        console.log(`---`)
    };

    return{playRound, getActivePlayer, getGameStatus, getPlayerOneScore, getPlayerTwoScore, clearBoard, resetGame};
})();

//TEST GAME BELOW

//gameController.playRound(1,0);
// gameController.playRound(1,1);
// gameController.playRound(0,0);
// gameController.playRound(2,0);
// gameController.playRound(0,1);
// gameController.playRound(0,2);

//Game UI

const container = document.querySelector(".container");
const cellNode = document.createElement("button");
const winStatusText = document.querySelector(".winStatus");

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

function createBordUI() {
    const arr = gameboard().getGameboard();
    let i = 0;
    arr.forEach((valX, index) =>{
        cellNode.setAttribute("data-id-x", index);
        arr[i].forEach((valY, index) => {
            cellNode.setAttribute("data-id-y", index);
            container.appendChild(cellNode.cloneNode(true));
        })
    })
};

function init(){
    const player = gameController.getActivePlayer();
    playerOneScoreText.textContent = gameController.getPlayerOneScore();
    playerTwoScoreText.textContent = gameController.getPlayerTwoScore();
    activePlayerUI();
};

createBordUI();
init();

function updateScore(){
    playerOneScoreText.textContent = gameController.getPlayerOneScore();
    playerTwoScoreText.textContent = gameController.getPlayerTwoScore();
};

function clearBoardUI(){
    while (container.firstChild){
        container.removeChild(container.firstChild);
    };
};

function activePlayerUI(){
    if(gameController.getActivePlayer().marker === "X"){
        leftBar.classList.add("activePlayer");
        rightBar.classList.remove("activePlayer");
    }else{
        leftBar.classList.remove("activePlayer");
        rightBar.classList.add("activePlayer");
    }
};

function winStatusUI(marker){
    if(marker === "X"){
        winStatusText.classList.add("winX");
        winStatusText.classList.remove("winO");
        winStatusText.appendChild(iconXmark.cloneNode());
        //winStatusText.textContent += "Wins!";
    }else{
        winStatusText.classList.add("winO");
        winStatusText.classList.remove("winX");
        winStatusText.appendChild(iconOmark.cloneNode());
        winStatusText.textContent += "Wins!";
    }
}

container.addEventListener("click", (e) =>{
    if(!gameController.getGameStatus()){
        const element = document.elementFromPoint(e.clientX, e.clientY);
        element.setAttribute("disabled", "");
        const player = gameController.getActivePlayer();
        const x = element.dataset.idX;
        const y = element.dataset.idY;
        element.dataset.marker = player.marker;
        gameController.playRound(x, y);
        if(player.marker === "X"){
            element.appendChild(iconXmark.cloneNode());
        }else{
            element.appendChild(iconOmark.cloneNode());
        }
        updateScore();
        activePlayerUI();
    }
});

clearButton.addEventListener("click", () => {
    gameController.clearBoard();
    clearBoardUI();
    createBordUI();
    winStatusText.textContent = "";
});

resetButton.addEventListener("click", () =>{
    gameController.resetGame();
    gameController.clearBoard();
    activePlayerUI();
    clearBoardUI();
    createBordUI();
    winStatusText.textContent = "";
});
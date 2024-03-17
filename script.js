const Player = (sign) => {
    this.sign = sign;
    const getSign = function() {
        return sign;
    };
    return {getSign};
}

const gameBoard = (function() {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoardIndex = function(index) {
        if (index >= board.length) return;
        return board[index];
    };
    const setBoardIndex = function(index, sign) {
        if (index >= board.length) return;
        board[index] = sign;
    }
    const resetBoard = function() {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }
    const isFull = function() {
        return board.every((index) => index !== "")
    }
    return {getBoardIndex, setBoardIndex, resetBoard, isFull};
})();

const gameController = (function() {
    const playerOne = Player('X');
    const playerTwo = Player('O');
    let currentPlayer = playerOne;
    let gameOver = false;

    const changePlayer = function() {
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
        giveMessage('turn');
        displayController.changeBoardClass();
    }
    const playRound = function(index) {
        if (gameBoard.getBoardIndex(index) !== '' || gameOver === true) return; 
        
        gameBoard.setBoardIndex(index, currentPlayer.getSign());
        displayController.updateDom();
        
        if (checkWinner()) {
            giveMessage('win');
            gameOver = true;
            return;
        } else {
        changePlayer();
        }

        if (gameBoard.isFull()) {
            giveMessage('tie');
            gameOver = true;
            return;
        }
    }
    const giveMessage = function(msg) {
        let textMessage;
        if (msg === 'win') textMessage = `Player ${currentPlayer.getSign()} has won!`;
        if (msg === 'turn') textMessage = `Player ${currentPlayer.getSign()}'s turn`
        if (msg === 'tie') textMessage = "It's a tie!"
        displayController.setMessage(textMessage);
    }
    const checkWinner = () => {
        const winConditions = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
    
        const winCombo = winConditions
            .filter((combination) => 
              combination.every((index) => gameBoard.getBoardIndex(index) === currentPlayer.getSign())
              )
              
        if (winCombo.length > 0) {
            displayController.changeWinClass(winCombo[0]);
            return true;
        }    
      };
    const getCurrentPlayer = function() {
        return currentPlayer.getSign();
    }
    const restartGame = function() {
        currentPlayer = playerOne;
        gameOver = false;
        giveMessage('turn');
        gameBoard.resetBoard();
        displayController.updateDom();
        displayController.changeBoardClass();
    }
    return {playRound, getCurrentPlayer, restartGame}
}());

const displayController = (function() {
    const cells = document.querySelectorAll(".cell");
    const restartButton = document.querySelector("#restartButton");
    const messageDiv = document.querySelector('#message');
    const boardDiv = document.querySelector('#board');

    restartButton.onclick = gameController.restartGame;

    const setMessage = function(message) {
        messageDiv.textContent = message;
    }
    const updateDom = function() {
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = gameBoard.getBoardIndex(i);
            cells[i].classList.remove('win')
            if (cells[i].textContent !== '') {
                cells[i].classList.add("filled")
            } else {
                cells[i].classList.remove("filled");
            };
        }
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', () => {
            gameController.playRound(i);
        })
    }
    
    const changeBoardClass = function() {
        if (gameController.getCurrentPlayer() === 'X') {
            boardDiv.classList.remove('O');
            boardDiv.classList.add('X');
            return;
        }
        if (gameController.getCurrentPlayer() === 'O') {
            boardDiv.classList.remove('X');
            boardDiv.classList.add('O');
            return;
        }
    }

    const changeWinClass = function(combo) {
        for (let i = 0; i < combo.length; i++) {
            cells[combo[i]].classList.add('win')
        }
    }

    return {setMessage, updateDom, changeBoardClass, changeWinClass};
})();
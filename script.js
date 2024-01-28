// board state
let board = [
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
];

let turn = 'X';
let turnCompleat = true;
let aroundValidIndex = [];
let userLastIndex = "";
let selectedIndex = -1;
let noComputer = false;

const closeModalBtn = document.getElementById("closeModalBtn");
const resultModal = document.getElementById("result-gameModal");
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName('close')[0];
const cells = document.querySelectorAll('.cell');
const turnLabel = document.getElementById('turn');

document.addEventListener("DOMContentLoaded", function () {
    closeModalBtn.addEventListener("click", function () {
        resultModal.style.display = "none";
    });
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    window.addEventListener("click", function (event) {
        if (event.target === resultModal) {
            resultModal.style.display = "none";
        }

    });

    // click handler
    cells.forEach(cell => {
        cell.addEventListener('click', handleTurn);
    })

    modal.style.display = "block";
});

function init(starter) {
    modal.style.display = "none";
    if (starter == "me") {
        turn = 'O';
        console.log("OO");
    } else if (starter == "computer") {
        turn = 'X';
    } else if (starter == 'no-computer') {
        noComputer = true;
        turn = 'O';
    }
    updateDOM();
    if (turn == 'X') {
        console.log("start with computer");
        aiTurn();
    }
}

function handleTurn(e) {
    // prevent click on reserved box
    if (board[e.target.id] == 'X' || board[e.target.id] == 'O') {
        console.log("selected");
        return false;
    }
    if (turnCompleat) {
        aroundValidIndex = getValidAround(e.target.id);

        if (aroundValidIndex.length == 0) {
            console.log("select another");
            return;
        }

        selectedIndex = e.target.id;
        board[e.target.id] = turn;
        userLastIndex = e.target.id;
        updateDOM();
        // switch turns
        turn === 'X' ? turn = 'O' : turn = 'X';

        turnCompleat = false;
        return;
    } else {
        aroundValidIndex.forEach((num) => {
            if (num == e.target.id) {
                board[e.target.id] = turn;
                turnCompleat = true;
                aroundValidIndex = [];
                selectedIndex = -1;
                updateDOM();
            }
        })
        if (!turnCompleat) {
            turnCompleat = true;
            turn === 'X' ? turn = 'O' : turn = 'X';
            board[userLastIndex] = "";
            handleTurn(e)
            return
        }
    }

    turnLabel.textContent = turn;
    // check win condition
    let winner = checkWin(board);
    if (winner) {
        winnerAlert(winner);
    }

    // ai turn
    aiTurn();

    winner = checkWin(board);
    if (winner) {
        winnerAlert(winner);
    }

}

function aiTurn() {
    if (noComputer) {
        return;
    }
    // minmax with alpha-beta pruning 
    // init alpha and beta
    console.log("aiTurn");
    let alpha = -Infinity;
    let beta = Infinity;
    const availableMoves = getAvailableMoves(board);
    let bestMove;
    let bestEval = -Infinity;
    if (board.every(cell => cell === '')) {
        bestMove = getRandomMoveIndex(board);
    } else {


        for (let moveItem of availableMoves) {

            board[moveItem[0]] = 'X';
            board[moveItem[1]] = 'O';
            // console.log("local" , localBoard);
            // console.log(board);
            let eval = minimax(board, 0, false, alpha, beta);

            board[moveItem[0]] = '';
            board[moveItem[1]] = '';

            // console.log("mostafa", moveItem);
            // console.log(`eval: ${eval}`, bestEval);

            // Choose the move with the highest evaluation
            if (eval > bestEval) {
                bestEval = eval;
                bestMove = moveItem;
            }

        };
    }

    if (!bestMove) {
        alert("ok end");
    }
    console.log(bestMove);
    // const bestMove = minimax(board, 4, true, alpha, beta);
    makeMove(bestMove[0], bestMove[1], 'X');
    turn = 'O';

    // update DOM
    updateDOM();
    checkWin(board);
}

function minimax(board, depth, maximizingPlayer, alpha, beta) {
    // بازی تمام شده است، امتیاز را برمی گرداند
    if (checkWin(board) == 'X') {
        return 1;
    } else if (checkWin(board) == 'O') {
        return -1;
    } else if (checkWin(board) == 'full') {
        return 0;
    }
    const availableMoves = getAvailableMoves(board);
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let moveItem of availableMoves) {
            // Make a move on the board
            board[moveItem[0]] = 'O';
            board[moveItem[1]] = 'X';

            let eval = minimax(board, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, eval);

            // Undo the move
            board[moveItem[0]] = '';
            board[moveItem[1]] = '';

            // Alpha-Beta pruning
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) {
                break;
            }

        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let moveItem of availableMoves) {
            // Make a move on the board
            board[moveItem[0]] = 'X';
            board[moveItem[1]] = 'O';
            let eval = minimax(board, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, eval);

            // Undo the move
            board[moveItem[0]] = '';
            board[moveItem[1]] = '';

            // Alpha-Beta pruning
            beta = Math.min(beta, eval);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }

}

function checkWin(board) {
    // console.log('checkWin');
    // loop through rows
    let winX = false;
    let winO = false;
    for (let i = 0; i < 4; i++) {
        let row = [board[i * 4], board[i * 4 + 1], board[i * 4 + 2], board[i * 4 + 3]];

        if (checkThreeInArr(row, 'X')) {
            winX = true;
        }
        if (checkThreeInArr(row, 'O')) {
            winO = true;
        }
    }
    // loop through cols
    for (let col = 0; col < 4; col++) {
        let column = [board[col], board[col + 4], board[col + 8], board[col + 12]];
        // console.log(column);
        if (checkThreeInArr(column, 'X')) {
            winX = true;
        }
        if (checkThreeInArr(column, 'O')) {
            winO = true;
        }
    }

    // check diagonals
    let diagonals = [
        [board[1], board[6], board[11]],
        [board[0], board[5], board[10]],
        [board[5], board[10], board[15]],
        [board[4], board[9], board[14]],
        [board[2], board[5], board[8]],
        [board[3], board[6], board[9]],
        [board[6], board[9], board[12]],
        [board[7], board[10], board[13]]
    ];
    diagonals.forEach((arr) => {
        if (arr.every(cell => cell === 'X')) {
            winX = true;
        }
        if (arr.every(cell => cell === 'O')) {
            winO = true;
        }
    })

    if (turn === 'X' && winO) {
        return 'O';
    }
    else if (turn === 'O' && winX) {
        return 'X';
    }
    else if (winO) {
        return 'O';
    }
    else if (winX) {
        return 'X';
    }

    if (getAvailableMoves(board).length == 0) {
        return 'full';
    }
    // no winner
    return null;
}

function checkThreeInArr(array, symbol) {
    return !!((array[0] == symbol && array[1] == symbol && array[2] == symbol) ||
        (array[1] == symbol && array[2] == symbol && array[3] == symbol))
}

function makeMove(position1, position2, player) {
    let player2 = anotherPlayer(player);
    if (!player2) {
        return false;
    }
    if (!canMove(position1, position2, player)) {
        return false;
    }

    board[position1] = player;
    board[position2] = player2;

    updateDOM();
    return true;
}

function getValidAround(position) {
    let aroundIndex = [];
    let around = [
        Number(position) - 4,                                            // top
        Number(position) + 4 >= 16 ? -1 : Number(position) + 4,       // bottom
        (Number(position) + 1) % 4 == 0 ? -1 : Number(position) + 1,  // right
        (Number(position)) % 4 == 0 ? -1 : Number(position) - 1,      // left
    ];
    around.forEach((i) => {
        if (i >= 0 && board[i] != 'X' && board[i] != 'O') {
            aroundIndex.push(i);
        }
    });
    return aroundIndex;
}

function canMove(position1, position2, player) {
    let player2 = anotherPlayer(player);
    if (!player2) {
        return false;
    }

    if (board[position1] == 'X' || board[position1] == 'O') {
        console.log("can't select");
        return false;
    }

    let aroundIndex = getValidAround(position1);
    if (aroundIndex.length == 0) {
        console.log("select another");
        return false;
    }
    if (!aroundIndex.includes(position2)) {
        return false;
    }
    return true;
}

function getAvailableMoves(localBoard) {
    let freeIndex = [];
    localBoard.forEach((item, index) => {
        if (item === "") {
            freeIndex.push(index);
        }
    });
    if (freeIndex.length == 0) {
        return [];
    }
    const candidates = [];
    freeIndex.forEach((item) => {
        const aroundCells = getValidAround(item);
        if (aroundCells.length > 0) {
            aroundCells.forEach((i) => {
                candidates.push([item, i])
            });
        }
    });
    if (candidates.length == 0) {
        return [];
    }
    return candidates;
}

function getRandomMoveIndex(board) {
    let localBoard = [...board];
    const candidates = getAvailableMoves(localBoard);

    if (candidates.length == 0) {
        return false;
    }
    const random = Math.floor(Math.random() * candidates.length);
    return candidates[random];
}

function anotherPlayer(player) {
    // if X >>> O , if O >>> X , else >>> false
    return player === 'X' ? 'O' : player === 'O' ? 'X' : false;
}

function winnerAlert(message) {
    // Get modal element
    var modal = document.getElementById('result-gameModal');
    // Get modal content element
    var modalContent = document.querySelector('#result-gameModal-message');
    // Set modal message text
   
    modalContent.textContent = `${message} won`;
    if (message == 'full') {
        modalContent.textContent = 'The game did not have a winner';
    }
    // Open modal
    modal.style.display = "block";
}

function startAlert() {
    modal.style.display = "block";
}

function restartGame() {
    // reset board, turn, dom
    board = [
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
    ];

    turnCompleat = true;
    aroundValidIndex = [];
    selectedIndex = -1;
    turn = 'X';
    userLastIndex = "";
    resultModal.style.display = "none";
    startAlert();
}

function updateDOM() {
    // update dom
    cells.forEach(cell => {
        cell.textContent = board[cell.id];
        cell.style.backgroundColor = '#fff';
        if (cell.id == selectedIndex) {
            cell.style.backgroundColor = '#D5EDF6';
        }
        aroundValidIndex.forEach((num) => {
            if (cell.id == num) {
                cell.style.backgroundColor = '#00D775';
            }
        })
    })
    turnLabel.textContent = turn;
}
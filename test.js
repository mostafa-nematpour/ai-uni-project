let board2 = [
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
    '', '', '', '',
];
let turn = 'O';
let number = 0;
let all = allComplete(board2, 0, '')

let allX = [...all].filter((item) =>
    item.winner == 'X'
)

let allO = all.filter((item) =>
    item.winner == 'O'
)

let allFull = all.filter((item) =>
    item.winner == 'full'
)

console.log(all)
console.log('\n')
console.log('starter: ', turn)
console.log('All complete: ', all.length)
console.log('X   wins: ', allX.length)
console.log('O   wins: ', allO.length)
console.log('not winner: ', allFull.length)
console.log(number);
// allFull.forEach((item) => {
//     printBoard(item.board)
// })



function allComplete(board0, count, history) {
    const board = [...board0];
    let winner = checkWin(board);

    if (winner === 'X') {
        return [{ winner: 'X', count, board, history }];
    } else if (winner === 'O') {
        return [{ winner: 'O', count, board, history }];
    } else if (winner === 'full') {
        return [{ winner: 'full', count, board, history }];
    }


    let available = getAvailableMoves(board)
    let answer = []
    for (let move of available) {
        number++;
        board[move[0]] = turn;
        turn = anotherPlayer(turn)
        board[move[1]] = turn;
        answer.push(
            ...allComplete(board, count + 1, history + '\n' + boardToString(board))
        )
    }
    return answer;
}


function anotherPlayer(player) {
    // if X >>> O , if O >>> X , else >>> false
    return player === 'X' ? 'O' : player === 'O' ? 'X' : false;
}

function randomMoveIndex(board) {
    let localBoard = [...board];
    const candidates = getAvailableMoves(localBoard);

    if (candidates.length == 0) {
        return false;
    }
    const random = Math.floor(Math.random() * candidates.length);
    return candidates[random];
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
        const aroundCells = getValidAround(localBoard, item);
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

function getValidAround(board, position) {
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

    if (board.every(cell => cell === 'O' || cell === 'X')) {
        return 'full';
    }

    // no winner
    return null;

}



function checkThreeInArr(array, symbol) {
    return !!((array[0] == symbol && array[1] == symbol && array[2] == symbol) ||
        (array[1] == symbol && array[2] == symbol && array[3] == symbol))
}

function printBoard(board) {
    console.log("\n");
    for (let i = 0; i < 4; i++) {
        let row = [board[i * 4], board[i * 4 + 1], board[i * 4 + 2], board[i * 4 + 3]];
        console.log("  ", ...row);
    }
    console.log("\n");
}

function boardToString(board) {
    let string = "";
    for (let i = 0; i < 4; i++) {
        let row = [
            board[i * 4] == '' ? ' ' : board[i * 4],
            board[i * 4 + 1] == '' ? ' ' : board[i * 4 + 1],
            board[i * 4 + 2] == '' ? ' ' : board[i * 4 + 2],
            board[i * 4 + 3] == '' ? ' ' : board[i * 4 + 3]
        ];

        string += row.toString() + '                \n'
    }
    return string;
}
'use strict'


const MINE = '💣'
const FLAG = '🚩'
var gBoard


var gLevelEasy = {
    SIZE: 4,
    MINES: 2
}

var gLevelMedium = {
    SIZE: 5,
    MINES: 4
}

var gLevelHard = {
    SIZE: 6,
    MINES: 6
}

// run on each cell on the mat 

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = createBoard(gLevelEasy.SIZE, gLevelEasy.SIZE)
    setMines(gBoard, gLevelEasy.MINES)
    setMinesNegCount(gBoard)
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
    console.log(gBoard)
}


// util
function createBoard(ROWS, COLS) {
    const board = []
    for (var i = 0; i < ROWS; i++) {
        board.push([])
        for (var j = 0; j < COLS; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

// util
function renderBoard(board, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            // console.log(className);
            if (cell.isMine) {
                strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${className}"><span class = "hidden">${MINE}</span></td>`
            } else {
                strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${className}"><span class = "hidden">${cell.minesAroundCount}</span></td>`
            }

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


// util negs function, used in setMinesNegCount to update DOM and MODEL
function getMinesNegCount(rowIdx, colIdx, board) {
    var negsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) negsCount++
        }
    }
    return negsCount
}


// check the negs of all set mines on the board
function setMinesNegCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            cell.minesAroundCount = getMinesNegCount(i, j, board)
        }
    }
}


// set mines on board
function setMines(board, mineCount) {
    for (var i = 0; i < mineCount; i++) {
        var x = getRandomIntInclusive(0, board.length - 1)
        var y = getRandomIntInclusive(0, board[0].length - 1)
        if (board[x][y].isMine) {
            continue
        } else {
            board[x][y].isMine = true
            console.log(x, y)
        }
    }
}


// check if cell is bomb, hidden, or has bombs around him
function onCellClicked(elCell, i, j) {
    if (gGame.isOn) {
        gBoard[i][j].isShown = true
        var tdata = elCell.querySelector("span")
        tdata.classList.remove('hidden')
        if (gBoard[i][j].isMine)
        elCell.classList.add('boom')
        else {
            elCell.classList.add('shown-cell')
            gGame.shownCount += 1
        }
    }
    if (gBoard[i][j].isMine === true) return
    expandShown(gBoard,elCell, i, j)
}

function onCellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

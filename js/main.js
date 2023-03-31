'use strict'


const MINE = '💣'
const FLAG = '🚩'
var gBoard


var gLevel = {
    SIZE: 4,
    MINES: 2
}


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = createBoard(gLevel.SIZE)
    setMines(gBoard, gLevel.MINES)
    setMinesNegCount(gBoard)
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
    // console.log(gBoard)
}


// util
function createBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
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
                strHTML += `<td oncontextmenu="onCellMarked(event, this, ${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})" class="${className}"><span class = "hidden">${MINE}</span></td>`
            } else {
                strHTML += `<td oncontextmenu="onCellMarked(event, this, ${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})" class="${className}"><span class = "hidden">${cell.minesAroundCount}</span></td>`
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


// check the negs of all set mines on the board, update 
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
            // console.log(x, y)
        }
    }
}


// check if cell is bomb, hidden, or has bombs around him
function onCellClicked(elCell, i, j) {
    if (gGame.isOn) {
        if (gBoard[i][j].isShown) return
        gBoard[i][j].isShown = true
        var tdata = elCell.querySelector('span') // get the span - the number within the td
        tdata.classList.remove('hidden') // remove the hidden class
        if (gBoard[i][j].isMine)
            elCell.classList.add('boom')
        else {
            elCell.classList.add('shown-cell') // if class is not mine or hidden, show it when clicked
            gGame.shownCount++
        }
    }
    if (gBoard[i][j].isMine) return // if a mine is present, don't expand negs
    expandShown(gBoard, i, j)
}


// sets a chosen game level 
function gameLevel(level) {
    gLevel = level
    onInit()
}

// put flags with right click
function onCellMarked(ev, elCell, i, j) {
    ev.preventDefault()
    var tdata = elCell.querySelector('span') // get the span - where the number is stored (span within td)
    var currCell = gBoard[i][j]
    if (currCell.isShown) return // cannot flag shown cells

    if (currCell.isMarked) {
        currCell.isMarked = false // remove a flag
        tdata.innerHTML = gBoard[i][j].minesAroundCount // this + line 155 would return the previous number under the flag, if there was any
        tdata.classList.add('hidden')
        if (currCell.isMine) {
            // opposite of line 154, lower the flag count
            gGame.markedCount--
            tdata.innerHTML = MINE
        }
    } else {
        // put a flag, don't hide the cell anymore, 
        currCell.isMarked = true
        tdata.innerHTML = FLAG
        tdata.classList.remove('hidden')
        if (currCell.isMine) {
            gGame.markedCount++
            console.log(gGame.markedCount)
        }
    }
}


function checkGameOver() {

}


function expandShown(board, rowIdx, colIdx) {
    // neighbor loop
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            var cell = board[i][j] // the cell in the matrix
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (cell.isMine || cell.isShown) continue
            cell.isShown = true
            // console.log(cell)
            var elCell = document.querySelector(`.cell-${i}-${j}`) // save specific cell from DOM
            var tdata = elCell.querySelector('span') // get the span in the specific cell
            // console.log(elCell)
            tdata.classList.remove('hidden')
            elCell.classList.add('shown-cell')
        }
    }
}
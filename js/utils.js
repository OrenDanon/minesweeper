'use strict'

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)// '.cell-2-7'
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function countNegs(rowIdx, colIdx, mat) {
    var negsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++
        }
    }
    return negsCount
}

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}

function drawNum() {
    var idx = getRandomInt(0, gNums.length)
    var num = gNums.splice(idx, 1)[0]
    return num
}


function findEmptyPos() {

    var emptyPoss = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            // console.log('cell', cell)
            // console.log('cell === \'\'', cell === '')
            // console.log('!cell', !cell)
            if (!cell) {
                var pos = { i, j }
                // var pos = { i: i, j: j }
                emptyPoss.push(pos)
            }
        }
    }
    var randIdx = getRandomInt(0, emptyPoss.length)
    var randPos = emptyPoss[randIdx]
    return randPos
}
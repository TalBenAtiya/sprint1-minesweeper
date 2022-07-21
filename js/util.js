'use strict'

function renderBoard(mat) {
    var strHTML = '<table border="0" celpadding="5"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j]
            const className = 'cell-' + i + '-' + j
            if (cell.isShown && cell.isMine) {
                strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})">${MINE}</td>`
            } else if (cell.isShown && cell.isMine === false) {
                strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})">${cell.minesAroundCount}</td>`
            } else if (cell.isMarked) {
                strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})">${MARK}</td>`
            }
            else {
                strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})"></td>`
            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getEmptyCells() {
    const emptyCells = []

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {

            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }
    const idx = getRandomInt(0, emptyCells.length)
    return emptyCells[idx]
}

// function countNeighborsMines(cellI, cellJ, mat) {
//     var minesCount = 0;

//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue;
//             if (j < 0 || j >= mat[i].length) continue;
//             if (mat[i][j] === MINE) {
//                 minesCount++
//             }
//         }
//     }
//     return minesCount;
// }

function getNeighborsStatus(cellI, cellJ, mat) {
    const neighborsOpts = []

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i === mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j === mat[i].length) continue;
            neighborsOpts.push(gBoard[i][j])
        }
    }
    return neighborsOpts
}

// inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var miliSec = 0
var sec = 0
var min = 0
function stopWatch() {
    if (gIsTimer) {
        miliSec = parseInt(miliSec)
        sec = parseInt(sec)
        min = parseInt(min)

        miliSec += 48

        if (miliSec >= 1000) {
            sec++
            miliSec = 0
        }

        if (sec == 60) {
            min++
            sec = 0
            miliSec = 0
        }

        if (miliSec < 10) {
            miliSec = '0' + miliSec
        }

        if (sec < 10) {
            sec = '0' + sec
        }

        if (min < 10) {
            min = '0' + min
        }
        var elStopWatch = document.querySelector('.timer')
        elStopWatch.innerText = min + ' : ' + sec + ' : ' + miliSec
    }
}


function resetTimer(){
    miliSec = 0
    sec = 0
    min = 0
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = `00:00:00`
    
}
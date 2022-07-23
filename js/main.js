'use strict'

window.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    cellMarked(event.target)
})

var gBoard
var gLives
var markCount
var cellCount
var currLvl = 0
var gIsTimer
var gInterval = setInterval(stopWatch, 47)
var gSafeClicks
// var gHints
// var gIsHint

const MINE = '💣'
const MARK = '🚩'

var gGame = {
    isOn: false,
}

var gLevel = [
    {
        size: 4,
        mines: 3
    },
    {
        size: 8,
        mines: 12
    },
    {
        size: 12,
        mines: 30
    },
]

function chooseLevel(btn) {
    var level = btn.className.split('-')
    currLvl = level[1]
    initGame(currLvl)
}

function initGame(level = currLvl) {
    var elLives = document.querySelector('.lives')
    var elBtn = document.querySelector('.smiley')
    var elTxt = document.querySelector(`h4`)
    elLives.innerText = '❤️❤️❤️'
    elBtn.innerText = '😄'
    console.log(elTxt.innerText);
    elTxt.innerText = '3 Clicks Available'

    resetTimer()

    // gIsHint = false
    // gHints = 3
    gSafeClicks = 3
    gIsTimer = false
    gLives = 3
    markCount = 0
    cellCount = 0
    gGame.isOn = true

    gBoard = buildBoard(gLevel[level])
    renderBoard(gBoard)
}

function buildBoard({ size = 4, mines = 3 }) {
    const board = []

    for (var i = 0; i < size; i++) {
        const row = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i, j },
            }
            row.push(cell)
        }
        board.push(row)
    }

    for (var z = 0; z < gLevel[currLvl].mines; z++) {
        var x = getRandomInt(0, size - 1)
        var y = getRandomInt(0, size - 1)
        if (board[x][y].isMine) {
            z -= 1
            continue
        } else {
            board[x][y].isMine = true
        }
    }

    console.table(board);
    return board
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    // if (gIsHint) {
    //     getHint(elCell)
    //     return
    // }
    if (!gIsTimer) gIsTimer = true


    if (gBoard[i][j].isShown) return

    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        steppedOnMine()
        return
    } else {
        gBoard[i][j].isShown = true
        cellCount++
    }

    const neighbors = getNeighborsStatus(i, j, gBoard)
    for (var z = 0; z < neighbors.length; z++) {
        if (neighbors[z].isMine) {
            gBoard[i][j].minesAroundCount++
        }
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(elCell, i, j)
    }
    renderBoard(gBoard)
    checkVictory()
}

function steppedOnMine() {
    gLives--
    var elLives = document.querySelector('.lives')
    if (gLives === 2) elLives.innerText = '❤️❤️'
    if (gLives === 1) elLives.innerText = '❤️'
    if (gLives === 0) {
        elLives.innerText = ''
        var elBtn = document.querySelector('.smiley')
        elBtn.innerText = '🤯'
        gameOver()
    }
    renderBoard(gBoard)
}

function cellMarked(elCell) {
    if (!gGame.isOn) return

    var className = elCell.className
    var classIdx = className.split('-')
    const i = classIdx[1]
    const j = classIdx[2]

    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        markCount--
    }
    else {
        gBoard[i][j].isMarked = true
        markCount++
    }

    checkVictory()
    renderBoard(gBoard)
}

function expandShown(elCell, i, j) {
    const neighbors = getNeighborsStatus(i, j, gBoard)
    for (var z = 0; z < neighbors.length; z++) {
        var idx = neighbors[z].location.i
        var jdx = neighbors[z].location.j

        if (neighbors[z].isShown) continue

        const newNeighbors = getNeighborsStatus(idx, jdx, gBoard)
        for (var x = 0; x < newNeighbors.length; x++) {
            if (newNeighbors[x].isMine) {
                gBoard[idx][jdx].minesAroundCount++
                gBoard[idx][jdx].isShown = true

            } else {
                gBoard[idx][jdx].isShown = true

            }
        }
        cellCount++
    }
    renderBoard(gBoard)
}

// function getHint(elCell) {
//     if (!gIsHint) {
//         gIsHint = true
//     }
//     if (gHints <= 0) return
//     gHints--
//     var hintCell = elCell.className
//     hintCell = hintCell.split('-')
//     var i = hintCell[1]
//     var j = hintCell[2]
//    console.log(hintCell)
//     var negs = getNeighborsStatus(i, j, gBoard)
    // console.log(negs)
    // for (var i = 0; i < negs.length; i++) {
    // }

    // var elBtn = document.querySelector('.hint')
    // if (gHints === 2) elBtn.innerText = '💡💡'
    // if (gHints === 1) elBtn.innerText = '💡'
    // if (gHints === 0) elBtn.innerText = ''
    // gIsHint = false
// }

function safeClick() {
    if (gSafeClicks <= 0) return
    gSafeClicks--
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                var safeCell = gBoard[i][j]
            }
        }
    }
    var idx = safeCell.location.i
    var jdx = safeCell.location.j

    var elCell = document.querySelector(`.cell-${idx}-${jdx}`)
    var elTxt = document.querySelector(`h4`)
    elCell.style.backgroundColor = 'lightyellow'
    setTimeout(() => { elCell.style.backgroundColor = '' }, 2000)
    if (gSafeClicks === 2) elTxt.innerText = '2 Clicks Available'
    if (gSafeClicks === 1) elTxt.innerText = '1 Click Available'
    if (gSafeClicks === 0) elTxt.innerText = 'No Clicks...'
}

function checkVictory() {
    var size = gLevel[currLvl].size
    var mines = gLevel[currLvl].mines
    console.log(cellCount);
    if (cellCount === size * size - mines && markCount === mines - (3 - gLives)) {
        var elBtn = document.querySelector('.smiley')
        elBtn.innerText = '😎'
        gameOver()
    }
}

function gameOver() {
    gGame.isOn = false
    gIsTimer = false
    clearInterval(gInterval)
}

function restartGame() {

    initGame()

}
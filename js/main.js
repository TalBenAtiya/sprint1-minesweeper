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

const MINE = '💣'
const MARK = '🚩'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
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
    elLives.innerText = '❤️❤️❤️'
    var elBtn = document.querySelector('.smiley')
    elBtn.innerText = '😄'
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = `00:00:00`
    
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
    if(!gIsTimer) gIsTimer = true
    

        if (gBoard[i][j].isShown) return
    gBoard[i][j].isShown = true
    cellCount++

    if (gBoard[i][j].isMine) {
        steppedOnMine()
        return
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
        cellCount++

        if (neighbors[z].isShown) continue

        const newNeighbors = getNeighborsStatus(idx, jdx, gBoard)
        for (var x = 0; x < newNeighbors.length; x++) {
            if (newNeighbors[x].isMine) {
                gBoard[idx][jdx].minesAroundCount++
                gBoard[idx][jdx].isShown = true
                elCell.InnerText = gBoard[idx][jdx].minesAroundCount
            } else {
                gBoard[idx][jdx].isShown = true
                elCell.InnerText = gBoard[idx][jdx].minesAroundCount
            }
        }
    }
    renderBoard(gBoard)
}

function checkVictory() {
    var size = gLevel[currLvl].size
    var mines = gLevel[currLvl].mines

    if (cellCount >= (size * size - mines) && markCount === mines - (3 - gLives)) {
        var elBtn = document.querySelector('.smiley')
        elBtn.innerText = '😎'
        gameOver()
    }
}

function gameOver() {
    gGame.isOn = false
    gIsTimer = false
}

function restartGame() {

    initGame()

}
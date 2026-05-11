var player = 'X'
var gridSize = 3
var maxPos = 3*3
var hasCenter = true
var center = 4
var threeD = false

function newBoard() {
    for (pos=0; pos<maxPos; pos++)
        if (pos%(gridSize*gridSize)==0)
            document.getElementById('p'+(pos/gridSize/gridSize)).remove()
    var board = document.getElementById("board")
    var plane
    gridSize = document.getElementById("gridSize").value
    if (gridSize%2==1) {
        hasCenter = true
        center = Math.floor(gridSize/2) + gridSize*Math.floor(gridSize/2)
    } else {
        hasCenter = false
    }
    maxPos = gridSize*gridSize
    threeD = document.getElementById("3D").checked
    if (threeD==true) {
        maxPos *= gridSize
        center += gridSize*gridSize*Math.floor(gridSize/2)
    }
    for (pos=0; pos<maxPos; pos++) {
        if (pos%(gridSize*gridSize)==0) {
            board.insertAdjacentHTML('beforeend', '<div id="p'+(pos/(gridSize*gridSize))+'"></div>')
            plane = document.getElementById('p'+(pos/gridSize/gridSize))
        } else if (pos%gridSize==0)
            plane.insertAdjacentHTML('beforeend', '<br>')
        plane.insertAdjacentHTML('beforeend', '<button id='+pos+' onClick="play('+pos+')">&nbsp;</button>')
    }
    if (document.getElementById('computerFirst').checked) {
        if (hasCenter)
            document.getElementById(center).innerHTML = 'O'
        else
            document.getElementById(0).innerHTML = 'O'
    }
}

function play(pos) {
    setPos(pos, 'X')
    if (hasFreeCells()) {
        while (true) {
            pos = Math.floor(Math.random()*maxPos)
            if (document.getElementById(pos).innerHTML=="&nbsp;") break
        }
        setPos(pos, 'O')
    }
}

function setPos(pos, player) {
    var btn = document.getElementById(pos)
    btn.innerHTML = player
    btn.disabled = true
    checkVictory(pos, player)
}

function checkVictory(pos, player) {
    i = pos%3
    j = Math.floor(pos/3)
    posW = 3*j + (i+2)%3
    posE = 3*j + (i+1)%3
    posS = 3*((j+1)%3) + i
    posN = 3*((j+2)%3) + i
    posA = 3*((j+1)%3) + (i+1)%3
    posB = 3*((j+2)%3) + (i+2)%3
    posC = 3*((j+1)%3) + (3+i-1)%3
    posD = 3*((j+2)%3) + (3+i-2)%3
    if (document.getElementById(posW).innerHTML==player && document.getElementById(posE).innerHTML==player)
        endGame(player)
    else if (document.getElementById(posS).innerHTML==player && document.getElementById(posN).innerHTML==player)
        endGame(player)
    else if (i==j && document.getElementById(posA).innerHTML==player && document.getElementById(posB).innerHTML==player)
        endGame(player)
    else if ((i+j)==2 && document.getElementById(posC).innerHTML==player && document.getElementById(posD).innerHTML==player)
        endGame(player)
}

function endGame(player) {
    alert("Player " + player + " won.")
    for (pos=0; pos<maxPos; pos++)
        document.getElementById(pos).disabled = true
}

function hasFreeCells() {
    for (pos=0; pos<maxPos; pos++)
        if (document.getElementById(pos).disabled!=true)
            return true
    return false
}

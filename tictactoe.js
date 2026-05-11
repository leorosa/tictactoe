var player = 'X'
var gridSize = 3
var maxPos = 3*3
var threeD = false

function newBoard() {
    player = 'X'
    for (pos=0; pos<maxPos; pos++)
        if (pos%(gridSize*gridSize)==0)
            document.getElementById('p'+(pos/gridSize/gridSize)).remove()
    var board = document.getElementById("board")
    var plane
    gridSize = document.getElementById("gridSize").value
    maxPos = gridSize*gridSize
    threeD = document.getElementById("3D").checked
    if (threeD==true)
        maxPos *= gridSize
    for (pos=0; pos<maxPos; pos++) {
        if (pos%(gridSize*gridSize)==0) {
            board.insertAdjacentHTML('beforeend', '<div id="p'+(pos/(gridSize*gridSize))+'"></div>')
            plane = document.getElementById('p'+(pos/gridSize/gridSize))
        }
        if (pos%gridSize==0)
            plane.insertAdjacentHTML('beforeend', '<br id="l'+(pos/gridSize)+'">')
        plane.insertAdjacentHTML('beforeend', '<button id='+pos+' onClick="setPos('+pos+')">&nbsp;</button>')
    }
}

function setPos(pos) {
    var btn = document.getElementById(pos)
    btn.disabled = true
    btn.innerHTML = player
    checkVictory(pos, player)
    player = (player=='X') ? 'O' : 'X'
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
    for (pos=0; pos<9; pos++)
        document.getElementById(pos).disabled = true
}

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
        center = -1
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
            setPos(center, 'O')
        else
            setPos(0, 'O')
    }
}

function play(pos) {
    setPos(pos, 'X')
    if (hasFreeCells()) { // computer logic:
        pos = -1;
        var freePos = -1;
        var valuePos = -1;
        var valueMax = -1;
        for (pos=0; pos<maxPos; pos++) {
            valuePos = -2;
            if (isCellFree(pos)) {
                valuePos = 0;
                if (checkVictory(pos, 'O')>0) { // return victorious position immediately
                    return pos;
                } else if (checkVictory(pos, 'X')>0) { // avoid losing
                    valuePos = 18;
                } else if (hookTest(pos, 'X')) {
                    valuePos = 16;
                } else if (hookTest(pos, 'O')) {
                    valuePos = 14;
                } else if (pos==center) {
                    valuePos = 12;
                } else if (hookFuture(pos, 'O')) {
                    valuePos = 10;
                } else if (hookFuture(pos, 'X')) {
                    valuePos = 8;
                } else if (hookTest(pos, '&nbsp;')) { // priorize free line/column/diagonal
                    valuePos = 4;
                    if (isVertex(pos)) valuePos += 2;
                } else if (isVertex(pos)) {
                    valuePos = 2;
                }
                if (valuePos>valueMax) {
                    valueMax = valuePos - Math.floor(Math.random()*1.999); // a touch of randomness...
                    freePos = pos;
                }
            }
        }
        setPos(freePos, 'O')
    }
}

function setPos(pos, player) {
    var btn = document.getElementById(pos)
    btn.innerHTML = player
    btn.disabled = true
    if (checkVictory(pos, player))
        endGame(player)
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
        return true
    else if (document.getElementById(posS).innerHTML==player && document.getElementById(posN).innerHTML==player)
        return true
    else if (i==j && document.getElementById(posA).innerHTML==player && document.getElementById(posB).innerHTML==player)
        return true
    else if ((i+j)==2 && document.getElementById(posC).innerHTML==player && document.getElementById(posD).innerHTML==player)
        return true
}

function endGame(player) {
    alert("Player " + player + " won.")
    for (pos=0; pos<maxPos; pos++)
        document.getElementById(pos).disabled = true
}

function hasFreeCells() {
    for (pos=0; pos<maxPos; pos++)
        if (isCellFree(pos))
            return true
    return false
}

function isCellFree(pos) {
    if (document.getElementById(pos).disabled==true)
        return false
    return true
}

function hookTest(pos, player) {
	var hook = 0
	document.getElementById(pos).innerHTML = player
	for (pos2=0; pos2<maxPos; pos2++) {
		if (isCellFree(pos2)) {
			if (checkVictory(pos2, player)>0) {
				hook++
			}
		}
	}
	document.getElementById(pos).innerHTML = '&nbsp;'
	return hook>1?true:false
}

function hookFuture(pos, player) {
	var hook = 0
	document.getElementById(pos).innerHTML = player
	for (pos2=0; pos2<maxPos; pos2++) {
		if (isCellFree(pos2)) {
			if (hookTest(pos2, player)) {
				hook++
				break
			}
		}
	}
	document.getElementById(pos).innerHTML = '&nbsp;'
	return hook>1?true:false
}

function isVertex(pos) { return pos==0 || pos==gridSize-1 || pos==gridSize*(gridSize-1) || pos==gridSize*gridSize-1; }

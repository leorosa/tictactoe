var FLAGI = 1 // victory flags (column, line, diagonals)
var FLAGJ = 2
var FLAGK = 4
var FLAGIJP = 8
var FLAGIJS = 16
var FLAGIKP = 32
var FLAGIKS = 64
var FLAGJKP = 128
var FLAGJKS = 256
var FLAGA = 512
var FLAGB = 1024
var FLAGC = 2048
var FLAGD = 4096

var NGRID = 3
var ZGRID = 1
var MAXPOS = 3*3
var HASCENTER = true
var CENTER = 4

function newBoard() {
    for (pos=0; pos<MAXPOS; pos++)
        if (pos%(NGRID*NGRID)==0)
            document.getElementById('p'+(pos/NGRID/NGRID)).remove()
    var board = document.getElementById("board")
    var plane
    NGRID = document.getElementById("gridSize").value
    if (document.getElementById("3D").checked) {
        ZGRID = NGRID
    }
    MAXPOS = NGRID*NGRID*ZGRID
    if (NGRID%2==1) {
        HASCENTER = true
        CENTER = Math.floor(NGRID/2) + NGRID*Math.floor(NGRID/2) + NGRID*NGRID*Math.floor(ZGRID/2)
    } else {
        HASCENTER = false
        CENTER = -1
    }
    for (pos=0; pos<MAXPOS; pos++) {
        if (pos%(NGRID*NGRID)==0) {
            board.insertAdjacentHTML('beforeend', '<div id="p'+(pos/(NGRID*NGRID))+'"></div>')
            plane = document.getElementById('p'+(pos/NGRID/NGRID))
        } else if (pos%NGRID==0)
            plane.insertAdjacentHTML('beforeend', '<br>')
        plane.insertAdjacentHTML('beforeend', '<button id='+pos+' onClick="play('+pos+')">&nbsp;</button>')
    }
    if (document.getElementById('computerFirst').checked) {
        if (HASCENTER)
            setPos(CENTER, 'O')
        else
            setPos(0, 'O')
    }
}

function play(pos) {
    setPos(pos, 'X')
    if (hasFreeCells()) {
        setPos(computerPos(), 'O')
    }
    if (!hasFreeCells())
        endGame("No player")
}

function computerPos() {
    var freePos = -1;
    var valuePos = -1;
    var valueMax = -1;
    for (pos=0; pos<MAXPOS; pos++) {
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
            } else if (HASCENTER && pos==CENTER) {
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
    return freePos
}

function setPos(pos, player) {
    var btn = document.getElementById(pos)
    btn.innerHTML = player
    btn.disabled = true
    if (checkVictory(pos, player)>0)
        endGame(player)
}

function checkVictory(pos, player) {
    var i = idxI(pos)
    var j = idxJ(pos)
    var k = idxK(pos)
    var res = FLAGI + FLAGJ
	if (ZGRID==NGRID) {
        res += FLAGK;
        if (i==k) res += FLAGIKP;
        if (i==NGRID-1-k) res += FLAGIKS;
        if (j==k) res += FLAGJKP;
        if (j==NGRID-1-k) res += FLAGJKS;
    }
    if (i==j) {
        res += FLAGIJP;
        if (ZGRID==NGRID) {
            if (i==k) res += FLAGA;
            if (i==NGRID-1-k) res += FLAGC;
        }
    }
    if (i==NGRID-1-j) {
        res += FLAGIJS;
        if (ZGRID==NGRID) {
            if (i==k) res += FLAGB;
            if (i==NGRID-1-k) res += FLAGD;
        }
    }
    for (n=1; n<NGRID; n++) {
        if ((res&FLAGI)>0 && document.getElementById(ijk2pos((i+n)%NGRID,j,k)).innerHTML!=player) { res -= FLAGI }
        if ((res&FLAGJ)>0 && document.getElementById(ijk2pos(i,(j+n)%NGRID,k)).innerHTML!=player) { res -= FLAGJ }
        if ((res&FLAGK)>0 && document.getElementById(ijk2pos(i,j,(k+n)%ZGRID)).innerHTML!=player) { res -= FLAGK; }
        if ((res&FLAGIJP)>0 && document.getElementById(ijk2pos((i+n)%NGRID,(j+n)%NGRID,k)).innerHTML!=player) { res -= FLAGIJP }
        if ((res&FLAGIJS)>0 && document.getElementById(ijk2pos((NGRID+i-n)%NGRID,(j+n)%NGRID,k)).innerHTML!=player) { res -= FLAGIJS }
        if ((res&FLAGIKP)>0 && document.getElementById(ijk2pos((i+n)%NGRID,j,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGIKP; }
        if ((res&FLAGIKS)>0 && document.getElementById(ijk2pos((NGRID+i-n)%NGRID,j,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGIKS; }
        if ((res&FLAGJKP)>0 && document.getElementById(ijk2pos(i,(j+n)%NGRID,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGJKP; }
        if ((res&FLAGJKS)>0 && document.getElementById(ijk2pos(i,(NGRID+j-n)%NGRID,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGJKS; }
        if ((res&FLAGA)>0 && document.getElementById(ijk2pos((i+n)%NGRID,(j+n)%NGRID,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGA; }
        if ((res&FLAGB)>0 && document.getElementById(ijk2pos((i+n)%NGRID,(NGRID+j-n)%NGRID,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGB; }
        if ((res&FLAGC)>0 && document.getElementById(ijk2pos((NGRID+i-n)%NGRID,(NGRID+j-n)%NGRID,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGC; }
        if ((res&FLAGD)>0 && document.getElementById(ijk2pos((NGRID+i-n)%NGRID,(j+n)%NGRID,(k+n)%NGRID)).innerHTML!=player) { res -= FLAGD; }
    }
    return res
}

function endGame(player) {
    alert(player + " won.")
    for (pos=0; pos<MAXPOS; pos++)
        document.getElementById(pos).disabled = true
}

function hasFreeCells() {
    for (pos=0; pos<MAXPOS; pos++)
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
	for (pos2=0; pos2<MAXPOS; pos2++) {
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
	for (pos2=0; pos2<MAXPOS; pos2++) {
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

function isVertex(pos) { return pos==0 || pos==NGRID-1 || pos==NGRID*(NGRID-1) || pos==NGRID*NGRID-1; }
function idxI(pos) { return pos%NGRID; }
function idxJ(pos) { return Math.floor(pos/NGRID)%NGRID; }
function idxK(pos) { return Math.floor(pos/NGRID/NGRID)%ZGRID; }
function ijk2pos(i, j, k) { return NGRID*NGRID*(k%ZGRID) + NGRID*(j%NGRID) + i%NGRID; }

/*
Authors: Matt Wisner

Filename:script.js

Purpose: The purpose of this javascript document is to traverse Project #2 – Blue Asqwilanga-Caverns. This project first finds viable caverns and then uses the rules to traverse between caverns while making sure it doesn't go where it has gone before.
*/



//Initialize Canvas
var canvas = document.getElementById("caverns");
canvas.width = 815;
canvas.height = 815;
var c = canvas.getContext("2d");

//array for storing viable caverns
var bluecaverns = [];

//holds the number of caverns generated by initializeCaverns()
var numCaverns = 0;

//holds least residue value to check for when program has explored to central most point
var minResidue = 999;

var currCave = 0;
var cavesVisited = [];
var prevCave = 0;

//blue cavern has three variables with maxes (16, 8, 7), x and y coordinates, and a residue value
function bluecavern(a, b, c, x, y, residue) {

    //this is the three values used to implement the rules
    this.a = a;
    this.b = b;
    this.c = c;

    //this is used to keep track of where the cavern is displayed
    this.x = x;
    this.y = y;

    //this is used to determine nearness to center
    this.residue = residue;
}


//fills array bluecaverns with all possible reachable caverns based on Sum rule and Zero-max rule
function initializeCaverns() {

    //holds value of which row the cavern is in
    var rowCounter = 1;

    //holds value of which column the cavern is in
    var colCounter = 0;

    //Algorithm to generate viable caverns, generates backwards so starting room is 16,0,0(this is equal to G,0,0)
    for (var i = 16; i >= 0; i--) {
        for (var j = 8; j >= 0; j--) {
            for (var k = 7; k >= 0; k--) {
                //Sum rule = all rooms viable rooms must have sum of 16
                if (i + j + k == 16) {

                    if (colCounter == 6) {
                        colCounter = 0;
                        rowCounter++;
                    }

                    //Zero-max rule = of the two changed room ID parts, either one part must be at its limit or zero
                    //This checks all 3 parts to determine if atleast one is min or maxed out
                    //This does not mean that the room is reachable it is just a candidate for one to move to
                    if (i == 16 | i == 0) {
                        colCounter++;
                        bluecaverns[numCaverns] = new bluecavern(i, j, k, 100 * colCounter, 100 * rowCounter, calcResidue(i, j, k));
                        numCaverns++;
                    } else if (j == 8 | j == 0) {
                        colCounter++;
                        bluecaverns[numCaverns] = new bluecavern(i, j, k, 100 * colCounter, 100 * rowCounter, calcResidue(i, j, k));
                        numCaverns++;
                    } else if (k == 7 | k == 0) {
                        colCounter++;
                        bluecaverns[numCaverns] = new bluecavern(i, j, k, 100 * colCounter, 100 * rowCounter, calcResidue(i, j, k));
                        numCaverns++;
                    }
                }
            }
        }
    }

    for (var i = 0; i < numCaverns; i++) {
        cavesVisited.push(false);
    }

    cavesVisited[currCave] = true;;

    console.log("Number of caverns " + " " + numCaverns);

}

//displays caverns on canvas
function displayCaverns() {

    for (var i = 0; i < numCaverns; i++) {
        drawCavern(i, "white");
    }
    drawCavern(currCave, 'gray')
}

//set up movement for animation
function travelCaverns() {


    prevCave = currCave;

    //checks for possible move
    for (var i = 0; i < numCaverns; i++) {
        if ((bluecaverns[currCave].a == bluecaverns[i].a) && (bluecaverns[i].b == 0 || bluecaverns[i].b == 8 || bluecaverns[i].c == 0 || bluecaverns[i].c == 7)) {
            if (cavesVisited[i] == false) {
                cavesVisited[i] = true;
                currCave = i;
                console.log(bluecaverns[i].a + " " + bluecaverns[i].b + " " + bluecaverns[i].c + " " + bluecaverns[i].residue + " " + i);
                i = numCaverns;
            }
        } else if ((bluecaverns[currCave].b == bluecaverns[i].b) && (bluecaverns[i].a == 0 || bluecaverns[i].a == 16 || bluecaverns[i].c == 0 || bluecaverns[i].c == 7)) {
            if (cavesVisited[i] == false) {
                cavesVisited[i] = true;
                currCave = i;
                console.log(bluecaverns[i].a + " " + bluecaverns[i].b + " " + bluecaverns[i].c + " " + bluecaverns[i].residue + " " + i);
                i = numCaverns;
            }
        } else if ((bluecaverns[currCave].c == bluecaverns[i].c) && (bluecaverns[i].a == 0 || bluecaverns[i].a == 16 || bluecaverns[i].b == 0 || bluecaverns[i].b == 8)) {
            if (cavesVisited[i] == false) {
                cavesVisited[i] = true;
                currCave = i;
                console.log(bluecaverns[i].a + " " + bluecaverns[i].b + " " + bluecaverns[i].c + " " + bluecaverns[i].residue + " " + i);
                i = numCaverns;
            }
        }

    }

    drawCavern(currCave, 'gray');
    drawPath(prevCave, currCave);
    if (bluecaverns[currCave].residue == minResidue) {
        console.log("Minumum Residue has been found at cave " + bluecaverns[currCave].a + " " + bluecaverns[currCave].b + " " + bluecaverns[currCave].c + " with a residue of: " + bluecaverns[currCave].residue);
    }
}

//allows for paths to cycle through colors making them easier to differentiate
var colors = ['red', 'blue', 'green', 'purple'];
var colorNum = 0;

//Draws path between cavern rooms
function drawPath(prevCave, nextCave) {

    c.strokeStyle = colors[colorNum++ % 4];
    c.beginPath();
    c.moveTo(bluecaverns[prevCave].x, bluecaverns[prevCave].y + 20);
    c.lineTo(bluecaverns[prevCave].x, bluecaverns[prevCave].y + 30 + (10*(prevCave%6)));
    c.lineTo(bluecaverns[nextCave].x - 10 - (5*(nextCave%5)), bluecaverns[prevCave].y + 30 + (10*(prevCave%6)));
    c.lineTo(bluecaverns[nextCave].x - 10 - (5*(nextCave%5)), bluecaverns[nextCave].y);
    c.lineTo(bluecaverns[nextCave].x, bluecaverns[nextCave].y);
    c.stroke();

}

//draws a cavern on the page based on its place in the array and what color you want the text to be
function drawCavern(caverNum, cavernColor) {

    var i = caverNum;

    c.fillStyle = 'blue';
    c.fillRect(bluecaverns[i].x, bluecaverns[i].y, 50, 20);

    c.font = "15px Courier";
    c.fillStyle = cavernColor;
    c.fillText(convertToHepta(bluecaverns[i].a) + " " + convertToHepta(bluecaverns[i].b) + " " + convertToHepta(bluecaverns[i].c), bluecaverns[i].x + 2, bluecaverns[i].y + 15);


}



function convertToHepta(num1) {

    switch (num1) {
        case 10:
            return 'A';
            break;
        case 11:
            return 'B';
            break;
        case 12:
            return 'C';
            break;
        case 13:
            return 'D';
            break;
        case 14:
            return 'E';
            break;
        case 15:
            return 'F';
            break;
        case 16:
            return 'G';
            break;
        default:
            return num1;
    }
}



function calcResidue(a, b, c) {
    var residue;

    residue = Math.abs(a - b) + Math.abs(b - c) + Math.abs(c - a);


    //get minimun residue in our case this value is allways 6
    //middle is considered 5,4,7 or 4,5,7
    if (residue < minResidue) {
        minResidue = residue;
    }

    return residue;
}

function main() {



}

window.onload = function () {
    let wait = 1000; // Millisecs
    let stop_cnt = 10; // Stop after this count.
    let ix = 0; // count.

    initializeCaverns();
    displayCaverns();

    var timerx = setInterval(
        function () {
            ++ix;
            travelCaverns();
            if (bluecaverns[currCave].residue == minResidue) {
                clearInterval(timerx);
            }
        }, wait);

}

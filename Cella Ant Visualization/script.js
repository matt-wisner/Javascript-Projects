
//Initialize Canvas
var canvas = document.getElementById( "boxes" );
canvas.width = 815;
canvas.height = 815;
var c = canvas.getContext( "2d" );
var arrowLeft = document.getElementById("arrow-left");
var arrowRight = document.getElementById("arrow-right");
var arrowUp = document.getElementById("arrow-up");
var arrowDown = document.getElementById("arrow-down");

//initialize boxes array initial direction and location
var boxes = [];
var direction = 0;
var focusX = 21;
var focusY = 21;

//set up boxes to have a state relative to their color
function boxState(state){
    this.state = state;
}


var numSteps = 0;

function drawBoxes(){
    //initializes all boxState Objects and Draws them
    for(var i = 1; i <= 41; i++){
        boxes[i] = []
        for(var j = 1; j <= 41; j++){
            c.fillStyle = 'black';
            
            boxes[i][j] = new boxState("black");

            c.fillRect(i*19,j*19,17,17);
        }
    }
}

function step(num1){
    
    numSteps++;
     if(boxes[focusX][focusY].state == "black"){
        boxes[focusX][focusY].state = "red";
        c.fillStyle = 'red';
        c.fillRect(focusX*19,focusY*19,17,17);
        direction++;
    }
    else if(boxes[focusX][focusY].state == "red"){
        boxes[focusX][focusY].state = "yellow";
        c.fillStyle = 'yellow';
        c.fillRect(focusX*19,focusY*19,17,17);
        direction++;
    }
    else if(boxes[focusX][focusY].state == "yellow"){
        boxes[focusX][focusY].state = "blue";
        c.fillStyle = 'blue';
        c.fillRect(focusX*19,focusY*19,17,17);
        direction--;
    }
    else if(boxes[focusX][focusY].state == "blue"){
        boxes[focusX][focusY].state = "black";
        c.fillStyle = 'black';
        c.fillRect(focusX*19,focusY*19,17,17);
        direction--;
    }   
    
    if(direction % 4 == 0){
        //move left
        focusX--;
         c.drawImage(arrowLeft, (focusX*19) - 3, (focusY*19) - 3);
    }
    else if(direction % 4 == 1){
        //move up
        focusY--;
        c.drawImage(arrowUp, (focusX*19) - 3, (focusY*19) - 3);
    }
    else if(direction % 4 == 2){
        //move right
        focusX++;
        c.drawImage(arrowRight, (focusX*19) - 3, (focusY*19) - 3);
    }
    else if(direction% 4 == 3){
        //move down
        focusY++;
        c.drawImage(arrowDown, (focusX*19) - 3, (focusY*19) - 3);
    }
    
    
    if(numSteps >= 4000){
        return;     //break out of function to stop animate from running
    }
    
    window.requestAnimationFrame(animate);

}


function animate(){
	
	setTimeout(step(), 1000 / 1);	//2nd parameter changes the speed 
	
}

function main(){
    
    drawBoxes();
    step();
}

main();






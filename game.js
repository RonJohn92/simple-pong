var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 15;
var ballSpeedY = 4;


var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;
// var titleScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var framesPerSecond = 30;
var myInterval = setInterval(function(framesPerSecond) {
	callBoth();
}, 1000/framesPerSecond);

function calcMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	console.log(rect);
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
		ballSpeedX = 15;
	}
}


// function showTitleScreen() {
// 	titleScreen = true;
// 	canvas = document.getElementById('gameCanvas');
// 	canvasContext = canvas.getContext('2d');
// 	colorRect(0,0,canvas.width, canvas.height, 'red');
// 	canvasContext.fillStyle = 'white'
// 	canvasContext.fillText("RONPONG 123 LET'S PLAY!", canvas.width/2-36, canvas.height/2+50);
// 	// pauseInterval();
//   //canvas.addEventListener('click', resumeInterval());
//
// }
//
// function pauseInterval() {
// 	clearInterval(myInterval);
// }
//
// function resumeInterval() {
// 	myInterval = setInterval(function(framesPerSecond) {
// 		callBoth();
// 	}, 1000/framesPerSecond);
// }


window.onload = function(){
	console.log("Hello World!");
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	// showTitleScreen()
	// the following calls moveEverything() and drawEverything() at variable interval
	// currently set at 30 times per 1000ms(i.e. 1s).

//	var framesPerSecond = 30;
	myInterval;

	// setInterval(function(){
	// 	callBoth();
	// }, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	// listens for mouse movement in the canvas element, calculates the
	// position of the mouse, and uses it to set the player-1 y-paddle coordinate
	// to move the paddle with the mouse.

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calcMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2); // minus (PADDLE_HEIGHT/2) to
																								 // align mouse to center of paddle

			// paddle2Y = mousePos.y - (PADDLE_HEIGHT/2);

		});
}

function callBoth() {
	moveEverything();  // function that contains movement logic and updates elements' positions
	drawEverything();  // function that redraws the screen after everything is moved
}


function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

	if(paddle2YCenter < ballY-25) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY+25) {
		paddle2Y -= 6;
	}
}

function moveEverything() {
	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX > canvas.width-PADDLE_THICKNESS){
		if(ballY > paddle2Y &&
			 ballY < paddle2Y+PADDLE_HEIGHT) {
			 ballSpeedX = ballSpeedX*-1;

			 var deltaY = ballY
 									-(paddle1Y+PADDLE_HEIGHT/2) -20;
 					ballSpeedY = deltaY * 0.20;
		} else {
			player1Score += 1; // must be BEFORE ballReset()
			ballReset();
		}
	}

	if(ballX < canvas.width-canvas.width) {
		if(ballY > paddle1Y &&
		   ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = ballSpeedX*-1;

			// deltaY is a variable that stands for the change in Y, or how steep Y will be when it is hit off of the paddle.
			// it is the ball's Y position, minus the paddle's center position.  DeltaY is then used to modify the ball's Y speed.
			// A coeficient is multiplied to adjust the ball's y speed.
			var deltaY = ballY
									-(paddle1Y+PADDLE_HEIGHT/2);
					ballSpeedY = deltaY -20 * 0.03 *Math.random();
		} else {
			player2Score +=1;
			ballReset();
		}

	}

	if(ballY > canvas.height-5 || ballY < canvas.height-canvas.height +5) {
		ballSpeedY = ballSpeedY*-1;
	}

}

function ballReset() {
	if (player1Score >= WINNING_SCORE ||
			player2Score >= WINNING_SCORE) {
				showingWinScreen = true;
			}

	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = ballSpeedX*-1;
}

function drawNet() {
	for(var i=0; i<canvas.height; i+=120) {
		colorRect(canvas.width/2-5, i, 10, 30, 'white');
	}
	for(var i=60; i<canvas.height; i+=120) {
		colorRect(canvas.width/2-5, i, 10, 30, 'gray');
	}
}


function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width, canvas.height, 'black');

	if(showingWinScreen) {

		ballSpeedX = 0;
		ballSpeedY = 0;
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillStyle = "skyblue";
			canvasContext.fillText("Left Player Won!", canvas.width/2-38, canvas.height/2-25);
		} else if (player2Score >= WINNING_SCORE) {
			canvasContext.fillStyle = "red";
			canvasContext.fillText("Right Player Won!", canvas.width/2-38, canvas.height/2-50);
		}
		canvasContext.fillStyle = "white";
		canvasContext.fillText("Click to continue", canvas.width/2-36, canvas.height/2+50);
		return;
	}

	drawNet();

	// this is left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'skyblue');

	// this is right player paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'red');

	// next line draws the ball
	colorCircle(ballX, ballY, 10, 'white');


	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, 690, 100);
	// canvasContext.fillText("RJ", canvas.width-25, canvas.height-10)

}

function colorCircle (centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill()
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

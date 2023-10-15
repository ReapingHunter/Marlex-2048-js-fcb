let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
// Variables for touch input
let startX = 0;
let startY = 0;

//Function to set the gameboard
function setGame() {
	// Initializes the 4x4 game board with all tiles set to 0
	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	];

	// Create the game board tile on the HTML document
	for(let r = 0; r < rows; r++) {
		for(let c = 0; c < columns; c++) {
			// Creating a div element representing a tile.
			let tile = document.createElement("div");

			//Setting a unique identifier
			tile.id = r.toString() + "-" + c.toString();

			//board is currently set to 0
			let num = board[r][c];

			// Update the tile's appearance based on num value
			updateTile(tile, num);

			// Appends the tile to the gameboard container
			document.getElementById("board").append(tile);
		}
	}
	setTwo();
}

//Function to update the appearance of a tile based on its number
function updateTile(tile, num){
	// clear the tile content
	tile.innerText = "";

	// clear the classList to avoid multiple classes
	tile.classList.value = "";

	// add a class named "tile"
	tile.classList.add("tile");

	// This will check for the "num" parameter and will apply specific styling based on the number value.
	// If num is positive, the number is converted to a string and placed inside the tile as text.
	if(num > 0) {
	    // Set the tile's text to the number based on the num value.
	    tile.innerText = num.toString();
	    // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
	    if (num <= 4096){
	        tile.classList.add("x"+num.toString());
	    } else {
	        // if num is greater than 4096, a special  class "x8192" is added.
	        tile.classList.add("x8192");
	    }
	}
}

// Event that triggers when web page finishes loading
window.onload = function() {
	setGame();
}

// Create function for event listeners for your keys sliding (left, right, up and down)
function handleSlide(e) {
	// Checks if the pressed key is one of the arrow keys.
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
		// Prevent default behavior (scrolling on keydown)
		e.preventDefault();
		//Invokes a function based on the arrow pressed.
		switch(e.code) {
			case "ArrowLeft":
				slideLeft();
				break;
			case "ArrowRight":
				slideRight();
				break;
			case "ArrowUp":
				slideUp();
				break;
			case "ArrowDown":
				slideDown();
				break;
			default:
				break;
		}
		setTwo();
	}
	//Updates score
	document.getElementById("score").innerText = score;

	checkWin();
   // Call hasLost() to check for game over conditions
   if (hasLost()) {
       // Use setTimeout to delay the alert
       setTimeout(() => {
           alert("Game Over! You have lost the game. Game will restart");
           restartGame();
           alert("Click any arrow key to restart");
           // You may want to reset the game or perform other actions when the user loses.
       }, 100); // Adjust the delay time (in milliseconds) as needed

   }
}

document.addEventListener("keydown", handleSlide);

// Removes empty tiles
function filterZero(row) {
	return row.filter(num => num != 0);
}

// Core function for sliding and merging tiles (adjacent tile) in a row
function slide(row) {
	row = filterZero(row); //Get rid of zero tiles

	//Checks for adjacent equal numbers
	for(let i = 0; i < row.length - 1; i++) {
		if(row[i] == row[i+1]) {
			// Doubles the first element
			row[i] *= 2;
			// and sets the second one to zero
			row[i+1] = 0;

			//Logic for scoring
			score += row[i];
		}
	}
	row = filterZero(row);

	// Add zeroes back
	while(row.length < columns) {
		row.push(0);
	}
	return row;
}

function slideLeft() {
	for(let r = 0; r < rows; r++) {
		let row = board[r];

		// Stores the original row
		let originRow = row.slice();

		// Merges similar tiles
		row = slide(row);

		// Will have the updated value in the board
		board[r] = row;

		// Update the id of the tile as well as appearance
		for(let c = 0; c < columns; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// Line for animation
			if(originRow[c] !== num && num !== 0) {
				tile.style.animation = "slide-from-right 0.1s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 100)
			}

			updateTile(tile, num);
		}
	}
}

function slideRight() {
	for(let r = 0; r < rows; r++) {
		let row = board[r];

		// Stores the original row
		let originRow = row.slice();

		// Reverse the order of the row, mirrored version of slide left
		row.reverse();

		// Merges similar tiles
		row = slide(row);
		row.reverse();
		// Will have the updated value in the board
		board[r] = row;

		// Update the id of the tile as well as appearance
		for(let c = 0; c < columns; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// Line for animation
			if(originRow[c] !== num && num !== 0) {
				tile.style.animation = "slide-from-left 0.1s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 100)
			}
			updateTile(tile, num);
		}
	}
}

function slideUp() {
	for(let c = 0; c < columns; c++) {
		// Creates a temporary array called row that represents a column from top to bottom
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// Stores the original row
		let originRow = row.slice();

		row = slide(row);

		//Check which tiles have changed in column
		let changedIndices = [];
		for(let r = 0; r < rows; r++) {

			//Records the current position of tiles that have changed
			if(originRow[r] !== row[r]) {
				changedIndices.push(r);
			}
		}

		// Update id of the tile
		for(let r = 0; r < rows; r++) {
			board[r][c] = row[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// Line for animation
			if(changedIndices.includes(r) && num !== 0) {
				tile.style.animation = "slide-from-down 0.1s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 100)
			}
			updateTile(tile, num);
		}
	}
}

function slideDown() {
	for(let c = 0; c < columns; c++) {
		// Creates a temporary array called row that represents a column from top to bottom
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// Stores the original row
		let originRow = row.slice();

		// Reverse the order of the row, mirrored version of slide up
		row.reverse();
		
		row = slide(row);
		row.reverse();

		//Check which tiles have changed in column
		let changedIndices = [];
		for(let r = 0; r < rows; r++) {

			//Records the current position of tiles that have changed
			if(originRow[r] !== row[r]) {
				changedIndices.push(r);
			}
		}

		// Update id of the tile
		for(let r = 0; r < rows; r++) {
			board[r][c] = row[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			// Line for animation
			if(changedIndices.includes(r) && num !== 0) {
				tile.style.animation = "slide-from-up 0.1s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 100)
			}

			updateTile(tile, num);
		}
	}
}

//Checks if there is an empty(zero) tiles
function hasEmptyTile() {
	let found = 0;
	for(let r = 0; r < rows && found != 1; r++) {
		//Checks if current tile = 0
		for(c = 0; c < columns && board[r][c] != 0; c++) {}
		found = (c != columns)? 1 : 0;
	}
	return (found == 1)? true : false;
}

//Function that will add new random "2" tile in the game board

function setTwo(){
	if(hasEmptyTile()){
		let found = false;

		while(!found){
			// Math.random() - to generate number between 0 - 1 times to the rows/columns.
			// Math.floor() - rounds down to the nearest integer.
			let r = Math.floor(Math.random() * rows);
			let c = Math.floor(Math.random() * columns);

			// Check if the position (r, c) in the gameboard is empty.
			if(board[r][c] == 0){
				board[r][c] = 2;

				let tile = document.getElementById(r.toString() + "-" + c.toString());
				tile.innerText = "2";
				tile.classList.add("x2");

				// empty tile found and skip the loop.
				found = true;
			}
		}
	}
	
}

function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }
    score = 0;
    setTwo();   // new tile   
}

// Functions for mobile compatibility


// Captures the coordinates of the touch input
document.addEventListener("touchstart", (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

// Prevents scrolling if touch input is received
document.addEventListener("touchmove", (e) => {
	if(!e.target.className.includes("tile")) {
		return;
	}
	e.preventDefault();
}, {passive: false});

// Listens for the "touchend" event on the entire document
document.addEventListener("touchend", (e) => {
	// Checks if element triggered the event has a classname tile
	if(!e.target.className.includes("tile")) {
		return;
	}

	// Calculate the horizontal and vertical difference between the initial position and final position
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// Checks if horizontal swipe > vertical swipe
	if(Math.abs(diffX) > Math.abs(diffY)) {
		// Horizontal swipe
		(diffX > 0)? slideLeft() : slideRight();
		setTwo();

	} else {
		// Vertical swipe
		(diffY > 0)? slideUp() : slideDown();
		setTwo();
	}
	//Updates score
	document.getElementById("score").innerText = score;

	checkWin();
   // Call hasLost() to check for game over conditions
   if (hasLost()) {
       // Use setTimeout to delay the alert
       setTimeout(() => {
           alert("Game Over! You have lost the game. Game will restart");
           restartGame();
           alert("Swipe in any direction to restart");
           // You may want to reset the game or perform other actions when the user loses.
       }, 100); // Adjust the delay time (in milliseconds) as needed

   }
});

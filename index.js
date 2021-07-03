const cells = document.querySelectorAll(".cell");
const messageArea = document.querySelector(".message");
const numShipsDisplay = document.querySelector(".ships");
const shotsNumDisplay = document.querySelector(".shots");
const highscoreDisplay = document.querySelector(".highscore");
const accuracyDisplay = document.querySelector(".accuracy");
const btnNewGame = document.querySelector(".btn-new-game");

const boardSize = 7;
const shipLength = 3;

let maxScore;

// state variables
let score;
let highscore = 0;
let accuracy;
let numShips;
let isPlaying;
let ships;

function createShip() {
	const shipLocation = [];
	let row, column;
	const direction = Math.trunc(Math.random() * 2); // 0 -> horizontal, 1 -> vertical

	if (direction === 0) {
		// starting row and column
		// for horizontal direction, the starting row can be anything from 0-6
		// the starting column needs to be anything from 0-4, since a ship takes up three cells
		// and if a ship's starting location is column 5 then it will go out of the board
		row = Math.trunc(Math.random() * boardSize);
		column = Math.trunc(Math.random() * (boardSize - shipLength + 1));
	} else {
		// starting row -> anything from 0-4
		// starting column -> anything from 0-6
		row = Math.trunc(Math.random() * (boardSize - shipLength + 1));
		column = Math.trunc(Math.random() * boardSize);
	}

	for (let i = 0; i < shipLength; i++) {
		if (direction === 0) {
			// for horizontal direction, a ship will occupy three consecutive column cells
			shipLocation.push(`${row}${column + i}`);
		} else {
			// for vertical direction, a ship will occupy three consecutive row cells
			shipLocation.push(`${row + i}${column}`);
		}
	}

	return shipLocation;
}

function isValidLocation(shipLocation) {
	let allShipCells = [];

	for (const ship of ships) {
		allShipCells = allShipCells.concat(...ship.location);
	}

	/* for a location to be ideal, it cannot conflict with an existing location,
	it cannot be vertically or horizontally adjacent to any other ship location
	the difference between two locations needs to be greater than 1 and cannot be 10
	We have to do this check for every existing ship cell against the new set of locations
	*/

	const isIdealLocation = allShipCells.every((cell) => {
		const firstDiff = Math.abs(cell - shipLocation[0]);
		const secondDiff = Math.abs(cell - shipLocation[1]);
		const thirdDiff = Math.abs(cell - shipLocation[2]);
		return (
			firstDiff > 1 && firstDiff !== 10 && secondDiff > 1 && secondDiff !== 10 && thirdDiff > 1 && thirdDiff !== 10
		);
	});

	// return true only if location does not conflict AND the location is ideal (no adjacent cells)
	return isIdealLocation;
}

function createShips() {
	let shipLocation;
	// set a valid location for each ship
	ships.forEach((ship) => {
		// keep generating a ship location until it's valid
		do {
			shipLocation = createShip();
		} while (!isValidLocation(shipLocation));

		// add the valid ship location to the appropriate ship object
		ship.location = shipLocation;
	});
}

function displayHit(cell) {
	cell.classList.add("hit");
	cell.textContent = "HIT!";
}

function displayMiss(cell) {
	cell.classList.add("miss");
	cell.textContent = "MISS!";
}

function clearCells() {
	cells.forEach((cell) => {
		cell.textContent = "";
		cell.classList.remove("hit");
		cell.classList.remove("miss");
	});
}

function displayMessage(message) {
	messageArea.textContent = message;
}

function initialize() {
	score = 15;
	maxScore = score;
	accuracy = 100;
	numShips = 3;
	isPlaying = true;
	ships = [
		{ location: [0, 0, 0], hits: [] },
		{ location: [0, 0, 0], hits: [] },
		{ location: [0, 0, 0], hits: [] },
	];

	createShips();
	clearCells();

	messageArea.textContent = "";
	numShipsDisplay.textContent = numShips;
	shotsNumDisplay.textContent = score;
	highscoreDisplay.textContent = highscore;
	accuracyDisplay.textContent = `${accuracy}%`;
}

function endGame() {
	isPlaying = false;
	if (score === 0) displayMessage("Game over! You are out of ammo!");
	if (numShips === 0) displayMessage("You sank all the ships!");
	highscore = score > highscore ? score : highscore;
	highscoreDisplay.textContent = highscore;
}

function checkHitOrMiss(cell) {
	let isHit = false;
	for (const [i, ship] of ships.entries()) {
		// register a hit if the clicked cell id matches any of the cell locations of the ship
		if (ship.location.includes(cell.id)) {
			isHit = true;
			ship.hits.push("hit");
			displayHit(cell);
			if (ship.hits.length === shipLength) {
				ships.splice(i, 1); // remove the current ship if all occupied cells of the ship have been hit
				displayMessage("You sank a ship!");
				numShips -= 1;
				numShipsDisplay.textContent = numShips;
				// end game if all ships are destroyed
				numShips === 0 && endGame();
			}
		}
	}

	// if not a hit, then deduct score and display miss
	if (!isHit) {
		score -= 1;
		accuracy = Math.round((score / maxScore) * 100);
		shotsNumDisplay.textContent = score;
		accuracyDisplay.textContent = `${accuracy}%`;
		displayMiss(cell);
	}
}

function updateState(event) {
	if (score === 0) return endGame();
	if (isPlaying && score > 0) {
		displayMessage("");
		const clickedCell = event.target;
		if (clickedCell.textContent === "") {
			checkHitOrMiss(clickedCell);
		}
	}
}

initialize();

for (const cell of cells) {
	cell.addEventListener("click", updateState);
}

btnNewGame.addEventListener("click", initialize);

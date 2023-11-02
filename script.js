let boardElement, movesElement, shuffleButton, resetButton;
let board, moves, isShuffled;

const initialize = () => {
	boardElement = document.querySelector("board");
	movesElement = document.querySelector("moves");
	shuffleButton = document.querySelector(".shuffle");
	resetButton = document.querySelector(".reset");

	board = new Array(4).fill().map(() => new Array(4));
	moves = 0;
	movesElement.innerHTML = moves;

	updateBoard(true);
	isShuffled = false;
	toggleButtons();
};

const updateBoard = (reset = false) => {
	boardElement.innerHTML = "";
	if (reset) {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const pos = i * 4 + j;
				board[i][j] = pos === 15 ? null : pos + 1;
			}
		}
	}

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			boardElement.innerHTML += `<tile ${!board[i][j] ? `id="empty"` : ""}>${board[i][j] ? board[i][j] : ""}</tile>`;
		}
	}

	const tiles = document.querySelectorAll("tile");
	for (let i = 0; i < tiles.length; i++) {
		const x = parseInt(i / 4);
		const y = i % 4;
		tiles[i].addEventListener("click", () => handleMove(x, y));
	}
};

const isValid = (x, y) => x >= 0 && x < 4 && y >= 0 && y < 4;

const handleMove = (x, y, shuffle = false) => {
	if (!shuffle && !isShuffled) return alert("Shuffle the board!");
	if (board[x][y] === null) {
		const emptyTile = document.querySelector("#empty");
		emptyTile.classList.add("shake");
		setTimeout(() => emptyTile.classList.remove("shake"), 1000);
		return;
	}

	for (let i = 0; i < 4; i++) {
		const newX = x + [0, 0, -1, 1][i]; //UDLR
		const newY = y + [-1, 1, 0, 0][i];

		if (isValid(newX, newY) && board[newX][newY] === null) {
			board[newX][newY] = board[x][y];
			board[x][y] = null;

			if (!shuffle) addMoves();
			updateBoard();
			break;
		}
	}

	if (!shuffle && checkWin()) {
		boardElement.innerHTML = "YOU WIN!"
			.split("")
			.map((letter) => `<tile class="shake">${letter}</tile>`)
			.join("\n");
	}
};

const shuffleBoard = (moves = 1000) => {
	for (let i = 0; i < moves; i++) {
		const x = Math.floor(Math.random() * 4);
		const y = Math.floor(Math.random() * 4);

		handleMove(x, y, true);
	}
	updateBoard();
	isShuffled = true;
	toggleButtons();
};

const addMoves = () => {
	moves++;
	movesElement.innerHTML = moves;
};

const checkWin = () => {
	const tiles = document.querySelectorAll("tile");
	for (let i = 0; i < tiles.length - 1; i++) {
		if (parseInt(tiles[i].innerHTML) !== i + 1) return false;
	}
	return true;
};

const toggleButtons = () => {
	shuffleButton.style.display = isShuffled ? "none" : "";
	resetButton.style.display = isShuffled ? "" : "none";
};

const instructions = () => {
	alert("Objective: Try to rearrange the board such that the numbers are in order from 1-15 in as few moves as possible.\n\nClick on the numbers adjacent to the empty tile to move it to that empty space.");
};

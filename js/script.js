// Importing Grid and Tile classes from external modules
import Grid from "./Grid.js"
import Tile from "./Tile.js"

// Getting the game board element by its ID
const gameBoard = document.getElementById("game-board")

// Creating a new Grid instance and adding initial tiles
const grid = new Grid(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

// Setting up keyboard input event listener
setupInput()

// Function to set up keyboard input
function setupInput() {
    // Adding a one-time event listener for the 'keydown' event
    window.addEventListener("keydown", handleInput, { once: true })
}

// Event listener to prevent the default behavior of arrow keys
document.addEventListener('keydown', function (e) {
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
    }
});

// Asynchronous function to handle keyboard input
async function handleInput(e) {
    e.preventDefault();
    // Handling arrow key inputs
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput()
                return
            }
            e.preventDefault();
            await moveUp()
            break
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            e.preventDefault();
            await moveDown()
            break
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput()
                return
            }
            await moveRight()
            break
        default:
            setupInput()
            return
    }

    // Merging tiles and adding a new tile
    grid.cells.forEach(cell => cell.mergeTiles())
    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    // Checking for game over condition
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("You lose")
        })
        return
    }

    setupInput()
}

// Functions to move tiles in different directions
function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

// Function to slide tiles within a group of cells
function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]
                if (cell.tile == null) continue
                let lastValidCell
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }

                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile
                    } else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null
                }
            }
            return promises
        })
    )
}

// Functions to check if tiles can move in different directions
function canMoveUp() {
    return canMove(grid.cellsByColumn)
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
    return canMove(grid.cellsByRow)
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

// Function to check if tiles can move within a group of cells
function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}

// Event listener to reload the page when the "New Game" button is clicked
document.addEventListener('DOMContentLoaded', function () {
    const newGameButton = document.getElementById('newGameButton');

    if (newGameButton) {
        newGameButton.addEventListener('click', function () {
            location.reload();
        });
    }
});

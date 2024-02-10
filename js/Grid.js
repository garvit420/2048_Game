// Constants for grid size, cell size, and cell gap
const GRID_SIZE = 4
const CELL_SIZE = 12
const CELL_GAP = 2

// Class representing the game grid
export default class Grid {
  #cells // Private field for the grid cells

  // Constructor for creating a new Grid instance
  constructor(gridElement) {
    // Setting CSS variables for grid size, cell size, and cell gap
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
    
    // Creating cell elements and initializing the grid cells
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      )
    })
  }

  // Getter for the grid cells
  get cells() {
    return this.#cells
  }

  // Getter for grid cells organized by rows
  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || []
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    }, [])
  }

  // Getter for grid cells organized by columns
  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []
      cellGrid[cell.x][cell.y] = cell
      return cellGrid
    }, [])
  }

  // Getter for empty cells in the grid
  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile == null)
  }

  // Method to get a random empty cell
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
    return this.#emptyCells[randomIndex]
  }
}

// Class representing a cell in the game grid
class Cell {
  #cellElement
  #x
  #y
  #tile
  #mergeTile

  // Constructor for creating a new Cell instance
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  // Getter for the x-coordinate of the cell
  get x() {
    return this.#x
  }

  // Getter for the y-coordinate of the cell
  get y() {
    return this.#y
  }

  // Getter for the tile in the cell
  get tile() {
    return this.#tile
  }

  // Setter for the tile in the cell
  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  // Getter for the tile to be merged in the cell
  get mergeTile() {
    return this.#mergeTile
  }

  // Setter for the tile to be merged in the cell
  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  // Method to check if the cell can accept a tile
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    )
  }

  // Method to merge tiles in the cell
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

// Helper function to create cell elements and append them to the grid
function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.append(cell)
  }
  return cells
}

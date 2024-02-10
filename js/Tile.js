// Class representing a tile in the 2048 game
export default class Tile {
  #tileElement // Private field for the tile's HTML element
  #x // Private field for the x-coordinate of the tile
  #y // Private field for the y-coordinate of the tile
  #value // Private field for the value of the tile

  // Constructor for creating a new Tile instance
  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
      // Creating a new div element for the tile
      this.#tileElement = document.createElement("div")
      // Adding the "tile" class to the tile's HTML element
      this.#tileElement.classList.add("tile")
      // Appending the tile's HTML element to the specified container
      tileContainer.append(this.#tileElement)
      // Setting the initial value of the tile
      this.value = value
  }

  // Getter for the value of the tile
  get value() {
      return this.#value
  }

  // Setter for the value of the tile
  set value(v) {
      // Setting the value of the tile
      this.#value = v
      // Setting the text content of the tile's HTML element
      this.#tileElement.textContent = v
      // Calculating background lightness based on the logarithm of the tile's value
      const power = Math.log2(v)
      const backgroundLightness = 100 - power * 9
      // Setting custom CSS properties for background lightness and text lightness
      this.#tileElement.style.setProperty(
          "--background-lightness",
          `${backgroundLightness}%`
      )
      this.#tileElement.style.setProperty(
          "--text-lightness",
          `${backgroundLightness <= 50 ? 90 : 10}%`
      )
  }

  // Setter for the x-coordinate of the tile
  set x(value) {
      this.#x = value
      this.#tileElement.style.setProperty("--x", value)
  }

  // Setter for the y-coordinate of the tile
  set y(value) {
      this.#y = value
      this.#tileElement.style.setProperty("--y", value)
  }

  // Method to remove the tile's HTML element from the DOM
  remove() {
      this.#tileElement.remove()
  }

  // Method to wait for the end of the transition or animation
  waitForTransition(animation = false) {
      return new Promise(resolve => {
          // Adding an event listener for the end of transition or animation
          this.#tileElement.addEventListener(
              animation ? "animationend" : "transitionend",
              resolve,
              {
                  once: true,
              }
          )
      })
  }
}

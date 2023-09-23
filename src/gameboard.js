import { Ship } from "./ship";

export function GameBoard() {
  const rows = 10;
  const columns = 10;
  const board = Array.from({ length: rows }, () => Array(columns).fill(null));

  const shipsTypes = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };

  const getShip = (row, column) => board[row][column].getName();

  const placeShip = (row, column, shipName, horizontal) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns)
      throw new Error("Row position out of range");

    const shipLength = shipsTypes[shipName];
    if (
      (horizontal && column + shipLength > columns) ||
      (!horizontal && row + shipLength > rows)
    ) {
      throw new Error("Ship does not fit from the given position");
    }

    const newShip = Ship(shipName, shipLength);
    if (horizontal) {
      for (let i = 0; i < shipLength; i++) {
        board[row][i] = newShip;
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        board[i][column] = newShip;
      }
    }
  };

  const receiveAttack = (row, column) => {};

  return {placeShip, getShip};
}

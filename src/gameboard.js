import { Ship } from "./ship";

export function GameBoard() {
  const rows = 10;
  const columns = 10;
  let board = Array.from({ length: rows }, () => Array(columns).fill(null));
  const shipsTypes = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };
  let sunkShips = 0;

  const getBoard = () => board;

  const clearBoard = () =>
    (board = Array.from({ length: rows }, () => Array(columns).fill(null)));

  const getShip = (row, column) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns)
      throw new Error("Row position out of range");
    if (board[row][column] == null) throw new Error("No ship in this position");

    return board[row][column].getName();
  };

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

    if (board[row][column] !== null) throw new Error("Position already taken");

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

  const receiveAttack = (row, column) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns)
      throw new Error("Row position out of range");

    if (board[row][column] == null) {
      board[row][column] = "miss";
    } else if (
      board[row][column] &&
      board[row][column] != "miss" &&
      board[row][column] != "hit"
    ) {
      board[row][column].hit();
      if (board[row][column].isSunk()) sunkShips++;
      board[row][column] = "hit";
    }
  };

  const isGameOver = () => sunkShips === 5;

  return { getBoard, clearBoard, placeShip, getShip, receiveAttack, isGameOver };
}

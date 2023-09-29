import { Ship } from "./ship.js";

export function GameBoard() {
  const rows = 10;
  const columns = 10;

  let board = Array.from({ length: rows }, () => Array(columns).fill(null));

  const shipPos = {
    carrier: null,
    battleship: null,
    cruiser: null,
    submarine: null,
    destroyer: null,
  };
  const shipsTypes = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };

  let sunkShips = 0;
  let shipOnDrag = { name: "", length: 0 };
  let fleetNumber = 0;

  const getBoard = () => board;

  const getShipInitialPosition = (name) => shipPos[name];

  const clearBoard = () =>
    (board = Array.from({ length: rows }, () => Array(columns).fill(null)));

  const getShip = (row, column) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns)
      throw new Error("Row position out of range");

    if (board[row][column] == null) throw new Error("No ship in this position");
    if (board[row][column] == "miss" || board[row][column] == "hit")
      throw new Error("No ship in this position");

    return board[row][column];
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

    for (let i = 0; i < shipLength; i++) {
      if (horizontal) {
        if (board[row][column + i] !== null) {
          throw new Error("Position already taken");
        }
      } else {
        if (board[row + i][column] !== null) {
          throw new Error("Position already taken");
        }
      }
    }

    const newShip = horizontal
      ? Ship(shipName, shipLength, "X")
      : Ship(shipName, shipLength, "Y");

    shipPos[shipName] = [row, column];

    for (let i = 0; i < shipLength; i++) {
      if (horizontal) {
        board[row][column + i] = newShip;
      } else {
        board[row + i][column] = newShip;
      }
    }

    fleetNumber++;
  };

  const receiveAttack = (row, column) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns)
      throw new Error("Row position out of range");

    let data = board[row][column];

    if (data == "miss" || data == "hit")
      throw new Error("Position already attacked");

    if (data == null) {
      board[row][column] = "miss";
      return false;
    } else {
      data.hit();
      if (data.isSunk()) sunkShips++;
      board[row][column] = "hit";
      return data;
    }
  };

  const isGameOver = () => sunkShips === 5;

  const getShipOnDrag = () => shipOnDrag;

  const setShipOnDrag = (shipInfo) => {
    shipOnDrag.name = shipInfo.name;
    shipOnDrag.length = shipInfo.length;
  };

  const getFleetNumber = () => fleetNumber;

  return {
    getBoard,
    clearBoard,
    placeShip,
    getShip,
    receiveAttack,
    isGameOver,
    getShipOnDrag,
    setShipOnDrag,
    getFleetNumber,
    getShipInitialPosition,
  };
}

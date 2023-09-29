import { GameBoard } from "./gameboard.js";

export function Player(name) {
  const shipsQuantity = {
    carrier: 1,
    battleship: 1,
    cruiser: 1,
    submarine: 1,
    destroyer: 1,
  };

  let turns = 0;
  const gameboard = GameBoard();

  const getGameboard = () => gameboard;

  const getTurns = () => turns;

  const getName = () => name;

  const placeShip = (row, column, shipName, horizontal) => {
    if (shipsQuantity[shipName] > 0) {
      gameboard.placeShip(row, column, shipName, horizontal);
      shipsQuantity[shipName]--;
    }
  };

  const attackEnemy = (enemyGameboard, row, column) => {
    try {
      const result = enemyGameboard.receiveAttack(row, column);
      turns++;
      return result;
    } catch (error) {
      throw new Error();
    }
  };

  return { getGameboard, getTurns, getName, placeShip, attackEnemy };
}

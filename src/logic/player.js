import { GameBoard } from "./gameboard.js";

export function Player(name) {
  const gameboard = GameBoard();

  const getGameboard = () => gameboard;

  const getName = () => name;

  const placeShip = (row, column, shipName, horizontal) =>
    gameboard.placeShip(row, column, shipName, horizontal);

  const attackEnemy = (enemyGameboard, row, column) => {
    try {
      return enemyGameboard.receiveAttack(row, column);
    } catch (error) {
      throw new Error();
    }
  };

  return { getGameboard, getName, placeShip, attackEnemy };
}

import { Player } from "./player.js";

function Game() {

  const ships = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
  let game;

  function startGame(userName) {

    const userPlayer = Player(userName);
    const computerPlayer = Player("computer");
    
    const computerTargetQueue = [];

    const getUserPlayer = () => userPlayer;
    
    const getComputerPlayer = () => computerPlayer;

    const autoPlaceComputerPlayer = () => {
      for (let i = 0; i < 5; i++) {
        const ship = ships[i];
        while (true) {
          const row = Math.trunc(Math.random() * 10);
          const column = Math.trunc(Math.random() * 10);
          const horizontal = Math.random() > 0.5;

          try {
            computerPlayer.placeShip(row, column, ship, horizontal);
            break;
          } catch (e) {
            //console.log(e);
            continue;
          }
        }
      }
    };

    const playerAttack = (row, column) => {
      const result = computerPlayer.attackEnemy(
        computerPlayer.getGameboard(),
        row,
        column,
      );

      if (result) return result;
      else return null;
    };

    const autoComputerAttack = () => {
      let result;
      let row;
      let column;

      while (true) {
        if (computerTargetQueue.length > 0) {
          [row, column] = computerTargetQueue[0];
          computerTargetQueue.shift();
        } else {
          row = Math.trunc(Math.random() * 10);
          column = Math.trunc(Math.random() * 10);
        }

        try {
          result = computerPlayer.attackEnemy(
            userPlayer.getGameboard(),
            row,
            column,
          );
          break;
        } catch (error) {
          continue;
        }
      }

      if (result) populateQueue(row, column);

      if (result)
        return {
          ship: result,
          coord: [row, column],
        };
      else return [row, column];
    };

    function populateQueue(row, column) {
      // up, right, down, left
      const drow = [-1, 0, 1, 0];
      const dcol = [0, 1, 0, -1];

      for (let i = 0; i < 4; i++) {
        const newRow = row + drow[i];
        const newColumn = column + dcol[i];
        if (newRow <= 9 && newRow >= 0 && newColumn <= 9 && newColumn >= 0) {
          computerTargetQueue.push([newRow, newColumn]);
        }
      }
    }

    game = {
      getUserPlayer,
      getComputerPlayer,
      playerAttack,
      autoPlaceComputerPlayer,
      autoComputerAttack,
    };
  }

  function getGame() {
    if (!game) throw new Error("First initialize the game");
    return game;
  }

  return { startGame, getGame };
}

export default Game();

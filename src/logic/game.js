import { Player } from "./player.js";

function Game() {
  const ships = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];

  let game;

  function startGame(userName) {
    const userPlayer = Player(userName);
    const computerPlayer = Player("computer");

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

    game = {
      getUserPlayer,
      getComputerPlayer,
      autoPlaceComputerPlayer,
    };
  }

  function getGame() {
    if (!game) throw new Error("First initialize the game");
    return game;
  }

  return { startGame, getGame };
}

export default Game();

/*
// place ships for user
for (let i = 0; i < 5; i++) {
  const ship = ships[i];
  while (true) {
    const row = Math.trunc(Math.random() * 10);
    const column = Math.trunc(Math.random() * 10);
    const horizontal = Math.random() > 0.5;

    // console.log(ship, row, column, horizontal);

    try {
      userPlayer.placeShip(row, column, ship, horizontal);
      break;
    } catch (e) {
      //console.log(e);
      continue;
    }
  }
}

// place ships for computer
for (let i = 0; i < 5; i++) {
  const ship = ships[i];
  while (true) {
    const row = Math.trunc(Math.random() * 10);
    const column = Math.trunc(Math.random() * 10);
    const horizontal = Math.random() > 0.5;

    // console.log(ship, row, column, horizontal);

    try {
      computerPlayer.placeShip(row, column, ship, horizontal);
      break;
    } catch (e) {
      //console.log(e);
      continue;
    }
  }
}

console.log("start game");
let userTurn = true;
let result;

while (true) {
  if (userTurn) {
    const enemyBoard = computerPlayer.getGameboard().getBoard();

    let printable = [...enemyBoard];
    printable = printable.map((row) =>
      row.map((item) => {
        if (item != null && typeof item != "string") {
          return item.getName();
        } else {
          return item;
        }
      }),
    );

    console.log(printable);

    const row = +prompt(`${userTurn} Enter row: `);
    const column = +prompt(`${userTurn} Enter column: `);

    result = userPlayer.attackEnemy(computerPlayer.getGameboard(), row, column);
  } else {
    while (true) {
      const row = Math.trunc(Math.random() * 10);
      const column = Math.trunc(Math.random() * 10);

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
  }

  if (userTurn) {
    if (result != null) console.log("Yout hit a ship: " + result.getName());
  } else {
    if (result != null) console.log("Computer hit a ship: " + result.getName());
  }

  const gameOver = userTurn
    ? computerPlayer.getGameboard().isGameOver()
    : userPlayer.getGameboard().isGameOver();

  if (gameOver) {
    const text = userPlayer ? "You won!" : "Computer won!";
    console.log(text);
    break;
  }

  userTurn = !userTurn;
}
*/

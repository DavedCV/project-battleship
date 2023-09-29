import fleet from "./fleet";
import helper from "./helper";
import Component from "./reusableComponents";
import Game from "../logic/game";
import Message from "../utils/message";

function Battle() {
  function loadBattleContent() {
    helper.deleteAppContent();

    const app = document.getElementById("app");
    app.classList.replace("setup", "battle");

    app.appendChild(createBattleWrapper());
    displayPlayerShips();
    Game.getGame().autoPlaceComputerPlayer();

    displayBattleStartMessage("captain");
    displayBattleStartMessage("enemy");

    initBoardFields();

    styleOnTurn(document.querySelector(".message.battle.captain"));
  }

  function createBattleWrapper() {
    const wrapper = helper.create("div", {
      className: "battle-wrapper",
    });

    helper.appendAll(wrapper, [
      createPlayerMap(),
      createComputerMap(),
      Component.createMessageSection(["battle", "captain"]),
      Component.createMessageSection(["battle", "enemy"]),
    ]);

    return wrapper;
  }

  function createPlayerMap() {
    const map = helper.createMap("player");

    map.appendChild(createMapTitle("PLAYER WATERS!"));

    return map;
  }

  function createComputerMap() {
    const map = helper.createMap("computer");

    map.appendChild(createMapTitle("ENEMY WATERS!"));

    return map;
  }

  function createMapTitle(text) {
    const container = helper.create("div", {
      className: "map-title-container",
    });

    const mapTitle = helper.create("h3", {
      className: "map-title",
      textContent: text,
    });

    container.appendChild(mapTitle);

    return container;
  }

  function displayPlayerShips() {
    const userBoard = document.getElementById("field-container-player");
    fleet.loadFleet(userBoard);
  }

  function displayBattleStartMessage(character) {
    const message = document.getElementById(`message-${character}`);
    if (character === "captain") {
      Component.addTypeWritterMessage(message, Message.getBattleStartMessage());
    } else {
      Component.addTypeWritterMessage(
        message,
        Message.getEnemyBattleStartMessage(),
      );
    }
  }

  function initBoardFields() {
    const computerBoard = document.getElementById("field-container-computer");

    [...computerBoard.children].forEach((field) => {
      field.addEventListener("click", handleFieldClick);
    });

    addFieldHoverWhenOnTurn();
  }

  function unInitBoardFields() {
    const computerBoard = document.getElementById("field-container-computer");

    [...computerBoard.children].forEach((field) => {
      field.removeEventListener("click", handleFieldClick);
    });

    removeFieldHoverWhenOffTurn();
  }

  function addFieldHoverWhenOnTurn() {
    const container = document.getElementById("field-container-computer");
    container.classList.remove("disabled");
  }

  function removeFieldHoverWhenOffTurn() {
    const container = document.getElementById("field-container-computer");
    container.classList.add("disabled");
  }

  async function handleFieldClick(event) {
    const { target } = event;
    target.classList.add("disabled");

    const playerResult = await playerTurn(target);
    if (playerResult === "win") return;

    const computerResult = await computerTurn();
    if (computerResult === "win") return;
  }

  async function playerTurn(targetNode) {
    const nodeIndex = [...targetNode.parentNode.children].indexOf(targetNode);
    const [row, column] = helper.getCoordinatesFromIndex(nodeIndex);

    let targetOnComputerBoard = Game.getGame().playerAttack(row, column);

    unInitBoardFields();
    await shotOnTurnPlay("player");

    let res;
    if (targetOnComputerBoard === null) {
      res = await playerMiss(targetNode);
    } else {
      res = await playerHit(targetNode, targetOnComputerBoard);
      if (res === "win") return res;
    }

    await turnEnd("player");
    return res;
  }

  async function computerTurn() {
    const target = Game.getGame().autoComputerAttack();

    let targetOnUserBoard, row, column;
    if (!Array.isArray(target)) {
      targetOnUserBoard = target.ship;
      row = target.coord[0];
      column = target.coord[1];
    } else {
      row = target[0];
      column = target[1];
    }

    displayPlayerNoCommentMessage();
    await timeoutOneSecond();

    await shotOnTurnPlay("computer");

    let res;
    if (Array.isArray(target)) {
      res = await computerMiss(row, column);
    } else {
      res = await computerHit(row, column, targetOnUserBoard);
    }

    await turnEnd("computer");
    return res;
  }

  async function computerMiss(row, column) {
    const playerBoard = document.getElementById("field-container-player");
    const index = helper.getIndexFromCoordinates(row, column);

    addMissStyle([...playerBoard.children][index]);
    await timeoutMissileLength();
    //Sound.miss()

    displayComputerMessage(null);
    await timeoutOneSecond();

    return "miss";
  }

  async function playerMiss(fieldNode) {
    addMissStyle(fieldNode);
    await timeoutMissileLength();
    //Sound.miss();
    displayPlayerMessage(null);
    await timeoutOneSecond();

    return "miss";
  }

  async function computerHit(row, column, ship) {
    const playerBoard = document.getElementById("field-container-player");
    const index = helper.getIndexFromCoordinates(row, column);

    addHitStyle([...playerBoard.children][index]);
    await timeoutMissileLength();
    //Sound.hit();
    displayComputerMessage(ship);
    await timeoutOneSecond();

    if (Game.getGame().getUserPlayer().getGameboard().isGameOver())
      return showEnemyWinModal();

    return "hit";
  }

  async function playerHit(fieldNode, ship) {
    addHitStyle(fieldNode);
    loadShipIfSunk(ship);
    await timeoutMissileLength();
    //Sound.hit();
    displayPlayerMessage(ship);
    await timeoutOneSecond();

    if (Game.getGame().getComputerPlayer().getGameboard().isGameOver())
      return showPlayerWinModal();

    return "hit";
  }

  function addHitStyle(fieldNode) {
    fieldNode.classList.add("hit");
  }

  function addMissStyle(fieldNode) {
    fieldNode.classList.add("miss");
  }

  function timeoutMissileLength() {
    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  function displayPlayerMessage(target) {
    const captain = document.getElementById("message-captain");
    const enemy = document.getElementById("message-enemy");

    if (target !== null) {
      if (!target.isSunk()) {
        displayMessage(
          captain,
          Message.getNewEnemyHitMessage(captain.textContent),
        );
      } else {
        displayMessage(
          captain,
          Message.getNewEnemySunkMessage(captain.textContent),
        );
      }
    } else {
      displayMessage(
        captain,
        Message.getNewPlayerMissMessage(captain.textContent),
      );
    }

    if (enemy.textContent !== "...")
      displayMessage(enemy, Message.getNoCommentMessage());
  }

  function displayComputerMessage(target) {
    const enemy = document.getElementById("message-enemy");

    if (target !== null) {
      if (!target.isSunk()) {
        displayMessage(
          enemy,
          Message.getNewPlayerHitMessage(enemy.textContent),
        );
      } else {
        displayMessage(
          enemy,
          Message.getNewPlayerSunkMessage(enemy.textContent),
        );
      }
    } else {
      displayMessage(enemy, Message.getNewPlayerMissMessage(enemy.textContent));
    }
  }

  function displayMessage(node, message) {
    clearTypeWritter(node);
    Component.addTypeWritterMessage(node, [message]);
  }

  function clearTypeWritter(node) {
    if (node.nextElementSibling) {
      node.textContent = "";
      node.nextElementSibling.remove();
    }
  }

  function timeoutOneSecond() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  function showPlayerWinModal() {
    const app = document.getElementById("app");

    helper.appendAll(app, [
      createWinnerModal({
        title: "YOU WIN!",
        id: "captain-win",
        className: "player",
      }),
      createWinOverlay(),
    ]);

    displayWinMessage("captain-win");
    initNewGameButton();
    unInitBoardFields();

    return "win";
  }

  function showEnemyWinModal() {
    const app = document.getElementById("app");

    helper.appendAll(app, [
      createWinnerModal({
        title: "YOU LOSE!",
        id: "enemy-win",
        className: "enemy",
      }),
      createWinOverlay(),
    ]);

    displayWinMessage("enemy-win");
    initNewGameButton();

    return "win";
  }

  async function shotOnTurnPlay(character) {
    if (character === "player") {
      //Sound.shot();
      await timeOutHalfSecond();
    } else {
      //Sound.shot();
      await timeOutHalfSecond();
    }
  }

  function timeOutHalfSecond() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  function displayPlayerNoCommentMessage() {
    const captain = document.getElementById("message-captain");
    displayMessage(captain, Message.getNoCommentMessage());
  }

  async function turnEnd(character) {
    await timeoutOneAndHalfSecond();

    if (character === "player") {
      styleOffTurn(document.querySelector(".message.battle.captain"));
      styleOnTurn(document.querySelector(".message.battle.enemy"));
      resizePlayerOffTurn();
    } else {
      styleOffTurn(document.querySelector(".message.battle.enemy"));
      styleOnTurn(document.querySelector(".message.battle.captain"));
      resizePlayerOnTurn();
      initBoardFields();
    }
  }

  function styleOffTurn(element) {
    element.classList.remove("on-turn");
    element.classList.add("off-turn");
  }

  function styleOnTurn(element) {
    element.classList.remove("off-turn");
    element.classList.add("on-turn");
  }

  function timeoutOneAndHalfSecond() {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }

  function resizePlayerOnTurn() {
    styleOffTurn(document.getElementById("board-computer"));
    styleOnTurn(document.getElementById("board-player"));
  }

  function resizePlayerOffTurn() {
    styleOffTurn(document.getElementById("board-player"));
    styleOnTurn(document.getElementById("board-computer"));
  }

  function loadShipIfSunk(ship) {
    console.log(ship.getLength());

    if (ship.isSunk()) {
      const [rowOrigin, columnOrigin] = Game.getGame()
        .getComputerPlayer()
        .getGameboard()
        .getShipInitialPosition(ship.getName());
      const fieldContainer = document.getElementById("field-container-computer");

      fleet.loadShipOnBoard({
        fieldContainer,
        ship,
        row: rowOrigin,
        column: columnOrigin,
      });
    }
  }

  return { loadBattleContent };
}

export default Battle();

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
    const computerMap = document.querySelector("board-computer");
    const computerBoard = computerMap.getElementById(
      "field-container-computer",
    );

    [...computerBoard].forEach((field) => {
      field.addEventListener("click", handleFieldClick);
    });

    addFieldHoverWhenOnTurn();
  }

  function unInitBoardFields() {
    const computerMap = document.querySelector("board-computer");
    const computerBoard = computerMap.getElementById(
      "field-container-computer",
    );

    [...computerBoard].forEach((field) => {
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

  function handleFieldClick(event) {
    const { target } = event;
    target.classList.add("disabled");

    playerTurn(target);
  }

  return { loadBattleContent };
}

export default Battle();

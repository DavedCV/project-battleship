import helper from "./helper";

import Game from "../logic/game";

import Component from "./reusableComponents";
import Message from "../utils/message";
import DragDrop from "./dragDrop";
import Battle from "./battle";

function setup() {
  function loadSetupContent() {
    const app = document.getElementById("app");
    app.classList.replace("pregame", "setup");

    app.appendChild(createSetupWrapper());

    displayWelcomeMessage();
    initButtons();
  }

  function createSetupWrapper() {
    const wrapper = helper.create("div", { className: "setup-wrapper" });

    helper.appendAll(wrapper, [
      Component.createMessageSection(["setup", "captain"]),
      createMapFleetSection(),
      createResetContinueSection(),
    ]);

    return wrapper;
  }

  function createMapFleetSection() {
    const section = helper.create("section", {
      id: "setup-container",
      className: "setup-container",
    });

    section.appendChild(createMapFleet());

    return section;
  }

  function createMapFleet() {
    const container = helper.create("div", {
      className: "board-fleet-container",
    });

    helper.appendAll(container, [
      helper.createMap("setup"),
      createFleetSelectSection(),
    ]);

    container.querySelector("#board-setup").appendChild(createAxisButtons());

    return container;
  }

  function createFleetSelectSection() {
    const section = helper.create("section", {
      id: "fleet-setup",
      className: "fleet-setup",
    });

    const fleet = [
      "carrier",
      "battleship",
      "cruiser",
      "submarine",
      "destroyer",
    ];

    fleet.forEach((ship) => {
      const shipCard = Component.createShipCard(ship);
      section.appendChild(shipCard);
    });

    return section;
  }

  function createAxisButtons() {
    const container = helper.create("div", {
      id: "axis-button-container",
      className: "axis-button-container",
    });

    const buttonX = helper.create("button", {
      id: "x-button",
      className: "axis-button",
      textContent: "X axis",
    });

    const buttonY = helper.create("button", {
      id: "y-button",
      className: "axis-button",
      textContent: "Y axis",
    });

    buttonX.classList.add("selected");

    helper.appendAll(container, [buttonX, buttonY]);

    return container;
  }

  function createResetContinueSection() {
    const container = helper.create("section", {
      id: "reset-continue-section",
      className: "reset-continue-section",
    });

    const resetButton = helper.create("button", {
      id: "reset-button",
      className: "reset-button",
      textContent: "Reset",
    });

    const continueButton = helper.create("button", {
      id: "continue-button",
      className: "continue-button",
      textContent: "Continue",
    });

    helper.appendAll(container, [resetButton, continueButton]);

    return container;
  }

  function displayWelcomeMessage() {
    const message = document.getElementById("message-captain");
    Component.addTypeWritterMessage(message, Message.getWelcomeMessage());
  }

  function initButtons() {
    initAxisButtons();
    initResetContinueButtons();

    setTabIndexCards();
    disableContinueButton();
  }

  function initAxisButtons() {
    const buttonX = document.getElementById("x-button");
    const buttonY = document.getElementById("y-button");

    buttonX.addEventListener("click", () => handleButton(buttonX, buttonY));
    buttonY.addEventListener("click", () => handleButton(buttonY, buttonX));
  }

  function handleButton(button, oppositeButton) {
    button.classList.add("selected");
    oppositeButton.classList.remove("selected");
  }

  function setTabIndexCards() {
    const shipCards = document.querySelectorAll(".ship-card");
    shipCards.forEach((shipCard) => shipCard.setAttribute("tabindex", 0));
  }

  function disableContinueButton() {
    const button = document.getElementById("continue-button");

    button.classList.add("disabled");
    button.addEventListener("keydown", DragDrop.preventEnterDefault);
  }

  function initResetContinueButtons() {
    const resetButton = document.getElementById("reset-button");
    const continueButton = document.getElementById("continue-button");
    const gameboard = Game.getGame().getUserPlayer().getGameboard();

    resetButton.addEventListener("click", () => handleReset(gameboard));
    continueButton.addEventListener("click", handleContinue);
  }

  function handleReset(gameboard) {
    const fieldContainer = document.getElementById("field-container-setup");

    resetFleetSelect();
    gameboard.clearBoard();
    removePlacedShips(fieldContainer);
    disableContinueButton();
    setTabIndexCards();
  }

  function resetFleetSelect() {
    const fleet = document.getElementById("fleet-setup");

    [...fleet.children].forEach((node) => {
      if (node.classList.contains("hidden")) {
        node.classList.remove("hidden");
      }
    });
  }

  function removePlacedShips(fieldContainer) {
    const ships = fieldContainer.querySelectorAll(".ship-image-container");
    ships.forEach((ship) => ship.remove());
  }

  function handleContinue() {
    if (Game.getGame().getUserPlayer().getGameboard().getFleetNumber() === 5) {
      Battle.loadBattleContent();
    }
  }

  return {
    loadSetupContent,
  };
}

export default setup();

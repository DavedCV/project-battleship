import helper from "./helper";
import Component from "./reusableComponents";

function setup() {
  function loadSetupContent() {
    const app = document.getElementById("app");
    app.classList.replace("pregame", "setup");

    app.appendChild(createSetupWrapper());
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
      textContent: "Confirm",
    });

    helper.appendAll(container, [resetButton, continueButton]);

    return container;
  }

  return {
    loadSetupContent,
  };
}

export default setup();

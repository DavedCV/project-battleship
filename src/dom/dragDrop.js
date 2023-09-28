import Game from "../logic/game";
import fleet from "./fleet";
import helper from "./helper";

function DragDrop() {
  function initDraggableFields() {
    dragStart();
    dragEnter();
    dragOver();
    dragLeave();
    dragDrop();
    mobileDrag();
    mobileDrop();
  }

  let fieldQueue = [];

  function emptyFieldQueue() {
    fieldQueue = [];
  }

  /* listeners ---------------------------------------------------------------*/
  function dragStart() {
    const fleetContainer = document.getElementById("fleet-setup");

    [...fleetContainer.children].forEach((node) => {
      node.addEventListener("dragstart", (event) => {
        dragStartHandler(event, node);
      });
    });
  }

  function dragEnter() {
    const fieldContainer = document.getElementById("field-container-setup");

    [...fieldContainer.children].forEach((node) => {
      node.addEventListener("dragenter", dragEnterHandler);
    });
  }

  function dragOver() {
    const fieldContainer = document.getElementById("field-container-setup");

    [...fieldContainer.children].forEach((node, index) => {
      // prevent default to allow dropping
      node.addEventListener("dragover", (event) => {
        dragOverHandler(event, fieldContainer, index);
      });
    });
  }

  function dragLeave() {
    const fieldContainer = document.getElementById("field-container-setup");

    // REMOVE DRAGOVER/HOVER CLASS
    [...fieldContainer.children].forEach((node) => {
      node.addEventListener("dragleave", dragLeaveHandler);
    });
  }

  function dragDrop() {
    const fieldContainer = document.getElementById("field-container-setup");

    [...fieldContainer.children].forEach((node, index) => {
      node.addEventListener("drop", () => {
        dragDropHandler(fieldContainer, index);
      });
    });
  }

  function mobileDrag() {
    const fleetContainer = document.getElementById("fleet-setup");
    const fieldContainer = document.getElementById("field-container-setup");

    [...fleetContainer.children].forEach((node) => {
      node.addEventListener("touchstart", (event) => {
        touchStartHandler(event, node);
      });
    });

    [...fleetContainer.children].forEach((node) => {
      node.addEventListener("touchmove", (event) => {
        touchMoveHandler(event, node, fieldContainer);
      });
    });
  }

  function mobileDrop() {
    const fleetContainer = document.getElementById("fleet-setup");
    const fieldContainer = document.getElementById("field-container-setup");

    [...fleetContainer.children].forEach((node) => {
      node.addEventListener("touchend", (event) => {
        touchEndHandler(event, node, fieldContainer);
      });
    });
  }

  /* handlers ----------------------------------------------------------------*/

  function dragStartHandler(event, node) {
    addShipOnDragStart(node);
    event.stopPropagation();
  }

  function dragEnterHandler(event) {
    event.preventDefault();
  }

  function dragOverHandler(event, fieldContainer, index) {
    event.preventDefault();
    styleFieldsForDrop(fieldContainer, index);
  }

  function dragLeaveHandler() {
    resetFieldStyling();
  }

  function dragDropHandler(fieldContainer, index) {
    const [x, y] = helper.getCoordinatesFromIndex(index);
    const [isPlaced, shipOnDrag] = dropIfValid(x, y);

    fleet.loadFleet(fieldContainer);
    hideIfPlaced(isPlaced, shipOnDrag);
    resetFieldStyling();
    removePlacedShipsTabIndex();
  }

  function touchStartHandler(event, node) {
    addShipOnDragStart(node);
    //console.log(event);
  }

  function touchMoveHandler(event, node, fieldContainer) {
    const touchX = event.targetTouches[0].clientX;
    const touchY = event.targetTouches[0].clientY;

    // this is because moving in the fleet-setup, the draggin start lagging
    document.getElementById("app").appendChild(node);
    positionNodeOnScreen(node, touchX, touchY);

    resetFieldStyling();
    const hoveredElement = document.elementFromPoint(touchX, touchY);

    if (hoveredElement == null) return;
    if (hoveredElement.classList.contains("field")) {
      const indexHoveredElement = [...fieldContainer.children].indexOf(
        hoveredElement,
      );
      styleFieldsForDrop(fieldContainer, indexHoveredElement);
    }
  }

  function touchEndHandler(event, node, fieldContainer) {
    const touchX = event.changedTouches[0].clientX;
    const touchY = event.changedTouches[0].clientY;
    const hoveredElement = document.elementFromPoint(touchX, touchY);

    if (hoveredElement == null) {
      document.getElementById("fleet-setup").appendChild(node);
    } else if (hoveredElement.classList.contains("field")) {
      const index = [...fieldContainer.children].indexOf(hoveredElement);
      const [x, y] = helper.getCoordinatesFromIndex(index);
      const [isPlaced, shipOnDrag] = dropIfValid(x, y);

      fleet.loadFleet(fieldContainer);
      resetFieldStyling();

      // return the card to the fleet-setup section
      document.getElementById("fleet-setup").appendChild(node);
      hideIfPlaced(isPlaced, shipOnDrag);
    } else {
      document.getElementById("fleet-setup").appendChild(node);
    }

    repositionIntoFleetSetup(node);
  }

  /* handler helpers ---------------------------------------------------------*/
  function addShipOnDragStart(node) {
    Game.getGame().getUserPlayer().getGameboard().setShipOnDrag({
      name: node.dataset.shipName,
      length: node.dataset.shipLength,
    });
  }

  function styleFieldsForDrop(fieldContainer, index) {
    const gameboard = Game.getGame().getUserPlayer().getGameboard();
    const shipOnDrag = gameboard.getShipOnDrag();
    let { length } = shipOnDrag;
    const axis = document
      .getElementById("x-button")
      .classList.contains("selected")
      ? "X"
      : "Y";

    emptyFieldQueue();

    let isTaken = false;
    if (axis === "X") {
      for (let i = index; i < helper.getNearestTen(index); i++) {
        const [x, y] = helper.getCoordinatesFromIndex(i);

        // RETURN IF WHOLE SHIPS SHADOW ALREADY ON MAP
        if (length === 0) break;
        [...fieldContainer.children][i].classList.add("hovering");
        fieldQueue.push(i);
        length -= 1;

        try {
          gameboard.getShip(x, y);
          isTaken = true;
        } catch (error) {
          continue;
        }
      }
    } else if (axis === "Y") {
      for (let i = index; i < 100; i += 10) {
        const [x, y] = helper.getCoordinatesFromIndex(i);

        // RETURN IF WHOLE SHIPS SHADOW ALREADY ON MAP
        if (length === 0) break;
        [...fieldContainer.children][i].classList.add("hovering");
        fieldQueue.push(i);
        length -= 1;

        try {
          gameboard.getShip(x, y);
          isTaken = true;
        } catch (error) {
          continue;
        }
      }
    }

    if (isTaken || length != 0) {
      fieldQueue.forEach((field) =>
        [...fieldContainer.children][field].classList.add("red"),
      );
    }
  }

  function resetFieldStyling() {
    const fieldContainer = document.getElementById("field-container-setup");
    for (let i = 0; i < fieldQueue.length; i += 1) {
      [...fieldContainer.children][fieldQueue[i]].className = "field";
    }
    emptyFieldQueue();
  }

  function dropIfValid(x, y) {
    const gameboard = Game.getGame().getUserPlayer().getGameboard();
    const shipOnDrag = gameboard.getShipOnDrag();
    const axis = document
      .getElementById("x-button")
      .classList.contains("selected")
      ? "X"
      : "Y";

    try {
      if (axis === "X") {
        gameboard.placeShip(x, y, shipOnDrag.name, true);
      } else {
        gameboard.placeShip(x, y, shipOnDrag.name, false);
      }
    } catch (error) {
      console.log(error);
      return [false, shipOnDrag.name];
    }

    // RETURNS [BOOL, SHIP-NAME]
    return [true, shipOnDrag.name];
  }

  function hideIfPlaced(isPlaced, shipOnDrag) {
    if (!isPlaced) return;

    const battleship = document.querySelector(`[data-ship-name=${shipOnDrag}]`);
    battleship.classList.add("hidden");

    enableContinueButtonIfAllPlaced();
  }

  function enableContinueButtonIfAllPlaced() {
    const ships = document.querySelectorAll(".ship-image-container");
    const button = document.getElementById("continue-button");

    if (ships.length !== 5) return;

    button.classList.remove("disabled");
    button.removeEventListener("keydown", preventEnterDefault);
  }

  function preventEnterDefault(event) {
    if (event.key === "Enter") event.preventDefault();
  }

  function removePlacedShipsTabIndex() {
    const shipCards = document.querySelectorAll(".ship-card.hidden");
    shipCards.forEach((shipCard) => shipCard.setAttribute("tabindex", "-1"));
  }

  function positionNodeOnScreen(node, x, y) {
    node.style.position = "fixed";
    node.style.top = `${y}px`;
    node.style.left = `${x}px`;
    node.style.zIndex = "5";
  }

  function repositionIntoFleetSetup(node) {
    node.style.position = "relative";
    node.style.top = "0";
    node.style.left = "0";
    node.style.zIndex = "0";
  }

  return { initDraggableFields };
}

export default DragDrop();

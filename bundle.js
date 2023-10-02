/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom/battle.js":
/*!***************************!*\
  !*** ./src/dom/battle.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _logic_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../logic/game */ "./src/logic/game.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");
/* harmony import */ var _fleet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fleet */ "./src/dom/fleet.js");
/* harmony import */ var _reusableComponents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reusableComponents */ "./src/dom/reusableComponents.js");
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/message */ "./src/utils/message.js");





function Battle() {
  function loadBattleContent() {
    _helper__WEBPACK_IMPORTED_MODULE_1__["default"].deleteAppContent();
    const app = document.getElementById("app");
    app.classList.replace("setup", "battle");
    app.appendChild(createBattleWrapper());
    displayPlayerShips();
    _logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().autoPlaceComputerPlayer();
    displayBattleStartMessage("captain");
    displayBattleStartMessage("enemy");
    initBoardFields();
    styleOnTurn(document.querySelector(".message.battle.captain"));
  }

  // ---------------------------------------------------------------------------

  function createBattleWrapper() {
    const wrapper = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].create("div", {
      className: "battle-wrapper"
    });
    _helper__WEBPACK_IMPORTED_MODULE_1__["default"].appendAll(wrapper, [createPlayerMap(), createComputerMap(), _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].createMessageSection(["battle", "captain"]), _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].createMessageSection(["battle", "enemy"])]);
    return wrapper;
  }
  function createPlayerMap() {
    const map = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].createMap("player");
    map.appendChild(createMapTitle("PLAYER WATERS!"));
    return map;
  }
  function createComputerMap() {
    const map = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].createMap("computer");
    map.appendChild(createMapTitle("ENEMY WATERS!"));
    return map;
  }
  function createMapTitle(text) {
    const container = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].create("div", {
      className: "map-title-container"
    });
    const mapTitle = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].create("h3", {
      className: "map-title",
      textContent: text
    });
    container.appendChild(mapTitle);
    return container;
  }
  function createWinnerModal(data) {
    const winnerModal = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].create("section", {
      id: "win-modal-container",
      className: "win-modal-container"
    });
    winnerModal.classList.add(data.className);
    const title = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].create("h4", {
      id: `title-${data.id}`,
      className: `title-${data.id}`,
      textContent: data.title
    });
    const message = _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].createMessageSection(["battle", data.id]);
    const button = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].create("button", {
      id: "new-game-button",
      className: "new-game-button",
      textContent: "New Battle!"
    });
    _helper__WEBPACK_IMPORTED_MODULE_1__["default"].appendAll(winnerModal, [title, message, button]);
    return winnerModal;
  }
  function createWinOverlay() {
    return _helper__WEBPACK_IMPORTED_MODULE_1__["default"].create("div", {
      className: "win-overlay"
    });
  }
  function showEnemyWinModal() {
    const app = document.getElementById("app");
    _helper__WEBPACK_IMPORTED_MODULE_1__["default"].appendAll(app, [createWinnerModal({
      title: "YOU LOSE!",
      id: "enemy-win",
      className: "enemy"
    }), createWinOverlay()]);
    displayWinMessage("enemy-win");
    initNewGameButton();
    return "win";
  }
  function showPlayerWinModal() {
    const app = document.getElementById("app");
    _helper__WEBPACK_IMPORTED_MODULE_1__["default"].appendAll(app, [createWinnerModal({
      title: "YOU WIN!",
      id: "captain-win",
      className: "player"
    }), createWinOverlay()]);
    displayWinMessage("captain-win");
    initNewGameButton();
    unInitBoardFields();
    return "win";
  }

  // ---------------------------------------------------------------------------

  function initBoardFields() {
    const computerBoard = document.getElementById("field-container-computer");
    [...computerBoard.children].forEach(field => {
      field.addEventListener("click", handleFieldClick);
    });
    addFieldHoverWhenOnTurn();
  }
  function unInitBoardFields() {
    const computerBoard = document.getElementById("field-container-computer");
    [...computerBoard.children].forEach(field => {
      field.removeEventListener("click", handleFieldClick);
    });
    removeFieldHoverWhenOffTurn();
  }
  function initNewGameButton() {
    const button = document.getElementById("new-game-button");
    button.addEventListener("click", () => window.location.reload());
  }

  // ---------------------------------------------------------------------------

  async function handleFieldClick(event) {
    const {
      target
    } = event;
    target.classList.add("disabled");
    const playerResult = await playerTurn(target);
    if (playerResult === "win") return;
    const computerResult = await computerTurn();
    if (computerResult === "win") return;
  }
  async function playerTurn(targetNode) {
    const nodeIndex = [...targetNode.parentNode.children].indexOf(targetNode);
    const [row, column] = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].getCoordinatesFromIndex(nodeIndex);
    let targetOnComputerBoard = _logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().playerAttack(row, column);
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
  async function playerMiss(fieldNode) {
    addMissStyle(fieldNode);
    await timeoutMissileLength();
    //Sound.miss();
    displayPlayerMessage(null);
    await timeoutOneSecond();
    return "miss";
  }
  async function playerHit(fieldNode, ship) {
    addHitStyle(fieldNode);
    loadShipIfSunk(ship);
    await timeoutMissileLength();
    //Sound.hit();
    displayPlayerMessage(ship);
    await timeoutOneSecond();
    if (_logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getComputerPlayer().getGameboard().isGameOver()) return showPlayerWinModal();
    return "hit";
  }
  async function computerTurn() {
    const target = _logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().autoComputerAttack();
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
    const index = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].getIndexFromCoordinates(row, column);
    addMissStyle([...playerBoard.children][index]);
    await timeoutMissileLength();
    //Sound.miss()

    displayComputerMessage(null);
    await timeoutOneSecond();
    return "miss";
  }
  async function computerHit(row, column, ship) {
    const playerBoard = document.getElementById("field-container-player");
    const index = _helper__WEBPACK_IMPORTED_MODULE_1__["default"].getIndexFromCoordinates(row, column);
    addHitStyle([...playerBoard.children][index]);
    await timeoutMissileLength();
    //Sound.hit();
    displayComputerMessage(ship);
    await timeoutOneSecond();
    if (_logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getUserPlayer().getGameboard().isGameOver()) return showEnemyWinModal();
    return "hit";
  }

  // ---------------------------------------------------------------------------

  async function shotOnTurnPlay(character) {
    if (character === "player") {
      //Sound.shot();
      await timeOutHalfSecond();
    } else {
      //Sound.shot();
      await timeOutHalfSecond();
    }
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

  // ---------------------------------------------------------------------------

  function displayPlayerShips() {
    const userBoard = document.getElementById("field-container-player");
    _fleet__WEBPACK_IMPORTED_MODULE_2__["default"].loadFleet(userBoard);
  }
  function loadShipIfSunk(ship) {
    console.log(ship.getLength());
    if (ship.isSunk()) {
      const [rowOrigin, columnOrigin] = _logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getComputerPlayer().getGameboard().getShipInitialPosition(ship.getName());
      const fieldContainer = document.getElementById("field-container-computer");
      _fleet__WEBPACK_IMPORTED_MODULE_2__["default"].loadShipOnBoard({
        fieldContainer,
        ship,
        row: rowOrigin,
        column: columnOrigin
      });
    }
  }

  // ---------------------------------------------------------------------------

  function displayBattleStartMessage(character) {
    const message = document.getElementById(`message-${character}`);
    if (character === "captain") {
      _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].addTypeWritterMessage(message, [_utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getBattleStartMessage()]);
    } else {
      _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].addTypeWritterMessage(message, [_utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getEnemyBattleStartMessage()]);
    }
  }
  function displayPlayerMessage(target) {
    const captain = document.getElementById("message-captain");
    const enemy = document.getElementById("message-enemy");
    if (target !== null) {
      if (!target.isSunk()) {
        displayMessage(captain, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNewEnemyHitMessage(captain.textContent));
      } else {
        displayMessage(captain, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNewEnemySunkMessage(captain.textContent));
      }
    } else {
      displayMessage(captain, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNewPlayerMissMessage(captain.textContent));
    }
    if (enemy.textContent !== "...") displayMessage(enemy, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNoCommentMessage());
  }
  function displayComputerMessage(target) {
    const enemy = document.getElementById("message-enemy");
    if (target !== null) {
      if (!target.isSunk()) {
        displayMessage(enemy, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNewPlayerHitMessage(enemy.textContent));
      } else {
        displayMessage(enemy, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNewPlayerSunkMessage(enemy.textContent));
      }
    } else {
      displayMessage(enemy, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNewEnemyMissMessage(enemy.textContent));
    }
  }
  function displayMessage(node, message) {
    clearTypeWritter(node);
    _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].addTypeWritterMessage(node, [message]);
  }
  function displayWinMessage(character) {
    const message = document.getElementById(`message-${character}`);
    if (character === "captain-win") {
      _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].addTypeWritterMessage(message, [_utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getPlayerWinMessage()]);
    } else if (character === "enemy-win") {
      _reusableComponents__WEBPACK_IMPORTED_MODULE_3__["default"].addTypeWritterMessage(message, [_utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getEnemyWinMessage()]);
    }
  }
  function displayPlayerNoCommentMessage() {
    const captain = document.getElementById("message-captain");
    displayMessage(captain, _utils_message__WEBPACK_IMPORTED_MODULE_4__["default"].getNoCommentMessage());
  }
  function clearTypeWritter(node) {
    if (node.nextElementSibling) {
      node.textContent = "";
      node.nextElementSibling.remove();
    }
  }

  // ---------------------------------------------------------------------------

  function addFieldHoverWhenOnTurn() {
    const container = document.getElementById("field-container-computer");
    container.classList.remove("disabled");
  }
  function removeFieldHoverWhenOffTurn() {
    const container = document.getElementById("field-container-computer");
    container.classList.add("disabled");
  }
  function addHitStyle(fieldNode) {
    fieldNode.classList.add("hit");
  }
  function addMissStyle(fieldNode) {
    fieldNode.classList.add("miss");
  }
  function styleOffTurn(element) {
    element.classList.remove("on-turn");
    element.classList.add("off-turn");
  }
  function styleOnTurn(element) {
    element.classList.remove("off-turn");
    element.classList.add("on-turn");
  }
  function resizePlayerOnTurn() {
    styleOffTurn(document.getElementById("board-computer"));
    styleOnTurn(document.getElementById("board-player"));
  }
  function resizePlayerOffTurn() {
    styleOffTurn(document.getElementById("board-player"));
    styleOnTurn(document.getElementById("board-computer"));
  }

  // ---------------------------------------------------------------------------

  function timeoutMissileLength() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
  function timeoutOneSecond() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  function timeOutHalfSecond() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  function timeoutOneAndHalfSecond() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
  return {
    loadBattleContent
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Battle());

/***/ }),

/***/ "./src/dom/dragDrop.js":
/*!*****************************!*\
  !*** ./src/dom/dragDrop.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _logic_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../logic/game */ "./src/logic/game.js");
/* harmony import */ var _fleet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fleet */ "./src/dom/fleet.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");



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
    [...fleetContainer.children].forEach(node => {
      node.addEventListener("dragstart", event => {
        dragStartHandler(event, node);
      });
    });
  }
  function dragEnter() {
    const fieldContainer = document.getElementById("field-container-setup");
    [...fieldContainer.children].forEach(node => {
      node.addEventListener("dragenter", dragEnterHandler);
    });
  }
  function dragOver() {
    const fieldContainer = document.getElementById("field-container-setup");
    [...fieldContainer.children].forEach((node, index) => {
      // prevent default to allow dropping
      node.addEventListener("dragover", event => {
        dragOverHandler(event, fieldContainer, index);
      });
    });
  }
  function dragLeave() {
    const fieldContainer = document.getElementById("field-container-setup");

    // REMOVE DRAGOVER/HOVER CLASS
    [...fieldContainer.children].forEach(node => {
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
    [...fleetContainer.children].forEach(node => {
      node.addEventListener("touchstart", event => {
        event.preventDefault();
        touchStartHandler(event, node);
      });
    });
    [...fleetContainer.children].forEach(node => {
      node.addEventListener("touchmove", event => {
        touchMoveHandler(event, node, fieldContainer);
      });
    });
  }
  function mobileDrop() {
    const fleetContainer = document.getElementById("fleet-setup");
    const fieldContainer = document.getElementById("field-container-setup");
    [...fleetContainer.children].forEach(node => {
      node.addEventListener("touchend", event => {
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
    const [x, y] = _helper__WEBPACK_IMPORTED_MODULE_2__["default"].getCoordinatesFromIndex(index);
    const [isPlaced, shipOnDrag] = dropIfValid(x, y);
    _fleet__WEBPACK_IMPORTED_MODULE_1__["default"].loadFleet(fieldContainer);
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
      const indexHoveredElement = [...fieldContainer.children].indexOf(hoveredElement);
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
      const [x, y] = _helper__WEBPACK_IMPORTED_MODULE_2__["default"].getCoordinatesFromIndex(index);
      const [isPlaced, shipOnDrag] = dropIfValid(x, y);
      _fleet__WEBPACK_IMPORTED_MODULE_1__["default"].loadFleet(fieldContainer);
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
    _logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getUserPlayer().getGameboard().setShipOnDrag({
      name: node.dataset.shipName,
      length: node.dataset.shipLength
    });
  }
  function styleFieldsForDrop(fieldContainer, index) {
    const gameboard = _logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getUserPlayer().getGameboard();
    const shipOnDrag = gameboard.getShipOnDrag();
    let {
      length
    } = shipOnDrag;
    const axis = document.getElementById("x-button").classList.contains("selected") ? "X" : "Y";
    emptyFieldQueue();
    let isTaken = false;
    if (axis === "X") {
      for (let i = index; i < _helper__WEBPACK_IMPORTED_MODULE_2__["default"].getNearestTen(index); i++) {
        const [x, y] = _helper__WEBPACK_IMPORTED_MODULE_2__["default"].getCoordinatesFromIndex(i);

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
        const [x, y] = _helper__WEBPACK_IMPORTED_MODULE_2__["default"].getCoordinatesFromIndex(i);

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
      fieldQueue.forEach(field => [...fieldContainer.children][field].classList.add("red"));
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
    const gameboard = _logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getUserPlayer().getGameboard();
    const shipOnDrag = gameboard.getShipOnDrag();
    const axis = document.getElementById("x-button").classList.contains("selected") ? "X" : "Y";
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
    shipCards.forEach(shipCard => shipCard.setAttribute("tabindex", "-1"));
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
  return {
    initDraggableFields
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DragDrop());

/***/ }),

/***/ "./src/dom/fleet.js":
/*!**************************!*\
  !*** ./src/dom/fleet.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assets_images_carrierX_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/images/carrierX.svg */ "./src/assets/images/carrierX.svg");
/* harmony import */ var _assets_images_battleshipX_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/images/battleshipX.svg */ "./src/assets/images/battleshipX.svg");
/* harmony import */ var _assets_images_cruiserX_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/images/cruiserX.svg */ "./src/assets/images/cruiserX.svg");
/* harmony import */ var _assets_images_submarineX_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/images/submarineX.svg */ "./src/assets/images/submarineX.svg");
/* harmony import */ var _assets_images_destroyerX_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/images/destroyerX.svg */ "./src/assets/images/destroyerX.svg");
/* harmony import */ var _logic_game__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../logic/game */ "./src/logic/game.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");
// assets






// factory


function fleet() {
  function loadFleet(fieldContainer) {
    const player = _logic_game__WEBPACK_IMPORTED_MODULE_5__["default"].getGame().getUserPlayer();
    const gameboard = player.getGameboard();
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 10; column++) {
        // if field is not empty on map load ship
        try {
          const ship = gameboard.getShip(row, column);
          loadShipOnBoard({
            fieldContainer,
            ship,
            row,
            column
          });
        } catch (error) {
          continue;
        }
      }
    }
  }
  function loadShipOnBoard(data) {
    const ship = data.ship;
    if (data.fieldContainer.querySelector(`.ship-image-container .${ship.getName()}`)) return;
    const length = ship.getLength();
    const [height, width] = [`10%`, `${length * 10}%`];
    const [top, left] = [`${data.row * 10}%`, `${data.column * 10}%`];
    const axis = ship.getAxis();
    let rotation = axis === "X" ? "rotate(0deg)" : "rotate(90deg) translateY(-100%)";
    const container = _helper__WEBPACK_IMPORTED_MODULE_6__["default"].create("div", {
      className: "ship-image-container bleep"
    });
    container.style.position = "absolute";
    container.style.zIndex = "-1";
    container.style.top = top;
    container.style.left = left;
    container.style.width = width;
    container.style.height = height;
    container.style.transform = rotation;
    container.style.transformOrigin = "top left";
    container.style.maskImage = _assets_images_carrierX_svg__WEBPACK_IMPORTED_MODULE_0__;
    const image = _helper__WEBPACK_IMPORTED_MODULE_6__["default"].create("img", {
      className: ship.getName(),
      src: loadShipImage(ship.getName())
    });
    image.style.height = "95%";
    image.style.aspectRatio = `${length}/1`;
    container.appendChild(image);
    data.fieldContainer.appendChild(container);
  }

  // this is used for webapck loading
  function loadShipImage(shipName) {
    let shipImage;
    switch (shipName) {
      case "carrier":
        shipImage = _assets_images_carrierX_svg__WEBPACK_IMPORTED_MODULE_0__;
        break;
      case "battleship":
        shipImage = _assets_images_battleshipX_svg__WEBPACK_IMPORTED_MODULE_1__;
        break;
      case "cruiser":
        shipImage = _assets_images_cruiserX_svg__WEBPACK_IMPORTED_MODULE_2__;
        break;
      case "submarine":
        shipImage = _assets_images_submarineX_svg__WEBPACK_IMPORTED_MODULE_3__;
        break;
      case "destroyer":
        shipImage = _assets_images_destroyerX_svg__WEBPACK_IMPORTED_MODULE_4__;
        break;
      default:
        shipImage = "";
    }
    return shipImage;
  }
  return {
    loadFleet,
    loadShipOnBoard
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fleet());

/***/ }),

/***/ "./src/dom/helper.js":
/*!***************************!*\
  !*** ./src/dom/helper.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function helper() {
  function deleteAppContent() {
    const app = document.getElementById("app");
    app.replaceChildren();
  }
  function create(type, data) {
    if (!type) console.log("missing type");
    const element = document.createElement(type);
    for (const [key, value] of Object.entries(data)) {
      element[key] = value;
    }
    return element;
  }
  function appendAll(container, nodeArray) {
    nodeArray.forEach(node => container.appendChild(node));
  }
  function createMap(description) {
    const map = document.createElement("div");
    map.id = `board-${description}`;
    map.classList.add("board", description);
    map.appendChild(createLettersSection());
    map.appendChild(createNumbersSection());
    map.appendChild(createBoard(description));
    return map;
  }
  function createLettersSection() {
    const letterContainer = document.createElement("div");
    letterContainer.id = "letter-container";
    letterContainer.classList.add("letter-container");
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    letters.forEach(element => {
      const letter = document.createElement("div");
      letter.className = "letter";
      letter.textContent = element;
      letterContainer.appendChild(letter);
    });
    return letterContainer;
  }
  function createNumbersSection() {
    const numberContainer = document.createElement("div");
    numberContainer.id = "number-container";
    numberContainer.classList.add("number-container");
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    numbers.forEach(element => {
      const number = document.createElement("div");
      number.className = "number";
      number.textContent = element;
      numberContainer.appendChild(number);
    });
    return numberContainer;
  }
  function createBoard(description) {
    const board = document.createElement("div");
    board.id = `field-container-${description}`;
    board.classList.add(`field-container`);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const field = document.createElement("div");
        field.classList.add("field");
        board.appendChild(field);
      }
    }
    return board;
  }
  function getNearestTen(num) {
    if (num === 0) num++;
    while (num % 10 !== 0) num++;
    return num;
  }
  function getCoordinatesFromIndex(index) {
    const x = Math.trunc(index / 10);
    const y = index % 10;
    return [x, y];
  }
  function getIndexFromCoordinates(row, column) {
    return row * 10 + column;
  }
  return {
    deleteAppContent,
    create,
    appendAll,
    createMap,
    getNearestTen,
    getCoordinatesFromIndex,
    getIndexFromCoordinates
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (helper());

/***/ }),

/***/ "./src/dom/pregame.js":
/*!****************************!*\
  !*** ./src/dom/pregame.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");

function pregame() {
  function loadCard() {
    const app = document.getElementById("app");
    app.classList.add("pregame");
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(app, [createPregameCard()]);
  }
  function createPregameCard() {
    const section = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("section", {
      className: "pregame-card"
    });
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(section, [createTitle(), createNameForm(), createPlayNowButton()]);
    return section;
  }
  function createTitle() {
    const title = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("h1", {
      textContent: "BATTLESHIP"
    });
    return title;
  }
  function createNameForm() {
    const container = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      className: "name-form"
    });
    const input = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("input", {
      type: "text",
      id: "name-input",
      className: "name-input",
      placeholder: "User Name",
      minLength: 0,
      maxLength: 15
    });
    const border = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("span", {
      className: "input-border"
    });
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(container, [input, border]);
    return container;
  }
  function createPlayNowButton() {
    const button = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("button", {
      type: "button",
      id: "play-now-button",
      className: "play-now-button"
    });
    const text = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("span", {
      className: "text-play-button",
      textContent: "ENTER COMBAT!"
    });
    button.appendChild(text);
    return button;
  }
  return {
    loadCard
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pregame());

/***/ }),

/***/ "./src/dom/reusableComponents.js":
/*!***************************************!*\
  !*** ./src/dom/reusableComponents.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");
/* harmony import */ var typed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! typed.js */ "./node_modules/typed.js/dist/typed.module.js");
/* harmony import */ var _assets_images_captain_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/images/captain.png */ "./src/assets/images/captain.png");
/* harmony import */ var _assets_images_enemy_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/images/enemy.png */ "./src/assets/images/enemy.png");
/* harmony import */ var _assets_images_cruiserX_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../assets/images/cruiserX.svg */ "./src/assets/images/cruiserX.svg");
/* harmony import */ var _assets_images_battleshipX_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/images/battleshipX.svg */ "./src/assets/images/battleshipX.svg");
/* harmony import */ var _assets_images_submarineX_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assets/images/submarineX.svg */ "./src/assets/images/submarineX.svg");
/* harmony import */ var _assets_images_destroyerX_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../assets/images/destroyerX.svg */ "./src/assets/images/destroyerX.svg");


// library


// assets







function Component() {
  // from webpack images loading
  const images = {
    captain: _assets_images_captain_png__WEBPACK_IMPORTED_MODULE_2__,
    enemy: _assets_images_enemy_png__WEBPACK_IMPORTED_MODULE_3__
  };
  function createMessageSection(classNamesArray) {
    const section = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("section", {
      className: "message"
    });
    classNamesArray.forEach(className => section.classList.add(className));
    const character = classNamesArray[1];
    const imageName = character == "captain" || character == "captain-win" ? "captain" : "enemy";
    const image = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("img", {
      className: "message-image",
      src: images[imageName]
    });
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(section, [image, createMessage(character)]);
    return section;
  }
  function createMessage(character) {
    const container = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      id: "message-container",
      className: "message-container"
    });
    const text = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      id: `message-${character}`,
      className: `message-${character}`
    });
    container.appendChild(text);
    return container;
  }
  function createShipCard(shipName) {
    const card = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      className: "ship-card",
      draggable: "true"
    });
    const content = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      className: "ship-content"
    });
    const image = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("img", {
      className: "ship-image"
    });
    const name = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("p", {
      className: "ship-name"
    });
    switch (shipName) {
      case "carrier":
        populateCard(card, image, name, "carrier", 5, _assets_images_cruiserX_svg__WEBPACK_IMPORTED_MODULE_4__, "carrier (5f)");
        break;
      case "battleship":
        populateCard(card, image, name, "battleship", 4, _assets_images_battleshipX_svg__WEBPACK_IMPORTED_MODULE_5__, "battleship (4f)");
        break;
      case "cruiser":
        populateCard(card, image, name, "cruiser", 3, _assets_images_cruiserX_svg__WEBPACK_IMPORTED_MODULE_4__, "cruiser (3f)");
        break;
      case "submarine":
        populateCard(card, image, name, "submarine", 3, _assets_images_submarineX_svg__WEBPACK_IMPORTED_MODULE_6__, "submarine (3f)");
        break;
      case "destroyer":
        populateCard(card, image, name, "destroyer", 2, _assets_images_destroyerX_svg__WEBPACK_IMPORTED_MODULE_7__, "destroyer (2f)");
        break;
      default:
        break;
    }
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(content, [image, name]);
    card.appendChild(content);
    return card;
  }
  function populateCard(card, image, name, dataShipName, dataShipLength, imageSrc, nameText) {
    card.dataset.shipName = dataShipName;
    card.dataset.shipLength = dataShipLength;
    image.src = imageSrc;
    name.textContent = nameText;
  }
  function addTypeWritterMessage(element, stringArray) {
    const typed = new typed_js__WEBPACK_IMPORTED_MODULE_1__["default"](element, {
      strings: stringArray,
      typeSpeed: 10
    });
  }
  return {
    createMessageSection,
    createShipCard,
    addTypeWritterMessage
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component());

/***/ }),

/***/ "./src/dom/setup.js":
/*!**************************!*\
  !*** ./src/dom/setup.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");
/* harmony import */ var _logic_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logic/game */ "./src/logic/game.js");
/* harmony import */ var _reusableComponents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reusableComponents */ "./src/dom/reusableComponents.js");
/* harmony import */ var _utils_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/message */ "./src/utils/message.js");
/* harmony import */ var _dragDrop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dragDrop */ "./src/dom/dragDrop.js");
/* harmony import */ var _battle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./battle */ "./src/dom/battle.js");






function setup() {
  function loadSetupContent() {
    const app = document.getElementById("app");
    app.classList.replace("pregame", "setup");
    app.appendChild(createSetupWrapper());
    displayWelcomeMessage();
    initButtons();
  }
  function createSetupWrapper() {
    const wrapper = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      className: "setup-wrapper"
    });
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(wrapper, [_reusableComponents__WEBPACK_IMPORTED_MODULE_2__["default"].createMessageSection(["setup", "captain"]), createMapFleetSection(), createResetContinueSection()]);
    return wrapper;
  }
  function createMapFleetSection() {
    const section = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("section", {
      id: "setup-container",
      className: "setup-container"
    });
    section.appendChild(createMapFleet());
    return section;
  }
  function createMapFleet() {
    const container = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      className: "board-fleet-container"
    });
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(container, [_helper__WEBPACK_IMPORTED_MODULE_0__["default"].createMap("setup"), createFleetSelectSection()]);
    container.querySelector("#board-setup").appendChild(createAxisButtons());
    return container;
  }
  function createFleetSelectSection() {
    const section = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("section", {
      id: "fleet-setup",
      className: "fleet-setup"
    });
    const fleet = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
    fleet.forEach(ship => {
      const shipCard = _reusableComponents__WEBPACK_IMPORTED_MODULE_2__["default"].createShipCard(ship);
      section.appendChild(shipCard);
    });
    return section;
  }
  function createAxisButtons() {
    const container = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("div", {
      id: "axis-button-container",
      className: "axis-button-container"
    });
    const buttonX = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("button", {
      id: "x-button",
      className: "axis-button",
      textContent: "X axis"
    });
    const buttonY = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("button", {
      id: "y-button",
      className: "axis-button",
      textContent: "Y axis"
    });
    buttonX.classList.add("selected");
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(container, [buttonX, buttonY]);
    return container;
  }
  function createResetContinueSection() {
    const container = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("section", {
      id: "reset-continue-section",
      className: "reset-continue-section"
    });
    const resetButton = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("button", {
      id: "reset-button",
      className: "reset-button",
      textContent: "Reset"
    });
    const continueButton = _helper__WEBPACK_IMPORTED_MODULE_0__["default"].create("button", {
      id: "continue-button",
      className: "continue-button",
      textContent: "Continue"
    });
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].appendAll(container, [resetButton, continueButton]);
    return container;
  }
  function displayWelcomeMessage() {
    const message = document.getElementById("message-captain");
    _reusableComponents__WEBPACK_IMPORTED_MODULE_2__["default"].addTypeWritterMessage(message, _utils_message__WEBPACK_IMPORTED_MODULE_3__["default"].getWelcomeMessage());
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
    shipCards.forEach(shipCard => shipCard.setAttribute("tabindex", 0));
  }
  function disableContinueButton() {
    const button = document.getElementById("continue-button");
    button.classList.add("disabled");
    button.addEventListener("keydown", _dragDrop__WEBPACK_IMPORTED_MODULE_4__["default"].preventEnterDefault);
  }
  function initResetContinueButtons() {
    const resetButton = document.getElementById("reset-button");
    const continueButton = document.getElementById("continue-button");
    const gameboard = _logic_game__WEBPACK_IMPORTED_MODULE_1__["default"].getGame().getUserPlayer().getGameboard();
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
    [...fleet.children].forEach(node => {
      if (node.classList.contains("hidden")) {
        node.classList.remove("hidden");
      }
    });
  }
  function removePlacedShips(fieldContainer) {
    const ships = fieldContainer.querySelectorAll(".ship-image-container");
    ships.forEach(ship => ship.remove());
  }
  function handleContinue() {
    if (_logic_game__WEBPACK_IMPORTED_MODULE_1__["default"].getGame().getUserPlayer().getGameboard().getFleetNumber() === 5) {
      _battle__WEBPACK_IMPORTED_MODULE_5__["default"].loadBattleContent();
    }
  }
  return {
    loadSetupContent
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setup());

/***/ }),

/***/ "./src/dom/view.js":
/*!*************************!*\
  !*** ./src/dom/view.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/dom/helper.js");
/* harmony import */ var _logic_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logic/game */ "./src/logic/game.js");
/* harmony import */ var _pregame__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pregame */ "./src/dom/pregame.js");
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./setup */ "./src/dom/setup.js");
/* harmony import */ var _dragDrop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dragDrop */ "./src/dom/dragDrop.js");





function view() {
  function loadContent() {
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].deleteAppContent();
    _pregame__WEBPACK_IMPORTED_MODULE_2__["default"].loadCard();
    initPlayButton();
  }
  function initPlayButton() {
    const button = document.getElementById("play-now-button");
    button.addEventListener("click", loadSetup);
  }
  function loadSetup() {
    setPlayerName();
    _helper__WEBPACK_IMPORTED_MODULE_0__["default"].deleteAppContent();
    _setup__WEBPACK_IMPORTED_MODULE_3__["default"].loadSetupContent();
    _dragDrop__WEBPACK_IMPORTED_MODULE_4__["default"].initDraggableFields();
  }
  function setPlayerName() {
    const name = document.getElementById("name-input").value.toString().trim();
    _logic_game__WEBPACK_IMPORTED_MODULE_1__["default"].startGame(name || "Captain");
    console.log(name);
  }
  return {
    loadContent
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (view());

/***/ }),

/***/ "./src/logic/game.js":
/*!***************************!*\
  !*** ./src/logic/game.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player.js */ "./src/logic/player.js");

function Game() {
  const ships = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
  let game;
  function startGame(userName) {
    const userPlayer = (0,_player_js__WEBPACK_IMPORTED_MODULE_0__.Player)(userName);
    const computerPlayer = (0,_player_js__WEBPACK_IMPORTED_MODULE_0__.Player)("computer");
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
      const result = computerPlayer.attackEnemy(computerPlayer.getGameboard(), row, column);
      if (result) return result;else return null;
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
          result = computerPlayer.attackEnemy(userPlayer.getGameboard(), row, column);
          break;
        } catch (error) {
          continue;
        }
      }
      if (result) populateQueue(row, column);
      if (result) return {
        ship: result,
        coord: [row, column]
      };else return [row, column];
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
      autoComputerAttack
    };
  }
  function getGame() {
    if (!game) throw new Error("First initialize the game");
    return game;
  }
  return {
    startGame,
    getGame
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game());

/***/ }),

/***/ "./src/logic/gameboard.js":
/*!********************************!*\
  !*** ./src/logic/gameboard.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameBoard: () => (/* binding */ GameBoard)
/* harmony export */ });
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ "./src/logic/ship.js");

function GameBoard() {
  const rows = 10;
  const columns = 10;
  let board = Array.from({
    length: rows
  }, () => Array(columns).fill(null));
  const shipPos = {
    carrier: null,
    battleship: null,
    cruiser: null,
    submarine: null,
    destroyer: null
  };
  const shipLengths = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2
  };
  let shipOnDrag = {
    name: "",
    length: 0
  };
  let sunkShips = 0;
  let fleetNumber = 0;
  const getShipInitialPosition = name => shipPos[name];
  const getBoard = () => board;
  const clearBoard = () => board = Array.from({
    length: rows
  }, () => Array(columns).fill(null));
  const getShip = (row, column) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns) throw new Error("Row position out of range");
    if (board[row][column] == null) throw new Error("No ship in this position");
    if (board[row][column] == "miss" || board[row][column] == "hit") throw new Error("No ship in this position");
    return board[row][column];
  };
  const placeShip = (row, column, shipName, horizontal) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns) throw new Error("Row position out of range");
    const shipLength = shipLengths[shipName];
    if (horizontal && column + shipLength > columns || !horizontal && row + shipLength > rows) {
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
    const newShip = horizontal ? (0,_ship_js__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipName, shipLength, "X") : (0,_ship_js__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipName, shipLength, "Y");
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
    if (row < 0 || row >= rows || column < 0 || column >= columns) throw new Error("Row position out of range");
    let data = board[row][column];
    if (data == "miss" || data == "hit") throw new Error("Position already attacked");
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
  const setShipOnDrag = shipInfo => {
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
    getShipInitialPosition
  };
}

/***/ }),

/***/ "./src/logic/player.js":
/*!*****************************!*\
  !*** ./src/logic/player.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard.js */ "./src/logic/gameboard.js");

function Player(name) {
  const gameboard = (0,_gameboard_js__WEBPACK_IMPORTED_MODULE_0__.GameBoard)();
  const getGameboard = () => gameboard;
  const getName = () => name;
  const placeShip = (row, column, shipName, horizontal) => gameboard.placeShip(row, column, shipName, horizontal);
  const attackEnemy = (enemyGameboard, row, column) => {
    try {
      return enemyGameboard.receiveAttack(row, column);
    } catch (error) {
      throw new Error();
    }
  };
  return {
    getGameboard,
    getName,
    placeShip,
    attackEnemy
  };
}

/***/ }),

/***/ "./src/logic/ship.js":
/*!***************************!*\
  !*** ./src/logic/ship.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
function Ship(name, length, axis) {
  let numberOfHits = 0;
  let sunk = false;
  const getName = () => name;
  const getLength = () => length;
  const getAxis = () => axis;
  const getNumberOfHits = () => numberOfHits;
  const hit = () => numberOfHits++;
  const isSunk = () => numberOfHits === length;
  return {
    getName,
    getLength,
    getAxis,
    getNumberOfHits,
    hit,
    isSunk
  };
}

/***/ }),

/***/ "./src/utils/message.js":
/*!******************************!*\
  !*** ./src/utils/message.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _logic_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../logic/game */ "./src/logic/game.js");

function Message() {
  const messages = {
    welcome: ["Welcome aboard", "Plan our formation by selecting the axis and dragging and dropping ships on the map."],
    battleStartPlayer: ["all systems are online and ready for action. Let's give 'em hell!"],
    battleStartEnemy: ["Prepare yourself for a battle unlike any other, for I shall be as ruthless as fate itself, just as your forebears were to mine. This ocean will bear witness to our contest, and I promise you, there shall be no quarter given nor asked."],
    enemyHit: ["They've just caught a cannonball to the hull, sir!", "Our precision strikes are taking a toll on their ship, Captain.", "The enemy vessel is feeling the weight of our firepower, sir.", "Their ship is in a downward spiral, just like their hopes of victory!", "That shot was a masterpiece, Captain. Their fate is sealed.", "Direct hit, Captain! The enemy ship's defenses are crumbling.", "We've scored a solid hit on the enemy vessel, sir.", "A thunderous blow, Captain! The enemy ship is in dire straits.", "KABOOM! The enemy ship is taking a beating. They won't last long.", "Another precise hit, Captain. Their combat capabilities are in shambles."],
    enemySunk: ["Captain, their ship is going under. That was a shot for the history books.", "Sir, we've sent the enemy ship to the abyss. It's sunk.", "The enemy ship has met its end, Captain. They won't trouble us again.", "Captain, we've dealt the final blow. The enemy ship is sunk.", "We've consigned the enemy ship to the depths, Captain. Well done.", "Captain, the enemy ship is no more. They won't pester us again.", "That shot was the nail in the coffin, Captain. The enemy ship is at rest beneath the waves.", "Direct hit, Captain. The enemy ship now rests on the ocean floor.", "The enemy ship is out of commission. They won't trouble us anymore.", "We've just given the enemy ship a one-way trip to the ocean's depths, Captain."],
    playerMiss: ["A near miss, but no cigar, captain.", "Our shots need refining, captain. They slipped through our fingers.", "Negative, captain. That shot missed the mark.", "We've come up empty-handed, captain. Keep the fire burning!", "That was a close shave, sir, but no hit.", "No luck this time. Keep up the effort!", "The enemy is proving elusive, sir. Let's stay vigilant.", "Time to fine-tune our aim, sir. They won't elude us for long.", "Our sights are slightly off, sir. We'll get them next time.", "Progress is slow, captain. What's the next move in our strategy?"],
    playerHit: ["Your fate is sealed!", "Hehehe, your fortunes are dwindling,", "Prepare for the storm of destruction!", "That was just a glimpse of your impending doom.", "The ocean's embrace awaits you, my foe.", "My torpedoes have found their mark, your end is nigh!", "So easily anticipated, you're not even a challenge.", "How does it feel to face the fury of my onslaught?", "Your fortune has deserted you, and there's no escape!", "Seems I've struck a nerve. Ready for a taste of your own medicine?"],
    playerSunk: ["Looks like you're headed for a watery grave. Hehehe.", "You fought like a coward and met a fitting end.", "Your ship was no match for our overwhelming firepower.", "Another one bites the dust. Crushing your kind is too easy.", "Your fate was sealed from the beginning. The sea claims its victims.", "Did you truly believe you could stand against us? How naive.", "It's regrettable that your vessel crumbled before our might.", "The ocean favors the strong. Your ship was doomed.", "Challenging me was a grave error. Your defeat was inevitable.", "Surrender was your only sensible choice. Now look at the consequences."],
    enemyMiss: ["I'll have my revenge soon enough.", "It's my turn to strike back, just you wait.", "Missed, but I won't miss twice.", "You can try to hide, but you won't elude me for long.", "I'll find you, no matter where you try to escape.", "Your luck is merely delaying the inevitable, my friend.", "My torpedoes are relentless; they'll track you down.", "You may have evaded one, but the next one won't miss.", "Consider that a warning shot; the real barrage is on its way.", "You're toying with danger, and my arsenal is boundless."],
    playerWin: ["Mission accomplished, Captain! You truly are the master of the seas."],
    enemyWin: ["You were no match for me scum."]
  };
  function getWelcomeMessage() {
    // add the name of the ingresed by te player
    messages.welcome[0] += ` ${_logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getUserPlayer().getName()}!`;
    return messages.welcome;
  }
  function getBattleStartMessage() {
    return `${_logic_game__WEBPACK_IMPORTED_MODULE_0__["default"].getGame().getUserPlayer().getName()} ${messages.battleStartPlayer[0]}`;
  }
  function getEnemyBattleStartMessage() {
    return messages.battleStartEnemy[0];
  }
  function getNewEnemyHitMessage(prevMessage) {
    let newMessage = prevMessage;
    while (newMessage === prevMessage) {
      newMessage = messages.enemyHit[randomChoice(messages.enemyHit.length)];
    }
    return newMessage;
  }
  function getNewEnemySunkMessage(prevMessage) {
    let newMessage = prevMessage;
    while (newMessage === prevMessage) {
      newMessage = messages.enemySunk[randomChoice(messages.enemySunk.length)];
    }
    return newMessage;
  }
  function getNewPlayerMissMessage(prevMessage) {
    let newMessage = prevMessage;
    while (newMessage === prevMessage) {
      newMessage = messages.playerMiss[randomChoice(messages.playerMiss.length)];
    }
    return newMessage;
  }
  function getNewPlayerHitMessage(prevMessage) {
    let newMessage = prevMessage;
    while (newMessage === prevMessage) {
      newMessage = messages.playerHit[randomChoice(messages.playerHit.length)];
    }
    return newMessage;
  }
  function getNewPlayerSunkMessage(prevMessage) {
    let newMessage = prevMessage;
    while (newMessage === prevMessage) {
      newMessage = messages.playerSunk[randomChoice(messages.playerSunk.length)];
    }
    return newMessage;
  }
  function getNewEnemyMissMessage(prevMessage) {
    let newMessage = prevMessage;
    while (newMessage === prevMessage) {
      newMessage = messages.enemyMiss[randomChoice(messages.enemyMiss.length)];
    }
    return newMessage;
  }
  function randomChoice(optionLength) {
    return Math.trunc(Math.random() * optionLength);
  }
  function getEnemyWinMessage() {
    return messages.enemyWin[0];
  }
  function getPlayerWinMessage() {
    return messages.playerWin[0];
  }
  function getNoCommentMessage() {
    return "...";
  }
  return {
    getWelcomeMessage,
    getBattleStartMessage,
    getEnemyBattleStartMessage,
    getNewEnemyHitMessage,
    getNewEnemySunkMessage,
    getNewPlayerMissMessage,
    getNoCommentMessage,
    getNewPlayerHitMessage,
    getNewPlayerSunkMessage,
    getNewEnemyMissMessage,
    getEnemyWinMessage,
    getPlayerWinMessage
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Message());

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/battle.css":
/*!*********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/battle.css ***!
  \*********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/images/grid.svg */ "./src/assets/images/grid.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.battle-wrapper {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  gap: 1rem;

  margin: 0 auto;
  max-width: 75rem;
}

.board.player,
.board.computer {
  background-color: rgba(0, 0, 0, 0.75);
  padding: 1rem;
}

.board.player .map-title-container,
.board.computer .map-title-container {
  order: 1;
  grid-column: 2 / 3;
}

.board .map-title-container .map-title {
  text-align: right;
  font-size: min(calc(0.5rem + 1vw), 1.25rem);
  margin-bottom: 0.5rem;
  padding-right: 0.5rem;
}

.board.player .map-title {
  color: #87ceeb;
}

.board.computer .map-title {
  color: #f3a640;
}

.field-container#field-container-computer {
  background: url(${___CSS_LOADER_URL_REPLACEMENT_0___}),
    radial-gradient(circle,
      rgba(2, 0, 36, 0) 0%,
      rgba(243, 166, 64, 0.15449929971988796) 60%,
      rgba(243, 166, 64, 0.25253851540616246) 85%,
      rgba(243, 166, 64, 0.3981967787114846) 100%);
}

.field-container#field-container-computer::before {
  -webkit-filter: invert(87%) sepia(18%) saturate(3703%) hue-rotate(325deg) brightness(96%) contrast(98%);
  filter: invert(87%) sepia(18%) saturate(3703%) hue-rotate(325deg) brightness(96%) contrast(98%);
}

.field-container#field-container-computer img {
  -webkit-filter: invert(63%) sepia(99%) saturate(360%) hue-rotate(343deg) brightness(98%) contrast(94%);
  filter: invert(63%) sepia(99%) saturate(360%) hue-rotate(343deg) brightness(98%) contrast(94%);
}

.battle-wrapper .field-container::after {
  display: none;
}

.field {
  position: relative;
  cursor: crosshair;
}

.field::before {
  content: "";
  z-index: 1;
  position: absolute;

  transform: translate(-37.5rem, -40.625rem) rotate(-315deg);
  height: 30%;
  width: 12.5rem;
  border: 0.1875rem solid #fefefe;
  border-radius: 1rem;
  background-color: #fefefe;
  opacity: 1;
  transition: all 0.15s cubic-bezier(0.7, 0.03, 0.85, 0.43);
}

.field::after {
  content: "";
  z-index: 1;
  position: absolute;

  height: 100%;
  width: 100%;

  border-radius: 100%;
  opacity: 0;
}


.field.hit::before {
  animation: shot 0.35s 0.175s 1;
  -webkit-animation: shot 0.35s 0.175s 1;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.field.hit::after {
  background-color: rgba(255, 0, 0, 0.5);
  animation: ripple 0.5s 0.2s 1;
  -webkit-animation: ripple 0.5s 0.2s 1;
  animation-delay: 0.35s;
  -webkit-animation-delay: 0.35s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.field.miss::before {
  animation: miss 0.35s 0.175s 1;
  -webkit-animation: miss 0.35s 0.175s 1;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.field.miss::after {
  background-color: rgba(0, 153, 255, 0.5);
  animation: ripple 0.5s 0.2s 1;
  -webkit-animation: ripple 0.5s 0.2s 1;
  animation-delay: 0.35s;
  -webkit-animation-delay: 0.35s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.message.battle {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.75);
  width: 100%;

  grid-column: 1/3;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;

  font-size: min(calc(0.5rem + 1vw), 1rem);
  transition: all 0.6s;
}

.message.battle.captain .message-captain {
  color: #87ceeb;
}

.message.battle.captain .typed-cursor {
  background-color: #87ceeb;
}

.message.battle.enemy {
  justify-content: flex-end;
}

.message.battle.enemy .message-image {
  order: 2;
}

.message.battle.enemy .message-container {
  order: 1;
}

.message.battle.enemy .message-enemy {
  color: #f3a640;
}

.message.battle.enemy .typed-cursor {
  background-color: #f3a640;
}

.message-image {
  height: min(calc(1.25rem + 2vw), 2.75rem);
}

.message.battle .message-container {
  display: inline;
  text-align: start;
}

.message.battle.enemy .message-container {
  text-align: end;
}

.message.battle .message-container .message-captain,
.message.battle .message-container .message-enemy {
  display: inline;
}

.message.battle .message-container .typed-cursor {
  position: relative;
  left: 0.0625rem;
  bottom: -0.1875rem;
  display: inline-block;
  width: 0.5rem;
  height: 1rem;
  color: transparent;
  overflow: hidden;
}

.message.battle.on-turn {
  animation: enemyTurn 0.6s ease forwards;
}

.message.battle.on-turn.captain .message-captain,
.message.battle.on-turn.enemy .message-enemy {
  color: #000000;
}

.message.battle.on-turn.captain .typed-cursor,
.message.battle.on-turn.enemy .typed-cursor {
  background-color: #000000;
}

.message.battle.captain {
  position: relative;
  overflow: hidden;
}

.message.battle.captain::after {
  content: "";
  position: absolute;
  z-index: -1;

  width: 200%;
  height: 100%;

  inset: 0;

  background-position: left;
  background: linear-gradient(90deg,
      rgba(135, 206, 235, 1) 0%,
      rgba(135, 206, 235, 0.8029586834733894) 20%,
      rgba(135, 206, 235, 0.604079131652661) 40%,
      rgba(135, 206, 235, 0.4023984593837535) 60%,
      rgba(135, 206, 235, 0.19511554621848737) 80%,
      rgba(135, 206, 235, 0) 100%);
  transform: translateX(-100%);
}

.message.battle.enemy {
  position: relative;
  overflow: hidden;
}

.message.battle.enemy::after {
  content: "";
  position: absolute;
  z-index: -1;

  width: 200%;
  height: 100%;

  inset: 0;

  background: rgb(243, 166, 64);
  background: linear-gradient(90deg,
      rgba(243, 166, 64, 0) 0%,
      rgba(243, 166, 64, 0.20211834733893552) 20%,
      rgba(243, 166, 64, 0.40379901960784315) 40%,
      rgba(243, 166, 64, 0.6026785714285714) 60%,
      rgba(243, 166, 64, 0.7987570028011204) 80%,
      rgba(243, 166, 64, 1) 100%);
  transform: translateX(-100%);
}

.message.battle.captain.on-turn::after {
  -webkit-animation: seepCaptain 1s 1 forwards;
  animation: seepCaptain 1s 1 forwards;
}

.message.battle.enemy.on-turn::after {
  -webkit-animation: seepEnemy 1s 1 forwards;
  animation: seepEnemy 1s 1 forwards;
}

.disabled {
  pointer-events: none;
}

@keyframes shot {
  75% {
    width: 5rem;
    background-color: #fefefe;
    border-color: #fefefe;
  }

  100% {
    width: 30%;
    background-color: rgba(255, 0, 0, 0.85);
    border-color: rgba(255, 0, 0, 0.5);
    transform: translateX(0) rotate(-315deg);
  }
}


@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.25);
    opacity: 1;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes miss {
  75% {
    width: 5rem;
    background-color: #fefefe;
    border-color: #fefefe;
  }

  100% {
    width: 30%;
    background-color: rgba(0, 153, 255, 0.85);
    border-color: rgba(0, 153, 255, 0.5);
    transform: translateX(0) rotate(-315deg);
  }
}

@keyframes enemyTurn {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.0125);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes seepCaptain {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0%);
  }
}

@keyframes seepEnemy {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-50%);
  }
}

@keyframes grow {
  0% {
    width: 12.5rem;
  }
  100% {
    width: 100%;
  }
}

@keyframes shrink {
  0% {
    width: 100%;
  }
  100% {
    width: 12.5rem;
  }
}

@media screen and (max-width: 48rem) {
  .battle-wrapper {
    display: grid;
    grid-template-rows: auto;
    align-items: center;
    justify-items: start;
  }

  .battle-wrapper .board.enemy {
    margin-left: auto;
  }

  .battle-wrapper .board {
    max-width: 25rem;
    grid-column: 1/3;
  }
}

@media screen and (max-width: 30rem) {
  .battle-wrapper {
    gap: 0.5rem;
  }

  .battle-wrapper .board.player {
    width: 12.5rem;
    margin-right: auto;
  }

  .battle-wrapper .board.player.off-turn {
    -webkit-animation: grow 1.5s 1 forwards;
    animation: grow 1.5s 1 forwards;
  }

  .battle-wrapper .board.player.on-turn {
    -webkit-animation: shrink 1.5s 1 forwards;
    animation: shrink 1.5s 1 forwards;
  }

  .battle-wrapper .board.enemy.off-turn {
    -webkit-animation: grow 1.5s 1 forwards;
    animation: grow 1.5s 1 forwards;
  }

  .battle-wrapper .board.enemy.on-turn {
    -webkit-animation: shrink 1.5s 1 forwards;
    animation: shrink 1.5s 1 forwards;
  }
}
`, "",{"version":3,"sources":["webpack://./src/styles/battle.css"],"names":[],"mappings":"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","sourcesContent":[".battle-wrapper {\n  width: 100%;\n\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  justify-items: center;\n  gap: 1rem;\n\n  margin: 0 auto;\n  max-width: 75rem;\n}\n\n.board.player,\n.board.computer {\n  background-color: rgba(0, 0, 0, 0.75);\n  padding: 1rem;\n}\n\n.board.player .map-title-container,\n.board.computer .map-title-container {\n  order: 1;\n  grid-column: 2 / 3;\n}\n\n.board .map-title-container .map-title {\n  text-align: right;\n  font-size: min(calc(0.5rem + 1vw), 1.25rem);\n  margin-bottom: 0.5rem;\n  padding-right: 0.5rem;\n}\n\n.board.player .map-title {\n  color: #87ceeb;\n}\n\n.board.computer .map-title {\n  color: #f3a640;\n}\n\n.field-container#field-container-computer {\n  background: url('../assets/images/grid.svg'),\n    radial-gradient(circle,\n      rgba(2, 0, 36, 0) 0%,\n      rgba(243, 166, 64, 0.15449929971988796) 60%,\n      rgba(243, 166, 64, 0.25253851540616246) 85%,\n      rgba(243, 166, 64, 0.3981967787114846) 100%);\n}\n\n.field-container#field-container-computer::before {\n  -webkit-filter: invert(87%) sepia(18%) saturate(3703%) hue-rotate(325deg) brightness(96%) contrast(98%);\n  filter: invert(87%) sepia(18%) saturate(3703%) hue-rotate(325deg) brightness(96%) contrast(98%);\n}\n\n.field-container#field-container-computer img {\n  -webkit-filter: invert(63%) sepia(99%) saturate(360%) hue-rotate(343deg) brightness(98%) contrast(94%);\n  filter: invert(63%) sepia(99%) saturate(360%) hue-rotate(343deg) brightness(98%) contrast(94%);\n}\n\n.battle-wrapper .field-container::after {\n  display: none;\n}\n\n.field {\n  position: relative;\n  cursor: crosshair;\n}\n\n.field::before {\n  content: \"\";\n  z-index: 1;\n  position: absolute;\n\n  transform: translate(-37.5rem, -40.625rem) rotate(-315deg);\n  height: 30%;\n  width: 12.5rem;\n  border: 0.1875rem solid #fefefe;\n  border-radius: 1rem;\n  background-color: #fefefe;\n  opacity: 1;\n  transition: all 0.15s cubic-bezier(0.7, 0.03, 0.85, 0.43);\n}\n\n.field::after {\n  content: \"\";\n  z-index: 1;\n  position: absolute;\n\n  height: 100%;\n  width: 100%;\n\n  border-radius: 100%;\n  opacity: 0;\n}\n\n\n.field.hit::before {\n  animation: shot 0.35s 0.175s 1;\n  -webkit-animation: shot 0.35s 0.175s 1;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n\n.field.hit::after {\n  background-color: rgba(255, 0, 0, 0.5);\n  animation: ripple 0.5s 0.2s 1;\n  -webkit-animation: ripple 0.5s 0.2s 1;\n  animation-delay: 0.35s;\n  -webkit-animation-delay: 0.35s;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n\n.field.miss::before {\n  animation: miss 0.35s 0.175s 1;\n  -webkit-animation: miss 0.35s 0.175s 1;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n\n.field.miss::after {\n  background-color: rgba(0, 153, 255, 0.5);\n  animation: ripple 0.5s 0.2s 1;\n  -webkit-animation: ripple 0.5s 0.2s 1;\n  animation-delay: 0.35s;\n  -webkit-animation-delay: 0.35s;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n\n.message.battle {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n\n  background-color: rgba(0, 0, 0, 0.75);\n  width: 100%;\n\n  grid-column: 1/3;\n  gap: 0.5rem;\n  padding: 1rem;\n  border-radius: 0.5rem;\n\n  font-size: min(calc(0.5rem + 1vw), 1rem);\n  transition: all 0.6s;\n}\n\n.message.battle.captain .message-captain {\n  color: #87ceeb;\n}\n\n.message.battle.captain .typed-cursor {\n  background-color: #87ceeb;\n}\n\n.message.battle.enemy {\n  justify-content: flex-end;\n}\n\n.message.battle.enemy .message-image {\n  order: 2;\n}\n\n.message.battle.enemy .message-container {\n  order: 1;\n}\n\n.message.battle.enemy .message-enemy {\n  color: #f3a640;\n}\n\n.message.battle.enemy .typed-cursor {\n  background-color: #f3a640;\n}\n\n.message-image {\n  height: min(calc(1.25rem + 2vw), 2.75rem);\n}\n\n.message.battle .message-container {\n  display: inline;\n  text-align: start;\n}\n\n.message.battle.enemy .message-container {\n  text-align: end;\n}\n\n.message.battle .message-container .message-captain,\n.message.battle .message-container .message-enemy {\n  display: inline;\n}\n\n.message.battle .message-container .typed-cursor {\n  position: relative;\n  left: 0.0625rem;\n  bottom: -0.1875rem;\n  display: inline-block;\n  width: 0.5rem;\n  height: 1rem;\n  color: transparent;\n  overflow: hidden;\n}\n\n.message.battle.on-turn {\n  animation: enemyTurn 0.6s ease forwards;\n}\n\n.message.battle.on-turn.captain .message-captain,\n.message.battle.on-turn.enemy .message-enemy {\n  color: #000000;\n}\n\n.message.battle.on-turn.captain .typed-cursor,\n.message.battle.on-turn.enemy .typed-cursor {\n  background-color: #000000;\n}\n\n.message.battle.captain {\n  position: relative;\n  overflow: hidden;\n}\n\n.message.battle.captain::after {\n  content: \"\";\n  position: absolute;\n  z-index: -1;\n\n  width: 200%;\n  height: 100%;\n\n  inset: 0;\n\n  background-position: left;\n  background: linear-gradient(90deg,\n      rgba(135, 206, 235, 1) 0%,\n      rgba(135, 206, 235, 0.8029586834733894) 20%,\n      rgba(135, 206, 235, 0.604079131652661) 40%,\n      rgba(135, 206, 235, 0.4023984593837535) 60%,\n      rgba(135, 206, 235, 0.19511554621848737) 80%,\n      rgba(135, 206, 235, 0) 100%);\n  transform: translateX(-100%);\n}\n\n.message.battle.enemy {\n  position: relative;\n  overflow: hidden;\n}\n\n.message.battle.enemy::after {\n  content: \"\";\n  position: absolute;\n  z-index: -1;\n\n  width: 200%;\n  height: 100%;\n\n  inset: 0;\n\n  background: rgb(243, 166, 64);\n  background: linear-gradient(90deg,\n      rgba(243, 166, 64, 0) 0%,\n      rgba(243, 166, 64, 0.20211834733893552) 20%,\n      rgba(243, 166, 64, 0.40379901960784315) 40%,\n      rgba(243, 166, 64, 0.6026785714285714) 60%,\n      rgba(243, 166, 64, 0.7987570028011204) 80%,\n      rgba(243, 166, 64, 1) 100%);\n  transform: translateX(-100%);\n}\n\n.message.battle.captain.on-turn::after {\n  -webkit-animation: seepCaptain 1s 1 forwards;\n  animation: seepCaptain 1s 1 forwards;\n}\n\n.message.battle.enemy.on-turn::after {\n  -webkit-animation: seepEnemy 1s 1 forwards;\n  animation: seepEnemy 1s 1 forwards;\n}\n\n.disabled {\n  pointer-events: none;\n}\n\n@keyframes shot {\n  75% {\n    width: 5rem;\n    background-color: #fefefe;\n    border-color: #fefefe;\n  }\n\n  100% {\n    width: 30%;\n    background-color: rgba(255, 0, 0, 0.85);\n    border-color: rgba(255, 0, 0, 0.5);\n    transform: translateX(0) rotate(-315deg);\n  }\n}\n\n\n@keyframes ripple {\n  0% {\n    transform: scale(0);\n    opacity: 0;\n  }\n\n  50% {\n    transform: scale(1.25);\n    opacity: 1;\n  }\n\n  100% {\n    transform: scale(0);\n    opacity: 0;\n  }\n}\n\n@keyframes miss {\n  75% {\n    width: 5rem;\n    background-color: #fefefe;\n    border-color: #fefefe;\n  }\n\n  100% {\n    width: 30%;\n    background-color: rgba(0, 153, 255, 0.85);\n    border-color: rgba(0, 153, 255, 0.5);\n    transform: translateX(0) rotate(-315deg);\n  }\n}\n\n@keyframes enemyTurn {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(1.0125);\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n\n@keyframes seepCaptain {\n  0% {\n    transform: translateX(-100%);\n  }\n\n  100% {\n    transform: translateX(0%);\n  }\n}\n\n@keyframes seepEnemy {\n  0% {\n    transform: translateX(100%);\n  }\n\n  100% {\n    transform: translateX(-50%);\n  }\n}\n\n@keyframes grow {\n  0% {\n    width: 12.5rem;\n  }\n  100% {\n    width: 100%;\n  }\n}\n\n@keyframes shrink {\n  0% {\n    width: 100%;\n  }\n  100% {\n    width: 12.5rem;\n  }\n}\n\n@media screen and (max-width: 48rem) {\n  .battle-wrapper {\n    display: grid;\n    grid-template-rows: auto;\n    align-items: center;\n    justify-items: start;\n  }\n\n  .battle-wrapper .board.enemy {\n    margin-left: auto;\n  }\n\n  .battle-wrapper .board {\n    max-width: 25rem;\n    grid-column: 1/3;\n  }\n}\n\n@media screen and (max-width: 30rem) {\n  .battle-wrapper {\n    gap: 0.5rem;\n  }\n\n  .battle-wrapper .board.player {\n    width: 12.5rem;\n    margin-right: auto;\n  }\n\n  .battle-wrapper .board.player.off-turn {\n    -webkit-animation: grow 1.5s 1 forwards;\n    animation: grow 1.5s 1 forwards;\n  }\n\n  .battle-wrapper .board.player.on-turn {\n    -webkit-animation: shrink 1.5s 1 forwards;\n    animation: shrink 1.5s 1 forwards;\n  }\n\n  .battle-wrapper .board.enemy.off-turn {\n    -webkit-animation: grow 1.5s 1 forwards;\n    animation: grow 1.5s 1 forwards;\n  }\n\n  .battle-wrapper .board.enemy.on-turn {\n    -webkit-animation: shrink 1.5s 1 forwards;\n    animation: shrink 1.5s 1 forwards;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/board.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/board.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/images/grid.svg */ "./src/assets/images/grid.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/images/cross.svg */ "./src/assets/images/cross.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.board {
  width: 100%;

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;

  max-width: 600px;
  border-radius: 0.5rem;
}

.board .letter-container,
.board .number-container {
  user-select: none;
  font-size: min(calc(0.2rem + 1.25vw), 0.85rem);
}

.board .axis-button-container {
  order: 1;
  grid-column: 1/3;
  margin-bottom: 1rem;
}

.board .letter-container {
  display: flex;
  justify-content: space-around;
  order: 2;
  grid-column: 2/3;
  margin-bottom: 0.5rem;
}

.board .number-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  order: 3;
  grid-column: 1/2;
  margin-right: 0.5rem;
}

.board .field-container {
  order: 4;

  position: relative;
  z-index: 0;

  grid-column: 2/3;

  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);

  aspect-ratio: 1/1;
  overflow: hidden;

  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___}), radial-gradient(circle,
      rgba(2, 0, 36, 0) 15%,
      rgba(112, 205, 241, 0.10127801120448177) 60%,
      rgba(112, 205, 241, 0.2497373949579832) 85%,
      rgba(112, 205, 241, 0.40379901960784315) 100%);
  background-repeat: no-repeat;
}

.board .field-container::before {
  content: "";
  position: absolute;
  z-index: 1;

  height: min(calc(1rem + 1vw), 2.25rem);
  width: min(calc(1rem + 1vw), 2.25rem);

  border-radius: 100%;

  background: url(${___CSS_LOADER_URL_REPLACEMENT_1___}) center / cover;

  top: 50%;
  left: 50%;
  transform: rotate(45deg) translate(-50%, -50%);
  transform-origin: top left;

  -webkit-filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);
  filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);
}

.board .field-container::after {
  content: "";
  position: absolute;
  z-index: -1;

  top: -50%;
  left: -50%;

  background: linear-gradient(50deg, rgba(34, 34, 34, 0) 56%, #70cdf1);
  border-right: solid 0.0625rem #87cfeb50;
  width: 100%;
  height: 100%;

  border-radius: 100% 0 0 0;
  pointer-events: none;

  -webkit-animation: sweep 3.5s infinite linear;
  animation: sweep 3.5s infinite linear;
  transform-origin: 100% 100%;
}

@keyframes sweep {
  to {
    transform: rotate(360deg);
  }
}

.board .field-container img {
  -webkit-filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);
  filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);
}

.board .field-container .field {
  display: flex;
  justify-content: center;
  align-items: center;

  aspect-ratio: 1/1;

  position: relative;
}

.board .field-container .field.hovering {
  background-color: #87cfeb80;
}

.board .field-container .field.hovering.red {
  background-color: #cf404080;
}

.board .field-container .field:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.board .field-container .ship-image-container {
  position: relative;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  transform-origin: center;
}

.board .field-container .ship-image-container.bleep {
  animation: bleep 3.5s infinite linear;
}

@keyframes bleep {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.board .field-container .ship-image-container img {
  position: relative;
  padding: 0;
  user-select: none;
  pointer-events: none;
  animation: scaleDrop 0.25s linear forwards
}

@keyframes scaleDrop {
  0% {
    opacity: 0;
    visibility: hidden;
    transform: scale(0);
  }
  80% {
    opacity: 1;
    visibility: visible;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
}

@media screen and (max-width: 30rem) {
  .board .field-container {
    border-width: 0.0625rem 0 0 0.0625rem;
  }

  .board .field-container .field {
    border-width: 0 0.0625rem 0.0625rem 0;
  }
}
`, "",{"version":3,"sources":["webpack://./src/styles/board.css"],"names":[],"mappings":"AAAA;EACE,WAAW;;EAEX,aAAa;EACb,+BAA+B;EAC/B,6BAA6B;;EAE7B,gBAAgB;EAChB,qBAAqB;AACvB;;AAEA;;EAEE,iBAAiB;EACjB,8CAA8C;AAChD;;AAEA;EACE,QAAQ;EACR,gBAAgB;EAChB,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,QAAQ;EACR,gBAAgB;EAChB,qBAAqB;AACvB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,6BAA6B;EAC7B,QAAQ;EACR,gBAAgB;EAChB,oBAAoB;AACtB;;AAEA;EACE,QAAQ;;EAER,kBAAkB;EAClB,UAAU;;EAEV,gBAAgB;;EAEhB,aAAa;EACb,sCAAsC;EACtC,mCAAmC;;EAEnC,iBAAiB;EACjB,gBAAgB;;EAEhB;;;;oDAIkD;EAClD,4BAA4B;AAC9B;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,UAAU;;EAEV,sCAAsC;EACtC,qCAAqC;;EAErC,mBAAmB;;EAEnB,kEAA0D;;EAE1D,QAAQ;EACR,SAAS;EACT,8CAA8C;EAC9C,0BAA0B;;EAE1B,sGAAsG;EACtG,8FAA8F;AAChG;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,WAAW;;EAEX,SAAS;EACT,UAAU;;EAEV,oEAAoE;EACpE,uCAAuC;EACvC,WAAW;EACX,YAAY;;EAEZ,yBAAyB;EACzB,oBAAoB;;EAEpB,6CAA6C;EAC7C,qCAAqC;EACrC,2BAA2B;AAC7B;;AAEA;EACE;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE,sGAAsG;EACtG,8FAA8F;AAChG;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;;EAEnB,iBAAiB;;EAEjB,kBAAkB;AACpB;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,2CAA2C;AAC7C;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,oBAAoB;EACpB,iBAAiB;EACjB,wBAAwB;AAC1B;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE;IACE,UAAU;EACZ;EACA;IACE,YAAY;EACd;EACA;IACE,UAAU;EACZ;AACF;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,iBAAiB;EACjB,oBAAoB;EACpB;AACF;;AAEA;EACE;IACE,UAAU;IACV,kBAAkB;IAClB,mBAAmB;EACrB;EACA;IACE,UAAU;IACV,mBAAmB;IACnB,qBAAqB;EACvB;EACA;IACE,UAAU;IACV,mBAAmB;IACnB,mBAAmB;EACrB;AACF;;AAEA;EACE;IACE,qCAAqC;EACvC;;EAEA;IACE,qCAAqC;EACvC;AACF","sourcesContent":[".board {\n  width: 100%;\n\n  display: grid;\n  grid-template-columns: auto 1fr;\n  grid-template-rows: auto auto;\n\n  max-width: 600px;\n  border-radius: 0.5rem;\n}\n\n.board .letter-container,\n.board .number-container {\n  user-select: none;\n  font-size: min(calc(0.2rem + 1.25vw), 0.85rem);\n}\n\n.board .axis-button-container {\n  order: 1;\n  grid-column: 1/3;\n  margin-bottom: 1rem;\n}\n\n.board .letter-container {\n  display: flex;\n  justify-content: space-around;\n  order: 2;\n  grid-column: 2/3;\n  margin-bottom: 0.5rem;\n}\n\n.board .number-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  order: 3;\n  grid-column: 1/2;\n  margin-right: 0.5rem;\n}\n\n.board .field-container {\n  order: 4;\n\n  position: relative;\n  z-index: 0;\n\n  grid-column: 2/3;\n\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  grid-template-rows: repeat(10, 1fr);\n\n  aspect-ratio: 1/1;\n  overflow: hidden;\n\n  background-image: url('../assets/images/grid.svg'), radial-gradient(circle,\n      rgba(2, 0, 36, 0) 15%,\n      rgba(112, 205, 241, 0.10127801120448177) 60%,\n      rgba(112, 205, 241, 0.2497373949579832) 85%,\n      rgba(112, 205, 241, 0.40379901960784315) 100%);\n  background-repeat: no-repeat;\n}\n\n.board .field-container::before {\n  content: \"\";\n  position: absolute;\n  z-index: 1;\n\n  height: min(calc(1rem + 1vw), 2.25rem);\n  width: min(calc(1rem + 1vw), 2.25rem);\n\n  border-radius: 100%;\n\n  background: url(../assets/images/cross.svg) center / cover;\n\n  top: 50%;\n  left: 50%;\n  transform: rotate(45deg) translate(-50%, -50%);\n  transform-origin: top left;\n\n  -webkit-filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);\n  filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);\n}\n\n.board .field-container::after {\n  content: \"\";\n  position: absolute;\n  z-index: -1;\n\n  top: -50%;\n  left: -50%;\n\n  background: linear-gradient(50deg, rgba(34, 34, 34, 0) 56%, #70cdf1);\n  border-right: solid 0.0625rem #87cfeb50;\n  width: 100%;\n  height: 100%;\n\n  border-radius: 100% 0 0 0;\n  pointer-events: none;\n\n  -webkit-animation: sweep 3.5s infinite linear;\n  animation: sweep 3.5s infinite linear;\n  transform-origin: 100% 100%;\n}\n\n@keyframes sweep {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.board .field-container img {\n  -webkit-filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);\n  filter: invert(67%) sepia(88%) saturate(286%) hue-rotate(164deg) brightness(96%) contrast(97%);\n}\n\n.board .field-container .field {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  aspect-ratio: 1/1;\n\n  position: relative;\n}\n\n.board .field-container .field.hovering {\n  background-color: #87cfeb80;\n}\n\n.board .field-container .field.hovering.red {\n  background-color: #cf404080;\n}\n\n.board .field-container .field:hover {\n  background-color: rgba(255, 255, 255, 0.25);\n}\n\n.board .field-container .ship-image-container {\n  position: relative;\n  z-index: 1;\n  pointer-events: none;\n  user-select: none;\n  transform-origin: center;\n}\n\n.board .field-container .ship-image-container.bleep {\n  animation: bleep 3.5s infinite linear;\n}\n\n@keyframes bleep {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.4;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n.board .field-container .ship-image-container img {\n  position: relative;\n  padding: 0;\n  user-select: none;\n  pointer-events: none;\n  animation: scaleDrop 0.25s linear forwards\n}\n\n@keyframes scaleDrop {\n  0% {\n    opacity: 0;\n    visibility: hidden;\n    transform: scale(0);\n  }\n  80% {\n    opacity: 1;\n    visibility: visible;\n    transform: scale(1.2);\n  }\n  100% {\n    opacity: 1;\n    visibility: visible;\n    transform: scale(1);\n  }\n}\n\n@media screen and (max-width: 30rem) {\n  .board .field-container {\n    border-width: 0.0625rem 0 0 0.0625rem;\n  }\n\n  .board .field-container .field {\n    border-width: 0 0.0625rem 0.0625rem 0;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/images/backgound.jpg */ "./src/assets/images/backgound.jpg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --main-color: #ffffff;
  --background-color: #03254c;

  color: var(--main-color);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
}

*,
*::after,
*::before {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  min-height: 100vh;
  min-height: -webkit-fill-available;
  background-color: var(--background-color);
}

body {
  background: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) center / cover no-repeat;
  overflow-x: hidden;
}

h1,
button,
a,
img {
  text-decoration: none;
  user-select: none;
}

.app {
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  min-height: 100vh;
  text-align: center;
  padding: 1rem;
}

.app.pregame {
  flex-direction: column;
  padding: 2rem;
}

.app.setup,
.app.battle {
  position: relative;
  width: 100%;
  margin: 0 auto;

}

.app.setup > *,
.app.battle > * {
  border-radius: 0.5rem;
}
`, "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"AAAA;EACE,qBAAqB;EACrB,2BAA2B;;EAE3B,wBAAwB;EACxB;wEACsE;EACtE,eAAe;AACjB;;AAEA;;;EAGE,sBAAsB;EACtB,SAAS;EACT,UAAU;AACZ;;AAEA;;EAEE,iBAAiB;EACjB,kCAAkC;EAClC,yCAAyC;AAC3C;;AAEA;EACE,4EAAwE;EACxE,kBAAkB;AACpB;;AAEA;;;;EAIE,qBAAqB;EACrB,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;;EAEnB,kBAAkB;EAClB,iBAAiB;EACjB,kBAAkB;EAClB,aAAa;AACf;;AAEA;EACE,sBAAsB;EACtB,aAAa;AACf;;AAEA;;EAEE,kBAAkB;EAClB,WAAW;EACX,cAAc;;AAEhB;;AAEA;;EAEE,qBAAqB;AACvB","sourcesContent":[":root {\n  --main-color: #ffffff;\n  --background-color: #03254c;\n\n  color: var(--main-color);\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  font-size: 16px;\n}\n\n*,\n*::after,\n*::before {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nhtml,\nbody {\n  min-height: 100vh;\n  min-height: -webkit-fill-available;\n  background-color: var(--background-color);\n}\n\nbody {\n  background: url(../assets/images/backgound.jpg) center / cover no-repeat;\n  overflow-x: hidden;\n}\n\nh1,\nbutton,\na,\nimg {\n  text-decoration: none;\n  user-select: none;\n}\n\n.app {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  position: relative;\n  min-height: 100vh;\n  text-align: center;\n  padding: 1rem;\n}\n\n.app.pregame {\n  flex-direction: column;\n  padding: 2rem;\n}\n\n.app.setup,\n.app.battle {\n  position: relative;\n  width: 100%;\n  margin: 0 auto;\n\n}\n\n.app.setup > *,\n.app.battle > * {\n  border-radius: 0.5rem;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/pregame.css":
/*!**********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/pregame.css ***!
  \**********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/images/carrierX.svg */ "./src/assets/images/carrierX.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --main-background: rgba(0, 0, 0, 0.75);
  --transparent-shadow-color: #0000004d;
  --transparent-low-grey-color: #ffffffa6;
  --main-color: #ffffff;
  --input-background-color: #00000033;
  --main-opposite-color: #000000;
}

.pregame-card {
  background-color: var(--main-background);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  max-width: 28.125rem;

  padding: min(calc(10%), 3rem);
  border: 0.125rem solid transparent;
  border-radius: 1rem;
  box-shadow: 0 0 30px 0.0625rem var(--transparent-shadow-color);

  text-align: center;
  transition: border-color 0.5s;

  aspect-ratio: 10/8;
}

.pregame-card:hover {
  border: 0.125rem solid white;
}

.pregame-card h1 {
  position: relative;

  line-height: 1;
  font-family: 'Anton', sans-serif;
  font-size: 5rem;
  letter-spacing: 0.1rem;
}

.pregame-card .name-form {
  position: relative;
  top: 5%;

  margin: 0 auto;
  max-width: 80%;
}

.name-form .name-input {
  position: relative;

  width: 100%;

  font-size: min(calc(0.6rem + 0.6vw), 1rem);
  color: var(--main-color);

  background-color: transparent;

  padding-inline: 0.5rem;
  padding-block: 0.7rem;

  border: none;
  border-bottom: 0.1rem solid var(--transparent-low-grey-color);
}

.name-form .name-input::placeholder {
  color: var(--transparent-low-grey-color);
  text-align: center;
}

.name-form .name-input:is(:hover, :focus) {
  outline: none;
  background: var(--input-background-color);
}

.name-form .name-input:is(:hover, :focus)~.input-border {
  width: 100%;
}

.name-form .input-border {
  position: absolute;
  background-color: var(--main-color);
  width: 0%;
  height: 0.125rem;
  bottom: 0;
  left: 0;
  transition: 0.3s;
}

.play-now-button {
  display: flex;
  justify-content: center;
  align-items: center;

  mask: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) no-repeat center;
  -webkit-mask: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) no-repeat center;

  mask-size: 100%;
  -webkit-mask-size: 100%;

  position: relative;
  
  width: 100%;
  min-width: 0;
  aspect-ratio: 4/1;

  margin: 0 auto;
  border: none;
  background-color: transparent;

  cursor: crosshair;
}

.play-now-button::before {
  content: '';
  position: absolute;
  z-index: -1;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.8s ease;
  
  height: 100%;
  width: 0;
  
  background-color: var(--main-color);
}

.play-now-button:hover::before,
.play-now-button:focus::before {
  width: 100%;
}

.play-now-button .text-play-button {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  bottom: 0;

  width: 100%;
  
  line-height: 2.5;
  
  font-size: min(calc(0.5rem + 0.5vw), 0.95rem);
  letter-spacing: 0.1875rem;;
  text-align: center;
  color: var(--main-color);
  
  transition: color 0.8s ease;
  
  padding: 0;
  margin: 0;
}

.play-now-button:hover .text-play-button,
.play-now-button:focus .text-play-button {
  color: var(--main-opposite-color);
}

@media screen and (max-width: 30rem) {
  .pregame-card h1 {
    font-size: 3rem;
  }
}
`, "",{"version":3,"sources":["webpack://./src/styles/pregame.css"],"names":[],"mappings":"AAAA;EACE,sCAAsC;EACtC,qCAAqC;EACrC,uCAAuC;EACvC,qBAAqB;EACrB,mCAAmC;EACnC,8BAA8B;AAChC;;AAEA;EACE,wCAAwC;;EAExC,aAAa;EACb,sBAAsB;EACtB,8BAA8B;;EAE9B,WAAW;EACX,oBAAoB;;EAEpB,6BAA6B;EAC7B,kCAAkC;EAClC,mBAAmB;EACnB,8DAA8D;;EAE9D,kBAAkB;EAClB,6BAA6B;;EAE7B,kBAAkB;AACpB;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;EACE,kBAAkB;;EAElB,cAAc;EACd,gCAAgC;EAChC,eAAe;EACf,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;EAClB,OAAO;;EAEP,cAAc;EACd,cAAc;AAChB;;AAEA;EACE,kBAAkB;;EAElB,WAAW;;EAEX,0CAA0C;EAC1C,wBAAwB;;EAExB,6BAA6B;;EAE7B,sBAAsB;EACtB,qBAAqB;;EAErB,YAAY;EACZ,6DAA6D;AAC/D;;AAEA;EACE,wCAAwC;EACxC,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,yCAAyC;AAC3C;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,mCAAmC;EACnC,SAAS;EACT,gBAAgB;EAChB,SAAS;EACT,OAAO;EACP,gBAAgB;AAClB;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;;EAEnB,8DAA2D;EAC3D,sEAAmE;;EAEnE,eAAe;EACf,uBAAuB;;EAEvB,kBAAkB;;EAElB,WAAW;EACX,YAAY;EACZ,iBAAiB;;EAEjB,cAAc;EACd,YAAY;EACZ,6BAA6B;;EAE7B,iBAAiB;AACnB;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,WAAW;;EAEX,SAAS;EACT,QAAQ;EACR,gCAAgC;EAChC,2BAA2B;;EAE3B,YAAY;EACZ,QAAQ;;EAER,mCAAmC;AACrC;;AAEA;;EAEE,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,0BAA0B;EAC1B,SAAS;;EAET,WAAW;;EAEX,gBAAgB;;EAEhB,6CAA6C;EAC7C,yBAAyB;EACzB,kBAAkB;EAClB,wBAAwB;;EAExB,2BAA2B;;EAE3B,UAAU;EACV,SAAS;AACX;;AAEA;;EAEE,iCAAiC;AACnC;;AAEA;EACE;IACE,eAAe;EACjB;AACF","sourcesContent":[":root {\n  --main-background: rgba(0, 0, 0, 0.75);\n  --transparent-shadow-color: #0000004d;\n  --transparent-low-grey-color: #ffffffa6;\n  --main-color: #ffffff;\n  --input-background-color: #00000033;\n  --main-opposite-color: #000000;\n}\n\n.pregame-card {\n  background-color: var(--main-background);\n\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n\n  width: 100%;\n  max-width: 28.125rem;\n\n  padding: min(calc(10%), 3rem);\n  border: 0.125rem solid transparent;\n  border-radius: 1rem;\n  box-shadow: 0 0 30px 0.0625rem var(--transparent-shadow-color);\n\n  text-align: center;\n  transition: border-color 0.5s;\n\n  aspect-ratio: 10/8;\n}\n\n.pregame-card:hover {\n  border: 0.125rem solid white;\n}\n\n.pregame-card h1 {\n  position: relative;\n\n  line-height: 1;\n  font-family: 'Anton', sans-serif;\n  font-size: 5rem;\n  letter-spacing: 0.1rem;\n}\n\n.pregame-card .name-form {\n  position: relative;\n  top: 5%;\n\n  margin: 0 auto;\n  max-width: 80%;\n}\n\n.name-form .name-input {\n  position: relative;\n\n  width: 100%;\n\n  font-size: min(calc(0.6rem + 0.6vw), 1rem);\n  color: var(--main-color);\n\n  background-color: transparent;\n\n  padding-inline: 0.5rem;\n  padding-block: 0.7rem;\n\n  border: none;\n  border-bottom: 0.1rem solid var(--transparent-low-grey-color);\n}\n\n.name-form .name-input::placeholder {\n  color: var(--transparent-low-grey-color);\n  text-align: center;\n}\n\n.name-form .name-input:is(:hover, :focus) {\n  outline: none;\n  background: var(--input-background-color);\n}\n\n.name-form .name-input:is(:hover, :focus)~.input-border {\n  width: 100%;\n}\n\n.name-form .input-border {\n  position: absolute;\n  background-color: var(--main-color);\n  width: 0%;\n  height: 0.125rem;\n  bottom: 0;\n  left: 0;\n  transition: 0.3s;\n}\n\n.play-now-button {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  mask: url('../assets/images/carrierX.svg') no-repeat center;\n  -webkit-mask: url('../assets/images/carrierX.svg') no-repeat center;\n\n  mask-size: 100%;\n  -webkit-mask-size: 100%;\n\n  position: relative;\n  \n  width: 100%;\n  min-width: 0;\n  aspect-ratio: 4/1;\n\n  margin: 0 auto;\n  border: none;\n  background-color: transparent;\n\n  cursor: crosshair;\n}\n\n.play-now-button::before {\n  content: '';\n  position: absolute;\n  z-index: -1;\n\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  transition: width 0.8s ease;\n  \n  height: 100%;\n  width: 0;\n  \n  background-color: var(--main-color);\n}\n\n.play-now-button:hover::before,\n.play-now-button:focus::before {\n  width: 100%;\n}\n\n.play-now-button .text-play-button {\n  position: absolute;\n  left: 50%;\n  transform: translate(-50%);\n  bottom: 0;\n\n  width: 100%;\n  \n  line-height: 2.5;\n  \n  font-size: min(calc(0.5rem + 0.5vw), 0.95rem);\n  letter-spacing: 0.1875rem;;\n  text-align: center;\n  color: var(--main-color);\n  \n  transition: color 0.8s ease;\n  \n  padding: 0;\n  margin: 0;\n}\n\n.play-now-button:hover .text-play-button,\n.play-now-button:focus .text-play-button {\n  color: var(--main-opposite-color);\n}\n\n@media screen and (max-width: 30rem) {\n  .pregame-card h1 {\n    font-size: 3rem;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/setup.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/setup.css ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --setup-max-width: 46.875rem;
  --font-size-normal-responsive: min(calc(0.5rem + 1vw), 1rem);
  --blue-light-color: #87ceeb;
}

.setup-wrapper {
  width: 100%;
}

.setup-wrapper>* {
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.75);
  max-width: var(--setup-max-width);
}

.message.setup {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  margin: 0 auto 0.5rem;
  padding: 1rem;
  font-size: var(--font-size-normal-responsive);
}

.message.setup .message-image {
  height: min(calc(1.25rem + 2vw), 2.75rem);
}

.message.setup .message-container {
  display: inline;
  text-align: start;
}

.message-container .message-captain {
  display: inline;
  color: var(--blue-light-color);
}

.message-container .typed-cursor {
  position: relative;
  left: 0.0625rem;
  bottom: -0.1875rem;

  display: inline-block;

  width: 0.5rem;
  height: 1rem;

  color: transparent;
  background-color: var(--blue-light-color);

  overflow: hidden;
}

.setup-container {
  margin: 0 auto;
  padding: 1rem;
}

.board-fleet-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

/* board styles are in the file board.css*/

.fleet-setup {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  border-radius: 0.5rem;
}

.ship-card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  position: relative;

  max-width: 9.375rem;
  min-width: 6.25rem;

  margin: calc(0.25rem + 0.5vw);
  padding: 0.25rem;
  border: 0.125rem solid white;
  border-radius: 0.5rem;

  color: #ffffff;
  background-color: #000000;
  box-shadow: 0 0 10px 0 #87ceeb;

  transition: all 0.05s linear, visibility 0.01s linear;
  filter: brightness(0.5);
}

.ship-card .ship-content .ship-image {
  height: min(calc(1rem + 1.5vw), 2rem);
  max-width: 100%;

  filter: invert(100%) sepia(8%) saturate(37%) hue-rotate(328deg) brightness(105%) contrast(100%);

  pointer-events: none;

  /*
  position: relative;
  z-index: 3;
  */
}

.ship-card .ship-content .ship-name {
  /*
  position: relative;
  z-index: 3;
  */

  font-size: 0.85rem;
}

.ship-card::before,
.ship-card::after {
  content: "";
  position: absolute;
  z-index: -1;

  background: rgb(0, 0, 0);
  transition: all 0.2s linear, visibility 0.01s linear;
}

.ship-card::before {
  width: calc(100% + 0.25rem);
  height: calc(100% - 1rem);

  top: 0.5rem;
  left: -0.125rem;
}

.ship-card::after {
  width: calc(100% - 1rem);
  height: calc(100% + 0.25rem);
  top: -0.125rem;
  left: 0.5rem;
}

.ship-card:hover::before,
.ship-card:focus::before {
  height: calc(100% - 2rem);
  top: 1rem;
}

.ship-card:hover::after,
.ship-card:focus::after {
  width: calc(100% - 2rem);
  left: 1rem;
}

.ship-card:active {
  transform: scale(0.95);
}

.ship-card:hover {
  cursor: grab;
}

.ship-card:focus {
  box-shadow: none;
  filter: brightness(1);
}

.ship-card:focus .ship-content {
  /*
  position: relative;
  z-index: 1;
  */
  pointer-events: none;
}

.ship-card:focus .ship-content .ship-image {
  /*
  position: relative;
  z-index: 2;
  */
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(8deg) brightness(100%) contrast(104%);
}

.ship-card.hidden {
  background-color: rgba(0, 0, 0, 0.75);

  box-shadow: none;

  pointer-events: none;

  opacity: 0.5;

  filter: brightness(0.5);
}

.ship-card.hidden::before,
.ship-card.hidden::after {
  background: transparent;
}

.ship-card.hidden .ship-content {
  visibility: hidden;
}

.ship-card[data-ship-name='carrier'] {
  order: 1;
}

.ship-card[data-ship-name='carrier'] img {
  aspect-ratio: 4/1;
}

.ship-card[data-ship-name='battleship'] {
  order: 2;
}

.ship-card[data-ship-name='battleship'] img {
  aspect-ratio: 4/1;
}

.ship-card[data-ship-name='cruiser'] {
  order: 3;
}

.ship-card[data-ship-name='cruiser'] img {
  aspect-ratio: 3/1;
}

.ship-card[data-ship-name='submarine'] {
  order: 4;
}

.ship-card[data-ship-name='submarine'] img {
  aspect-ratio: 3/1;
}

.ship-card[data-ship-name='destroyer'] {
  order: 5;
}

.ship-card[data-ship-name='destroyer'] img {
  aspect-ratio: 2/1;
}

.reset-continue-section {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: min(10%, 2rem);

  margin: 0.5rem auto 0;
  padding: 1rem;
}

button {
  outline: none;
}

button:focus,
.ship-card:focus {
  outline: 0.125rem solid #87ceeb;
  outline-offset: 0.125rem;
}

/* SHOW OUTLINE ON TABS ONLY */
button:focus:not(:focus-visible),
.ship-card:focus:not(:focus-visible) {
  outline: none;
}

.axis-button-container {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: min(10%, 2rem);
}

.axis-button,
.reset-button,
.continue-button {
  appearance: none;
  display: inline-block;

  min-width: 0;
  
  margin: 0;
  padding: 0.75rem 3rem;
  border: 0.0625rem solid #ffffff;

  font-size: min(calc(0.5rem + 1vw), 1rem);
  text-align: center;
  color: #ffffff;

  background-color: transparent;

  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  
  cursor: pointer;
}

.axis-button:hover,
.reset-button:hover,
.continue-button.enabled:hover
{
  box-shadow: 0 0.5rem 0.9375rem rgba(0, 0, 0, 0.25);
  transform: translateY(-0.125rem);
}

.axis-button:active,
.reset-button:active,
.continue-button.active:active,
.axis-button.selected {
  color: #000000;
  background-color: #ffffff;
}

.continue-button.disabled {
  border-color: #ffffffa6;
  color: #ffffffa6;
  pointer-events: all;
  cursor: not-allowed;
}

.continue-button.disabled:active {
  pointer-events: none;
  background-color: #cf404080;
}

@media screen and (max-width: 30rem) {
  .app.setup .setup-container .board-fleet-container {
    display: flex;
    flex-direction: column;
  }

  .board-fleet-container .fleet-setup {
    display: flex;
    flex-direction: row;
  }
}

@media screen and (max-width: 30rem) {
  .ship-card[data-ship-name='carrier'] {
    order: 5;
  }

  .ship-card[data-ship-name='battleship'] {
    order: 4;
  }

  .ship-card[data-ship-name='cruiser'] {
    order: 3;
  }

  .ship-card[data-ship-name='submarine'] {
    order: 2;
  }

  .ship-card[data-ship-name='destroyer'] {
    order: 1;
  }
}
`, "",{"version":3,"sources":["webpack://./src/styles/setup.css"],"names":[],"mappings":"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","sourcesContent":[":root {\n  --setup-max-width: 46.875rem;\n  --font-size-normal-responsive: min(calc(0.5rem + 1vw), 1rem);\n  --blue-light-color: #87ceeb;\n}\n\n.setup-wrapper {\n  width: 100%;\n}\n\n.setup-wrapper>* {\n  border-radius: 0.5rem;\n  background-color: rgba(0, 0, 0, 0.75);\n  max-width: var(--setup-max-width);\n}\n\n.message.setup {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 0.5rem;\n\n  margin: 0 auto 0.5rem;\n  padding: 1rem;\n  font-size: var(--font-size-normal-responsive);\n}\n\n.message.setup .message-image {\n  height: min(calc(1.25rem + 2vw), 2.75rem);\n}\n\n.message.setup .message-container {\n  display: inline;\n  text-align: start;\n}\n\n.message-container .message-captain {\n  display: inline;\n  color: var(--blue-light-color);\n}\n\n.message-container .typed-cursor {\n  position: relative;\n  left: 0.0625rem;\n  bottom: -0.1875rem;\n\n  display: inline-block;\n\n  width: 0.5rem;\n  height: 1rem;\n\n  color: transparent;\n  background-color: var(--blue-light-color);\n\n  overflow: hidden;\n}\n\n.setup-container {\n  margin: 0 auto;\n  padding: 1rem;\n}\n\n.board-fleet-container {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 0.5rem;\n}\n\n/* board styles are in the file board.css*/\n\n.fleet-setup {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: column;\n  justify-content: center;\n  border-radius: 0.5rem;\n}\n\n.ship-card {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex: 1;\n\n  position: relative;\n\n  max-width: 9.375rem;\n  min-width: 6.25rem;\n\n  margin: calc(0.25rem + 0.5vw);\n  padding: 0.25rem;\n  border: 0.125rem solid white;\n  border-radius: 0.5rem;\n\n  color: #ffffff;\n  background-color: #000000;\n  box-shadow: 0 0 10px 0 #87ceeb;\n\n  transition: all 0.05s linear, visibility 0.01s linear;\n  filter: brightness(0.5);\n}\n\n.ship-card .ship-content .ship-image {\n  height: min(calc(1rem + 1.5vw), 2rem);\n  max-width: 100%;\n\n  filter: invert(100%) sepia(8%) saturate(37%) hue-rotate(328deg) brightness(105%) contrast(100%);\n\n  pointer-events: none;\n\n  /*\n  position: relative;\n  z-index: 3;\n  */\n}\n\n.ship-card .ship-content .ship-name {\n  /*\n  position: relative;\n  z-index: 3;\n  */\n\n  font-size: 0.85rem;\n}\n\n.ship-card::before,\n.ship-card::after {\n  content: \"\";\n  position: absolute;\n  z-index: -1;\n\n  background: rgb(0, 0, 0);\n  transition: all 0.2s linear, visibility 0.01s linear;\n}\n\n.ship-card::before {\n  width: calc(100% + 0.25rem);\n  height: calc(100% - 1rem);\n\n  top: 0.5rem;\n  left: -0.125rem;\n}\n\n.ship-card::after {\n  width: calc(100% - 1rem);\n  height: calc(100% + 0.25rem);\n  top: -0.125rem;\n  left: 0.5rem;\n}\n\n.ship-card:hover::before,\n.ship-card:focus::before {\n  height: calc(100% - 2rem);\n  top: 1rem;\n}\n\n.ship-card:hover::after,\n.ship-card:focus::after {\n  width: calc(100% - 2rem);\n  left: 1rem;\n}\n\n.ship-card:active {\n  transform: scale(0.95);\n}\n\n.ship-card:hover {\n  cursor: grab;\n}\n\n.ship-card:focus {\n  box-shadow: none;\n  filter: brightness(1);\n}\n\n.ship-card:focus .ship-content {\n  /*\n  position: relative;\n  z-index: 1;\n  */\n  pointer-events: none;\n}\n\n.ship-card:focus .ship-content .ship-image {\n  /*\n  position: relative;\n  z-index: 2;\n  */\n  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(8deg) brightness(100%) contrast(104%);\n}\n\n.ship-card.hidden {\n  background-color: rgba(0, 0, 0, 0.75);\n\n  box-shadow: none;\n\n  pointer-events: none;\n\n  opacity: 0.5;\n\n  filter: brightness(0.5);\n}\n\n.ship-card.hidden::before,\n.ship-card.hidden::after {\n  background: transparent;\n}\n\n.ship-card.hidden .ship-content {\n  visibility: hidden;\n}\n\n.ship-card[data-ship-name='carrier'] {\n  order: 1;\n}\n\n.ship-card[data-ship-name='carrier'] img {\n  aspect-ratio: 4/1;\n}\n\n.ship-card[data-ship-name='battleship'] {\n  order: 2;\n}\n\n.ship-card[data-ship-name='battleship'] img {\n  aspect-ratio: 4/1;\n}\n\n.ship-card[data-ship-name='cruiser'] {\n  order: 3;\n}\n\n.ship-card[data-ship-name='cruiser'] img {\n  aspect-ratio: 3/1;\n}\n\n.ship-card[data-ship-name='submarine'] {\n  order: 4;\n}\n\n.ship-card[data-ship-name='submarine'] img {\n  aspect-ratio: 3/1;\n}\n\n.ship-card[data-ship-name='destroyer'] {\n  order: 5;\n}\n\n.ship-card[data-ship-name='destroyer'] img {\n  aspect-ratio: 2/1;\n}\n\n.reset-continue-section {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  gap: min(10%, 2rem);\n\n  margin: 0.5rem auto 0;\n  padding: 1rem;\n}\n\nbutton {\n  outline: none;\n}\n\nbutton:focus,\n.ship-card:focus {\n  outline: 0.125rem solid #87ceeb;\n  outline-offset: 0.125rem;\n}\n\n/* SHOW OUTLINE ON TABS ONLY */\nbutton:focus:not(:focus-visible),\n.ship-card:focus:not(:focus-visible) {\n  outline: none;\n}\n\n.axis-button-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  gap: min(10%, 2rem);\n}\n\n.axis-button,\n.reset-button,\n.continue-button {\n  appearance: none;\n  display: inline-block;\n\n  min-width: 0;\n  \n  margin: 0;\n  padding: 0.75rem 3rem;\n  border: 0.0625rem solid #ffffff;\n\n  font-size: min(calc(0.5rem + 1vw), 1rem);\n  text-align: center;\n  color: #ffffff;\n\n  background-color: transparent;\n\n  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);\n  \n  cursor: pointer;\n}\n\n.axis-button:hover,\n.reset-button:hover,\n.continue-button.enabled:hover\n{\n  box-shadow: 0 0.5rem 0.9375rem rgba(0, 0, 0, 0.25);\n  transform: translateY(-0.125rem);\n}\n\n.axis-button:active,\n.reset-button:active,\n.continue-button.active:active,\n.axis-button.selected {\n  color: #000000;\n  background-color: #ffffff;\n}\n\n.continue-button.disabled {\n  border-color: #ffffffa6;\n  color: #ffffffa6;\n  pointer-events: all;\n  cursor: not-allowed;\n}\n\n.continue-button.disabled:active {\n  pointer-events: none;\n  background-color: #cf404080;\n}\n\n@media screen and (max-width: 30rem) {\n  .app.setup .setup-container .board-fleet-container {\n    display: flex;\n    flex-direction: column;\n  }\n\n  .board-fleet-container .fleet-setup {\n    display: flex;\n    flex-direction: row;\n  }\n}\n\n@media screen and (max-width: 30rem) {\n  .ship-card[data-ship-name='carrier'] {\n    order: 5;\n  }\n\n  .ship-card[data-ship-name='battleship'] {\n    order: 4;\n  }\n\n  .ship-card[data-ship-name='cruiser'] {\n    order: 3;\n  }\n\n  .ship-card[data-ship-name='submarine'] {\n    order: 2;\n  }\n\n  .ship-card[data-ship-name='destroyer'] {\n    order: 1;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/winnerModal.css":
/*!**************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/winnerModal.css ***!
  \**************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.win-modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);

  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;

  width: min(30rem, 80%);
  aspect-ratio: 1 / 1;

  padding: 2rem;

  border-radius: 2rem;

  transform-origin: top left;
  animation: pop 0.5s 1 forwards;
}

.win-modal-container.player {
  box-shadow: 0 0 2rem #87ceeb;
}

.win-modal-container.enemy {
  box-shadow: 0 0 2rem #f3a640;
}

.win-modal-container .title-captain-win,
.win-modal-container .title-enemy-win {
  font-size: 2rem;
  font-style: italic;
  font-weight: 400;
  text-align: center;
}

.win-modal-container .title-captain-win {
  color: #87ceeb;
}

.win-modal-container .title-enemy-win {
  color: #f3a640;
}

.win-modal-container .message.battle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.win-modal-container .message.battle.enemy-win,
.win-modal-container .message.battle.captain-win {
  max-width: 18rem;
}

.win-modal-container .message.battle.enemy-win img,
.win-modal-container .message.battle.captain-win img {
  height: 3rem;
}

.win-modal-container .message.battle.enemy-win .typed-cursor,
.win-modal-container .message.battle.captain-win .typed-cursor {
  display: inline-block;

  position: relative;
}

.win-modal-container .message.battle .message-container {
  text-align: center;
}

.win-modal-container  .message-container .message-captain-win,
.win-modal-container  .message-container .message-enemy-win {
  display: inline;
  width: 100%;
  font-size: min(calc(0.5rem + 1vw), 1.125rem);
}

.win-modal-container .message.battle .message-container .message-captain-win {
  color: #87ceeb;
}

.win-modal-container .message.battle .message-container .message-enemy-win {
  color: #f3a640;
}

.win-modal-container .message.battle .message-container .message-captain-win+.typed-cursor {
  color: #87ceeb;
}

.win-modal-container .message.battle .message-container .message-enemy-win+.typed-cursor {
  color: #f3a640;
}

.win-overlay {
  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.75);

  position: absolute;
  z-index: 5;

  animation: opacityShow 0.5s 1 forwards;
}

@keyframes pop {
  0% {
    opacity: 0.25;
    transform: scale(0) translate(-50%, -50%);
  }

  80% {
    opacity: 1;
    transform: scale(1.1) translate(-50%, -50%);
  }

  100% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%);
  }
}

@keyframes opacityShow {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

button {
  outline: none;
}

button:focus {
  outline: 0.125rem solid #87ceeb;
  outline-offset: 0.125rem;
}

button:focus:not(:focus-visible) {
  outline: none;
}

.enemy-win + .new-game-button:focus {
  outline-color: #f3a640;
}

.new-game-button {
  appearance: none;
  display: inline-block;

  min-width: 0;
  margin: 0;
  padding: 0.75rem 3rem;
  border: 0.0625rem solid #ffffff;
  border-radius: 0.5rem;

  font-size: min(calc(0.5rem + 1vw), 1rem);
  text-align: center;
  color: #ffffff;

  background-color: transparent;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

.new-game-button:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0 0.5rem 0.9375rem;
  transform: translateY(-0.125rem);
}

.new-game-button:active {
  color: #000000;
  background-color: #ffffff;
}
`, "",{"version":3,"sources":["webpack://./src/styles/winnerModal.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;EACnB,SAAS;;EAET,qCAAqC;EACrC,2BAA2B;;EAE3B,kBAAkB;EAClB,WAAW;EACX,QAAQ;EACR,SAAS;;EAET,sBAAsB;EACtB,mBAAmB;;EAEnB,aAAa;;EAEb,mBAAmB;;EAEnB,0BAA0B;EAC1B,8BAA8B;AAChC;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;;EAEE,eAAe;EACf,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;AACrB;;AAEA;;EAEE,gBAAgB;AAClB;;AAEA;;EAEE,YAAY;AACd;;AAEA;;EAEE,qBAAqB;;EAErB,kBAAkB;AACpB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;;EAEE,eAAe;EACf,WAAW;EACX,4CAA4C;AAC9C;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,WAAW;EACX,YAAY;;EAEZ,qCAAqC;;EAErC,kBAAkB;EAClB,UAAU;;EAEV,sCAAsC;AACxC;;AAEA;EACE;IACE,aAAa;IACb,yCAAyC;EAC3C;;EAEA;IACE,UAAU;IACV,2CAA2C;EAC7C;;EAEA;IACE,UAAU;IACV,yCAAyC;EAC3C;AACF;;AAEA;EACE;IACE,UAAU;EACZ;;EAEA;IACE,UAAU;EACZ;AACF;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,+BAA+B;EAC/B,wBAAwB;AAC1B;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;EAChB,qBAAqB;;EAErB,YAAY;EACZ,SAAS;EACT,qBAAqB;EACrB,+BAA+B;EAC/B,qBAAqB;;EAErB,wCAAwC;EACxC,kBAAkB;EAClB,cAAc;;EAEd,6BAA6B;EAC7B,oDAAoD;EACpD,eAAe;AACjB;;AAEA;EACE,kDAAkD;EAClD,gCAAgC;AAClC;;AAEA;EACE,cAAc;EACd,yBAAyB;AAC3B","sourcesContent":[".win-modal-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n\n  background-color: rgba(0, 0, 0, 0.75);\n  backdrop-filter: blur(10px);\n\n  position: absolute;\n  z-index: 10;\n  top: 50%;\n  left: 50%;\n\n  width: min(30rem, 80%);\n  aspect-ratio: 1 / 1;\n\n  padding: 2rem;\n\n  border-radius: 2rem;\n\n  transform-origin: top left;\n  animation: pop 0.5s 1 forwards;\n}\n\n.win-modal-container.player {\n  box-shadow: 0 0 2rem #87ceeb;\n}\n\n.win-modal-container.enemy {\n  box-shadow: 0 0 2rem #f3a640;\n}\n\n.win-modal-container .title-captain-win,\n.win-modal-container .title-enemy-win {\n  font-size: 2rem;\n  font-style: italic;\n  font-weight: 400;\n  text-align: center;\n}\n\n.win-modal-container .title-captain-win {\n  color: #87ceeb;\n}\n\n.win-modal-container .title-enemy-win {\n  color: #f3a640;\n}\n\n.win-modal-container .message.battle {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.win-modal-container .message.battle.enemy-win,\n.win-modal-container .message.battle.captain-win {\n  max-width: 18rem;\n}\n\n.win-modal-container .message.battle.enemy-win img,\n.win-modal-container .message.battle.captain-win img {\n  height: 3rem;\n}\n\n.win-modal-container .message.battle.enemy-win .typed-cursor,\n.win-modal-container .message.battle.captain-win .typed-cursor {\n  display: inline-block;\n\n  position: relative;\n}\n\n.win-modal-container .message.battle .message-container {\n  text-align: center;\n}\n\n.win-modal-container  .message-container .message-captain-win,\n.win-modal-container  .message-container .message-enemy-win {\n  display: inline;\n  width: 100%;\n  font-size: min(calc(0.5rem + 1vw), 1.125rem);\n}\n\n.win-modal-container .message.battle .message-container .message-captain-win {\n  color: #87ceeb;\n}\n\n.win-modal-container .message.battle .message-container .message-enemy-win {\n  color: #f3a640;\n}\n\n.win-modal-container .message.battle .message-container .message-captain-win+.typed-cursor {\n  color: #87ceeb;\n}\n\n.win-modal-container .message.battle .message-container .message-enemy-win+.typed-cursor {\n  color: #f3a640;\n}\n\n.win-overlay {\n  width: 100%;\n  height: 100%;\n\n  background-color: rgba(0, 0, 0, 0.75);\n\n  position: absolute;\n  z-index: 5;\n\n  animation: opacityShow 0.5s 1 forwards;\n}\n\n@keyframes pop {\n  0% {\n    opacity: 0.25;\n    transform: scale(0) translate(-50%, -50%);\n  }\n\n  80% {\n    opacity: 1;\n    transform: scale(1.1) translate(-50%, -50%);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale(1) translate(-50%, -50%);\n  }\n}\n\n@keyframes opacityShow {\n  0% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\nbutton {\n  outline: none;\n}\n\nbutton:focus {\n  outline: 0.125rem solid #87ceeb;\n  outline-offset: 0.125rem;\n}\n\nbutton:focus:not(:focus-visible) {\n  outline: none;\n}\n\n.enemy-win + .new-game-button:focus {\n  outline-color: #f3a640;\n}\n\n.new-game-button {\n  appearance: none;\n  display: inline-block;\n\n  min-width: 0;\n  margin: 0;\n  padding: 0.75rem 3rem;\n  border: 0.0625rem solid #ffffff;\n  border-radius: 0.5rem;\n\n  font-size: min(calc(0.5rem + 1vw), 1rem);\n  text-align: center;\n  color: #ffffff;\n\n  background-color: transparent;\n  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);\n  cursor: pointer;\n}\n\n.new-game-button:hover {\n  box-shadow: rgba(0, 0, 0, 0.25) 0 0.5rem 0.9375rem;\n  transform: translateY(-0.125rem);\n}\n\n.new-game-button:active {\n  color: #000000;\n  background-color: #ffffff;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/battle.css":
/*!*******************************!*\
  !*** ./src/styles/battle.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_battle_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./battle.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/battle.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_battle_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_battle_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_battle_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_battle_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/board.css":
/*!******************************!*\
  !*** ./src/styles/board.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_board_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./board.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/board.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_board_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_board_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_board_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_board_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/pregame.css":
/*!********************************!*\
  !*** ./src/styles/pregame.css ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_pregame_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./pregame.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/pregame.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_pregame_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_pregame_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_pregame_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_pregame_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/setup.css":
/*!******************************!*\
  !*** ./src/styles/setup.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_setup_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./setup.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/setup.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_setup_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_setup_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_setup_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_setup_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/winnerModal.css":
/*!************************************!*\
  !*** ./src/styles/winnerModal.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_winnerModal_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./winnerModal.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/winnerModal.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_winnerModal_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_winnerModal_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_winnerModal_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_winnerModal_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/images/backgound.jpg":
/*!*****************************************!*\
  !*** ./src/assets/images/backgound.jpg ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "019ae1bd6003be09a755.jpg";

/***/ }),

/***/ "./src/assets/images/battleshipX.svg":
/*!*******************************************!*\
  !*** ./src/assets/images/battleshipX.svg ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "d56e5a89beb359219e25.svg";

/***/ }),

/***/ "./src/assets/images/captain.png":
/*!***************************************!*\
  !*** ./src/assets/images/captain.png ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "751fb6c8ea1eaa715977.png";

/***/ }),

/***/ "./src/assets/images/carrierX.svg":
/*!****************************************!*\
  !*** ./src/assets/images/carrierX.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "008846a84b2a34dde315.svg";

/***/ }),

/***/ "./src/assets/images/cross.svg":
/*!*************************************!*\
  !*** ./src/assets/images/cross.svg ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "640f2e18a69b8f2bf893.svg";

/***/ }),

/***/ "./src/assets/images/cruiserX.svg":
/*!****************************************!*\
  !*** ./src/assets/images/cruiserX.svg ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "0504ee6feab7e47038d3.svg";

/***/ }),

/***/ "./src/assets/images/destroyerX.svg":
/*!******************************************!*\
  !*** ./src/assets/images/destroyerX.svg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "56e5c8a88ff718d93efc.svg";

/***/ }),

/***/ "./src/assets/images/enemy.png":
/*!*************************************!*\
  !*** ./src/assets/images/enemy.png ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "81d9a6bfc789803c5d23.png";

/***/ }),

/***/ "./src/assets/images/grid.svg":
/*!************************************!*\
  !*** ./src/assets/images/grid.svg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "cc5276b8bdcda775337c.svg";

/***/ }),

/***/ "./src/assets/images/submarineX.svg":
/*!******************************************!*\
  !*** ./src/assets/images/submarineX.svg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "543bf6eb30d63dfd7a2f.svg";

/***/ }),

/***/ "./node_modules/typed.js/dist/typed.module.js":
/*!****************************************************!*\
  !*** ./node_modules/typed.js/dist/typed.module.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ i)
/* harmony export */ });
function t(){return t=Object.assign?Object.assign.bind():function(t){for(var s=1;s<arguments.length;s++){var e=arguments[s];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t},t.apply(this,arguments)}var s={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:Infinity,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(t){},onComplete:function(t){},preStringTyped:function(t,s){},onStringTyped:function(t,s){},onLastStringBackspaced:function(t){},onTypingPaused:function(t,s){},onTypingResumed:function(t,s){},onReset:function(t){},onStop:function(t,s){},onStart:function(t,s){},onDestroy:function(t){}},e=new(/*#__PURE__*/function(){function e(){}var n=e.prototype;return n.load=function(e,n,i){if(e.el="string"==typeof i?document.querySelector(i):i,e.options=t({},s,n),e.isInput="input"===e.el.tagName.toLowerCase(),e.attr=e.options.attr,e.bindInputFocusEvents=e.options.bindInputFocusEvents,e.showCursor=!e.isInput&&e.options.showCursor,e.cursorChar=e.options.cursorChar,e.cursorBlinking=!0,e.elContent=e.attr?e.el.getAttribute(e.attr):e.el.textContent,e.contentType=e.options.contentType,e.typeSpeed=e.options.typeSpeed,e.startDelay=e.options.startDelay,e.backSpeed=e.options.backSpeed,e.smartBackspace=e.options.smartBackspace,e.backDelay=e.options.backDelay,e.fadeOut=e.options.fadeOut,e.fadeOutClass=e.options.fadeOutClass,e.fadeOutDelay=e.options.fadeOutDelay,e.isPaused=!1,e.strings=e.options.strings.map(function(t){return t.trim()}),e.stringsElement="string"==typeof e.options.stringsElement?document.querySelector(e.options.stringsElement):e.options.stringsElement,e.stringsElement){e.strings=[],e.stringsElement.style.cssText="clip: rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;";var r=Array.prototype.slice.apply(e.stringsElement.children),o=r.length;if(o)for(var a=0;a<o;a+=1)e.strings.push(r[a].innerHTML.trim())}for(var u in e.strPos=0,e.currentElContent=this.getCurrentElContent(e),e.currentElContent&&e.currentElContent.length>0&&(e.strPos=e.currentElContent.length-1,e.strings.unshift(e.currentElContent)),e.sequence=[],e.strings)e.sequence[u]=u;e.arrayPos=0,e.stopNum=0,e.loop=e.options.loop,e.loopCount=e.options.loopCount,e.curLoop=0,e.shuffle=e.options.shuffle,e.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},e.typingComplete=!1,e.autoInsertCss=e.options.autoInsertCss,e.autoInsertCss&&(this.appendCursorAnimationCss(e),this.appendFadeOutAnimationCss(e))},n.getCurrentElContent=function(t){return t.attr?t.el.getAttribute(t.attr):t.isInput?t.el.value:"html"===t.contentType?t.el.innerHTML:t.el.textContent},n.appendCursorAnimationCss=function(t){var s="data-typed-js-cursor-css";if(t.showCursor&&!document.querySelector("["+s+"]")){var e=document.createElement("style");e.setAttribute(s,"true"),e.innerHTML="\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ",document.body.appendChild(e)}},n.appendFadeOutAnimationCss=function(t){var s="data-typed-fadeout-js-css";if(t.fadeOut&&!document.querySelector("["+s+"]")){var e=document.createElement("style");e.setAttribute(s,"true"),e.innerHTML="\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ",document.body.appendChild(e)}},e}()),n=new(/*#__PURE__*/function(){function t(){}var s=t.prototype;return s.typeHtmlChars=function(t,s,e){if("html"!==e.contentType)return s;var n=t.substring(s).charAt(0);if("<"===n||"&"===n){var i;for(i="<"===n?">":";";t.substring(s+1).charAt(0)!==i&&!(1+ ++s>t.length););s++}return s},s.backSpaceHtmlChars=function(t,s,e){if("html"!==e.contentType)return s;var n=t.substring(s).charAt(0);if(">"===n||";"===n){var i;for(i=">"===n?"<":"&";t.substring(s-1).charAt(0)!==i&&!(--s<0););s--}return s},t}()),i=/*#__PURE__*/function(){function t(t,s){e.load(this,s,t),this.begin()}var s=t.prototype;return s.toggle=function(){this.pause.status?this.start():this.stop()},s.stop=function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this))},s.start=function(){this.typingComplete||this.pause.status&&(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this))},s.destroy=function(){this.reset(!1),this.options.onDestroy(this)},s.reset=function(t){void 0===t&&(t=!0),clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,t&&(this.insertCursor(),this.options.onReset(this),this.begin())},s.begin=function(){var t=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){0===t.strPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos):t.backspace(t.strings[t.sequence[t.arrayPos]],t.strPos)},this.startDelay)},s.typewrite=function(t,s){var e=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var i=this.humanizer(this.typeSpeed),r=1;!0!==this.pause.status?this.timeout=setTimeout(function(){s=n.typeHtmlChars(t,s,e);var i=0,o=t.substring(s);if("^"===o.charAt(0)&&/^\^\d+/.test(o)){var a=1;a+=(o=/\d+/.exec(o)[0]).length,i=parseInt(o),e.temporaryPause=!0,e.options.onTypingPaused(e.arrayPos,e),t=t.substring(0,s)+t.substring(s+a),e.toggleBlinking(!0)}if("`"===o.charAt(0)){for(;"`"!==t.substring(s+r).charAt(0)&&(r++,!(s+r>t.length)););var u=t.substring(0,s),p=t.substring(u.length+1,s+r),c=t.substring(s+r+1);t=u+p+c,r--}e.timeout=setTimeout(function(){e.toggleBlinking(!1),s>=t.length?e.doneTyping(t,s):e.keepTyping(t,s,r),e.temporaryPause&&(e.temporaryPause=!1,e.options.onTypingResumed(e.arrayPos,e))},i)},i):this.setPauseStatus(t,s,!0)},s.keepTyping=function(t,s,e){0===s&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this));var n=t.substring(0,s+=e);this.replaceText(n),this.typewrite(t,s)},s.doneTyping=function(t,s){var e=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),this.arrayPos===this.strings.length-1&&(this.complete(),!1===this.loop||this.curLoop===this.loopCount)||(this.timeout=setTimeout(function(){e.backspace(t,s)},this.backDelay))},s.backspace=function(t,s){var e=this;if(!0!==this.pause.status){if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var i=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){s=n.backSpaceHtmlChars(t,s,e);var i=t.substring(0,s);if(e.replaceText(i),e.smartBackspace){var r=e.strings[e.arrayPos+1];e.stopNum=r&&i===r.substring(0,s)?s:0}s>e.stopNum?(s--,e.backspace(t,s)):s<=e.stopNum&&(e.arrayPos++,e.arrayPos===e.strings.length?(e.arrayPos=0,e.options.onLastStringBackspaced(),e.shuffleStringsIfNeeded(),e.begin()):e.typewrite(e.strings[e.sequence[e.arrayPos]],s))},i)}else this.setPauseStatus(t,s,!1)},s.complete=function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0},s.setPauseStatus=function(t,s,e){this.pause.typewrite=e,this.pause.curString=t,this.pause.curStrPos=s},s.toggleBlinking=function(t){this.cursor&&(this.pause.status||this.cursorBlinking!==t&&(this.cursorBlinking=t,t?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink")))},s.humanizer=function(t){return Math.round(Math.random()*t/2)+t},s.shuffleStringsIfNeeded=function(){this.shuffle&&(this.sequence=this.sequence.sort(function(){return Math.random()-.5}))},s.initFadeOut=function(){var t=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){t.arrayPos++,t.replaceText(""),t.strings.length>t.arrayPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],0):(t.typewrite(t.strings[0],0),t.arrayPos=0)},this.fadeOutDelay)},s.replaceText=function(t){this.attr?this.el.setAttribute(this.attr,t):this.isInput?this.el.value=t:"html"===this.contentType?this.el.innerHTML=t:this.el.textContent=t},s.bindFocusEvents=function(){var t=this;this.isInput&&(this.el.addEventListener("focus",function(s){t.stop()}),this.el.addEventListener("blur",function(s){t.el.value&&0!==t.el.value.length||t.start()}))},s.insertCursor=function(){this.showCursor&&(this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling)))},t}();
//# sourceMappingURL=typed.module.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/main.css */ "./src/styles/main.css");
/* harmony import */ var _styles_pregame_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/pregame.css */ "./src/styles/pregame.css");
/* harmony import */ var _styles_setup_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/setup.css */ "./src/styles/setup.css");
/* harmony import */ var _styles_board_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/board.css */ "./src/styles/board.css");
/* harmony import */ var _styles_battle_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/battle.css */ "./src/styles/battle.css");
/* harmony import */ var _styles_winnerModal_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./styles/winnerModal.css */ "./src/styles/winnerModal.css");
/* harmony import */ var _dom_view__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom/view */ "./src/dom/view.js");







_dom_view__WEBPACK_IMPORTED_MODULE_6__["default"].loadContent();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sd0ZBQXdGLFdBQVcsVUFBVSxZQUFZLGFBQWEsWUFBWSxVQUFVLFlBQVksT0FBTyxNQUFNLFlBQVksV0FBVyxNQUFNLE1BQU0sVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxTQUFTLE9BQU8sT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxhQUFhLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLGFBQWEsV0FBVyxXQUFXLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGNBQWMsYUFBYSxZQUFZLFlBQVksV0FBVyxVQUFVLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsT0FBTyxNQUFNLFVBQVUsT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sVUFBVSxPQUFPLE1BQU0sWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksWUFBWSxVQUFVLFdBQVcsV0FBVyxZQUFZLFdBQVcsT0FBTyxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxZQUFZLFVBQVUsV0FBVyxXQUFXLFlBQVksV0FBVyxPQUFPLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE1BQU0sT0FBTyxLQUFLLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxZQUFZLFdBQVcsTUFBTSxLQUFLLFlBQVksV0FBVyxLQUFLLE1BQU0sS0FBSyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE1BQU0sTUFBTSxLQUFLLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLE1BQU0sS0FBSyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxLQUFLLE1BQU0sS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFVBQVUsTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsTUFBTSxNQUFNLEtBQUssS0FBSyxVQUFVLE1BQU0sS0FB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O0FBRUEsb0JBQW9CLG1DQUFtQzs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sdUZBQXVGLFdBQVcsVUFBVSxZQUFZLGNBQWMsYUFBYSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLE9BQU8sS0FBSyxXQUFXLFlBQVksWUFBWSxhQUFhLFdBQVcsWUFBWSxjQUFjLGFBQWEsY0FBYyxTQUFTLE9BQU8sYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFlBQVksWUFBWSxjQUFjLGNBQWMsY0FBYyxXQUFXLFVBQVUsWUFBWSxjQUFjLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLFlBQVksVUFBVSxXQUFXLFlBQVks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QUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sdUZBQXVGLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsWUFBWSxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxhQUFhLGNBQWMsV0FBVyxXQUFXLFlBQVksY0FBYyxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksT0FBTyxhQUFhLE1BQU0sVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxZQUFZLGFBQWEsYUFBYSxjQUFjLGFBQWEsYUFBYSxhQUFhLGNBQWMsV0FBVyxZQUFZLGNBQWMsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLFlBQVksYUFBYSxjQUFjLFFBQVEsS0FBSyxNQUFNLEtBQUssT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFVBQVUsWUFBWSxZQUFZLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxjQUFjLFdBQVcsVUFBVSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsVUFBVSxNQUFNLE1BQU0sWUFBWSxXQUFXLE1BQU0sTUFBTSxZQUFZLFdBQVcsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxhQUFhLGNBQWMsY0FBYyxZQUFZLFlBQVksT0FBTyxNQUFNLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFlB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Q0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sNkZBQTZGLFVBQVUsWUFBWSxhQUFhLGFBQWEsWUFBWSxZQUFZLGNBQWMsYUFBYSxXQUFXLFVBQVUsV0FBVyxZQUFZLGNBQWMsWUFBWSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxNQUFNLFlBQVksT0FBTyxNQUFNLFVBQVUsTUFBTSxNQUFNLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLE1BQU0sVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsV0FBVyxhQUFhLGFBQWEsWUFBWSxZQUFZLE9BQU8sS0FBSyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksTUFBTSxNQUFNLEtB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QUFDRjtBQUNBO0FBQ0M7QUFDSTtBQUVIO0FBRTlCeVQsaURBQUksQ0FBQ0MsV0FBVyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9kb20vYmF0dGxlLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9kb20vZHJhZ0Ryb3AuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL2RvbS9mbGVldC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvZG9tL2hlbHBlci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvZG9tL3ByZWdhbWUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL2RvbS9yZXVzYWJsZUNvbXBvbmVudHMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL2RvbS9zZXR1cC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvZG9tL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL2xvZ2ljL2dhbWUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL2xvZ2ljL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvbG9naWMvcGxheWVyLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9sb2dpYy9zaGlwLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy91dGlscy9tZXNzYWdlLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvYmF0dGxlLmNzcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvc3R5bGVzL2JvYXJkLmNzcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvc3R5bGVzL21haW4uY3NzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvcHJlZ2FtZS5jc3MiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy9zZXR1cC5jc3MiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy93aW5uZXJNb2RhbC5jc3MiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvYmF0dGxlLmNzcz8zOGQyIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvYm9hcmQuY3NzP2E2MWUiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy9tYWluLmNzcz9lODBhIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvcHJlZ2FtZS5jc3M/Y2UyZCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvc3R5bGVzL3NldHVwLmNzcz83NTkyIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvd2lubmVyTW9kYWwuY3NzP2E4ZWEiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvdHlwZWQuanMvZGlzdC90eXBlZC5tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2xvZ2ljL2dhbWVcIjtcblxuaW1wb3J0IGhlbHBlciBmcm9tIFwiLi9oZWxwZXJcIjtcblxuaW1wb3J0IGZsZWV0IGZyb20gXCIuL2ZsZWV0XCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCIuL3JldXNhYmxlQ29tcG9uZW50c1wiO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSBcIi4uL3V0aWxzL21lc3NhZ2VcIjtcblxuZnVuY3Rpb24gQmF0dGxlKCkge1xuICBmdW5jdGlvbiBsb2FkQmF0dGxlQ29udGVudCgpIHtcbiAgICBoZWxwZXIuZGVsZXRlQXBwQ29udGVudCgpO1xuXG4gICAgY29uc3QgYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIik7XG4gICAgYXBwLmNsYXNzTGlzdC5yZXBsYWNlKFwic2V0dXBcIiwgXCJiYXR0bGVcIik7XG5cbiAgICBhcHAuYXBwZW5kQ2hpbGQoY3JlYXRlQmF0dGxlV3JhcHBlcigpKTtcbiAgICBkaXNwbGF5UGxheWVyU2hpcHMoKTtcbiAgICBHYW1lLmdldEdhbWUoKS5hdXRvUGxhY2VDb21wdXRlclBsYXllcigpO1xuXG4gICAgZGlzcGxheUJhdHRsZVN0YXJ0TWVzc2FnZShcImNhcHRhaW5cIik7XG4gICAgZGlzcGxheUJhdHRsZVN0YXJ0TWVzc2FnZShcImVuZW15XCIpO1xuXG4gICAgaW5pdEJvYXJkRmllbGRzKCk7XG5cbiAgICBzdHlsZU9uVHVybihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2UuYmF0dGxlLmNhcHRhaW5cIikpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZnVuY3Rpb24gY3JlYXRlQmF0dGxlV3JhcHBlcigpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gaGVscGVyLmNyZWF0ZShcImRpdlwiLCB7XG4gICAgICBjbGFzc05hbWU6IFwiYmF0dGxlLXdyYXBwZXJcIixcbiAgICB9KTtcblxuICAgIGhlbHBlci5hcHBlbmRBbGwod3JhcHBlciwgW1xuICAgICAgY3JlYXRlUGxheWVyTWFwKCksXG4gICAgICBjcmVhdGVDb21wdXRlck1hcCgpLFxuICAgICAgQ29tcG9uZW50LmNyZWF0ZU1lc3NhZ2VTZWN0aW9uKFtcImJhdHRsZVwiLCBcImNhcHRhaW5cIl0pLFxuICAgICAgQ29tcG9uZW50LmNyZWF0ZU1lc3NhZ2VTZWN0aW9uKFtcImJhdHRsZVwiLCBcImVuZW15XCJdKSxcbiAgICBdKTtcblxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGxheWVyTWFwKCkge1xuICAgIGNvbnN0IG1hcCA9IGhlbHBlci5jcmVhdGVNYXAoXCJwbGF5ZXJcIik7XG5cbiAgICBtYXAuYXBwZW5kQ2hpbGQoY3JlYXRlTWFwVGl0bGUoXCJQTEFZRVIgV0FURVJTIVwiKSk7XG5cbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZXJNYXAoKSB7XG4gICAgY29uc3QgbWFwID0gaGVscGVyLmNyZWF0ZU1hcChcImNvbXB1dGVyXCIpO1xuXG4gICAgbWFwLmFwcGVuZENoaWxkKGNyZWF0ZU1hcFRpdGxlKFwiRU5FTVkgV0FURVJTIVwiKSk7XG5cbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTWFwVGl0bGUodGV4dCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGhlbHBlci5jcmVhdGUoXCJkaXZcIiwge1xuICAgICAgY2xhc3NOYW1lOiBcIm1hcC10aXRsZS1jb250YWluZXJcIixcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hcFRpdGxlID0gaGVscGVyLmNyZWF0ZShcImgzXCIsIHtcbiAgICAgIGNsYXNzTmFtZTogXCJtYXAtdGl0bGVcIixcbiAgICAgIHRleHRDb250ZW50OiB0ZXh0LFxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1hcFRpdGxlKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVXaW5uZXJNb2RhbChkYXRhKSB7XG4gICAgY29uc3Qgd2lubmVyTW9kYWwgPSBoZWxwZXIuY3JlYXRlKFwic2VjdGlvblwiLCB7XG4gICAgICBpZDogXCJ3aW4tbW9kYWwtY29udGFpbmVyXCIsXG4gICAgICBjbGFzc05hbWU6IFwid2luLW1vZGFsLWNvbnRhaW5lclwiLFxuICAgIH0pO1xuXG4gICAgd2lubmVyTW9kYWwuY2xhc3NMaXN0LmFkZChkYXRhLmNsYXNzTmFtZSk7XG5cbiAgICBjb25zdCB0aXRsZSA9IGhlbHBlci5jcmVhdGUoXCJoNFwiLCB7XG4gICAgICBpZDogYHRpdGxlLSR7ZGF0YS5pZH1gLFxuICAgICAgY2xhc3NOYW1lOiBgdGl0bGUtJHtkYXRhLmlkfWAsXG4gICAgICB0ZXh0Q29udGVudDogZGF0YS50aXRsZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBDb21wb25lbnQuY3JlYXRlTWVzc2FnZVNlY3Rpb24oW1wiYmF0dGxlXCIsIGRhdGEuaWRdKTtcblxuICAgIGNvbnN0IGJ1dHRvbiA9IGhlbHBlci5jcmVhdGUoXCJidXR0b25cIiwge1xuICAgICAgaWQ6IFwibmV3LWdhbWUtYnV0dG9uXCIsXG4gICAgICBjbGFzc05hbWU6IFwibmV3LWdhbWUtYnV0dG9uXCIsXG4gICAgICB0ZXh0Q29udGVudDogXCJOZXcgQmF0dGxlIVwiLFxuICAgIH0pO1xuXG4gICAgaGVscGVyLmFwcGVuZEFsbCh3aW5uZXJNb2RhbCwgW3RpdGxlLCBtZXNzYWdlLCBidXR0b25dKTtcblxuICAgIHJldHVybiB3aW5uZXJNb2RhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVdpbk92ZXJsYXkoKSB7XG4gICAgcmV0dXJuIGhlbHBlci5jcmVhdGUoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwid2luLW92ZXJsYXlcIiB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dFbmVteVdpbk1vZGFsKCkge1xuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpO1xuXG4gICAgaGVscGVyLmFwcGVuZEFsbChhcHAsIFtcbiAgICAgIGNyZWF0ZVdpbm5lck1vZGFsKHtcbiAgICAgICAgdGl0bGU6IFwiWU9VIExPU0UhXCIsXG4gICAgICAgIGlkOiBcImVuZW15LXdpblwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZW5lbXlcIixcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlV2luT3ZlcmxheSgpLFxuICAgIF0pO1xuXG4gICAgZGlzcGxheVdpbk1lc3NhZ2UoXCJlbmVteS13aW5cIik7XG4gICAgaW5pdE5ld0dhbWVCdXR0b24oKTtcblxuICAgIHJldHVybiBcIndpblwiO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd1BsYXllcldpbk1vZGFsKCkge1xuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpO1xuXG4gICAgaGVscGVyLmFwcGVuZEFsbChhcHAsIFtcbiAgICAgIGNyZWF0ZVdpbm5lck1vZGFsKHtcbiAgICAgICAgdGl0bGU6IFwiWU9VIFdJTiFcIixcbiAgICAgICAgaWQ6IFwiY2FwdGFpbi13aW5cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInBsYXllclwiLFxuICAgICAgfSksXG4gICAgICBjcmVhdGVXaW5PdmVybGF5KCksXG4gICAgXSk7XG5cbiAgICBkaXNwbGF5V2luTWVzc2FnZShcImNhcHRhaW4td2luXCIpO1xuICAgIGluaXROZXdHYW1lQnV0dG9uKCk7XG4gICAgdW5Jbml0Qm9hcmRGaWVsZHMoKTtcblxuICAgIHJldHVybiBcIndpblwiO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZnVuY3Rpb24gaW5pdEJvYXJkRmllbGRzKCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZWxkLWNvbnRhaW5lci1jb21wdXRlclwiKTtcblxuICAgIFsuLi5jb21wdXRlckJvYXJkLmNoaWxkcmVuXS5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgZmllbGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUZpZWxkQ2xpY2spO1xuICAgIH0pO1xuXG4gICAgYWRkRmllbGRIb3ZlcldoZW5PblR1cm4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuSW5pdEJvYXJkRmllbGRzKCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZWxkLWNvbnRhaW5lci1jb21wdXRlclwiKTtcblxuICAgIFsuLi5jb21wdXRlckJvYXJkLmNoaWxkcmVuXS5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgZmllbGQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUZpZWxkQ2xpY2spO1xuICAgIH0pO1xuXG4gICAgcmVtb3ZlRmllbGRIb3ZlcldoZW5PZmZUdXJuKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0TmV3R2FtZUJ1dHRvbigpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1nYW1lLWJ1dHRvblwiKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKSk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBhc3luYyBmdW5jdGlvbiBoYW5kbGVGaWVsZENsaWNrKGV2ZW50KSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IGV2ZW50O1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG5cbiAgICBjb25zdCBwbGF5ZXJSZXN1bHQgPSBhd2FpdCBwbGF5ZXJUdXJuKHRhcmdldCk7XG4gICAgaWYgKHBsYXllclJlc3VsdCA9PT0gXCJ3aW5cIikgcmV0dXJuO1xuXG4gICAgY29uc3QgY29tcHV0ZXJSZXN1bHQgPSBhd2FpdCBjb21wdXRlclR1cm4oKTtcbiAgICBpZiAoY29tcHV0ZXJSZXN1bHQgPT09IFwid2luXCIpIHJldHVybjtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHBsYXllclR1cm4odGFyZ2V0Tm9kZSkge1xuICAgIGNvbnN0IG5vZGVJbmRleCA9IFsuLi50YXJnZXROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5dLmluZGV4T2YodGFyZ2V0Tm9kZSk7XG4gICAgY29uc3QgW3JvdywgY29sdW1uXSA9IGhlbHBlci5nZXRDb29yZGluYXRlc0Zyb21JbmRleChub2RlSW5kZXgpO1xuXG4gICAgbGV0IHRhcmdldE9uQ29tcHV0ZXJCb2FyZCA9IEdhbWUuZ2V0R2FtZSgpLnBsYXllckF0dGFjayhyb3csIGNvbHVtbik7XG5cbiAgICB1bkluaXRCb2FyZEZpZWxkcygpO1xuICAgIGF3YWl0IHNob3RPblR1cm5QbGF5KFwicGxheWVyXCIpO1xuXG4gICAgbGV0IHJlcztcbiAgICBpZiAodGFyZ2V0T25Db21wdXRlckJvYXJkID09PSBudWxsKSB7XG4gICAgICByZXMgPSBhd2FpdCBwbGF5ZXJNaXNzKHRhcmdldE5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMgPSBhd2FpdCBwbGF5ZXJIaXQodGFyZ2V0Tm9kZSwgdGFyZ2V0T25Db21wdXRlckJvYXJkKTtcbiAgICAgIGlmIChyZXMgPT09IFwid2luXCIpIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgYXdhaXQgdHVybkVuZChcInBsYXllclwiKTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gcGxheWVyTWlzcyhmaWVsZE5vZGUpIHtcbiAgICBhZGRNaXNzU3R5bGUoZmllbGROb2RlKTtcbiAgICBhd2FpdCB0aW1lb3V0TWlzc2lsZUxlbmd0aCgpO1xuICAgIC8vU291bmQubWlzcygpO1xuICAgIGRpc3BsYXlQbGF5ZXJNZXNzYWdlKG51bGwpO1xuICAgIGF3YWl0IHRpbWVvdXRPbmVTZWNvbmQoKTtcblxuICAgIHJldHVybiBcIm1pc3NcIjtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHBsYXllckhpdChmaWVsZE5vZGUsIHNoaXApIHtcbiAgICBhZGRIaXRTdHlsZShmaWVsZE5vZGUpO1xuICAgIGxvYWRTaGlwSWZTdW5rKHNoaXApO1xuICAgIGF3YWl0IHRpbWVvdXRNaXNzaWxlTGVuZ3RoKCk7XG4gICAgLy9Tb3VuZC5oaXQoKTtcbiAgICBkaXNwbGF5UGxheWVyTWVzc2FnZShzaGlwKTtcbiAgICBhd2FpdCB0aW1lb3V0T25lU2Vjb25kKCk7XG5cbiAgICBpZiAoR2FtZS5nZXRHYW1lKCkuZ2V0Q29tcHV0ZXJQbGF5ZXIoKS5nZXRHYW1lYm9hcmQoKS5pc0dhbWVPdmVyKCkpXG4gICAgICByZXR1cm4gc2hvd1BsYXllcldpbk1vZGFsKCk7XG5cbiAgICByZXR1cm4gXCJoaXRcIjtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGNvbXB1dGVyVHVybigpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBHYW1lLmdldEdhbWUoKS5hdXRvQ29tcHV0ZXJBdHRhY2soKTtcblxuICAgIGxldCB0YXJnZXRPblVzZXJCb2FyZCwgcm93LCBjb2x1bW47XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgIHRhcmdldE9uVXNlckJvYXJkID0gdGFyZ2V0LnNoaXA7XG4gICAgICByb3cgPSB0YXJnZXQuY29vcmRbMF07XG4gICAgICBjb2x1bW4gPSB0YXJnZXQuY29vcmRbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdyA9IHRhcmdldFswXTtcbiAgICAgIGNvbHVtbiA9IHRhcmdldFsxXTtcbiAgICB9XG5cbiAgICBkaXNwbGF5UGxheWVyTm9Db21tZW50TWVzc2FnZSgpO1xuICAgIGF3YWl0IHRpbWVvdXRPbmVTZWNvbmQoKTtcblxuICAgIGF3YWl0IHNob3RPblR1cm5QbGF5KFwiY29tcHV0ZXJcIik7XG5cbiAgICBsZXQgcmVzO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgIHJlcyA9IGF3YWl0IGNvbXB1dGVyTWlzcyhyb3csIGNvbHVtbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcyA9IGF3YWl0IGNvbXB1dGVySGl0KHJvdywgY29sdW1uLCB0YXJnZXRPblVzZXJCb2FyZCk7XG4gICAgfVxuXG4gICAgYXdhaXQgdHVybkVuZChcImNvbXB1dGVyXCIpO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBjb21wdXRlck1pc3Mocm93LCBjb2x1bW4pIHtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmllbGQtY29udGFpbmVyLXBsYXllclwiKTtcbiAgICBjb25zdCBpbmRleCA9IGhlbHBlci5nZXRJbmRleEZyb21Db29yZGluYXRlcyhyb3csIGNvbHVtbik7XG5cbiAgICBhZGRNaXNzU3R5bGUoWy4uLnBsYXllckJvYXJkLmNoaWxkcmVuXVtpbmRleF0pO1xuICAgIGF3YWl0IHRpbWVvdXRNaXNzaWxlTGVuZ3RoKCk7XG4gICAgLy9Tb3VuZC5taXNzKClcblxuICAgIGRpc3BsYXlDb21wdXRlck1lc3NhZ2UobnVsbCk7XG4gICAgYXdhaXQgdGltZW91dE9uZVNlY29uZCgpO1xuXG4gICAgcmV0dXJuIFwibWlzc1wiO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gY29tcHV0ZXJIaXQocm93LCBjb2x1bW4sIHNoaXApIHtcbiAgICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmllbGQtY29udGFpbmVyLXBsYXllclwiKTtcbiAgICBjb25zdCBpbmRleCA9IGhlbHBlci5nZXRJbmRleEZyb21Db29yZGluYXRlcyhyb3csIGNvbHVtbik7XG5cbiAgICBhZGRIaXRTdHlsZShbLi4ucGxheWVyQm9hcmQuY2hpbGRyZW5dW2luZGV4XSk7XG4gICAgYXdhaXQgdGltZW91dE1pc3NpbGVMZW5ndGgoKTtcbiAgICAvL1NvdW5kLmhpdCgpO1xuICAgIGRpc3BsYXlDb21wdXRlck1lc3NhZ2Uoc2hpcCk7XG4gICAgYXdhaXQgdGltZW91dE9uZVNlY29uZCgpO1xuXG4gICAgaWYgKEdhbWUuZ2V0R2FtZSgpLmdldFVzZXJQbGF5ZXIoKS5nZXRHYW1lYm9hcmQoKS5pc0dhbWVPdmVyKCkpXG4gICAgICByZXR1cm4gc2hvd0VuZW15V2luTW9kYWwoKTtcblxuICAgIHJldHVybiBcImhpdFwiO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgYXN5bmMgZnVuY3Rpb24gc2hvdE9uVHVyblBsYXkoY2hhcmFjdGVyKSB7XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCJwbGF5ZXJcIikge1xuICAgICAgLy9Tb3VuZC5zaG90KCk7XG4gICAgICBhd2FpdCB0aW1lT3V0SGFsZlNlY29uZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1NvdW5kLnNob3QoKTtcbiAgICAgIGF3YWl0IHRpbWVPdXRIYWxmU2Vjb25kKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gdHVybkVuZChjaGFyYWN0ZXIpIHtcbiAgICBhd2FpdCB0aW1lb3V0T25lQW5kSGFsZlNlY29uZCgpO1xuXG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCJwbGF5ZXJcIikge1xuICAgICAgc3R5bGVPZmZUdXJuKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVzc2FnZS5iYXR0bGUuY2FwdGFpblwiKSk7XG4gICAgICBzdHlsZU9uVHVybihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2UuYmF0dGxlLmVuZW15XCIpKTtcbiAgICAgIHJlc2l6ZVBsYXllck9mZlR1cm4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVPZmZUdXJuKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVzc2FnZS5iYXR0bGUuZW5lbXlcIikpO1xuICAgICAgc3R5bGVPblR1cm4oZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZXNzYWdlLmJhdHRsZS5jYXB0YWluXCIpKTtcbiAgICAgIHJlc2l6ZVBsYXllck9uVHVybigpO1xuICAgICAgaW5pdEJvYXJkRmllbGRzKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZnVuY3Rpb24gZGlzcGxheVBsYXllclNoaXBzKCkge1xuICAgIGNvbnN0IHVzZXJCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmllbGQtY29udGFpbmVyLXBsYXllclwiKTtcbiAgICBmbGVldC5sb2FkRmxlZXQodXNlckJvYXJkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvYWRTaGlwSWZTdW5rKHNoaXApIHtcbiAgICBjb25zb2xlLmxvZyhzaGlwLmdldExlbmd0aCgpKTtcblxuICAgIGlmIChzaGlwLmlzU3VuaygpKSB7XG4gICAgICBjb25zdCBbcm93T3JpZ2luLCBjb2x1bW5PcmlnaW5dID0gR2FtZS5nZXRHYW1lKClcbiAgICAgICAgLmdldENvbXB1dGVyUGxheWVyKClcbiAgICAgICAgLmdldEdhbWVib2FyZCgpXG4gICAgICAgIC5nZXRTaGlwSW5pdGlhbFBvc2l0aW9uKHNoaXAuZ2V0TmFtZSgpKTtcbiAgICAgIGNvbnN0IGZpZWxkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIFwiZmllbGQtY29udGFpbmVyLWNvbXB1dGVyXCIsXG4gICAgICApO1xuXG4gICAgICBmbGVldC5sb2FkU2hpcE9uQm9hcmQoe1xuICAgICAgICBmaWVsZENvbnRhaW5lcixcbiAgICAgICAgc2hpcCxcbiAgICAgICAgcm93OiByb3dPcmlnaW4sXG4gICAgICAgIGNvbHVtbjogY29sdW1uT3JpZ2luLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZnVuY3Rpb24gZGlzcGxheUJhdHRsZVN0YXJ0TWVzc2FnZShjaGFyYWN0ZXIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYG1lc3NhZ2UtJHtjaGFyYWN0ZXJ9YCk7XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCJjYXB0YWluXCIpIHtcbiAgICAgIENvbXBvbmVudC5hZGRUeXBlV3JpdHRlck1lc3NhZ2UobWVzc2FnZSwgW1xuICAgICAgICBNZXNzYWdlLmdldEJhdHRsZVN0YXJ0TWVzc2FnZSgpLFxuICAgICAgXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIENvbXBvbmVudC5hZGRUeXBlV3JpdHRlck1lc3NhZ2UobWVzc2FnZSwgW1xuICAgICAgICBNZXNzYWdlLmdldEVuZW15QmF0dGxlU3RhcnRNZXNzYWdlKCksXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkaXNwbGF5UGxheWVyTWVzc2FnZSh0YXJnZXQpIHtcbiAgICBjb25zdCBjYXB0YWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZXNzYWdlLWNhcHRhaW5cIik7XG4gICAgY29uc3QgZW5lbXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lc3NhZ2UtZW5lbXlcIik7XG5cbiAgICBpZiAodGFyZ2V0ICE9PSBudWxsKSB7XG4gICAgICBpZiAoIXRhcmdldC5pc1N1bmsoKSkge1xuICAgICAgICBkaXNwbGF5TWVzc2FnZShcbiAgICAgICAgICBjYXB0YWluLFxuICAgICAgICAgIE1lc3NhZ2UuZ2V0TmV3RW5lbXlIaXRNZXNzYWdlKGNhcHRhaW4udGV4dENvbnRlbnQpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheU1lc3NhZ2UoXG4gICAgICAgICAgY2FwdGFpbixcbiAgICAgICAgICBNZXNzYWdlLmdldE5ld0VuZW15U3Vua01lc3NhZ2UoY2FwdGFpbi50ZXh0Q29udGVudCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BsYXlNZXNzYWdlKFxuICAgICAgICBjYXB0YWluLFxuICAgICAgICBNZXNzYWdlLmdldE5ld1BsYXllck1pc3NNZXNzYWdlKGNhcHRhaW4udGV4dENvbnRlbnQpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZW5lbXkudGV4dENvbnRlbnQgIT09IFwiLi4uXCIpXG4gICAgICBkaXNwbGF5TWVzc2FnZShlbmVteSwgTWVzc2FnZS5nZXROb0NvbW1lbnRNZXNzYWdlKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzcGxheUNvbXB1dGVyTWVzc2FnZSh0YXJnZXQpIHtcbiAgICBjb25zdCBlbmVteSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVzc2FnZS1lbmVteVwiKTtcblxuICAgIGlmICh0YXJnZXQgIT09IG51bGwpIHtcbiAgICAgIGlmICghdGFyZ2V0LmlzU3VuaygpKSB7XG4gICAgICAgIGRpc3BsYXlNZXNzYWdlKFxuICAgICAgICAgIGVuZW15LFxuICAgICAgICAgIE1lc3NhZ2UuZ2V0TmV3UGxheWVySGl0TWVzc2FnZShlbmVteS50ZXh0Q29udGVudCksXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5TWVzc2FnZShcbiAgICAgICAgICBlbmVteSxcbiAgICAgICAgICBNZXNzYWdlLmdldE5ld1BsYXllclN1bmtNZXNzYWdlKGVuZW15LnRleHRDb250ZW50KSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGxheU1lc3NhZ2UoZW5lbXksIE1lc3NhZ2UuZ2V0TmV3RW5lbXlNaXNzTWVzc2FnZShlbmVteS50ZXh0Q29udGVudCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc3BsYXlNZXNzYWdlKG5vZGUsIG1lc3NhZ2UpIHtcbiAgICBjbGVhclR5cGVXcml0dGVyKG5vZGUpO1xuICAgIENvbXBvbmVudC5hZGRUeXBlV3JpdHRlck1lc3NhZ2Uobm9kZSwgW21lc3NhZ2VdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc3BsYXlXaW5NZXNzYWdlKGNoYXJhY3Rlcikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbWVzc2FnZS0ke2NoYXJhY3Rlcn1gKTtcblxuICAgIGlmIChjaGFyYWN0ZXIgPT09IFwiY2FwdGFpbi13aW5cIikge1xuICAgICAgQ29tcG9uZW50LmFkZFR5cGVXcml0dGVyTWVzc2FnZShtZXNzYWdlLCBbTWVzc2FnZS5nZXRQbGF5ZXJXaW5NZXNzYWdlKCldKTtcbiAgICB9IGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gXCJlbmVteS13aW5cIikge1xuICAgICAgQ29tcG9uZW50LmFkZFR5cGVXcml0dGVyTWVzc2FnZShtZXNzYWdlLCBbTWVzc2FnZS5nZXRFbmVteVdpbk1lc3NhZ2UoKV0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc3BsYXlQbGF5ZXJOb0NvbW1lbnRNZXNzYWdlKCkge1xuICAgIGNvbnN0IGNhcHRhaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lc3NhZ2UtY2FwdGFpblwiKTtcbiAgICBkaXNwbGF5TWVzc2FnZShjYXB0YWluLCBNZXNzYWdlLmdldE5vQ29tbWVudE1lc3NhZ2UoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhclR5cGVXcml0dGVyKG5vZGUpIHtcbiAgICBpZiAobm9kZS5uZXh0RWxlbWVudFNpYmxpbmcpIHtcbiAgICAgIG5vZGUudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgbm9kZS5uZXh0RWxlbWVudFNpYmxpbmcucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZnVuY3Rpb24gYWRkRmllbGRIb3ZlcldoZW5PblR1cm4oKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWVsZC1jb250YWluZXItY29tcHV0ZXJcIik7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUZpZWxkSG92ZXJXaGVuT2ZmVHVybigpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZWxkLWNvbnRhaW5lci1jb21wdXRlclwiKTtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSGl0U3R5bGUoZmllbGROb2RlKSB7XG4gICAgZmllbGROb2RlLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRNaXNzU3R5bGUoZmllbGROb2RlKSB7XG4gICAgZmllbGROb2RlLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3R5bGVPZmZUdXJuKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJvbi10dXJuXCIpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm9mZi10dXJuXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3R5bGVPblR1cm4oZWxlbWVudCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm9mZi10dXJuXCIpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm9uLXR1cm5cIik7XG4gIH1cblxuICBmdW5jdGlvbiByZXNpemVQbGF5ZXJPblR1cm4oKSB7XG4gICAgc3R5bGVPZmZUdXJuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmQtY29tcHV0ZXJcIikpO1xuICAgIHN0eWxlT25UdXJuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmQtcGxheWVyXCIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2l6ZVBsYXllck9mZlR1cm4oKSB7XG4gICAgc3R5bGVPZmZUdXJuKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmQtcGxheWVyXCIpKTtcbiAgICBzdHlsZU9uVHVybihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkLWNvbXB1dGVyXCIpKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGZ1bmN0aW9uIHRpbWVvdXRNaXNzaWxlTGVuZ3RoKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDApKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVvdXRPbmVTZWNvbmQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVPdXRIYWxmU2Vjb25kKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDApKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVvdXRPbmVBbmRIYWxmU2Vjb25kKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxNTAwKSk7XG4gIH1cblxuICByZXR1cm4geyBsb2FkQmF0dGxlQ29udGVudCB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBCYXR0bGUoKTtcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuLi9sb2dpYy9nYW1lXCI7XG5pbXBvcnQgZmxlZXQgZnJvbSBcIi4vZmxlZXRcIjtcbmltcG9ydCBoZWxwZXIgZnJvbSBcIi4vaGVscGVyXCI7XG5cbmZ1bmN0aW9uIERyYWdEcm9wKCkge1xuICBmdW5jdGlvbiBpbml0RHJhZ2dhYmxlRmllbGRzKCkge1xuICAgIGRyYWdTdGFydCgpO1xuICAgIGRyYWdFbnRlcigpO1xuICAgIGRyYWdPdmVyKCk7XG4gICAgZHJhZ0xlYXZlKCk7XG4gICAgZHJhZ0Ryb3AoKTtcbiAgICBtb2JpbGVEcmFnKCk7XG4gICAgbW9iaWxlRHJvcCgpO1xuICB9XG5cbiAgbGV0IGZpZWxkUXVldWUgPSBbXTtcblxuICBmdW5jdGlvbiBlbXB0eUZpZWxkUXVldWUoKSB7XG4gICAgZmllbGRRdWV1ZSA9IFtdO1xuICB9XG5cbiAgLyogbGlzdGVuZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gIGZ1bmN0aW9uIGRyYWdTdGFydCgpIHtcbiAgICBjb25zdCBmbGVldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxlZXQtc2V0dXBcIik7XG5cbiAgICBbLi4uZmxlZXRDb250YWluZXIuY2hpbGRyZW5dLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgZHJhZ1N0YXJ0SGFuZGxlcihldmVudCwgbm9kZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdFbnRlcigpIHtcbiAgICBjb25zdCBmaWVsZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmllbGQtY29udGFpbmVyLXNldHVwXCIpO1xuXG4gICAgWy4uLmZpZWxkQ29udGFpbmVyLmNoaWxkcmVuXS5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW50ZXJcIiwgZHJhZ0VudGVySGFuZGxlcik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnT3ZlcigpIHtcbiAgICBjb25zdCBmaWVsZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmllbGQtY29udGFpbmVyLXNldHVwXCIpO1xuXG4gICAgWy4uLmZpZWxkQ29udGFpbmVyLmNoaWxkcmVuXS5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgICAgLy8gcHJldmVudCBkZWZhdWx0IHRvIGFsbG93IGRyb3BwaW5nXG4gICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50LCBmaWVsZENvbnRhaW5lciwgaW5kZXgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnTGVhdmUoKSB7XG4gICAgY29uc3QgZmllbGRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZWxkLWNvbnRhaW5lci1zZXR1cFwiKTtcblxuICAgIC8vIFJFTU9WRSBEUkFHT1ZFUi9IT1ZFUiBDTEFTU1xuICAgIFsuLi5maWVsZENvbnRhaW5lci5jaGlsZHJlbl0uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGRyYWdMZWF2ZUhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhZ0Ryb3AoKSB7XG4gICAgY29uc3QgZmllbGRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZWxkLWNvbnRhaW5lci1zZXR1cFwiKTtcblxuICAgIFsuLi5maWVsZENvbnRhaW5lci5jaGlsZHJlbl0uZm9yRWFjaCgobm9kZSwgaW5kZXgpID0+IHtcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKCkgPT4ge1xuICAgICAgICBkcmFnRHJvcEhhbmRsZXIoZmllbGRDb250YWluZXIsIGluZGV4KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9iaWxlRHJhZygpIHtcbiAgICBjb25zdCBmbGVldENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxlZXQtc2V0dXBcIik7XG4gICAgY29uc3QgZmllbGRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZWxkLWNvbnRhaW5lci1zZXR1cFwiKTtcblxuICAgIFsuLi5mbGVldENvbnRhaW5lci5jaGlsZHJlbl0uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdG91Y2hTdGFydEhhbmRsZXIoZXZlbnQsIG5vZGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBbLi4uZmxlZXRDb250YWluZXIuY2hpbGRyZW5dLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdG91Y2hNb3ZlSGFuZGxlcihldmVudCwgbm9kZSwgZmllbGRDb250YWluZXIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2JpbGVEcm9wKCkge1xuICAgIGNvbnN0IGZsZWV0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGVldC1zZXR1cFwiKTtcbiAgICBjb25zdCBmaWVsZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmllbGQtY29udGFpbmVyLXNldHVwXCIpO1xuXG4gICAgWy4uLmZsZWV0Q29udGFpbmVyLmNoaWxkcmVuXS5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdG91Y2hFbmRIYW5kbGVyKGV2ZW50LCBub2RlLCBmaWVsZENvbnRhaW5lcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIGhhbmRsZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGZ1bmN0aW9uIGRyYWdTdGFydEhhbmRsZXIoZXZlbnQsIG5vZGUpIHtcbiAgICBhZGRTaGlwT25EcmFnU3RhcnQobm9kZSk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmFnRW50ZXJIYW5kbGVyKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdPdmVySGFuZGxlcihldmVudCwgZmllbGRDb250YWluZXIsIGluZGV4KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBzdHlsZUZpZWxkc0ZvckRyb3AoZmllbGRDb250YWluZXIsIGluZGV4KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdMZWF2ZUhhbmRsZXIoKSB7XG4gICAgcmVzZXRGaWVsZFN0eWxpbmcoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdEcm9wSGFuZGxlcihmaWVsZENvbnRhaW5lciwgaW5kZXgpIHtcbiAgICBjb25zdCBbeCwgeV0gPSBoZWxwZXIuZ2V0Q29vcmRpbmF0ZXNGcm9tSW5kZXgoaW5kZXgpO1xuICAgIGNvbnN0IFtpc1BsYWNlZCwgc2hpcE9uRHJhZ10gPSBkcm9wSWZWYWxpZCh4LCB5KTtcblxuICAgIGZsZWV0LmxvYWRGbGVldChmaWVsZENvbnRhaW5lcik7XG4gICAgaGlkZUlmUGxhY2VkKGlzUGxhY2VkLCBzaGlwT25EcmFnKTtcbiAgICByZXNldEZpZWxkU3R5bGluZygpO1xuICAgIHJlbW92ZVBsYWNlZFNoaXBzVGFiSW5kZXgoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNoU3RhcnRIYW5kbGVyKGV2ZW50LCBub2RlKSB7XG4gICAgYWRkU2hpcE9uRHJhZ1N0YXJ0KG5vZGUpO1xuICAgIC8vY29uc29sZS5sb2coZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2hNb3ZlSGFuZGxlcihldmVudCwgbm9kZSwgZmllbGRDb250YWluZXIpIHtcbiAgICBjb25zdCB0b3VjaFggPSBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgY29uc3QgdG91Y2hZID0gZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZO1xuXG4gICAgLy8gdGhpcyBpcyBiZWNhdXNlIG1vdmluZyBpbiB0aGUgZmxlZXQtc2V0dXAsIHRoZSBkcmFnZ2luIHN0YXJ0IGxhZ2dpbmdcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcFwiKS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICBwb3NpdGlvbk5vZGVPblNjcmVlbihub2RlLCB0b3VjaFgsIHRvdWNoWSk7XG5cbiAgICByZXNldEZpZWxkU3R5bGluZygpO1xuICAgIGNvbnN0IGhvdmVyZWRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaFgsIHRvdWNoWSk7XG5cbiAgICBpZiAoaG92ZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmIChob3ZlcmVkRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWVsZFwiKSkge1xuICAgICAgY29uc3QgaW5kZXhIb3ZlcmVkRWxlbWVudCA9IFsuLi5maWVsZENvbnRhaW5lci5jaGlsZHJlbl0uaW5kZXhPZihcbiAgICAgICAgaG92ZXJlZEVsZW1lbnQsXG4gICAgICApO1xuICAgICAgc3R5bGVGaWVsZHNGb3JEcm9wKGZpZWxkQ29udGFpbmVyLCBpbmRleEhvdmVyZWRFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaEVuZEhhbmRsZXIoZXZlbnQsIG5vZGUsIGZpZWxkQ29udGFpbmVyKSB7XG4gICAgY29uc3QgdG91Y2hYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICBjb25zdCB0b3VjaFkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xuICAgIGNvbnN0IGhvdmVyZWRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaFgsIHRvdWNoWSk7XG5cbiAgICBpZiAoaG92ZXJlZEVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGVldC1zZXR1cFwiKS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICB9IGVsc2UgaWYgKGhvdmVyZWRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImZpZWxkXCIpKSB7XG4gICAgICBjb25zdCBpbmRleCA9IFsuLi5maWVsZENvbnRhaW5lci5jaGlsZHJlbl0uaW5kZXhPZihob3ZlcmVkRWxlbWVudCk7XG4gICAgICBjb25zdCBbeCwgeV0gPSBoZWxwZXIuZ2V0Q29vcmRpbmF0ZXNGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgY29uc3QgW2lzUGxhY2VkLCBzaGlwT25EcmFnXSA9IGRyb3BJZlZhbGlkKHgsIHkpO1xuXG4gICAgICBmbGVldC5sb2FkRmxlZXQoZmllbGRDb250YWluZXIpO1xuICAgICAgcmVzZXRGaWVsZFN0eWxpbmcoKTtcblxuICAgICAgLy8gcmV0dXJuIHRoZSBjYXJkIHRvIHRoZSBmbGVldC1zZXR1cCBzZWN0aW9uXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZWV0LXNldHVwXCIpLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgaGlkZUlmUGxhY2VkKGlzUGxhY2VkLCBzaGlwT25EcmFnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGVldC1zZXR1cFwiKS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICB9XG5cbiAgICByZXBvc2l0aW9uSW50b0ZsZWV0U2V0dXAobm9kZSk7XG4gIH1cblxuICAvKiBoYW5kbGVyIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICBmdW5jdGlvbiBhZGRTaGlwT25EcmFnU3RhcnQobm9kZSkge1xuICAgIEdhbWUuZ2V0R2FtZSgpLmdldFVzZXJQbGF5ZXIoKS5nZXRHYW1lYm9hcmQoKS5zZXRTaGlwT25EcmFnKHtcbiAgICAgIG5hbWU6IG5vZGUuZGF0YXNldC5zaGlwTmFtZSxcbiAgICAgIGxlbmd0aDogbm9kZS5kYXRhc2V0LnNoaXBMZW5ndGgsXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdHlsZUZpZWxkc0ZvckRyb3AoZmllbGRDb250YWluZXIsIGluZGV4KSB7XG4gICAgY29uc3QgZ2FtZWJvYXJkID0gR2FtZS5nZXRHYW1lKCkuZ2V0VXNlclBsYXllcigpLmdldEdhbWVib2FyZCgpO1xuICAgIGNvbnN0IHNoaXBPbkRyYWcgPSBnYW1lYm9hcmQuZ2V0U2hpcE9uRHJhZygpO1xuICAgIGxldCB7IGxlbmd0aCB9ID0gc2hpcE9uRHJhZztcbiAgICBjb25zdCBheGlzID0gZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcIngtYnV0dG9uXCIpXG4gICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VsZWN0ZWRcIilcbiAgICAgID8gXCJYXCJcbiAgICAgIDogXCJZXCI7XG5cbiAgICBlbXB0eUZpZWxkUXVldWUoKTtcblxuICAgIGxldCBpc1Rha2VuID0gZmFsc2U7XG4gICAgaWYgKGF4aXMgPT09IFwiWFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gaW5kZXg7IGkgPCBoZWxwZXIuZ2V0TmVhcmVzdFRlbihpbmRleCk7IGkrKykge1xuICAgICAgICBjb25zdCBbeCwgeV0gPSBoZWxwZXIuZ2V0Q29vcmRpbmF0ZXNGcm9tSW5kZXgoaSk7XG5cbiAgICAgICAgLy8gUkVUVVJOIElGIFdIT0xFIFNISVBTIFNIQURPVyBBTFJFQURZIE9OIE1BUFxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKSBicmVhaztcbiAgICAgICAgWy4uLmZpZWxkQ29udGFpbmVyLmNoaWxkcmVuXVtpXS5jbGFzc0xpc3QuYWRkKFwiaG92ZXJpbmdcIik7XG4gICAgICAgIGZpZWxkUXVldWUucHVzaChpKTtcbiAgICAgICAgbGVuZ3RoIC09IDE7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBnYW1lYm9hcmQuZ2V0U2hpcCh4LCB5KTtcbiAgICAgICAgICBpc1Rha2VuID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXhpcyA9PT0gXCJZXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSBpbmRleDsgaSA8IDEwMDsgaSArPSAxMCkge1xuICAgICAgICBjb25zdCBbeCwgeV0gPSBoZWxwZXIuZ2V0Q29vcmRpbmF0ZXNGcm9tSW5kZXgoaSk7XG5cbiAgICAgICAgLy8gUkVUVVJOIElGIFdIT0xFIFNISVBTIFNIQURPVyBBTFJFQURZIE9OIE1BUFxuICAgICAgICBpZiAobGVuZ3RoID09PSAwKSBicmVhaztcbiAgICAgICAgWy4uLmZpZWxkQ29udGFpbmVyLmNoaWxkcmVuXVtpXS5jbGFzc0xpc3QuYWRkKFwiaG92ZXJpbmdcIik7XG4gICAgICAgIGZpZWxkUXVldWUucHVzaChpKTtcbiAgICAgICAgbGVuZ3RoIC09IDE7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBnYW1lYm9hcmQuZ2V0U2hpcCh4LCB5KTtcbiAgICAgICAgICBpc1Rha2VuID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1Rha2VuIHx8IGxlbmd0aCAhPSAwKSB7XG4gICAgICBmaWVsZFF1ZXVlLmZvckVhY2goKGZpZWxkKSA9PlxuICAgICAgICBbLi4uZmllbGRDb250YWluZXIuY2hpbGRyZW5dW2ZpZWxkXS5jbGFzc0xpc3QuYWRkKFwicmVkXCIpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNldEZpZWxkU3R5bGluZygpIHtcbiAgICBjb25zdCBmaWVsZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmllbGQtY29udGFpbmVyLXNldHVwXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRRdWV1ZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgWy4uLmZpZWxkQ29udGFpbmVyLmNoaWxkcmVuXVtmaWVsZFF1ZXVlW2ldXS5jbGFzc05hbWUgPSBcImZpZWxkXCI7XG4gICAgfVxuICAgIGVtcHR5RmllbGRRdWV1ZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJvcElmVmFsaWQoeCwgeSkge1xuICAgIGNvbnN0IGdhbWVib2FyZCA9IEdhbWUuZ2V0R2FtZSgpLmdldFVzZXJQbGF5ZXIoKS5nZXRHYW1lYm9hcmQoKTtcbiAgICBjb25zdCBzaGlwT25EcmFnID0gZ2FtZWJvYXJkLmdldFNoaXBPbkRyYWcoKTtcbiAgICBjb25zdCBheGlzID0gZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcIngtYnV0dG9uXCIpXG4gICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VsZWN0ZWRcIilcbiAgICAgID8gXCJYXCJcbiAgICAgIDogXCJZXCI7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKGF4aXMgPT09IFwiWFwiKSB7XG4gICAgICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoeCwgeSwgc2hpcE9uRHJhZy5uYW1lLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoeCwgeSwgc2hpcE9uRHJhZy5uYW1lLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIHJldHVybiBbZmFsc2UsIHNoaXBPbkRyYWcubmFtZV07XG4gICAgfVxuXG4gICAgLy8gUkVUVVJOUyBbQk9PTCwgU0hJUC1OQU1FXVxuICAgIHJldHVybiBbdHJ1ZSwgc2hpcE9uRHJhZy5uYW1lXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVJZlBsYWNlZChpc1BsYWNlZCwgc2hpcE9uRHJhZykge1xuICAgIGlmICghaXNQbGFjZWQpIHJldHVybjtcblxuICAgIGNvbnN0IGJhdHRsZXNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zaGlwLW5hbWU9JHtzaGlwT25EcmFnfV1gKTtcbiAgICBiYXR0bGVzaGlwLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cbiAgICBlbmFibGVDb250aW51ZUJ1dHRvbklmQWxsUGxhY2VkKCk7XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVDb250aW51ZUJ1dHRvbklmQWxsUGxhY2VkKCkge1xuICAgIGNvbnN0IHNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zaGlwLWltYWdlLWNvbnRhaW5lclwiKTtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRpbnVlLWJ1dHRvblwiKTtcblxuICAgIGlmIChzaGlwcy5sZW5ndGggIT09IDUpIHJldHVybjtcblxuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHByZXZlbnRFbnRlckRlZmF1bHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJldmVudEVudGVyRGVmYXVsdChldmVudCkge1xuICAgIGlmIChldmVudC5rZXkgPT09IFwiRW50ZXJcIikgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVBsYWNlZFNoaXBzVGFiSW5kZXgoKSB7XG4gICAgY29uc3Qgc2hpcENhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zaGlwLWNhcmQuaGlkZGVuXCIpO1xuICAgIHNoaXBDYXJkcy5mb3JFYWNoKChzaGlwQ2FyZCkgPT4gc2hpcENhcmQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwb3NpdGlvbk5vZGVPblNjcmVlbihub2RlLCB4LCB5KSB7XG4gICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICBub2RlLnN0eWxlLnRvcCA9IGAke3l9cHhgO1xuICAgIG5vZGUuc3R5bGUubGVmdCA9IGAke3h9cHhgO1xuICAgIG5vZGUuc3R5bGUuekluZGV4ID0gXCI1XCI7XG4gIH1cblxuICBmdW5jdGlvbiByZXBvc2l0aW9uSW50b0ZsZWV0U2V0dXAobm9kZSkge1xuICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgbm9kZS5zdHlsZS50b3AgPSBcIjBcIjtcbiAgICBub2RlLnN0eWxlLmxlZnQgPSBcIjBcIjtcbiAgICBub2RlLnN0eWxlLnpJbmRleCA9IFwiMFwiO1xuICB9XG5cbiAgcmV0dXJuIHsgaW5pdERyYWdnYWJsZUZpZWxkcyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnRHJvcCgpO1xuIiwiLy8gYXNzZXRzXG5pbXBvcnQgY2FycmllciBmcm9tIFwiLi4vYXNzZXRzL2ltYWdlcy9jYXJyaWVyWC5zdmdcIjtcbmltcG9ydCBiYXR0bGVzaGlwIGZyb20gXCIuLi9hc3NldHMvaW1hZ2VzL2JhdHRsZXNoaXBYLnN2Z1wiO1xuaW1wb3J0IGNydWlzZXIgZnJvbSBcIi4uL2Fzc2V0cy9pbWFnZXMvY3J1aXNlclguc3ZnXCI7XG5pbXBvcnQgc3VibWFyaW5lIGZyb20gXCIuLi9hc3NldHMvaW1hZ2VzL3N1Ym1hcmluZVguc3ZnXCI7XG5pbXBvcnQgZGVzdHJveWVyIGZyb20gXCIuLi9hc3NldHMvaW1hZ2VzL2Rlc3Ryb3llclguc3ZnXCI7XG5cbi8vIGZhY3RvcnlcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9sb2dpYy9nYW1lXCI7XG5pbXBvcnQgaGVscGVyIGZyb20gXCIuL2hlbHBlclwiO1xuXG5mdW5jdGlvbiBmbGVldCgpIHtcbiAgZnVuY3Rpb24gbG9hZEZsZWV0KGZpZWxkQ29udGFpbmVyKSB7XG4gICAgY29uc3QgcGxheWVyID0gR2FtZS5nZXRHYW1lKCkuZ2V0VXNlclBsYXllcigpO1xuICAgIGNvbnN0IGdhbWVib2FyZCA9IHBsYXllci5nZXRHYW1lYm9hcmQoKTtcblxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sdW1uID0gMDsgY29sdW1uIDwgMTA7IGNvbHVtbisrKSB7XG4gICAgICAgIC8vIGlmIGZpZWxkIGlzIG5vdCBlbXB0eSBvbiBtYXAgbG9hZCBzaGlwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgc2hpcCA9IGdhbWVib2FyZC5nZXRTaGlwKHJvdywgY29sdW1uKTtcbiAgICAgICAgICBsb2FkU2hpcE9uQm9hcmQoe1xuICAgICAgICAgICAgZmllbGRDb250YWluZXIsXG4gICAgICAgICAgICBzaGlwLFxuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbG9hZFNoaXBPbkJvYXJkKGRhdGEpIHtcbiAgICBjb25zdCBzaGlwID0gZGF0YS5zaGlwO1xuXG4gICAgaWYgKFxuICAgICAgZGF0YS5maWVsZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLnNoaXAtaW1hZ2UtY29udGFpbmVyIC4ke3NoaXAuZ2V0TmFtZSgpfWAsXG4gICAgICApXG4gICAgKVxuICAgICAgcmV0dXJuO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gc2hpcC5nZXRMZW5ndGgoKTtcbiAgICBjb25zdCBbaGVpZ2h0LCB3aWR0aF0gPSBbYDEwJWAsIGAke2xlbmd0aCAqIDEwfSVgXTtcbiAgICBjb25zdCBbdG9wLCBsZWZ0XSA9IFtgJHtkYXRhLnJvdyAqIDEwfSVgLCBgJHtkYXRhLmNvbHVtbiAqIDEwfSVgXTtcbiAgICBjb25zdCBheGlzID0gc2hpcC5nZXRBeGlzKCk7XG5cbiAgICBsZXQgcm90YXRpb24gPVxuICAgICAgYXhpcyA9PT0gXCJYXCIgPyBcInJvdGF0ZSgwZGVnKVwiIDogXCJyb3RhdGUoOTBkZWcpIHRyYW5zbGF0ZVkoLTEwMCUpXCI7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBoZWxwZXIuY3JlYXRlKFwiZGl2XCIsIHtcbiAgICAgIGNsYXNzTmFtZTogXCJzaGlwLWltYWdlLWNvbnRhaW5lciBibGVlcFwiLFxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIGNvbnRhaW5lci5zdHlsZS56SW5kZXggPSBcIi0xXCI7XG4gICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IHRvcDtcbiAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodDtcbiAgICBjb250YWluZXIuc3R5bGUudHJhbnNmb3JtID0gcm90YXRpb247XG4gICAgY29udGFpbmVyLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IFwidG9wIGxlZnRcIjtcbiAgICBjb250YWluZXIuc3R5bGUubWFza0ltYWdlID0gY2FycmllcjtcblxuICAgIGNvbnN0IGltYWdlID0gaGVscGVyLmNyZWF0ZShcImltZ1wiLCB7XG4gICAgICBjbGFzc05hbWU6IHNoaXAuZ2V0TmFtZSgpLFxuICAgICAgc3JjOiBsb2FkU2hpcEltYWdlKHNoaXAuZ2V0TmFtZSgpKSxcbiAgICB9KTtcblxuICAgIGltYWdlLnN0eWxlLmhlaWdodCA9IFwiOTUlXCI7XG4gICAgaW1hZ2Uuc3R5bGUuYXNwZWN0UmF0aW8gPSBgJHtsZW5ndGh9LzFgO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGltYWdlKTtcbiAgICBkYXRhLmZpZWxkQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH1cblxuICAvLyB0aGlzIGlzIHVzZWQgZm9yIHdlYmFwY2sgbG9hZGluZ1xuICBmdW5jdGlvbiBsb2FkU2hpcEltYWdlKHNoaXBOYW1lKSB7XG4gICAgbGV0IHNoaXBJbWFnZTtcbiAgICBzd2l0Y2ggKHNoaXBOYW1lKSB7XG4gICAgICBjYXNlIFwiY2FycmllclwiOlxuICAgICAgICBzaGlwSW1hZ2UgPSBjYXJyaWVyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJiYXR0bGVzaGlwXCI6XG4gICAgICAgIHNoaXBJbWFnZSA9IGJhdHRsZXNoaXA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImNydWlzZXJcIjpcbiAgICAgICAgc2hpcEltYWdlID0gY3J1aXNlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3VibWFyaW5lXCI6XG4gICAgICAgIHNoaXBJbWFnZSA9IHN1Ym1hcmluZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGVzdHJveWVyXCI6XG4gICAgICAgIHNoaXBJbWFnZSA9IGRlc3Ryb3llcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzaGlwSW1hZ2UgPSBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gc2hpcEltYWdlO1xuICB9XG5cbiAgcmV0dXJuIHsgbG9hZEZsZWV0LCBsb2FkU2hpcE9uQm9hcmQgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmxlZXQoKTtcbiIsImZ1bmN0aW9uIGhlbHBlcigpIHtcbiAgZnVuY3Rpb24gZGVsZXRlQXBwQ29udGVudCgpIHtcbiAgICBjb25zdCBhcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcFwiKTtcbiAgICBhcHAucmVwbGFjZUNoaWxkcmVuKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGUodHlwZSwgZGF0YSkge1xuICAgIGlmICghdHlwZSkgY29uc29sZS5sb2coXCJtaXNzaW5nIHR5cGVcIik7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICBlbGVtZW50W2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGVuZEFsbChjb250YWluZXIsIG5vZGVBcnJheSkge1xuICAgIG5vZGVBcnJheS5mb3JFYWNoKChub2RlKSA9PiBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9kZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTWFwKGRlc2NyaXB0aW9uKSB7XG4gICAgY29uc3QgbWFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtYXAuaWQgPSBgYm9hcmQtJHtkZXNjcmlwdGlvbn1gO1xuICAgIG1hcC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIiwgZGVzY3JpcHRpb24pO1xuXG4gICAgbWFwLmFwcGVuZENoaWxkKGNyZWF0ZUxldHRlcnNTZWN0aW9uKCkpO1xuICAgIG1hcC5hcHBlbmRDaGlsZChjcmVhdGVOdW1iZXJzU2VjdGlvbigpKTtcbiAgICBtYXAuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmQoZGVzY3JpcHRpb24pKTtcblxuICAgIHJldHVybiBtYXA7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVMZXR0ZXJzU2VjdGlvbigpIHtcbiAgICBjb25zdCBsZXR0ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldHRlckNvbnRhaW5lci5pZCA9IFwibGV0dGVyLWNvbnRhaW5lclwiO1xuICAgIGxldHRlckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwibGV0dGVyLWNvbnRhaW5lclwiKTtcbiAgICBjb25zdCBsZXR0ZXJzID0gW1wiQVwiLCBcIkJcIiwgXCJDXCIsIFwiRFwiLCBcIkVcIiwgXCJGXCIsIFwiR1wiLCBcIkhcIiwgXCJJXCIsIFwiSlwiXTtcblxuICAgIGxldHRlcnMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgbGV0dGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGxldHRlci5jbGFzc05hbWUgPSBcImxldHRlclwiO1xuICAgICAgbGV0dGVyLnRleHRDb250ZW50ID0gZWxlbWVudDtcbiAgICAgIGxldHRlckNvbnRhaW5lci5hcHBlbmRDaGlsZChsZXR0ZXIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxldHRlckNvbnRhaW5lcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU51bWJlcnNTZWN0aW9uKCkge1xuICAgIGNvbnN0IG51bWJlckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbnVtYmVyQ29udGFpbmVyLmlkID0gXCJudW1iZXItY29udGFpbmVyXCI7XG4gICAgbnVtYmVyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJudW1iZXItY29udGFpbmVyXCIpO1xuICAgIGNvbnN0IG51bWJlcnMgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdO1xuXG4gICAgbnVtYmVycy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBudW1iZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgbnVtYmVyLmNsYXNzTmFtZSA9IFwibnVtYmVyXCI7XG4gICAgICBudW1iZXIudGV4dENvbnRlbnQgPSBlbGVtZW50O1xuICAgICAgbnVtYmVyQ29udGFpbmVyLmFwcGVuZENoaWxkKG51bWJlcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbnVtYmVyQ29udGFpbmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQm9hcmQoZGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYm9hcmQuaWQgPSBgZmllbGQtY29udGFpbmVyLSR7ZGVzY3JpcHRpb259YDtcbiAgICBib2FyZC5jbGFzc0xpc3QuYWRkKGBmaWVsZC1jb250YWluZXJgKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcImZpZWxkXCIpO1xuICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvYXJkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmVhcmVzdFRlbihudW0pIHtcbiAgICBpZiAobnVtID09PSAwKSBudW0rKztcblxuICAgIHdoaWxlIChudW0gJSAxMCAhPT0gMCkgbnVtKys7XG5cbiAgICByZXR1cm4gbnVtO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXNGcm9tSW5kZXgoaW5kZXgpIHtcbiAgICBjb25zdCB4ID0gTWF0aC50cnVuYyhpbmRleCAvIDEwKTtcbiAgICBjb25zdCB5ID0gaW5kZXggJSAxMDtcblxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbmRleEZyb21Db29yZGluYXRlcyhyb3csIGNvbHVtbikge1xuICAgIHJldHVybiByb3cgKiAxMCArIGNvbHVtbjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGVsZXRlQXBwQ29udGVudCxcbiAgICBjcmVhdGUsXG4gICAgYXBwZW5kQWxsLFxuICAgIGNyZWF0ZU1hcCxcbiAgICBnZXROZWFyZXN0VGVuLFxuICAgIGdldENvb3JkaW5hdGVzRnJvbUluZGV4LFxuICAgIGdldEluZGV4RnJvbUNvb3JkaW5hdGVzLFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBoZWxwZXIoKTtcbiIsImltcG9ydCBoZWxwZXIgZnJvbSBcIi4vaGVscGVyXCI7XG5cbmZ1bmN0aW9uIHByZWdhbWUoKSB7XG4gIGZ1bmN0aW9uIGxvYWRDYXJkKCkge1xuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpO1xuICAgIGFwcC5jbGFzc0xpc3QuYWRkKFwicHJlZ2FtZVwiKTtcblxuICAgIGhlbHBlci5hcHBlbmRBbGwoYXBwLCBbY3JlYXRlUHJlZ2FtZUNhcmQoKV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJlZ2FtZUNhcmQoKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IGhlbHBlci5jcmVhdGUoXCJzZWN0aW9uXCIsIHsgY2xhc3NOYW1lOiBcInByZWdhbWUtY2FyZFwiIH0pO1xuXG4gICAgaGVscGVyLmFwcGVuZEFsbChzZWN0aW9uLCBbXG4gICAgICBjcmVhdGVUaXRsZSgpLFxuICAgICAgY3JlYXRlTmFtZUZvcm0oKSxcbiAgICAgIGNyZWF0ZVBsYXlOb3dCdXR0b24oKSxcbiAgICBdKTtcblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVGl0bGUoKSB7XG4gICAgY29uc3QgdGl0bGUgPSBoZWxwZXIuY3JlYXRlKFwiaDFcIiwgeyB0ZXh0Q29udGVudDogXCJCQVRUTEVTSElQXCIgfSk7XG4gICAgcmV0dXJuIHRpdGxlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTmFtZUZvcm0oKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gaGVscGVyLmNyZWF0ZShcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJuYW1lLWZvcm1cIiB9KTtcblxuICAgIGNvbnN0IGlucHV0ID0gaGVscGVyLmNyZWF0ZShcImlucHV0XCIsIHtcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgaWQ6IFwibmFtZS1pbnB1dFwiLFxuICAgICAgY2xhc3NOYW1lOiBcIm5hbWUtaW5wdXRcIixcbiAgICAgIHBsYWNlaG9sZGVyOiBcIlVzZXIgTmFtZVwiLFxuICAgICAgbWluTGVuZ3RoOiAwLFxuICAgICAgbWF4TGVuZ3RoOiAxNSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGJvcmRlciA9IGhlbHBlci5jcmVhdGUoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImlucHV0LWJvcmRlclwiIH0pO1xuXG4gICAgaGVscGVyLmFwcGVuZEFsbChjb250YWluZXIsIFtpbnB1dCwgYm9yZGVyXSk7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGxheU5vd0J1dHRvbigpIHtcbiAgICBjb25zdCBidXR0b24gPSBoZWxwZXIuY3JlYXRlKFwiYnV0dG9uXCIsIHtcbiAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICBpZDogXCJwbGF5LW5vdy1idXR0b25cIixcbiAgICAgIGNsYXNzTmFtZTogXCJwbGF5LW5vdy1idXR0b25cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IHRleHQgPSBoZWxwZXIuY3JlYXRlKFwic3BhblwiLCB7XG4gICAgICBjbGFzc05hbWU6IFwidGV4dC1wbGF5LWJ1dHRvblwiLFxuICAgICAgdGV4dENvbnRlbnQ6IFwiRU5URVIgQ09NQkFUIVwiLFxuICAgIH0pO1xuXG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIHJldHVybiB7IGxvYWRDYXJkIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByZWdhbWUoKTtcbiIsImltcG9ydCBoZWxwZXIgZnJvbSBcIi4vaGVscGVyXCI7XG5cbi8vIGxpYnJhcnlcbmltcG9ydCBUeXBlZCBmcm9tIFwidHlwZWQuanNcIjtcblxuLy8gYXNzZXRzXG5pbXBvcnQgY2FwdGFpbiBmcm9tIFwiLi4vYXNzZXRzL2ltYWdlcy9jYXB0YWluLnBuZ1wiO1xuaW1wb3J0IGVuZW15IGZyb20gXCIuLi9hc3NldHMvaW1hZ2VzL2VuZW15LnBuZ1wiO1xuaW1wb3J0IGNhcnJpZXIgZnJvbSBcIi4uL2Fzc2V0cy9pbWFnZXMvY3J1aXNlclguc3ZnXCI7XG5pbXBvcnQgYmF0dGxlc2hpcCBmcm9tIFwiLi4vYXNzZXRzL2ltYWdlcy9iYXR0bGVzaGlwWC5zdmdcIjtcbmltcG9ydCBjcnVpc2VyIGZyb20gXCIuLi9hc3NldHMvaW1hZ2VzL2NydWlzZXJYLnN2Z1wiO1xuaW1wb3J0IHN1Ym1hcmluZSBmcm9tIFwiLi4vYXNzZXRzL2ltYWdlcy9zdWJtYXJpbmVYLnN2Z1wiO1xuaW1wb3J0IGRlc3Ryb3llciBmcm9tIFwiLi4vYXNzZXRzL2ltYWdlcy9kZXN0cm95ZXJYLnN2Z1wiO1xuXG5mdW5jdGlvbiBDb21wb25lbnQoKSB7XG4gIC8vIGZyb20gd2VicGFjayBpbWFnZXMgbG9hZGluZ1xuICBjb25zdCBpbWFnZXMgPSB7IGNhcHRhaW4sIGVuZW15IH07XG5cbiAgZnVuY3Rpb24gY3JlYXRlTWVzc2FnZVNlY3Rpb24oY2xhc3NOYW1lc0FycmF5KSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IGhlbHBlci5jcmVhdGUoXCJzZWN0aW9uXCIsIHsgY2xhc3NOYW1lOiBcIm1lc3NhZ2VcIiB9KTtcblxuICAgIGNsYXNzTmFtZXNBcnJheS5mb3JFYWNoKChjbGFzc05hbWUpID0+IHNlY3Rpb24uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpKTtcblxuICAgIGNvbnN0IGNoYXJhY3RlciA9IGNsYXNzTmFtZXNBcnJheVsxXTtcblxuICAgIGNvbnN0IGltYWdlTmFtZSA9XG4gICAgICBjaGFyYWN0ZXIgPT0gXCJjYXB0YWluXCIgfHwgY2hhcmFjdGVyID09IFwiY2FwdGFpbi13aW5cIlxuICAgICAgICA/IFwiY2FwdGFpblwiXG4gICAgICAgIDogXCJlbmVteVwiO1xuICAgIGNvbnN0IGltYWdlID0gaGVscGVyLmNyZWF0ZShcImltZ1wiLCB7XG4gICAgICBjbGFzc05hbWU6IFwibWVzc2FnZS1pbWFnZVwiLFxuICAgICAgc3JjOiBpbWFnZXNbaW1hZ2VOYW1lXSxcbiAgICB9KTtcblxuICAgIGhlbHBlci5hcHBlbmRBbGwoc2VjdGlvbiwgW2ltYWdlLCBjcmVhdGVNZXNzYWdlKGNoYXJhY3RlcildKTtcblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTWVzc2FnZShjaGFyYWN0ZXIpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBoZWxwZXIuY3JlYXRlKFwiZGl2XCIsIHtcbiAgICAgIGlkOiBcIm1lc3NhZ2UtY29udGFpbmVyXCIsXG4gICAgICBjbGFzc05hbWU6IFwibWVzc2FnZS1jb250YWluZXJcIixcbiAgICB9KTtcblxuICAgIGNvbnN0IHRleHQgPSBoZWxwZXIuY3JlYXRlKFwiZGl2XCIsIHtcbiAgICAgIGlkOiBgbWVzc2FnZS0ke2NoYXJhY3Rlcn1gLFxuICAgICAgY2xhc3NOYW1lOiBgbWVzc2FnZS0ke2NoYXJhY3Rlcn1gLFxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoaXBDYXJkKHNoaXBOYW1lKSB7XG4gICAgY29uc3QgY2FyZCA9IGhlbHBlci5jcmVhdGUoXCJkaXZcIiwge1xuICAgICAgY2xhc3NOYW1lOiBcInNoaXAtY2FyZFwiLFxuICAgICAgZHJhZ2dhYmxlOiBcInRydWVcIixcbiAgICB9KTtcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBoZWxwZXIuY3JlYXRlKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInNoaXAtY29udGVudFwiIH0pO1xuICAgIGNvbnN0IGltYWdlID0gaGVscGVyLmNyZWF0ZShcImltZ1wiLCB7IGNsYXNzTmFtZTogXCJzaGlwLWltYWdlXCIgfSk7XG4gICAgY29uc3QgbmFtZSA9IGhlbHBlci5jcmVhdGUoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInNoaXAtbmFtZVwiIH0pO1xuXG4gICAgc3dpdGNoIChzaGlwTmFtZSkge1xuICAgICAgY2FzZSBcImNhcnJpZXJcIjpcbiAgICAgICAgcG9wdWxhdGVDYXJkKGNhcmQsIGltYWdlLCBuYW1lLCBcImNhcnJpZXJcIiwgNSwgY2FycmllciwgXCJjYXJyaWVyICg1ZilcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImJhdHRsZXNoaXBcIjpcbiAgICAgICAgcG9wdWxhdGVDYXJkKFxuICAgICAgICAgIGNhcmQsXG4gICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBcImJhdHRsZXNoaXBcIixcbiAgICAgICAgICA0LFxuICAgICAgICAgIGJhdHRsZXNoaXAsXG4gICAgICAgICAgXCJiYXR0bGVzaGlwICg0ZilcIixcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY3J1aXNlclwiOlxuICAgICAgICBwb3B1bGF0ZUNhcmQoY2FyZCwgaW1hZ2UsIG5hbWUsIFwiY3J1aXNlclwiLCAzLCBjcnVpc2VyLCBcImNydWlzZXIgKDNmKVwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3VibWFyaW5lXCI6XG4gICAgICAgIHBvcHVsYXRlQ2FyZChcbiAgICAgICAgICBjYXJkLFxuICAgICAgICAgIGltYWdlLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgXCJzdWJtYXJpbmVcIixcbiAgICAgICAgICAzLFxuICAgICAgICAgIHN1Ym1hcmluZSxcbiAgICAgICAgICBcInN1Ym1hcmluZSAoM2YpXCIsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlc3Ryb3llclwiOlxuICAgICAgICBwb3B1bGF0ZUNhcmQoXG4gICAgICAgICAgY2FyZCxcbiAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIFwiZGVzdHJveWVyXCIsXG4gICAgICAgICAgMixcbiAgICAgICAgICBkZXN0cm95ZXIsXG4gICAgICAgICAgXCJkZXN0cm95ZXIgKDJmKVwiLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGhlbHBlci5hcHBlbmRBbGwoY29udGVudCwgW2ltYWdlLCBuYW1lXSk7XG4gICAgY2FyZC5hcHBlbmRDaGlsZChjb250ZW50KTtcblxuICAgIHJldHVybiBjYXJkO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9wdWxhdGVDYXJkKFxuICAgIGNhcmQsXG4gICAgaW1hZ2UsXG4gICAgbmFtZSxcbiAgICBkYXRhU2hpcE5hbWUsXG4gICAgZGF0YVNoaXBMZW5ndGgsXG4gICAgaW1hZ2VTcmMsXG4gICAgbmFtZVRleHQsXG4gICkge1xuICAgIGNhcmQuZGF0YXNldC5zaGlwTmFtZSA9IGRhdGFTaGlwTmFtZTtcbiAgICBjYXJkLmRhdGFzZXQuc2hpcExlbmd0aCA9IGRhdGFTaGlwTGVuZ3RoO1xuICAgIGltYWdlLnNyYyA9IGltYWdlU3JjO1xuICAgIG5hbWUudGV4dENvbnRlbnQgPSBuYW1lVGV4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFR5cGVXcml0dGVyTWVzc2FnZShlbGVtZW50LCBzdHJpbmdBcnJheSkge1xuICAgIGNvbnN0IHR5cGVkID0gbmV3IFR5cGVkKGVsZW1lbnQsIHtcbiAgICAgIHN0cmluZ3M6IHN0cmluZ0FycmF5LFxuICAgICAgdHlwZVNwZWVkOiAxMCxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7IGNyZWF0ZU1lc3NhZ2VTZWN0aW9uLCBjcmVhdGVTaGlwQ2FyZCwgYWRkVHlwZVdyaXR0ZXJNZXNzYWdlIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCgpO1xuIiwiaW1wb3J0IGhlbHBlciBmcm9tIFwiLi9oZWxwZXJcIjtcblxuaW1wb3J0IEdhbWUgZnJvbSBcIi4uL2xvZ2ljL2dhbWVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiLi9yZXVzYWJsZUNvbXBvbmVudHNcIjtcbmltcG9ydCBNZXNzYWdlIGZyb20gXCIuLi91dGlscy9tZXNzYWdlXCI7XG5pbXBvcnQgRHJhZ0Ryb3AgZnJvbSBcIi4vZHJhZ0Ryb3BcIjtcbmltcG9ydCBCYXR0bGUgZnJvbSBcIi4vYmF0dGxlXCI7XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBmdW5jdGlvbiBsb2FkU2V0dXBDb250ZW50KCkge1xuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpO1xuICAgIGFwcC5jbGFzc0xpc3QucmVwbGFjZShcInByZWdhbWVcIiwgXCJzZXR1cFwiKTtcblxuICAgIGFwcC5hcHBlbmRDaGlsZChjcmVhdGVTZXR1cFdyYXBwZXIoKSk7XG5cbiAgICBkaXNwbGF5V2VsY29tZU1lc3NhZ2UoKTtcbiAgICBpbml0QnV0dG9ucygpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2V0dXBXcmFwcGVyKCkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBoZWxwZXIuY3JlYXRlKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInNldHVwLXdyYXBwZXJcIiB9KTtcblxuICAgIGhlbHBlci5hcHBlbmRBbGwod3JhcHBlciwgW1xuICAgICAgQ29tcG9uZW50LmNyZWF0ZU1lc3NhZ2VTZWN0aW9uKFtcInNldHVwXCIsIFwiY2FwdGFpblwiXSksXG4gICAgICBjcmVhdGVNYXBGbGVldFNlY3Rpb24oKSxcbiAgICAgIGNyZWF0ZVJlc2V0Q29udGludWVTZWN0aW9uKCksXG4gICAgXSk7XG5cbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU1hcEZsZWV0U2VjdGlvbigpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gaGVscGVyLmNyZWF0ZShcInNlY3Rpb25cIiwge1xuICAgICAgaWQ6IFwic2V0dXAtY29udGFpbmVyXCIsXG4gICAgICBjbGFzc05hbWU6IFwic2V0dXAtY29udGFpbmVyXCIsXG4gICAgfSk7XG5cbiAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGNyZWF0ZU1hcEZsZWV0KCkpO1xuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVNYXBGbGVldCgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBoZWxwZXIuY3JlYXRlKFwiZGl2XCIsIHtcbiAgICAgIGNsYXNzTmFtZTogXCJib2FyZC1mbGVldC1jb250YWluZXJcIixcbiAgICB9KTtcblxuICAgIGhlbHBlci5hcHBlbmRBbGwoY29udGFpbmVyLCBbXG4gICAgICBoZWxwZXIuY3JlYXRlTWFwKFwic2V0dXBcIiksXG4gICAgICBjcmVhdGVGbGVldFNlbGVjdFNlY3Rpb24oKSxcbiAgICBdKTtcblxuICAgIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiI2JvYXJkLXNldHVwXCIpLmFwcGVuZENoaWxkKGNyZWF0ZUF4aXNCdXR0b25zKCkpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZsZWV0U2VsZWN0U2VjdGlvbigpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gaGVscGVyLmNyZWF0ZShcInNlY3Rpb25cIiwge1xuICAgICAgaWQ6IFwiZmxlZXQtc2V0dXBcIixcbiAgICAgIGNsYXNzTmFtZTogXCJmbGVldC1zZXR1cFwiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZmxlZXQgPSBbXG4gICAgICBcImNhcnJpZXJcIixcbiAgICAgIFwiYmF0dGxlc2hpcFwiLFxuICAgICAgXCJjcnVpc2VyXCIsXG4gICAgICBcInN1Ym1hcmluZVwiLFxuICAgICAgXCJkZXN0cm95ZXJcIixcbiAgICBdO1xuXG4gICAgZmxlZXQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgY29uc3Qgc2hpcENhcmQgPSBDb21wb25lbnQuY3JlYXRlU2hpcENhcmQoc2hpcCk7XG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKHNoaXBDYXJkKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXhpc0J1dHRvbnMoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gaGVscGVyLmNyZWF0ZShcImRpdlwiLCB7XG4gICAgICBpZDogXCJheGlzLWJ1dHRvbi1jb250YWluZXJcIixcbiAgICAgIGNsYXNzTmFtZTogXCJheGlzLWJ1dHRvbi1jb250YWluZXJcIixcbiAgICB9KTtcblxuICAgIGNvbnN0IGJ1dHRvblggPSBoZWxwZXIuY3JlYXRlKFwiYnV0dG9uXCIsIHtcbiAgICAgIGlkOiBcIngtYnV0dG9uXCIsXG4gICAgICBjbGFzc05hbWU6IFwiYXhpcy1idXR0b25cIixcbiAgICAgIHRleHRDb250ZW50OiBcIlggYXhpc1wiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYnV0dG9uWSA9IGhlbHBlci5jcmVhdGUoXCJidXR0b25cIiwge1xuICAgICAgaWQ6IFwieS1idXR0b25cIixcbiAgICAgIGNsYXNzTmFtZTogXCJheGlzLWJ1dHRvblwiLFxuICAgICAgdGV4dENvbnRlbnQ6IFwiWSBheGlzXCIsXG4gICAgfSk7XG5cbiAgICBidXR0b25YLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblxuICAgIGhlbHBlci5hcHBlbmRBbGwoY29udGFpbmVyLCBbYnV0dG9uWCwgYnV0dG9uWV0pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlc2V0Q29udGludWVTZWN0aW9uKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGhlbHBlci5jcmVhdGUoXCJzZWN0aW9uXCIsIHtcbiAgICAgIGlkOiBcInJlc2V0LWNvbnRpbnVlLXNlY3Rpb25cIixcbiAgICAgIGNsYXNzTmFtZTogXCJyZXNldC1jb250aW51ZS1zZWN0aW9uXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNldEJ1dHRvbiA9IGhlbHBlci5jcmVhdGUoXCJidXR0b25cIiwge1xuICAgICAgaWQ6IFwicmVzZXQtYnV0dG9uXCIsXG4gICAgICBjbGFzc05hbWU6IFwicmVzZXQtYnV0dG9uXCIsXG4gICAgICB0ZXh0Q29udGVudDogXCJSZXNldFwiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGludWVCdXR0b24gPSBoZWxwZXIuY3JlYXRlKFwiYnV0dG9uXCIsIHtcbiAgICAgIGlkOiBcImNvbnRpbnVlLWJ1dHRvblwiLFxuICAgICAgY2xhc3NOYW1lOiBcImNvbnRpbnVlLWJ1dHRvblwiLFxuICAgICAgdGV4dENvbnRlbnQ6IFwiQ29udGludWVcIixcbiAgICB9KTtcblxuICAgIGhlbHBlci5hcHBlbmRBbGwoY29udGFpbmVyLCBbcmVzZXRCdXR0b24sIGNvbnRpbnVlQnV0dG9uXSk7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzcGxheVdlbGNvbWVNZXNzYWdlKCkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lc3NhZ2UtY2FwdGFpblwiKTtcbiAgICBDb21wb25lbnQuYWRkVHlwZVdyaXR0ZXJNZXNzYWdlKG1lc3NhZ2UsIE1lc3NhZ2UuZ2V0V2VsY29tZU1lc3NhZ2UoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0QnV0dG9ucygpIHtcbiAgICBpbml0QXhpc0J1dHRvbnMoKTtcbiAgICBpbml0UmVzZXRDb250aW51ZUJ1dHRvbnMoKTtcblxuICAgIHNldFRhYkluZGV4Q2FyZHMoKTtcbiAgICBkaXNhYmxlQ29udGludWVCdXR0b24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRBeGlzQnV0dG9ucygpIHtcbiAgICBjb25zdCBidXR0b25YID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ4LWJ1dHRvblwiKTtcbiAgICBjb25zdCBidXR0b25ZID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ5LWJ1dHRvblwiKTtcblxuICAgIGJ1dHRvblguYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGhhbmRsZUJ1dHRvbihidXR0b25YLCBidXR0b25ZKSk7XG4gICAgYnV0dG9uWS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gaGFuZGxlQnV0dG9uKGJ1dHRvblksIGJ1dHRvblgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUJ1dHRvbihidXR0b24sIG9wcG9zaXRlQnV0dG9uKSB7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcbiAgICBvcHBvc2l0ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRUYWJJbmRleENhcmRzKCkge1xuICAgIGNvbnN0IHNoaXBDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2hpcC1jYXJkXCIpO1xuICAgIHNoaXBDYXJkcy5mb3JFYWNoKChzaGlwQ2FyZCkgPT4gc2hpcENhcmQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgMCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzYWJsZUNvbnRpbnVlQnV0dG9uKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGludWUtYnV0dG9uXCIpO1xuXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgRHJhZ0Ryb3AucHJldmVudEVudGVyRGVmYXVsdCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0UmVzZXRDb250aW51ZUJ1dHRvbnMoKSB7XG4gICAgY29uc3QgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc2V0LWJ1dHRvblwiKTtcbiAgICBjb25zdCBjb250aW51ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGludWUtYnV0dG9uXCIpO1xuICAgIGNvbnN0IGdhbWVib2FyZCA9IEdhbWUuZ2V0R2FtZSgpLmdldFVzZXJQbGF5ZXIoKS5nZXRHYW1lYm9hcmQoKTtcblxuICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBoYW5kbGVSZXNldChnYW1lYm9hcmQpKTtcbiAgICBjb250aW51ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ29udGludWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVzZXQoZ2FtZWJvYXJkKSB7XG4gICAgY29uc3QgZmllbGRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZWxkLWNvbnRhaW5lci1zZXR1cFwiKTtcblxuICAgIHJlc2V0RmxlZXRTZWxlY3QoKTtcbiAgICBnYW1lYm9hcmQuY2xlYXJCb2FyZCgpO1xuICAgIHJlbW92ZVBsYWNlZFNoaXBzKGZpZWxkQ29udGFpbmVyKTtcbiAgICBkaXNhYmxlQ29udGludWVCdXR0b24oKTtcbiAgICBzZXRUYWJJbmRleENhcmRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldEZsZWV0U2VsZWN0KCkge1xuICAgIGNvbnN0IGZsZWV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGVldC1zZXR1cFwiKTtcblxuICAgIFsuLi5mbGVldC5jaGlsZHJlbl0uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZGVuXCIpKSB7XG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVBsYWNlZFNoaXBzKGZpZWxkQ29udGFpbmVyKSB7XG4gICAgY29uc3Qgc2hpcHMgPSBmaWVsZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLnNoaXAtaW1hZ2UtY29udGFpbmVyXCIpO1xuICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHNoaXAucmVtb3ZlKCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ29udGludWUoKSB7XG4gICAgaWYgKEdhbWUuZ2V0R2FtZSgpLmdldFVzZXJQbGF5ZXIoKS5nZXRHYW1lYm9hcmQoKS5nZXRGbGVldE51bWJlcigpID09PSA1KSB7XG4gICAgICBCYXR0bGUubG9hZEJhdHRsZUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxvYWRTZXR1cENvbnRlbnQsXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwKCk7XG4iLCJpbXBvcnQgaGVscGVyIGZyb20gXCIuL2hlbHBlclwiO1xuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vbG9naWMvZ2FtZVwiO1xuXG5pbXBvcnQgcHJlZ2FtZSBmcm9tIFwiLi9wcmVnYW1lXCI7XG5pbXBvcnQgc2V0dXAgZnJvbSBcIi4vc2V0dXBcIjtcbmltcG9ydCBEcmFnRHJvcCBmcm9tIFwiLi9kcmFnRHJvcFwiO1xuXG5mdW5jdGlvbiB2aWV3KCkge1xuICBmdW5jdGlvbiBsb2FkQ29udGVudCgpIHtcbiAgICBoZWxwZXIuZGVsZXRlQXBwQ29udGVudCgpO1xuICAgIHByZWdhbWUubG9hZENhcmQoKTtcbiAgICBpbml0UGxheUJ1dHRvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFBsYXlCdXR0b24oKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LW5vdy1idXR0b25cIik7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsb2FkU2V0dXApO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9hZFNldHVwKCkge1xuICAgIHNldFBsYXllck5hbWUoKTtcbiAgICBoZWxwZXIuZGVsZXRlQXBwQ29udGVudCgpO1xuICAgIHNldHVwLmxvYWRTZXR1cENvbnRlbnQoKTtcbiAgICBEcmFnRHJvcC5pbml0RHJhZ2dhYmxlRmllbGRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQbGF5ZXJOYW1lKCkge1xuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWUtaW5wdXRcIikudmFsdWUudG9TdHJpbmcoKS50cmltKCk7XG4gICAgR2FtZS5zdGFydEdhbWUobmFtZSB8fCBcIkNhcHRhaW5cIik7XG4gICAgY29uc29sZS5sb2cobmFtZSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxvYWRDb250ZW50LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB2aWV3KCk7XG4iLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXIuanNcIjtcblxuZnVuY3Rpb24gR2FtZSgpIHtcblxuICBjb25zdCBzaGlwcyA9IFtcImNhcnJpZXJcIiwgXCJiYXR0bGVzaGlwXCIsIFwiY3J1aXNlclwiLCBcInN1Ym1hcmluZVwiLCBcImRlc3Ryb3llclwiXTtcbiAgbGV0IGdhbWU7XG5cbiAgZnVuY3Rpb24gc3RhcnRHYW1lKHVzZXJOYW1lKSB7XG5cbiAgICBjb25zdCB1c2VyUGxheWVyID0gUGxheWVyKHVzZXJOYW1lKTtcbiAgICBjb25zdCBjb21wdXRlclBsYXllciA9IFBsYXllcihcImNvbXB1dGVyXCIpO1xuICAgIFxuICAgIGNvbnN0IGNvbXB1dGVyVGFyZ2V0UXVldWUgPSBbXTtcblxuICAgIGNvbnN0IGdldFVzZXJQbGF5ZXIgPSAoKSA9PiB1c2VyUGxheWVyO1xuICAgIFxuICAgIGNvbnN0IGdldENvbXB1dGVyUGxheWVyID0gKCkgPT4gY29tcHV0ZXJQbGF5ZXI7XG5cbiAgICBjb25zdCBhdXRvUGxhY2VDb21wdXRlclBsYXllciA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBzaGlwc1tpXTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBNYXRoLnRydW5jKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgY29uc3QgY29sdW1uID0gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgIGNvbnN0IGhvcml6b250YWwgPSBNYXRoLnJhbmRvbSgpID4gMC41O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbXB1dGVyUGxheWVyLnBsYWNlU2hpcChyb3csIGNvbHVtbiwgc2hpcCwgaG9yaXpvbnRhbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHBsYXllckF0dGFjayA9IChyb3csIGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY29tcHV0ZXJQbGF5ZXIuYXR0YWNrRW5lbXkoXG4gICAgICAgIGNvbXB1dGVyUGxheWVyLmdldEdhbWVib2FyZCgpLFxuICAgICAgICByb3csXG4gICAgICAgIGNvbHVtbixcbiAgICAgICk7XG5cbiAgICAgIGlmIChyZXN1bHQpIHJldHVybiByZXN1bHQ7XG4gICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBjb25zdCBhdXRvQ29tcHV0ZXJBdHRhY2sgPSAoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgbGV0IHJvdztcbiAgICAgIGxldCBjb2x1bW47XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlmIChjb21wdXRlclRhcmdldFF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBbcm93LCBjb2x1bW5dID0gY29tcHV0ZXJUYXJnZXRRdWV1ZVswXTtcbiAgICAgICAgICBjb21wdXRlclRhcmdldFF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcm93ID0gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgIGNvbHVtbiA9IE1hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVzdWx0ID0gY29tcHV0ZXJQbGF5ZXIuYXR0YWNrRW5lbXkoXG4gICAgICAgICAgICB1c2VyUGxheWVyLmdldEdhbWVib2FyZCgpLFxuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdCkgcG9wdWxhdGVRdWV1ZShyb3csIGNvbHVtbik7XG5cbiAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2hpcDogcmVzdWx0LFxuICAgICAgICAgIGNvb3JkOiBbcm93LCBjb2x1bW5dLFxuICAgICAgICB9O1xuICAgICAgZWxzZSByZXR1cm4gW3JvdywgY29sdW1uXTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcG9wdWxhdGVRdWV1ZShyb3csIGNvbHVtbikge1xuICAgICAgLy8gdXAsIHJpZ2h0LCBkb3duLCBsZWZ0XG4gICAgICBjb25zdCBkcm93ID0gWy0xLCAwLCAxLCAwXTtcbiAgICAgIGNvbnN0IGRjb2wgPSBbMCwgMSwgMCwgLTFdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICBjb25zdCBuZXdSb3cgPSByb3cgKyBkcm93W2ldO1xuICAgICAgICBjb25zdCBuZXdDb2x1bW4gPSBjb2x1bW4gKyBkY29sW2ldO1xuICAgICAgICBpZiAobmV3Um93IDw9IDkgJiYgbmV3Um93ID49IDAgJiYgbmV3Q29sdW1uIDw9IDkgJiYgbmV3Q29sdW1uID49IDApIHtcbiAgICAgICAgICBjb21wdXRlclRhcmdldFF1ZXVlLnB1c2goW25ld1JvdywgbmV3Q29sdW1uXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnYW1lID0ge1xuICAgICAgZ2V0VXNlclBsYXllcixcbiAgICAgIGdldENvbXB1dGVyUGxheWVyLFxuICAgICAgcGxheWVyQXR0YWNrLFxuICAgICAgYXV0b1BsYWNlQ29tcHV0ZXJQbGF5ZXIsXG4gICAgICBhdXRvQ29tcHV0ZXJBdHRhY2ssXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEdhbWUoKSB7XG4gICAgaWYgKCFnYW1lKSB0aHJvdyBuZXcgRXJyb3IoXCJGaXJzdCBpbml0aWFsaXplIHRoZSBnYW1lXCIpO1xuICAgIHJldHVybiBnYW1lO1xuICB9XG5cbiAgcmV0dXJuIHsgc3RhcnRHYW1lLCBnZXRHYW1lIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWUoKTtcbiIsImltcG9ydCB7IFNoaXAgfSBmcm9tIFwiLi9zaGlwLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBHYW1lQm9hcmQoKSB7XG4gIGNvbnN0IHJvd3MgPSAxMDtcbiAgY29uc3QgY29sdW1ucyA9IDEwO1xuXG4gIGxldCBib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHJvd3MgfSwgKCkgPT4gQXJyYXkoY29sdW1ucykuZmlsbChudWxsKSk7XG5cbiAgY29uc3Qgc2hpcFBvcyA9IHtcbiAgICBjYXJyaWVyOiBudWxsLFxuICAgIGJhdHRsZXNoaXA6IG51bGwsXG4gICAgY3J1aXNlcjogbnVsbCxcbiAgICBzdWJtYXJpbmU6IG51bGwsXG4gICAgZGVzdHJveWVyOiBudWxsLFxuICB9O1xuXG4gIGNvbnN0IHNoaXBMZW5ndGhzID0ge1xuICAgIGNhcnJpZXI6IDUsXG4gICAgYmF0dGxlc2hpcDogNCxcbiAgICBjcnVpc2VyOiAzLFxuICAgIHN1Ym1hcmluZTogMyxcbiAgICBkZXN0cm95ZXI6IDIsXG4gIH07XG5cbiAgbGV0IHNoaXBPbkRyYWcgPSB7IG5hbWU6IFwiXCIsIGxlbmd0aDogMCB9O1xuXG4gIGxldCBzdW5rU2hpcHMgPSAwO1xuICBsZXQgZmxlZXROdW1iZXIgPSAwO1xuXG4gIGNvbnN0IGdldFNoaXBJbml0aWFsUG9zaXRpb24gPSAobmFtZSkgPT4gc2hpcFBvc1tuYW1lXTtcblxuICBjb25zdCBnZXRCb2FyZCA9ICgpID0+IGJvYXJkO1xuXG4gIGNvbnN0IGNsZWFyQm9hcmQgPSAoKSA9PlxuICAgIChib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHJvd3MgfSwgKCkgPT4gQXJyYXkoY29sdW1ucykuZmlsbChudWxsKSkpO1xuXG4gIGNvbnN0IGdldFNoaXAgPSAocm93LCBjb2x1bW4pID0+IHtcbiAgICBpZiAocm93IDwgMCB8fCByb3cgPj0gcm93cyB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbiA+PSBjb2x1bW5zKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUm93IHBvc2l0aW9uIG91dCBvZiByYW5nZVwiKTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbHVtbl0gPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKFwiTm8gc2hpcCBpbiB0aGlzIHBvc2l0aW9uXCIpO1xuICAgIGlmIChib2FyZFtyb3ddW2NvbHVtbl0gPT0gXCJtaXNzXCIgfHwgYm9hcmRbcm93XVtjb2x1bW5dID09IFwiaGl0XCIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzaGlwIGluIHRoaXMgcG9zaXRpb25cIik7XG5cbiAgICByZXR1cm4gYm9hcmRbcm93XVtjb2x1bW5dO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChyb3csIGNvbHVtbiwgc2hpcE5hbWUsIGhvcml6b250YWwpID0+IHtcbiAgICBpZiAocm93IDwgMCB8fCByb3cgPj0gcm93cyB8fCBjb2x1bW4gPCAwIHx8IGNvbHVtbiA+PSBjb2x1bW5zKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUm93IHBvc2l0aW9uIG91dCBvZiByYW5nZVwiKTtcblxuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwTGVuZ3Roc1tzaGlwTmFtZV07XG4gICAgaWYgKFxuICAgICAgKGhvcml6b250YWwgJiYgY29sdW1uICsgc2hpcExlbmd0aCA+IGNvbHVtbnMpIHx8XG4gICAgICAoIWhvcml6b250YWwgJiYgcm93ICsgc2hpcExlbmd0aCA+IHJvd3MpXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaGlwIGRvZXMgbm90IGZpdCBmcm9tIHRoZSBnaXZlbiBwb3NpdGlvblwiKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgICAgaWYgKGJvYXJkW3Jvd11bY29sdW1uICsgaV0gIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb3NpdGlvbiBhbHJlYWR5IHRha2VuXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYm9hcmRbcm93ICsgaV1bY29sdW1uXSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGFscmVhZHkgdGFrZW5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBuZXdTaGlwID0gaG9yaXpvbnRhbFxuICAgICAgPyBTaGlwKHNoaXBOYW1lLCBzaGlwTGVuZ3RoLCBcIlhcIilcbiAgICAgIDogU2hpcChzaGlwTmFtZSwgc2hpcExlbmd0aCwgXCJZXCIpO1xuXG4gICAgc2hpcFBvc1tzaGlwTmFtZV0gPSBbcm93LCBjb2x1bW5dO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bY29sdW1uICsgaV0gPSBuZXdTaGlwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9hcmRbcm93ICsgaV1bY29sdW1uXSA9IG5ld1NoaXA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmxlZXROdW1iZXIrKztcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHJvdywgY29sdW1uKSA9PiB7XG4gICAgaWYgKHJvdyA8IDAgfHwgcm93ID49IHJvd3MgfHwgY29sdW1uIDwgMCB8fCBjb2x1bW4gPj0gY29sdW1ucylcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlJvdyBwb3NpdGlvbiBvdXQgb2YgcmFuZ2VcIik7XG5cbiAgICBsZXQgZGF0YSA9IGJvYXJkW3Jvd11bY29sdW1uXTtcblxuICAgIGlmIChkYXRhID09IFwibWlzc1wiIHx8IGRhdGEgPT0gXCJoaXRcIilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGFscmVhZHkgYXR0YWNrZWRcIik7XG5cbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICBib2FyZFtyb3ddW2NvbHVtbl0gPSBcIm1pc3NcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5oaXQoKTtcbiAgICAgIGlmIChkYXRhLmlzU3VuaygpKSBzdW5rU2hpcHMrKztcbiAgICAgIGJvYXJkW3Jvd11bY29sdW1uXSA9IFwiaGl0XCI7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaXNHYW1lT3ZlciA9ICgpID0+IHN1bmtTaGlwcyA9PT0gNTtcblxuICBjb25zdCBnZXRTaGlwT25EcmFnID0gKCkgPT4gc2hpcE9uRHJhZztcblxuICBjb25zdCBzZXRTaGlwT25EcmFnID0gKHNoaXBJbmZvKSA9PiB7XG4gICAgc2hpcE9uRHJhZy5uYW1lID0gc2hpcEluZm8ubmFtZTtcbiAgICBzaGlwT25EcmFnLmxlbmd0aCA9IHNoaXBJbmZvLmxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBnZXRGbGVldE51bWJlciA9ICgpID0+IGZsZWV0TnVtYmVyO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0Qm9hcmQsXG4gICAgY2xlYXJCb2FyZCxcbiAgICBwbGFjZVNoaXAsXG4gICAgZ2V0U2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGlzR2FtZU92ZXIsXG4gICAgZ2V0U2hpcE9uRHJhZyxcbiAgICBzZXRTaGlwT25EcmFnLFxuICAgIGdldEZsZWV0TnVtYmVyLFxuICAgIGdldFNoaXBJbml0aWFsUG9zaXRpb24sXG4gIH07XG59XG4iLCJpbXBvcnQgeyBHYW1lQm9hcmQgfSBmcm9tIFwiLi9nYW1lYm9hcmQuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIFBsYXllcihuYW1lKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IEdhbWVCb2FyZCgpO1xuXG4gIGNvbnN0IGdldEdhbWVib2FyZCA9ICgpID0+IGdhbWVib2FyZDtcblxuICBjb25zdCBnZXROYW1lID0gKCkgPT4gbmFtZTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAocm93LCBjb2x1bW4sIHNoaXBOYW1lLCBob3Jpem9udGFsKSA9PlxuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAocm93LCBjb2x1bW4sIHNoaXBOYW1lLCBob3Jpem9udGFsKTtcblxuICBjb25zdCBhdHRhY2tFbmVteSA9IChlbmVteUdhbWVib2FyZCwgcm93LCBjb2x1bW4pID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGVuZW15R2FtZWJvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2x1bW4pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2V0R2FtZWJvYXJkLCBnZXROYW1lLCBwbGFjZVNoaXAsIGF0dGFja0VuZW15IH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gU2hpcChuYW1lLCBsZW5ndGgsIGF4aXMpIHtcbiAgbGV0IG51bWJlck9mSGl0cyA9IDA7XG4gIGxldCBzdW5rID0gZmFsc2U7XG5cbiAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IG5hbWU7XG5cbiAgY29uc3QgZ2V0TGVuZ3RoID0gKCkgPT4gbGVuZ3RoO1xuXG4gIGNvbnN0IGdldEF4aXMgPSAoKSA9PiBheGlzO1xuXG4gIGNvbnN0IGdldE51bWJlck9mSGl0cyA9ICgpID0+IG51bWJlck9mSGl0cztcblxuICBjb25zdCBoaXQgPSAoKSA9PiBudW1iZXJPZkhpdHMrKztcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiBudW1iZXJPZkhpdHMgPT09IGxlbmd0aDtcblxuICByZXR1cm4geyBnZXROYW1lLCBnZXRMZW5ndGgsIGdldEF4aXMsIGdldE51bWJlck9mSGl0cywgaGl0LCBpc1N1bmsgfTtcbn1cbiIsImltcG9ydCBHYW1lIGZyb20gXCIuLi9sb2dpYy9nYW1lXCI7XG5cbmZ1bmN0aW9uIE1lc3NhZ2UoKSB7XG4gIGNvbnN0IG1lc3NhZ2VzID0ge1xuICAgIHdlbGNvbWU6IFtcbiAgICAgIFwiV2VsY29tZSBhYm9hcmRcIixcbiAgICAgIFwiUGxhbiBvdXIgZm9ybWF0aW9uIGJ5IHNlbGVjdGluZyB0aGUgYXhpcyBhbmQgZHJhZ2dpbmcgYW5kIGRyb3BwaW5nIHNoaXBzIG9uIHRoZSBtYXAuXCIsXG4gICAgXSxcbiAgICBiYXR0bGVTdGFydFBsYXllcjogW1xuICAgICAgXCJhbGwgc3lzdGVtcyBhcmUgb25saW5lIGFuZCByZWFkeSBmb3IgYWN0aW9uLiBMZXQncyBnaXZlICdlbSBoZWxsIVwiLFxuICAgIF0sXG4gICAgYmF0dGxlU3RhcnRFbmVteTogW1xuICAgICAgXCJQcmVwYXJlIHlvdXJzZWxmIGZvciBhIGJhdHRsZSB1bmxpa2UgYW55IG90aGVyLCBmb3IgSSBzaGFsbCBiZSBhcyBydXRobGVzcyBhcyBmYXRlIGl0c2VsZiwganVzdCBhcyB5b3VyIGZvcmViZWFycyB3ZXJlIHRvIG1pbmUuIFRoaXMgb2NlYW4gd2lsbCBiZWFyIHdpdG5lc3MgdG8gb3VyIGNvbnRlc3QsIGFuZCBJIHByb21pc2UgeW91LCB0aGVyZSBzaGFsbCBiZSBubyBxdWFydGVyIGdpdmVuIG5vciBhc2tlZC5cIixcbiAgICBdLFxuICAgIGVuZW15SGl0OiBbXG4gICAgICBcIlRoZXkndmUganVzdCBjYXVnaHQgYSBjYW5ub25iYWxsIHRvIHRoZSBodWxsLCBzaXIhXCIsXG4gICAgICBcIk91ciBwcmVjaXNpb24gc3RyaWtlcyBhcmUgdGFraW5nIGEgdG9sbCBvbiB0aGVpciBzaGlwLCBDYXB0YWluLlwiLFxuICAgICAgXCJUaGUgZW5lbXkgdmVzc2VsIGlzIGZlZWxpbmcgdGhlIHdlaWdodCBvZiBvdXIgZmlyZXBvd2VyLCBzaXIuXCIsXG4gICAgICBcIlRoZWlyIHNoaXAgaXMgaW4gYSBkb3dud2FyZCBzcGlyYWwsIGp1c3QgbGlrZSB0aGVpciBob3BlcyBvZiB2aWN0b3J5IVwiLFxuICAgICAgXCJUaGF0IHNob3Qgd2FzIGEgbWFzdGVycGllY2UsIENhcHRhaW4uIFRoZWlyIGZhdGUgaXMgc2VhbGVkLlwiLFxuICAgICAgXCJEaXJlY3QgaGl0LCBDYXB0YWluISBUaGUgZW5lbXkgc2hpcCdzIGRlZmVuc2VzIGFyZSBjcnVtYmxpbmcuXCIsXG4gICAgICBcIldlJ3ZlIHNjb3JlZCBhIHNvbGlkIGhpdCBvbiB0aGUgZW5lbXkgdmVzc2VsLCBzaXIuXCIsXG4gICAgICBcIkEgdGh1bmRlcm91cyBibG93LCBDYXB0YWluISBUaGUgZW5lbXkgc2hpcCBpcyBpbiBkaXJlIHN0cmFpdHMuXCIsXG4gICAgICBcIktBQk9PTSEgVGhlIGVuZW15IHNoaXAgaXMgdGFraW5nIGEgYmVhdGluZy4gVGhleSB3b24ndCBsYXN0IGxvbmcuXCIsXG4gICAgICBcIkFub3RoZXIgcHJlY2lzZSBoaXQsIENhcHRhaW4uIFRoZWlyIGNvbWJhdCBjYXBhYmlsaXRpZXMgYXJlIGluIHNoYW1ibGVzLlwiLFxuICAgIF0sXG4gICAgZW5lbXlTdW5rOiBbXG4gICAgICBcIkNhcHRhaW4sIHRoZWlyIHNoaXAgaXMgZ29pbmcgdW5kZXIuIFRoYXQgd2FzIGEgc2hvdCBmb3IgdGhlIGhpc3RvcnkgYm9va3MuXCIsXG4gICAgICBcIlNpciwgd2UndmUgc2VudCB0aGUgZW5lbXkgc2hpcCB0byB0aGUgYWJ5c3MuIEl0J3Mgc3Vuay5cIixcbiAgICAgIFwiVGhlIGVuZW15IHNoaXAgaGFzIG1ldCBpdHMgZW5kLCBDYXB0YWluLiBUaGV5IHdvbid0IHRyb3VibGUgdXMgYWdhaW4uXCIsXG4gICAgICBcIkNhcHRhaW4sIHdlJ3ZlIGRlYWx0IHRoZSBmaW5hbCBibG93LiBUaGUgZW5lbXkgc2hpcCBpcyBzdW5rLlwiLFxuICAgICAgXCJXZSd2ZSBjb25zaWduZWQgdGhlIGVuZW15IHNoaXAgdG8gdGhlIGRlcHRocywgQ2FwdGFpbi4gV2VsbCBkb25lLlwiLFxuICAgICAgXCJDYXB0YWluLCB0aGUgZW5lbXkgc2hpcCBpcyBubyBtb3JlLiBUaGV5IHdvbid0IHBlc3RlciB1cyBhZ2Fpbi5cIixcbiAgICAgIFwiVGhhdCBzaG90IHdhcyB0aGUgbmFpbCBpbiB0aGUgY29mZmluLCBDYXB0YWluLiBUaGUgZW5lbXkgc2hpcCBpcyBhdCByZXN0IGJlbmVhdGggdGhlIHdhdmVzLlwiLFxuICAgICAgXCJEaXJlY3QgaGl0LCBDYXB0YWluLiBUaGUgZW5lbXkgc2hpcCBub3cgcmVzdHMgb24gdGhlIG9jZWFuIGZsb29yLlwiLFxuICAgICAgXCJUaGUgZW5lbXkgc2hpcCBpcyBvdXQgb2YgY29tbWlzc2lvbi4gVGhleSB3b24ndCB0cm91YmxlIHVzIGFueW1vcmUuXCIsXG4gICAgICBcIldlJ3ZlIGp1c3QgZ2l2ZW4gdGhlIGVuZW15IHNoaXAgYSBvbmUtd2F5IHRyaXAgdG8gdGhlIG9jZWFuJ3MgZGVwdGhzLCBDYXB0YWluLlwiLFxuICAgIF0sXG4gICAgcGxheWVyTWlzczogW1xuICAgICAgXCJBIG5lYXIgbWlzcywgYnV0IG5vIGNpZ2FyLCBjYXB0YWluLlwiLFxuICAgICAgXCJPdXIgc2hvdHMgbmVlZCByZWZpbmluZywgY2FwdGFpbi4gVGhleSBzbGlwcGVkIHRocm91Z2ggb3VyIGZpbmdlcnMuXCIsXG4gICAgICBcIk5lZ2F0aXZlLCBjYXB0YWluLiBUaGF0IHNob3QgbWlzc2VkIHRoZSBtYXJrLlwiLFxuICAgICAgXCJXZSd2ZSBjb21lIHVwIGVtcHR5LWhhbmRlZCwgY2FwdGFpbi4gS2VlcCB0aGUgZmlyZSBidXJuaW5nIVwiLFxuICAgICAgXCJUaGF0IHdhcyBhIGNsb3NlIHNoYXZlLCBzaXIsIGJ1dCBubyBoaXQuXCIsXG4gICAgICBcIk5vIGx1Y2sgdGhpcyB0aW1lLiBLZWVwIHVwIHRoZSBlZmZvcnQhXCIsXG4gICAgICBcIlRoZSBlbmVteSBpcyBwcm92aW5nIGVsdXNpdmUsIHNpci4gTGV0J3Mgc3RheSB2aWdpbGFudC5cIixcbiAgICAgIFwiVGltZSB0byBmaW5lLXR1bmUgb3VyIGFpbSwgc2lyLiBUaGV5IHdvbid0IGVsdWRlIHVzIGZvciBsb25nLlwiLFxuICAgICAgXCJPdXIgc2lnaHRzIGFyZSBzbGlnaHRseSBvZmYsIHNpci4gV2UnbGwgZ2V0IHRoZW0gbmV4dCB0aW1lLlwiLFxuICAgICAgXCJQcm9ncmVzcyBpcyBzbG93LCBjYXB0YWluLiBXaGF0J3MgdGhlIG5leHQgbW92ZSBpbiBvdXIgc3RyYXRlZ3k/XCIsXG4gICAgXSxcbiAgICBwbGF5ZXJIaXQ6IFtcbiAgICAgIFwiWW91ciBmYXRlIGlzIHNlYWxlZCFcIixcbiAgICAgIFwiSGVoZWhlLCB5b3VyIGZvcnR1bmVzIGFyZSBkd2luZGxpbmcsXCIsXG4gICAgICBcIlByZXBhcmUgZm9yIHRoZSBzdG9ybSBvZiBkZXN0cnVjdGlvbiFcIixcbiAgICAgIFwiVGhhdCB3YXMganVzdCBhIGdsaW1wc2Ugb2YgeW91ciBpbXBlbmRpbmcgZG9vbS5cIixcbiAgICAgIFwiVGhlIG9jZWFuJ3MgZW1icmFjZSBhd2FpdHMgeW91LCBteSBmb2UuXCIsXG4gICAgICBcIk15IHRvcnBlZG9lcyBoYXZlIGZvdW5kIHRoZWlyIG1hcmssIHlvdXIgZW5kIGlzIG5pZ2ghXCIsXG4gICAgICBcIlNvIGVhc2lseSBhbnRpY2lwYXRlZCwgeW91J3JlIG5vdCBldmVuIGEgY2hhbGxlbmdlLlwiLFxuICAgICAgXCJIb3cgZG9lcyBpdCBmZWVsIHRvIGZhY2UgdGhlIGZ1cnkgb2YgbXkgb25zbGF1Z2h0P1wiLFxuICAgICAgXCJZb3VyIGZvcnR1bmUgaGFzIGRlc2VydGVkIHlvdSwgYW5kIHRoZXJlJ3Mgbm8gZXNjYXBlIVwiLFxuICAgICAgXCJTZWVtcyBJJ3ZlIHN0cnVjayBhIG5lcnZlLiBSZWFkeSBmb3IgYSB0YXN0ZSBvZiB5b3VyIG93biBtZWRpY2luZT9cIixcbiAgICBdLFxuICAgIHBsYXllclN1bms6IFtcbiAgICAgIFwiTG9va3MgbGlrZSB5b3UncmUgaGVhZGVkIGZvciBhIHdhdGVyeSBncmF2ZS4gSGVoZWhlLlwiLFxuICAgICAgXCJZb3UgZm91Z2h0IGxpa2UgYSBjb3dhcmQgYW5kIG1ldCBhIGZpdHRpbmcgZW5kLlwiLFxuICAgICAgXCJZb3VyIHNoaXAgd2FzIG5vIG1hdGNoIGZvciBvdXIgb3ZlcndoZWxtaW5nIGZpcmVwb3dlci5cIixcbiAgICAgIFwiQW5vdGhlciBvbmUgYml0ZXMgdGhlIGR1c3QuIENydXNoaW5nIHlvdXIga2luZCBpcyB0b28gZWFzeS5cIixcbiAgICAgIFwiWW91ciBmYXRlIHdhcyBzZWFsZWQgZnJvbSB0aGUgYmVnaW5uaW5nLiBUaGUgc2VhIGNsYWltcyBpdHMgdmljdGltcy5cIixcbiAgICAgIFwiRGlkIHlvdSB0cnVseSBiZWxpZXZlIHlvdSBjb3VsZCBzdGFuZCBhZ2FpbnN0IHVzPyBIb3cgbmFpdmUuXCIsXG4gICAgICBcIkl0J3MgcmVncmV0dGFibGUgdGhhdCB5b3VyIHZlc3NlbCBjcnVtYmxlZCBiZWZvcmUgb3VyIG1pZ2h0LlwiLFxuICAgICAgXCJUaGUgb2NlYW4gZmF2b3JzIHRoZSBzdHJvbmcuIFlvdXIgc2hpcCB3YXMgZG9vbWVkLlwiLFxuICAgICAgXCJDaGFsbGVuZ2luZyBtZSB3YXMgYSBncmF2ZSBlcnJvci4gWW91ciBkZWZlYXQgd2FzIGluZXZpdGFibGUuXCIsXG4gICAgICBcIlN1cnJlbmRlciB3YXMgeW91ciBvbmx5IHNlbnNpYmxlIGNob2ljZS4gTm93IGxvb2sgYXQgdGhlIGNvbnNlcXVlbmNlcy5cIixcbiAgICBdLFxuICAgIGVuZW15TWlzczogW1xuICAgICAgXCJJJ2xsIGhhdmUgbXkgcmV2ZW5nZSBzb29uIGVub3VnaC5cIixcbiAgICAgIFwiSXQncyBteSB0dXJuIHRvIHN0cmlrZSBiYWNrLCBqdXN0IHlvdSB3YWl0LlwiLFxuICAgICAgXCJNaXNzZWQsIGJ1dCBJIHdvbid0IG1pc3MgdHdpY2UuXCIsXG4gICAgICBcIllvdSBjYW4gdHJ5IHRvIGhpZGUsIGJ1dCB5b3Ugd29uJ3QgZWx1ZGUgbWUgZm9yIGxvbmcuXCIsXG4gICAgICBcIkknbGwgZmluZCB5b3UsIG5vIG1hdHRlciB3aGVyZSB5b3UgdHJ5IHRvIGVzY2FwZS5cIixcbiAgICAgIFwiWW91ciBsdWNrIGlzIG1lcmVseSBkZWxheWluZyB0aGUgaW5ldml0YWJsZSwgbXkgZnJpZW5kLlwiLFxuICAgICAgXCJNeSB0b3JwZWRvZXMgYXJlIHJlbGVudGxlc3M7IHRoZXknbGwgdHJhY2sgeW91IGRvd24uXCIsXG4gICAgICBcIllvdSBtYXkgaGF2ZSBldmFkZWQgb25lLCBidXQgdGhlIG5leHQgb25lIHdvbid0IG1pc3MuXCIsXG4gICAgICBcIkNvbnNpZGVyIHRoYXQgYSB3YXJuaW5nIHNob3Q7IHRoZSByZWFsIGJhcnJhZ2UgaXMgb24gaXRzIHdheS5cIixcbiAgICAgIFwiWW91J3JlIHRveWluZyB3aXRoIGRhbmdlciwgYW5kIG15IGFyc2VuYWwgaXMgYm91bmRsZXNzLlwiLFxuICAgIF0sXG4gICAgcGxheWVyV2luOiBbXG4gICAgICBcIk1pc3Npb24gYWNjb21wbGlzaGVkLCBDYXB0YWluISBZb3UgdHJ1bHkgYXJlIHRoZSBtYXN0ZXIgb2YgdGhlIHNlYXMuXCIsXG4gICAgXSxcbiAgICBlbmVteVdpbjogW1wiWW91IHdlcmUgbm8gbWF0Y2ggZm9yIG1lIHNjdW0uXCJdLFxuICB9O1xuXG4gIGZ1bmN0aW9uIGdldFdlbGNvbWVNZXNzYWdlKCkge1xuICAgIC8vIGFkZCB0aGUgbmFtZSBvZiB0aGUgaW5ncmVzZWQgYnkgdGUgcGxheWVyXG4gICAgbWVzc2FnZXMud2VsY29tZVswXSArPSBgICR7R2FtZS5nZXRHYW1lKCkuZ2V0VXNlclBsYXllcigpLmdldE5hbWUoKX0hYDtcbiAgICByZXR1cm4gbWVzc2FnZXMud2VsY29tZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJhdHRsZVN0YXJ0TWVzc2FnZSgpIHtcbiAgICByZXR1cm4gYCR7R2FtZS5nZXRHYW1lKCkuZ2V0VXNlclBsYXllcigpLmdldE5hbWUoKX0gJHtcbiAgICAgIG1lc3NhZ2VzLmJhdHRsZVN0YXJ0UGxheWVyWzBdXG4gICAgfWA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRFbmVteUJhdHRsZVN0YXJ0TWVzc2FnZSgpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuYmF0dGxlU3RhcnRFbmVteVswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5ld0VuZW15SGl0TWVzc2FnZShwcmV2TWVzc2FnZSkge1xuICAgIGxldCBuZXdNZXNzYWdlID0gcHJldk1lc3NhZ2U7XG4gICAgd2hpbGUgKG5ld01lc3NhZ2UgPT09IHByZXZNZXNzYWdlKSB7XG4gICAgICBuZXdNZXNzYWdlID0gbWVzc2FnZXMuZW5lbXlIaXRbcmFuZG9tQ2hvaWNlKG1lc3NhZ2VzLmVuZW15SGl0Lmxlbmd0aCldO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdNZXNzYWdlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmV3RW5lbXlTdW5rTWVzc2FnZShwcmV2TWVzc2FnZSkge1xuICAgIGxldCBuZXdNZXNzYWdlID0gcHJldk1lc3NhZ2U7XG4gICAgd2hpbGUgKG5ld01lc3NhZ2UgPT09IHByZXZNZXNzYWdlKSB7XG4gICAgICBuZXdNZXNzYWdlID0gbWVzc2FnZXMuZW5lbXlTdW5rW3JhbmRvbUNob2ljZShtZXNzYWdlcy5lbmVteVN1bmsubGVuZ3RoKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld01lc3NhZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXdQbGF5ZXJNaXNzTWVzc2FnZShwcmV2TWVzc2FnZSkge1xuICAgIGxldCBuZXdNZXNzYWdlID0gcHJldk1lc3NhZ2U7XG4gICAgd2hpbGUgKG5ld01lc3NhZ2UgPT09IHByZXZNZXNzYWdlKSB7XG4gICAgICBuZXdNZXNzYWdlID1cbiAgICAgICAgbWVzc2FnZXMucGxheWVyTWlzc1tyYW5kb21DaG9pY2UobWVzc2FnZXMucGxheWVyTWlzcy5sZW5ndGgpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3TWVzc2FnZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5ld1BsYXllckhpdE1lc3NhZ2UocHJldk1lc3NhZ2UpIHtcbiAgICBsZXQgbmV3TWVzc2FnZSA9IHByZXZNZXNzYWdlO1xuICAgIHdoaWxlIChuZXdNZXNzYWdlID09PSBwcmV2TWVzc2FnZSkge1xuICAgICAgbmV3TWVzc2FnZSA9IG1lc3NhZ2VzLnBsYXllckhpdFtyYW5kb21DaG9pY2UobWVzc2FnZXMucGxheWVySGl0Lmxlbmd0aCldO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdNZXNzYWdlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmV3UGxheWVyU3Vua01lc3NhZ2UocHJldk1lc3NhZ2UpIHtcbiAgICBsZXQgbmV3TWVzc2FnZSA9IHByZXZNZXNzYWdlO1xuICAgIHdoaWxlIChuZXdNZXNzYWdlID09PSBwcmV2TWVzc2FnZSkge1xuICAgICAgbmV3TWVzc2FnZSA9XG4gICAgICAgIG1lc3NhZ2VzLnBsYXllclN1bmtbcmFuZG9tQ2hvaWNlKG1lc3NhZ2VzLnBsYXllclN1bmsubGVuZ3RoKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld01lc3NhZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXdFbmVteU1pc3NNZXNzYWdlKHByZXZNZXNzYWdlKSB7XG4gICAgbGV0IG5ld01lc3NhZ2UgPSBwcmV2TWVzc2FnZTtcbiAgICB3aGlsZSAobmV3TWVzc2FnZSA9PT0gcHJldk1lc3NhZ2UpIHtcbiAgICAgIG5ld01lc3NhZ2UgPSBtZXNzYWdlcy5lbmVteU1pc3NbcmFuZG9tQ2hvaWNlKG1lc3NhZ2VzLmVuZW15TWlzcy5sZW5ndGgpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3TWVzc2FnZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbUNob2ljZShvcHRpb25MZW5ndGgpIHtcbiAgICByZXR1cm4gTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogb3B0aW9uTGVuZ3RoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEVuZW15V2luTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gbWVzc2FnZXMuZW5lbXlXaW5bMF07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJXaW5NZXNzYWdlKCkge1xuICAgIHJldHVybiBtZXNzYWdlcy5wbGF5ZXJXaW5bMF07XG4gIH1cblxuICBmdW5jdGlvbiBnZXROb0NvbW1lbnRNZXNzYWdlKCkge1xuICAgIHJldHVybiBcIi4uLlwiO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRXZWxjb21lTWVzc2FnZSxcbiAgICBnZXRCYXR0bGVTdGFydE1lc3NhZ2UsXG4gICAgZ2V0RW5lbXlCYXR0bGVTdGFydE1lc3NhZ2UsXG4gICAgZ2V0TmV3RW5lbXlIaXRNZXNzYWdlLFxuICAgIGdldE5ld0VuZW15U3Vua01lc3NhZ2UsXG4gICAgZ2V0TmV3UGxheWVyTWlzc01lc3NhZ2UsXG4gICAgZ2V0Tm9Db21tZW50TWVzc2FnZSxcbiAgICBnZXROZXdQbGF5ZXJIaXRNZXNzYWdlLFxuICAgIGdldE5ld1BsYXllclN1bmtNZXNzYWdlLFxuICAgIGdldE5ld0VuZW15TWlzc01lc3NhZ2UsXG4gICAgZ2V0RW5lbXlXaW5NZXNzYWdlLFxuICAgIGdldFBsYXllcldpbk1lc3NhZ2UsXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2UoKTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9hc3NldHMvaW1hZ2VzL2dyaWQuc3ZnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAuYmF0dGxlLXdyYXBwZXIge1xuICB3aWR0aDogMTAwJTtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxcmVtO1xuXG4gIG1hcmdpbjogMCBhdXRvO1xuICBtYXgtd2lkdGg6IDc1cmVtO1xufVxuXG4uYm9hcmQucGxheWVyLFxuLmJvYXJkLmNvbXB1dGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjc1KTtcbiAgcGFkZGluZzogMXJlbTtcbn1cblxuLmJvYXJkLnBsYXllciAubWFwLXRpdGxlLWNvbnRhaW5lcixcbi5ib2FyZC5jb21wdXRlciAubWFwLXRpdGxlLWNvbnRhaW5lciB7XG4gIG9yZGVyOiAxO1xuICBncmlkLWNvbHVtbjogMiAvIDM7XG59XG5cbi5ib2FyZCAubWFwLXRpdGxlLWNvbnRhaW5lciAubWFwLXRpdGxlIHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMXZ3KSwgMS4yNXJlbSk7XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbiAgcGFkZGluZy1yaWdodDogMC41cmVtO1xufVxuXG4uYm9hcmQucGxheWVyIC5tYXAtdGl0bGUge1xuICBjb2xvcjogIzg3Y2VlYjtcbn1cblxuLmJvYXJkLmNvbXB1dGVyIC5tYXAtdGl0bGUge1xuICBjb2xvcjogI2YzYTY0MDtcbn1cblxuLmZpZWxkLWNvbnRhaW5lciNmaWVsZC1jb250YWluZXItY29tcHV0ZXIge1xuICBiYWNrZ3JvdW5kOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSksXG4gICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSxcbiAgICAgIHJnYmEoMiwgMCwgMzYsIDApIDAlLFxuICAgICAgcmdiYSgyNDMsIDE2NiwgNjQsIDAuMTU0NDk5Mjk5NzE5ODg3OTYpIDYwJSxcbiAgICAgIHJnYmEoMjQzLCAxNjYsIDY0LCAwLjI1MjUzODUxNTQwNjE2MjQ2KSA4NSUsXG4gICAgICByZ2JhKDI0MywgMTY2LCA2NCwgMC4zOTgxOTY3Nzg3MTE0ODQ2KSAxMDAlKTtcbn1cblxuLmZpZWxkLWNvbnRhaW5lciNmaWVsZC1jb250YWluZXItY29tcHV0ZXI6OmJlZm9yZSB7XG4gIC13ZWJraXQtZmlsdGVyOiBpbnZlcnQoODclKSBzZXBpYSgxOCUpIHNhdHVyYXRlKDM3MDMlKSBodWUtcm90YXRlKDMyNWRlZykgYnJpZ2h0bmVzcyg5NiUpIGNvbnRyYXN0KDk4JSk7XG4gIGZpbHRlcjogaW52ZXJ0KDg3JSkgc2VwaWEoMTglKSBzYXR1cmF0ZSgzNzAzJSkgaHVlLXJvdGF0ZSgzMjVkZWcpIGJyaWdodG5lc3MoOTYlKSBjb250cmFzdCg5OCUpO1xufVxuXG4uZmllbGQtY29udGFpbmVyI2ZpZWxkLWNvbnRhaW5lci1jb21wdXRlciBpbWcge1xuICAtd2Via2l0LWZpbHRlcjogaW52ZXJ0KDYzJSkgc2VwaWEoOTklKSBzYXR1cmF0ZSgzNjAlKSBodWUtcm90YXRlKDM0M2RlZykgYnJpZ2h0bmVzcyg5OCUpIGNvbnRyYXN0KDk0JSk7XG4gIGZpbHRlcjogaW52ZXJ0KDYzJSkgc2VwaWEoOTklKSBzYXR1cmF0ZSgzNjAlKSBodWUtcm90YXRlKDM0M2RlZykgYnJpZ2h0bmVzcyg5OCUpIGNvbnRyYXN0KDk0JSk7XG59XG5cbi5iYXR0bGUtd3JhcHBlciAuZmllbGQtY29udGFpbmVyOjphZnRlciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5maWVsZCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgY3Vyc29yOiBjcm9zc2hhaXI7XG59XG5cbi5maWVsZDo6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgei1pbmRleDogMTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0zNy41cmVtLCAtNDAuNjI1cmVtKSByb3RhdGUoLTMxNWRlZyk7XG4gIGhlaWdodDogMzAlO1xuICB3aWR0aDogMTIuNXJlbTtcbiAgYm9yZGVyOiAwLjE4NzVyZW0gc29saWQgI2ZlZmVmZTtcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcbiAgb3BhY2l0eTogMTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMTVzIGN1YmljLWJlemllcigwLjcsIDAuMDMsIDAuODUsIDAuNDMpO1xufVxuXG4uZmllbGQ6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgei1pbmRleDogMTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG5cbiAgYm9yZGVyLXJhZGl1czogMTAwJTtcbiAgb3BhY2l0eTogMDtcbn1cblxuXG4uZmllbGQuaGl0OjpiZWZvcmUge1xuICBhbmltYXRpb246IHNob3QgMC4zNXMgMC4xNzVzIDE7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBzaG90IDAuMzVzIDAuMTc1cyAxO1xuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbn1cblxuLmZpZWxkLmhpdDo6YWZ0ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC41KTtcbiAgYW5pbWF0aW9uOiByaXBwbGUgMC41cyAwLjJzIDE7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiByaXBwbGUgMC41cyAwLjJzIDE7XG4gIGFuaW1hdGlvbi1kZWxheTogMC4zNXM7XG4gIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAwLjM1cztcbiAgLXdlYmtpdC1hbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XG59XG5cbi5maWVsZC5taXNzOjpiZWZvcmUge1xuICBhbmltYXRpb246IG1pc3MgMC4zNXMgMC4xNzVzIDE7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBtaXNzIDAuMzVzIDAuMTc1cyAxO1xuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbn1cblxuLmZpZWxkLm1pc3M6OmFmdGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxNTMsIDI1NSwgMC41KTtcbiAgYW5pbWF0aW9uOiByaXBwbGUgMC41cyAwLjJzIDE7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiByaXBwbGUgMC41cyAwLjJzIDE7XG4gIGFuaW1hdGlvbi1kZWxheTogMC4zNXM7XG4gIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAwLjM1cztcbiAgLXdlYmtpdC1hbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XG59XG5cbi5tZXNzYWdlLmJhdHRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNzUpO1xuICB3aWR0aDogMTAwJTtcblxuICBncmlkLWNvbHVtbjogMS8zO1xuICBnYXA6IDAuNXJlbTtcbiAgcGFkZGluZzogMXJlbTtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMXZ3KSwgMXJlbSk7XG4gIHRyYW5zaXRpb246IGFsbCAwLjZzO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUuY2FwdGFpbiAubWVzc2FnZS1jYXB0YWluIHtcbiAgY29sb3I6ICM4N2NlZWI7XG59XG5cbi5tZXNzYWdlLmJhdHRsZS5jYXB0YWluIC50eXBlZC1jdXJzb3Ige1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjODdjZWViO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkgLm1lc3NhZ2UtaW1hZ2Uge1xuICBvcmRlcjogMjtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlLmVuZW15IC5tZXNzYWdlLWNvbnRhaW5lciB7XG4gIG9yZGVyOiAxO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkgLm1lc3NhZ2UtZW5lbXkge1xuICBjb2xvcjogI2YzYTY0MDtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlLmVuZW15IC50eXBlZC1jdXJzb3Ige1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNhNjQwO1xufVxuXG4ubWVzc2FnZS1pbWFnZSB7XG4gIGhlaWdodDogbWluKGNhbGMoMS4yNXJlbSArIDJ2dyksIDIuNzVyZW0pO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUgLm1lc3NhZ2UtY29udGFpbmVyIHtcbiAgZGlzcGxheTogaW5saW5lO1xuICB0ZXh0LWFsaWduOiBzdGFydDtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlLmVuZW15IC5tZXNzYWdlLWNvbnRhaW5lciB7XG4gIHRleHQtYWxpZ246IGVuZDtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1jYXB0YWluLFxuLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1lbmVteSB7XG4gIGRpc3BsYXk6IGlubGluZTtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAudHlwZWQtY3Vyc29yIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBsZWZ0OiAwLjA2MjVyZW07XG4gIGJvdHRvbTogLTAuMTg3NXJlbTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB3aWR0aDogMC41cmVtO1xuICBoZWlnaHQ6IDFyZW07XG4gIGNvbG9yOiB0cmFuc3BhcmVudDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlLm9uLXR1cm4ge1xuICBhbmltYXRpb246IGVuZW15VHVybiAwLjZzIGVhc2UgZm9yd2FyZHM7XG59XG5cbi5tZXNzYWdlLmJhdHRsZS5vbi10dXJuLmNhcHRhaW4gLm1lc3NhZ2UtY2FwdGFpbixcbi5tZXNzYWdlLmJhdHRsZS5vbi10dXJuLmVuZW15IC5tZXNzYWdlLWVuZW15IHtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5tZXNzYWdlLmJhdHRsZS5vbi10dXJuLmNhcHRhaW4gLnR5cGVkLWN1cnNvcixcbi5tZXNzYWdlLmJhdHRsZS5vbi10dXJuLmVuZW15IC50eXBlZC1jdXJzb3Ige1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUuY2FwdGFpbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlLmNhcHRhaW46OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAtMTtcblxuICB3aWR0aDogMjAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuXG4gIGluc2V0OiAwO1xuXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGxlZnQ7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZyxcbiAgICAgIHJnYmEoMTM1LCAyMDYsIDIzNSwgMSkgMCUsXG4gICAgICByZ2JhKDEzNSwgMjA2LCAyMzUsIDAuODAyOTU4NjgzNDczMzg5NCkgMjAlLFxuICAgICAgcmdiYSgxMzUsIDIwNiwgMjM1LCAwLjYwNDA3OTEzMTY1MjY2MSkgNDAlLFxuICAgICAgcmdiYSgxMzUsIDIwNiwgMjM1LCAwLjQwMjM5ODQ1OTM4Mzc1MzUpIDYwJSxcbiAgICAgIHJnYmEoMTM1LCAyMDYsIDIzNSwgMC4xOTUxMTU1NDYyMTg0ODczNykgODAlLFxuICAgICAgcmdiYSgxMzUsIDIwNiwgMjM1LCAwKSAxMDAlKTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKTtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlLmVuZW15IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXk6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAtMTtcblxuICB3aWR0aDogMjAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuXG4gIGluc2V0OiAwO1xuXG4gIGJhY2tncm91bmQ6IHJnYigyNDMsIDE2NiwgNjQpO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsXG4gICAgICByZ2JhKDI0MywgMTY2LCA2NCwgMCkgMCUsXG4gICAgICByZ2JhKDI0MywgMTY2LCA2NCwgMC4yMDIxMTgzNDczMzg5MzU1MikgMjAlLFxuICAgICAgcmdiYSgyNDMsIDE2NiwgNjQsIDAuNDAzNzk5MDE5NjA3ODQzMTUpIDQwJSxcbiAgICAgIHJnYmEoMjQzLCAxNjYsIDY0LCAwLjYwMjY3ODU3MTQyODU3MTQpIDYwJSxcbiAgICAgIHJnYmEoMjQzLCAxNjYsIDY0LCAwLjc5ODc1NzAwMjgwMTEyMDQpIDgwJSxcbiAgICAgIHJnYmEoMjQzLCAxNjYsIDY0LCAxKSAxMDAlKTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKTtcbn1cblxuLm1lc3NhZ2UuYmF0dGxlLmNhcHRhaW4ub24tdHVybjo6YWZ0ZXIge1xuICAtd2Via2l0LWFuaW1hdGlvbjogc2VlcENhcHRhaW4gMXMgMSBmb3J3YXJkcztcbiAgYW5pbWF0aW9uOiBzZWVwQ2FwdGFpbiAxcyAxIGZvcndhcmRzO1xufVxuXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkub24tdHVybjo6YWZ0ZXIge1xuICAtd2Via2l0LWFuaW1hdGlvbjogc2VlcEVuZW15IDFzIDEgZm9yd2FyZHM7XG4gIGFuaW1hdGlvbjogc2VlcEVuZW15IDFzIDEgZm9yd2FyZHM7XG59XG5cbi5kaXNhYmxlZCB7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG5Aa2V5ZnJhbWVzIHNob3Qge1xuICA3NSUge1xuICAgIHdpZHRoOiA1cmVtO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XG4gICAgYm9yZGVyLWNvbG9yOiAjZmVmZWZlO1xuICB9XG5cbiAgMTAwJSB7XG4gICAgd2lkdGg6IDMwJTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC44NSk7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC41KTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCkgcm90YXRlKC0zMTVkZWcpO1xuICB9XG59XG5cblxuQGtleWZyYW1lcyByaXBwbGUge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG5cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMjUpO1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cblxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDApO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBtaXNzIHtcbiAgNzUlIHtcbiAgICB3aWR0aDogNXJlbTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xuICAgIGJvcmRlci1jb2xvcjogI2ZlZmVmZTtcbiAgfVxuXG4gIDEwMCUge1xuICAgIHdpZHRoOiAzMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAxNTMsIDI1NSwgMC44NSk7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDE1MywgMjU1LCAwLjUpO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKSByb3RhdGUoLTMxNWRlZyk7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBlbmVteVR1cm4ge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuXG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjAxMjUpO1xuICB9XG5cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHNlZXBDYXB0YWluIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XG4gIH1cblxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgc2VlcEVuZW15IHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcbiAgfVxuXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIGdyb3cge1xuICAwJSB7XG4gICAgd2lkdGg6IDEyLjVyZW07XG4gIH1cbiAgMTAwJSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBzaHJpbmsge1xuICAwJSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgMTAwJSB7XG4gICAgd2lkdGg6IDEyLjVyZW07XG4gIH1cbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDhyZW0pIHtcbiAgLmJhdHRsZS13cmFwcGVyIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogYXV0bztcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktaXRlbXM6IHN0YXJ0O1xuICB9XG5cbiAgLmJhdHRsZS13cmFwcGVyIC5ib2FyZC5lbmVteSB7XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIH1cblxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkIHtcbiAgICBtYXgtd2lkdGg6IDI1cmVtO1xuICAgIGdyaWQtY29sdW1uOiAxLzM7XG4gIH1cbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzByZW0pIHtcbiAgLmJhdHRsZS13cmFwcGVyIHtcbiAgICBnYXA6IDAuNXJlbTtcbiAgfVxuXG4gIC5iYXR0bGUtd3JhcHBlciAuYm9hcmQucGxheWVyIHtcbiAgICB3aWR0aDogMTIuNXJlbTtcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gIH1cblxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkLnBsYXllci5vZmYtdHVybiB7XG4gICAgLXdlYmtpdC1hbmltYXRpb246IGdyb3cgMS41cyAxIGZvcndhcmRzO1xuICAgIGFuaW1hdGlvbjogZ3JvdyAxLjVzIDEgZm9yd2FyZHM7XG4gIH1cblxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkLnBsYXllci5vbi10dXJuIHtcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogc2hyaW5rIDEuNXMgMSBmb3J3YXJkcztcbiAgICBhbmltYXRpb246IHNocmluayAxLjVzIDEgZm9yd2FyZHM7XG4gIH1cblxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkLmVuZW15Lm9mZi10dXJuIHtcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogZ3JvdyAxLjVzIDEgZm9yd2FyZHM7XG4gICAgYW5pbWF0aW9uOiBncm93IDEuNXMgMSBmb3J3YXJkcztcbiAgfVxuXG4gIC5iYXR0bGUtd3JhcHBlciAuYm9hcmQuZW5lbXkub24tdHVybiB7XG4gICAgLXdlYmtpdC1hbmltYXRpb246IHNocmluayAxLjVzIDEgZm9yd2FyZHM7XG4gICAgYW5pbWF0aW9uOiBzaHJpbmsgMS41cyAxIGZvcndhcmRzO1xuICB9XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvYmF0dGxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLFdBQVc7O0VBRVgsYUFBYTtFQUNiLDhCQUE4QjtFQUM5QixxQkFBcUI7RUFDckIsU0FBUzs7RUFFVCxjQUFjO0VBQ2QsZ0JBQWdCO0FBQ2xCOztBQUVBOztFQUVFLHFDQUFxQztFQUNyQyxhQUFhO0FBQ2Y7O0FBRUE7O0VBRUUsUUFBUTtFQUNSLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQiwyQ0FBMkM7RUFDM0MscUJBQXFCO0VBQ3JCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxjQUFjO0FBQ2hCOztBQUVBO0VBQ0U7Ozs7O2tEQUtnRDtBQUNsRDs7QUFFQTtFQUNFLHVHQUF1RztFQUN2RywrRkFBK0Y7QUFDakc7O0FBRUE7RUFDRSxzR0FBc0c7RUFDdEcsOEZBQThGO0FBQ2hH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QVU7RUFDWjs7RUFFQTtJQUNFLG1CQUFtQjtJQUNuQixVQUFVO0VBQ1o7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsV0FBVztJQUNYLHlCQUF5QjtJQUN6QixxQkFBcUI7RUFDdkI7O0VBRUE7SUFDRSxVQUFVO0lBQ1YseUNBQXlDO0lBQ3pDLG9DQUFvQztJQUNwQyx3Q0FBd0M7RUFDMUM7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsbUJBQW1CO0VBQ3JCOztFQUVBO0lBQ0Usd0JBQXdCO0VBQzFCOztFQUVBO0lBQ0UsbUJBQW1CO0VBQ3JCO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLDRCQUE0QjtFQUM5Qjs7RUFFQTtJQUNFLHlCQUF5QjtFQUMzQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSwyQkFBMkI7RUFDN0I7O0VBRUE7SUFDRSwyQkFBMkI7RUFDN0I7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsV0FBVztFQUNiO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLFdBQVc7RUFDYjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxhQUFhO0lBQ2Isd0JBQXdCO0lBQ3hCLG1CQUFtQjtJQUNuQixvQkFBb0I7RUFDdEI7O0VBRUE7SUFDRSxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0VBQ2xCO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLFdBQVc7RUFDYjs7RUFFQTtJQUNFLGNBQWM7SUFDZCxrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSx1Q0FBdUM7SUFDdkMsK0JBQStCO0VBQ2pDOztFQUVBO0lBQ0UseUNBQXlDO0lBQ3pDLGlDQUFpQztFQUNuQzs7RUFFQTtJQUNFLHVDQUF1QztJQUN2QywrQkFBK0I7RUFDakM7O0VBRUE7SUFDRSx5Q0FBeUM7SUFDekMsaUNBQWlDO0VBQ25DO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmJhdHRsZS13cmFwcGVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG5cXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgbWF4LXdpZHRoOiA3NXJlbTtcXG59XFxuXFxuLmJvYXJkLnBsYXllcixcXG4uYm9hcmQuY29tcHV0ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjc1KTtcXG4gIHBhZGRpbmc6IDFyZW07XFxufVxcblxcbi5ib2FyZC5wbGF5ZXIgLm1hcC10aXRsZS1jb250YWluZXIsXFxuLmJvYXJkLmNvbXB1dGVyIC5tYXAtdGl0bGUtY29udGFpbmVyIHtcXG4gIG9yZGVyOiAxO1xcbiAgZ3JpZC1jb2x1bW46IDIgLyAzO1xcbn1cXG5cXG4uYm9hcmQgLm1hcC10aXRsZS1jb250YWluZXIgLm1hcC10aXRsZSB7XFxuICB0ZXh0LWFsaWduOiByaWdodDtcXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMXZ3KSwgMS4yNXJlbSk7XFxuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XFxuICBwYWRkaW5nLXJpZ2h0OiAwLjVyZW07XFxufVxcblxcbi5ib2FyZC5wbGF5ZXIgLm1hcC10aXRsZSB7XFxuICBjb2xvcjogIzg3Y2VlYjtcXG59XFxuXFxuLmJvYXJkLmNvbXB1dGVyIC5tYXAtdGl0bGUge1xcbiAgY29sb3I6ICNmM2E2NDA7XFxufVxcblxcbi5maWVsZC1jb250YWluZXIjZmllbGQtY29udGFpbmVyLWNvbXB1dGVyIHtcXG4gIGJhY2tncm91bmQ6IHVybCgnLi4vYXNzZXRzL2ltYWdlcy9ncmlkLnN2ZycpLFxcbiAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlLFxcbiAgICAgIHJnYmEoMiwgMCwgMzYsIDApIDAlLFxcbiAgICAgIHJnYmEoMjQzLCAxNjYsIDY0LCAwLjE1NDQ5OTI5OTcxOTg4Nzk2KSA2MCUsXFxuICAgICAgcmdiYSgyNDMsIDE2NiwgNjQsIDAuMjUyNTM4NTE1NDA2MTYyNDYpIDg1JSxcXG4gICAgICByZ2JhKDI0MywgMTY2LCA2NCwgMC4zOTgxOTY3Nzg3MTE0ODQ2KSAxMDAlKTtcXG59XFxuXFxuLmZpZWxkLWNvbnRhaW5lciNmaWVsZC1jb250YWluZXItY29tcHV0ZXI6OmJlZm9yZSB7XFxuICAtd2Via2l0LWZpbHRlcjogaW52ZXJ0KDg3JSkgc2VwaWEoMTglKSBzYXR1cmF0ZSgzNzAzJSkgaHVlLXJvdGF0ZSgzMjVkZWcpIGJyaWdodG5lc3MoOTYlKSBjb250cmFzdCg5OCUpO1xcbiAgZmlsdGVyOiBpbnZlcnQoODclKSBzZXBpYSgxOCUpIHNhdHVyYXRlKDM3MDMlKSBodWUtcm90YXRlKDMyNWRlZykgYnJpZ2h0bmVzcyg5NiUpIGNvbnRyYXN0KDk4JSk7XFxufVxcblxcbi5maWVsZC1jb250YWluZXIjZmllbGQtY29udGFpbmVyLWNvbXB1dGVyIGltZyB7XFxuICAtd2Via2l0LWZpbHRlcjogaW52ZXJ0KDYzJSkgc2VwaWEoOTklKSBzYXR1cmF0ZSgzNjAlKSBodWUtcm90YXRlKDM0M2RlZykgYnJpZ2h0bmVzcyg5OCUpIGNvbnRyYXN0KDk0JSk7XFxuICBmaWx0ZXI6IGludmVydCg2MyUpIHNlcGlhKDk5JSkgc2F0dXJhdGUoMzYwJSkgaHVlLXJvdGF0ZSgzNDNkZWcpIGJyaWdodG5lc3MoOTglKSBjb250cmFzdCg5NCUpO1xcbn1cXG5cXG4uYmF0dGxlLXdyYXBwZXIgLmZpZWxkLWNvbnRhaW5lcjo6YWZ0ZXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmZpZWxkIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGN1cnNvcjogY3Jvc3NoYWlyO1xcbn1cXG5cXG4uZmllbGQ6OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIHotaW5kZXg6IDE7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtMzcuNXJlbSwgLTQwLjYyNXJlbSkgcm90YXRlKC0zMTVkZWcpO1xcbiAgaGVpZ2h0OiAzMCU7XFxuICB3aWR0aDogMTIuNXJlbTtcXG4gIGJvcmRlcjogMC4xODc1cmVtIHNvbGlkICNmZWZlZmU7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcXG4gIG9wYWNpdHk6IDE7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC4xNXMgY3ViaWMtYmV6aWVyKDAuNywgMC4wMywgMC44NSwgMC40Myk7XFxufVxcblxcbi5maWVsZDo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICB6LWluZGV4OiAxO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcblxcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuXFxuICBib3JkZXItcmFkaXVzOiAxMDAlO1xcbiAgb3BhY2l0eTogMDtcXG59XFxuXFxuXFxuLmZpZWxkLmhpdDo6YmVmb3JlIHtcXG4gIGFuaW1hdGlvbjogc2hvdCAwLjM1cyAwLjE3NXMgMTtcXG4gIC13ZWJraXQtYW5pbWF0aW9uOiBzaG90IDAuMzVzIDAuMTc1cyAxO1xcbiAgLXdlYmtpdC1hbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xcbn1cXG5cXG4uZmllbGQuaGl0OjphZnRlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC41KTtcXG4gIGFuaW1hdGlvbjogcmlwcGxlIDAuNXMgMC4ycyAxO1xcbiAgLXdlYmtpdC1hbmltYXRpb246IHJpcHBsZSAwLjVzIDAuMnMgMTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMC4zNXM7XFxuICAtd2Via2l0LWFuaW1hdGlvbi1kZWxheTogMC4zNXM7XFxuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XFxufVxcblxcbi5maWVsZC5taXNzOjpiZWZvcmUge1xcbiAgYW5pbWF0aW9uOiBtaXNzIDAuMzVzIDAuMTc1cyAxO1xcbiAgLXdlYmtpdC1hbmltYXRpb246IG1pc3MgMC4zNXMgMC4xNzVzIDE7XFxuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XFxufVxcblxcbi5maWVsZC5taXNzOjphZnRlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDE1MywgMjU1LCAwLjUpO1xcbiAgYW5pbWF0aW9uOiByaXBwbGUgMC41cyAwLjJzIDE7XFxuICAtd2Via2l0LWFuaW1hdGlvbjogcmlwcGxlIDAuNXMgMC4ycyAxO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjM1cztcXG4gIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAwLjM1cztcXG4gIC13ZWJraXQtYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XFxuICBhbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjc1KTtcXG4gIHdpZHRoOiAxMDAlO1xcblxcbiAgZ3JpZC1jb2x1bW46IDEvMztcXG4gIGdhcDogMC41cmVtO1xcbiAgcGFkZGluZzogMXJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG5cXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMXZ3KSwgMXJlbSk7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC42cztcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlLmNhcHRhaW4gLm1lc3NhZ2UtY2FwdGFpbiB7XFxuICBjb2xvcjogIzg3Y2VlYjtcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlLmNhcHRhaW4gLnR5cGVkLWN1cnNvciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjODdjZWViO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkge1xcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlLmVuZW15IC5tZXNzYWdlLWltYWdlIHtcXG4gIG9yZGVyOiAyO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkgLm1lc3NhZ2UtY29udGFpbmVyIHtcXG4gIG9yZGVyOiAxO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkgLm1lc3NhZ2UtZW5lbXkge1xcbiAgY29sb3I6ICNmM2E2NDA7XFxufVxcblxcbi5tZXNzYWdlLmJhdHRsZS5lbmVteSAudHlwZWQtY3Vyc29yIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmM2E2NDA7XFxufVxcblxcbi5tZXNzYWdlLWltYWdlIHtcXG4gIGhlaWdodDogbWluKGNhbGMoMS4yNXJlbSArIDJ2dyksIDIuNzVyZW0pO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUgLm1lc3NhZ2UtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIHRleHQtYWxpZ246IHN0YXJ0O1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUuZW5lbXkgLm1lc3NhZ2UtY29udGFpbmVyIHtcXG4gIHRleHQtYWxpZ246IGVuZDtcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1jYXB0YWluLFxcbi5tZXNzYWdlLmJhdHRsZSAubWVzc2FnZS1jb250YWluZXIgLm1lc3NhZ2UtZW5lbXkge1xcbiAgZGlzcGxheTogaW5saW5lO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUgLm1lc3NhZ2UtY29udGFpbmVyIC50eXBlZC1jdXJzb3Ige1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbGVmdDogMC4wNjI1cmVtO1xcbiAgYm90dG9tOiAtMC4xODc1cmVtO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgd2lkdGg6IDAuNXJlbTtcXG4gIGhlaWdodDogMXJlbTtcXG4gIGNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5tZXNzYWdlLmJhdHRsZS5vbi10dXJuIHtcXG4gIGFuaW1hdGlvbjogZW5lbXlUdXJuIDAuNnMgZWFzZSBmb3J3YXJkcztcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlLm9uLXR1cm4uY2FwdGFpbiAubWVzc2FnZS1jYXB0YWluLFxcbi5tZXNzYWdlLmJhdHRsZS5vbi10dXJuLmVuZW15IC5tZXNzYWdlLWVuZW15IHtcXG4gIGNvbG9yOiAjMDAwMDAwO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUub24tdHVybi5jYXB0YWluIC50eXBlZC1jdXJzb3IsXFxuLm1lc3NhZ2UuYmF0dGxlLm9uLXR1cm4uZW5lbXkgLnR5cGVkLWN1cnNvciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUuY2FwdGFpbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4ubWVzc2FnZS5iYXR0bGUuY2FwdGFpbjo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB6LWluZGV4OiAtMTtcXG5cXG4gIHdpZHRoOiAyMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcblxcbiAgaW5zZXQ6IDA7XFxuXFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBsZWZ0O1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLFxcbiAgICAgIHJnYmEoMTM1LCAyMDYsIDIzNSwgMSkgMCUsXFxuICAgICAgcmdiYSgxMzUsIDIwNiwgMjM1LCAwLjgwMjk1ODY4MzQ3MzM4OTQpIDIwJSxcXG4gICAgICByZ2JhKDEzNSwgMjA2LCAyMzUsIDAuNjA0MDc5MTMxNjUyNjYxKSA0MCUsXFxuICAgICAgcmdiYSgxMzUsIDIwNiwgMjM1LCAwLjQwMjM5ODQ1OTM4Mzc1MzUpIDYwJSxcXG4gICAgICByZ2JhKDEzNSwgMjA2LCAyMzUsIDAuMTk1MTE1NTQ2MjE4NDg3MzcpIDgwJSxcXG4gICAgICByZ2JhKDEzNSwgMjA2LCAyMzUsIDApIDEwMCUpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKTtcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlLmVuZW15IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5tZXNzYWdlLmJhdHRsZS5lbmVteTo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB6LWluZGV4OiAtMTtcXG5cXG4gIHdpZHRoOiAyMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcblxcbiAgaW5zZXQ6IDA7XFxuXFxuICBiYWNrZ3JvdW5kOiByZ2IoMjQzLCAxNjYsIDY0KTtcXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZyxcXG4gICAgICByZ2JhKDI0MywgMTY2LCA2NCwgMCkgMCUsXFxuICAgICAgcmdiYSgyNDMsIDE2NiwgNjQsIDAuMjAyMTE4MzQ3MzM4OTM1NTIpIDIwJSxcXG4gICAgICByZ2JhKDI0MywgMTY2LCA2NCwgMC40MDM3OTkwMTk2MDc4NDMxNSkgNDAlLFxcbiAgICAgIHJnYmEoMjQzLCAxNjYsIDY0LCAwLjYwMjY3ODU3MTQyODU3MTQpIDYwJSxcXG4gICAgICByZ2JhKDI0MywgMTY2LCA2NCwgMC43OTg3NTcwMDI4MDExMjA0KSA4MCUsXFxuICAgICAgcmdiYSgyNDMsIDE2NiwgNjQsIDEpIDEwMCUpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0xMDAlKTtcXG59XFxuXFxuLm1lc3NhZ2UuYmF0dGxlLmNhcHRhaW4ub24tdHVybjo6YWZ0ZXIge1xcbiAgLXdlYmtpdC1hbmltYXRpb246IHNlZXBDYXB0YWluIDFzIDEgZm9yd2FyZHM7XFxuICBhbmltYXRpb246IHNlZXBDYXB0YWluIDFzIDEgZm9yd2FyZHM7XFxufVxcblxcbi5tZXNzYWdlLmJhdHRsZS5lbmVteS5vbi10dXJuOjphZnRlciB7XFxuICAtd2Via2l0LWFuaW1hdGlvbjogc2VlcEVuZW15IDFzIDEgZm9yd2FyZHM7XFxuICBhbmltYXRpb246IHNlZXBFbmVteSAxcyAxIGZvcndhcmRzO1xcbn1cXG5cXG4uZGlzYWJsZWQge1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbkBrZXlmcmFtZXMgc2hvdCB7XFxuICA3NSUge1xcbiAgICB3aWR0aDogNXJlbTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcXG4gICAgYm9yZGVyLWNvbG9yOiAjZmVmZWZlO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIHdpZHRoOiAzMCU7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjg1KTtcXG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC41KTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApIHJvdGF0ZSgtMzE1ZGVnKTtcXG4gIH1cXG59XFxuXFxuXFxuQGtleWZyYW1lcyByaXBwbGUge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjI1KTtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIG1pc3Mge1xcbiAgNzUlIHtcXG4gICAgd2lkdGg6IDVyZW07XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XFxuICAgIGJvcmRlci1jb2xvcjogI2ZlZmVmZTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMzAlO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDE1MywgMjU1LCAwLjg1KTtcXG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDE1MywgMjU1LCAwLjUpO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCkgcm90YXRlKC0zMTVkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGVuZW15VHVybiB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuXFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDEyNSk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzZWVwQ2FwdGFpbiB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDAlKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzZWVwRW5lbXkge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGdyb3cge1xcbiAgMCUge1xcbiAgICB3aWR0aDogMTIuNXJlbTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzaHJpbmsge1xcbiAgMCUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMTIuNXJlbTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDhyZW0pIHtcXG4gIC5iYXR0bGUtd3JhcHBlciB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogYXV0bztcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1pdGVtczogc3RhcnQ7XFxuICB9XFxuXFxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkLmVuZW15IHtcXG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICB9XFxuXFxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkIHtcXG4gICAgbWF4LXdpZHRoOiAyNXJlbTtcXG4gICAgZ3JpZC1jb2x1bW46IDEvMztcXG4gIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzByZW0pIHtcXG4gIC5iYXR0bGUtd3JhcHBlciB7XFxuICAgIGdhcDogMC41cmVtO1xcbiAgfVxcblxcbiAgLmJhdHRsZS13cmFwcGVyIC5ib2FyZC5wbGF5ZXIge1xcbiAgICB3aWR0aDogMTIuNXJlbTtcXG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xcbiAgfVxcblxcbiAgLmJhdHRsZS13cmFwcGVyIC5ib2FyZC5wbGF5ZXIub2ZmLXR1cm4ge1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogZ3JvdyAxLjVzIDEgZm9yd2FyZHM7XFxuICAgIGFuaW1hdGlvbjogZ3JvdyAxLjVzIDEgZm9yd2FyZHM7XFxuICB9XFxuXFxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkLnBsYXllci5vbi10dXJuIHtcXG4gICAgLXdlYmtpdC1hbmltYXRpb246IHNocmluayAxLjVzIDEgZm9yd2FyZHM7XFxuICAgIGFuaW1hdGlvbjogc2hyaW5rIDEuNXMgMSBmb3J3YXJkcztcXG4gIH1cXG5cXG4gIC5iYXR0bGUtd3JhcHBlciAuYm9hcmQuZW5lbXkub2ZmLXR1cm4ge1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogZ3JvdyAxLjVzIDEgZm9yd2FyZHM7XFxuICAgIGFuaW1hdGlvbjogZ3JvdyAxLjVzIDEgZm9yd2FyZHM7XFxuICB9XFxuXFxuICAuYmF0dGxlLXdyYXBwZXIgLmJvYXJkLmVuZW15Lm9uLXR1cm4ge1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogc2hyaW5rIDEuNXMgMSBmb3J3YXJkcztcXG4gICAgYW5pbWF0aW9uOiBzaHJpbmsgMS41cyAxIGZvcndhcmRzO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2Fzc2V0cy9pbWFnZXMvZ3JpZC5zdmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyA9IG5ldyBVUkwoXCIuLi9hc3NldHMvaW1hZ2VzL2Nyb3NzLnN2Z1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC5ib2FyZCB7XG4gIHdpZHRoOiAxMDAlO1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byBhdXRvO1xuXG4gIG1heC13aWR0aDogNjAwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcbn1cblxuLmJvYXJkIC5sZXR0ZXItY29udGFpbmVyLFxuLmJvYXJkIC5udW1iZXItY29udGFpbmVyIHtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC4ycmVtICsgMS4yNXZ3KSwgMC44NXJlbSk7XG59XG5cbi5ib2FyZCAuYXhpcy1idXR0b24tY29udGFpbmVyIHtcbiAgb3JkZXI6IDE7XG4gIGdyaWQtY29sdW1uOiAxLzM7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbi5ib2FyZCAubGV0dGVyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBvcmRlcjogMjtcbiAgZ3JpZC1jb2x1bW46IDIvMztcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uYm9hcmQgLm51bWJlci1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgb3JkZXI6IDM7XG4gIGdyaWQtY29sdW1uOiAxLzI7XG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xufVxuXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lciB7XG4gIG9yZGVyOiA0O1xuXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogMDtcblxuICBncmlkLWNvbHVtbjogMi8zO1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcblxuICBhc3BlY3QtcmF0aW86IDEvMTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSksIHJhZGlhbC1ncmFkaWVudChjaXJjbGUsXG4gICAgICByZ2JhKDIsIDAsIDM2LCAwKSAxNSUsXG4gICAgICByZ2JhKDExMiwgMjA1LCAyNDEsIDAuMTAxMjc4MDExMjA0NDgxNzcpIDYwJSxcbiAgICAgIHJnYmEoMTEyLCAyMDUsIDI0MSwgMC4yNDk3MzczOTQ5NTc5ODMyKSA4NSUsXG4gICAgICByZ2JhKDExMiwgMjA1LCAyNDEsIDAuNDAzNzk5MDE5NjA3ODQzMTUpIDEwMCUpO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xufVxuXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lcjo6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxO1xuXG4gIGhlaWdodDogbWluKGNhbGMoMXJlbSArIDF2dyksIDIuMjVyZW0pO1xuICB3aWR0aDogbWluKGNhbGMoMXJlbSArIDF2dyksIDIuMjVyZW0pO1xuXG4gIGJvcmRlci1yYWRpdXM6IDEwMCU7XG5cbiAgYmFja2dyb3VuZDogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fX30pIGNlbnRlciAvIGNvdmVyO1xuXG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKSB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0O1xuXG4gIC13ZWJraXQtZmlsdGVyOiBpbnZlcnQoNjclKSBzZXBpYSg4OCUpIHNhdHVyYXRlKDI4NiUpIGh1ZS1yb3RhdGUoMTY0ZGVnKSBicmlnaHRuZXNzKDk2JSkgY29udHJhc3QoOTclKTtcbiAgZmlsdGVyOiBpbnZlcnQoNjclKSBzZXBpYSg4OCUpIHNhdHVyYXRlKDI4NiUpIGh1ZS1yb3RhdGUoMTY0ZGVnKSBicmlnaHRuZXNzKDk2JSkgY29udHJhc3QoOTclKTtcbn1cblxuLmJvYXJkIC5maWVsZC1jb250YWluZXI6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAtMTtcblxuICB0b3A6IC01MCU7XG4gIGxlZnQ6IC01MCU7XG5cbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDUwZGVnLCByZ2JhKDM0LCAzNCwgMzQsIDApIDU2JSwgIzcwY2RmMSk7XG4gIGJvcmRlci1yaWdodDogc29saWQgMC4wNjI1cmVtICM4N2NmZWI1MDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcblxuICBib3JkZXItcmFkaXVzOiAxMDAlIDAgMCAwO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcblxuICAtd2Via2l0LWFuaW1hdGlvbjogc3dlZXAgMy41cyBpbmZpbml0ZSBsaW5lYXI7XG4gIGFuaW1hdGlvbjogc3dlZXAgMy41cyBpbmZpbml0ZSBsaW5lYXI7XG4gIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMTAwJTtcbn1cblxuQGtleWZyYW1lcyBzd2VlcCB7XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIGltZyB7XG4gIC13ZWJraXQtZmlsdGVyOiBpbnZlcnQoNjclKSBzZXBpYSg4OCUpIHNhdHVyYXRlKDI4NiUpIGh1ZS1yb3RhdGUoMTY0ZGVnKSBicmlnaHRuZXNzKDk2JSkgY29udHJhc3QoOTclKTtcbiAgZmlsdGVyOiBpbnZlcnQoNjclKSBzZXBpYSg4OCUpIHNhdHVyYXRlKDI4NiUpIGh1ZS1yb3RhdGUoMTY0ZGVnKSBicmlnaHRuZXNzKDk2JSkgY29udHJhc3QoOTclKTtcbn1cblxuLmJvYXJkIC5maWVsZC1jb250YWluZXIgLmZpZWxkIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgYXNwZWN0LXJhdGlvOiAxLzE7XG5cbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lciAuZmllbGQuaG92ZXJpbmcge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjODdjZmViODA7XG59XG5cbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5maWVsZC5ob3ZlcmluZy5yZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2Y0MDQwODA7XG59XG5cbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5maWVsZDpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yNSk7XG59XG5cbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5zaGlwLWltYWdlLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogMTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5zaGlwLWltYWdlLWNvbnRhaW5lci5ibGVlcCB7XG4gIGFuaW1hdGlvbjogYmxlZXAgMy41cyBpbmZpbml0ZSBsaW5lYXI7XG59XG5cbkBrZXlmcmFtZXMgYmxlZXAge1xuICAwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICA1MCUge1xuICAgIG9wYWNpdHk6IDAuNDtcbiAgfVxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG59XG5cbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5zaGlwLWltYWdlLWNvbnRhaW5lciBpbWcge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmc6IDA7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgYW5pbWF0aW9uOiBzY2FsZURyb3AgMC4yNXMgbGluZWFyIGZvcndhcmRzXG59XG5cbkBrZXlmcmFtZXMgc2NhbGVEcm9wIHtcbiAgMCUge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XG4gIH1cbiAgODAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjIpO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDMwcmVtKSB7XG4gIC5ib2FyZCAuZmllbGQtY29udGFpbmVyIHtcbiAgICBib3JkZXItd2lkdGg6IDAuMDYyNXJlbSAwIDAgMC4wNjI1cmVtO1xuICB9XG5cbiAgLmJvYXJkIC5maWVsZC1jb250YWluZXIgLmZpZWxkIHtcbiAgICBib3JkZXItd2lkdGg6IDAgMC4wNjI1cmVtIDAuMDYyNXJlbSAwO1xuICB9XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvYm9hcmQuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsV0FBVzs7RUFFWCxhQUFhO0VBQ2IsK0JBQStCO0VBQy9CLDZCQUE2Qjs7RUFFN0IsZ0JBQWdCO0VBQ2hCLHFCQUFxQjtBQUN2Qjs7QUFFQTs7RUFFRSxpQkFBaUI7RUFDakIsOENBQThDO0FBQ2hEOztBQUVBO0VBQ0UsUUFBUTtFQUNSLGdCQUFnQjtFQUNoQixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsNkJBQTZCO0VBQzdCLFFBQVE7RUFDUixnQkFBZ0I7RUFDaEIscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qiw2QkFBNkI7RUFDN0IsUUFBUTtFQUNSLGdCQUFnQjtFQUNoQixvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRSxRQUFROztFQUVSLGtCQUFrQjtFQUNsQixVQUFVOztFQUVWLGdCQUFnQjs7RUFFaEIsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxtQ0FBbUM7O0VBRW5DLGlCQUFpQjtFQUNqQixnQkFBZ0I7O0VBRWhCOzs7O29EQUlrRDtFQUNsRCw0QkFBNEI7QUFDOUI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLFVBQVU7O0VBRVYsc0NBQXNDO0VBQ3RDLHFDQUFxQzs7RUFFckMsbUJBQW1COztFQUVuQixrRUFBMEQ7O0VBRTFELFFBQVE7RUFDUixTQUFTO0VBQ1QsOENBQThDO0VBQzlDLDBCQUEwQjs7RUFFMUIsc0dBQXNHO0VBQ3RHLDhGQUE4RjtBQUNoRzs7QUFFQTtFQUNFLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsV0FBVzs7RUFFWCxTQUFTO0VBQ1QsVUFBVTs7RUFFVixvRUFBb0U7RUFDcEUsdUNBQXVDO0VBQ3ZDLFdBQVc7RUFDWCxZQUFZOztFQUVaLHlCQUF5QjtFQUN6QixvQkFBb0I7O0VBRXBCLDZDQUE2QztFQUM3QyxxQ0FBcUM7RUFDckMsMkJBQTJCO0FBQzdCOztBQUVBO0VBQ0U7SUFDRSx5QkFBeUI7RUFDM0I7QUFDRjs7QUFFQTtFQUNFLHNHQUFzRztFQUN0Ryw4RkFBOEY7QUFDaEc7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjs7RUFFbkIsaUJBQWlCOztFQUVqQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSwyQ0FBMkM7QUFDN0M7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsVUFBVTtFQUNWLG9CQUFvQjtFQUNwQixpQkFBaUI7RUFDakIsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UscUNBQXFDO0FBQ3ZDOztBQUVBO0VBQ0U7SUFDRSxVQUFVO0VBQ1o7RUFDQTtJQUNFLFlBQVk7RUFDZDtFQUNBO0lBQ0UsVUFBVTtFQUNaO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixvQkFBb0I7RUFDcEI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsVUFBVTtJQUNWLGtCQUFrQjtJQUNsQixtQkFBbUI7RUFDckI7RUFDQTtJQUNFLFVBQVU7SUFDVixtQkFBbUI7SUFDbkIscUJBQXFCO0VBQ3ZCO0VBQ0E7SUFDRSxVQUFVO0lBQ1YsbUJBQW1CO0lBQ25CLG1CQUFtQjtFQUNyQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxxQ0FBcUM7RUFDdkM7O0VBRUE7SUFDRSxxQ0FBcUM7RUFDdkM7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuYm9hcmQge1xcbiAgd2lkdGg6IDEwMCU7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byBhdXRvO1xcblxcbiAgbWF4LXdpZHRoOiA2MDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG59XFxuXFxuLmJvYXJkIC5sZXR0ZXItY29udGFpbmVyLFxcbi5ib2FyZCAubnVtYmVyLWNvbnRhaW5lciB7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC4ycmVtICsgMS4yNXZ3KSwgMC44NXJlbSk7XFxufVxcblxcbi5ib2FyZCAuYXhpcy1idXR0b24tY29udGFpbmVyIHtcXG4gIG9yZGVyOiAxO1xcbiAgZ3JpZC1jb2x1bW46IDEvMztcXG4gIG1hcmdpbi1ib3R0b206IDFyZW07XFxufVxcblxcbi5ib2FyZCAubGV0dGVyLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICBvcmRlcjogMjtcXG4gIGdyaWQtY29sdW1uOiAyLzM7XFxuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XFxufVxcblxcbi5ib2FyZCAubnVtYmVyLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgb3JkZXI6IDM7XFxuICBncmlkLWNvbHVtbjogMS8yO1xcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XFxufVxcblxcbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIHtcXG4gIG9yZGVyOiA0O1xcblxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogMDtcXG5cXG4gIGdyaWQtY29sdW1uOiAyLzM7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcXG5cXG4gIGFzcGVjdC1yYXRpbzogMS8xO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG5cXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vYXNzZXRzL2ltYWdlcy9ncmlkLnN2ZycpLCByYWRpYWwtZ3JhZGllbnQoY2lyY2xlLFxcbiAgICAgIHJnYmEoMiwgMCwgMzYsIDApIDE1JSxcXG4gICAgICByZ2JhKDExMiwgMjA1LCAyNDEsIDAuMTAxMjc4MDExMjA0NDgxNzcpIDYwJSxcXG4gICAgICByZ2JhKDExMiwgMjA1LCAyNDEsIDAuMjQ5NzM3Mzk0OTU3OTgzMikgODUlLFxcbiAgICAgIHJnYmEoMTEyLCAyMDUsIDI0MSwgMC40MDM3OTkwMTk2MDc4NDMxNSkgMTAwJSk7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbn1cXG5cXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lcjo6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgei1pbmRleDogMTtcXG5cXG4gIGhlaWdodDogbWluKGNhbGMoMXJlbSArIDF2dyksIDIuMjVyZW0pO1xcbiAgd2lkdGg6IG1pbihjYWxjKDFyZW0gKyAxdncpLCAyLjI1cmVtKTtcXG5cXG4gIGJvcmRlci1yYWRpdXM6IDEwMCU7XFxuXFxuICBiYWNrZ3JvdW5kOiB1cmwoLi4vYXNzZXRzL2ltYWdlcy9jcm9zcy5zdmcpIGNlbnRlciAvIGNvdmVyO1xcblxcbiAgdG9wOiA1MCU7XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZykgdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7XFxuXFxuICAtd2Via2l0LWZpbHRlcjogaW52ZXJ0KDY3JSkgc2VwaWEoODglKSBzYXR1cmF0ZSgyODYlKSBodWUtcm90YXRlKDE2NGRlZykgYnJpZ2h0bmVzcyg5NiUpIGNvbnRyYXN0KDk3JSk7XFxuICBmaWx0ZXI6IGludmVydCg2NyUpIHNlcGlhKDg4JSkgc2F0dXJhdGUoMjg2JSkgaHVlLXJvdGF0ZSgxNjRkZWcpIGJyaWdodG5lc3MoOTYlKSBjb250cmFzdCg5NyUpO1xcbn1cXG5cXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lcjo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB6LWluZGV4OiAtMTtcXG5cXG4gIHRvcDogLTUwJTtcXG4gIGxlZnQ6IC01MCU7XFxuXFxuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoNTBkZWcsIHJnYmEoMzQsIDM0LCAzNCwgMCkgNTYlLCAjNzBjZGYxKTtcXG4gIGJvcmRlci1yaWdodDogc29saWQgMC4wNjI1cmVtICM4N2NmZWI1MDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcblxcbiAgYm9yZGVyLXJhZGl1czogMTAwJSAwIDAgMDtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcblxcbiAgLXdlYmtpdC1hbmltYXRpb246IHN3ZWVwIDMuNXMgaW5maW5pdGUgbGluZWFyO1xcbiAgYW5pbWF0aW9uOiBzd2VlcCAzLjVzIGluZmluaXRlIGxpbmVhcjtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMTAwJTtcXG59XFxuXFxuQGtleWZyYW1lcyBzd2VlcCB7XFxuICB0byB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XFxuICB9XFxufVxcblxcbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIGltZyB7XFxuICAtd2Via2l0LWZpbHRlcjogaW52ZXJ0KDY3JSkgc2VwaWEoODglKSBzYXR1cmF0ZSgyODYlKSBodWUtcm90YXRlKDE2NGRlZykgYnJpZ2h0bmVzcyg5NiUpIGNvbnRyYXN0KDk3JSk7XFxuICBmaWx0ZXI6IGludmVydCg2NyUpIHNlcGlhKDg4JSkgc2F0dXJhdGUoMjg2JSkgaHVlLXJvdGF0ZSgxNjRkZWcpIGJyaWdodG5lc3MoOTYlKSBjb250cmFzdCg5NyUpO1xcbn1cXG5cXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lciAuZmllbGQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXG4gIGFzcGVjdC1yYXRpbzogMS8xO1xcblxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lciAuZmllbGQuaG92ZXJpbmcge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzg3Y2ZlYjgwO1xcbn1cXG5cXG4uYm9hcmQgLmZpZWxkLWNvbnRhaW5lciAuZmllbGQuaG92ZXJpbmcucmVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjZjQwNDA4MDtcXG59XFxuXFxuLmJvYXJkIC5maWVsZC1jb250YWluZXIgLmZpZWxkOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yNSk7XFxufVxcblxcbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5zaGlwLWltYWdlLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiAxO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuLmJvYXJkIC5maWVsZC1jb250YWluZXIgLnNoaXAtaW1hZ2UtY29udGFpbmVyLmJsZWVwIHtcXG4gIGFuaW1hdGlvbjogYmxlZXAgMy41cyBpbmZpbml0ZSBsaW5lYXI7XFxufVxcblxcbkBrZXlmcmFtZXMgYmxlZXAge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgb3BhY2l0eTogMC40O1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxufVxcblxcbi5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5zaGlwLWltYWdlLWNvbnRhaW5lciBpbWcge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgcGFkZGluZzogMDtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICBhbmltYXRpb246IHNjYWxlRHJvcCAwLjI1cyBsaW5lYXIgZm9yd2FyZHNcXG59XFxuXFxuQGtleWZyYW1lcyBzY2FsZURyb3Age1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICB9XFxuICA4MCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzByZW0pIHtcXG4gIC5ib2FyZCAuZmllbGQtY29udGFpbmVyIHtcXG4gICAgYm9yZGVyLXdpZHRoOiAwLjA2MjVyZW0gMCAwIDAuMDYyNXJlbTtcXG4gIH1cXG5cXG4gIC5ib2FyZCAuZmllbGQtY29udGFpbmVyIC5maWVsZCB7XFxuICAgIGJvcmRlci13aWR0aDogMCAwLjA2MjVyZW0gMC4wNjI1cmVtIDA7XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL2ltYWdlcy9iYWNrZ291bmQuanBnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XG4gIC0tbWFpbi1jb2xvcjogI2ZmZmZmZjtcbiAgLS1iYWNrZ3JvdW5kLWNvbG9yOiAjMDMyNTRjO1xuXG4gIGNvbG9yOiB2YXIoLS1tYWluLWNvbG9yKTtcbiAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sXG4gICAgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgJ09wZW4gU2FucycsICdIZWx2ZXRpY2EgTmV1ZScsIHNhbnMtc2VyaWY7XG4gIGZvbnQtc2l6ZTogMTZweDtcbn1cblxuKixcbio6OmFmdGVyLFxuKjo6YmVmb3JlIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG5odG1sLFxuYm9keSB7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICBtaW4taGVpZ2h0OiAtd2Via2l0LWZpbGwtYXZhaWxhYmxlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYWNrZ3JvdW5kLWNvbG9yKTtcbn1cblxuYm9keSB7XG4gIGJhY2tncm91bmQ6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KSBjZW50ZXIgLyBjb3ZlciBuby1yZXBlYXQ7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbn1cblxuaDEsXG5idXR0b24sXG5hLFxuaW1nIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuLmFwcCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZzogMXJlbTtcbn1cblxuLmFwcC5wcmVnYW1lIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcGFkZGluZzogMnJlbTtcbn1cblxuLmFwcC5zZXR1cCxcbi5hcHAuYmF0dGxlIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luOiAwIGF1dG87XG5cbn1cblxuLmFwcC5zZXR1cCA+ICosXG4uYXBwLmJhdHRsZSA+ICoge1xuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvbWFpbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxxQkFBcUI7RUFDckIsMkJBQTJCOztFQUUzQix3QkFBd0I7RUFDeEI7d0VBQ3NFO0VBQ3RFLGVBQWU7QUFDakI7O0FBRUE7OztFQUdFLHNCQUFzQjtFQUN0QixTQUFTO0VBQ1QsVUFBVTtBQUNaOztBQUVBOztFQUVFLGlCQUFpQjtFQUNqQixrQ0FBa0M7RUFDbEMseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsNEVBQXdFO0VBQ3hFLGtCQUFrQjtBQUNwQjs7QUFFQTs7OztFQUlFLHFCQUFxQjtFQUNyQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjs7RUFFbkIsa0JBQWtCO0VBQ2xCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsYUFBYTtBQUNmOztBQUVBO0VBQ0Usc0JBQXNCO0VBQ3RCLGFBQWE7QUFDZjs7QUFFQTs7RUFFRSxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLGNBQWM7O0FBRWhCOztBQUVBOztFQUVFLHFCQUFxQjtBQUN2QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI6cm9vdCB7XFxuICAtLW1haW4tY29sb3I6ICNmZmZmZmY7XFxuICAtLWJhY2tncm91bmQtY29sb3I6ICMwMzI1NGM7XFxuXFxuICBjb2xvcjogdmFyKC0tbWFpbi1jb2xvcik7XFxuICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90byxcXG4gICAgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgJ09wZW4gU2FucycsICdIZWx2ZXRpY2EgTmV1ZScsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDE2cHg7XFxufVxcblxcbiosXFxuKjo6YWZ0ZXIsXFxuKjo6YmVmb3JlIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG5odG1sLFxcbmJvZHkge1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBtaW4taGVpZ2h0OiAtd2Via2l0LWZpbGwtYXZhaWxhYmxlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvcik7XFxufVxcblxcbmJvZHkge1xcbiAgYmFja2dyb3VuZDogdXJsKC4uL2Fzc2V0cy9pbWFnZXMvYmFja2dvdW5kLmpwZykgY2VudGVyIC8gY292ZXIgbm8tcmVwZWF0O1xcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xcbn1cXG5cXG5oMSxcXG5idXR0b24sXFxuYSxcXG5pbWcge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5hcHAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG5cXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgcGFkZGluZzogMXJlbTtcXG59XFxuXFxuLmFwcC5wcmVnYW1lIHtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBwYWRkaW5nOiAycmVtO1xcbn1cXG5cXG4uYXBwLnNldHVwLFxcbi5hcHAuYmF0dGxlIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuXFxufVxcblxcbi5hcHAuc2V0dXAgPiAqLFxcbi5hcHAuYmF0dGxlID4gKiB7XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL2ltYWdlcy9jYXJyaWVyWC5zdmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcbiAgLS1tYWluLWJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC43NSk7XG4gIC0tdHJhbnNwYXJlbnQtc2hhZG93LWNvbG9yOiAjMDAwMDAwNGQ7XG4gIC0tdHJhbnNwYXJlbnQtbG93LWdyZXktY29sb3I6ICNmZmZmZmZhNjtcbiAgLS1tYWluLWNvbG9yOiAjZmZmZmZmO1xuICAtLWlucHV0LWJhY2tncm91bmQtY29sb3I6ICMwMDAwMDAzMztcbiAgLS1tYWluLW9wcG9zaXRlLWNvbG9yOiAjMDAwMDAwO1xufVxuXG4ucHJlZ2FtZS1jYXJkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbi1iYWNrZ3JvdW5kKTtcblxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgd2lkdGg6IDEwMCU7XG4gIG1heC13aWR0aDogMjguMTI1cmVtO1xuXG4gIHBhZGRpbmc6IG1pbihjYWxjKDEwJSksIDNyZW0pO1xuICBib3JkZXI6IDAuMTI1cmVtIHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBib3gtc2hhZG93OiAwIDAgMzBweCAwLjA2MjVyZW0gdmFyKC0tdHJhbnNwYXJlbnQtc2hhZG93LWNvbG9yKTtcblxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjVzO1xuXG4gIGFzcGVjdC1yYXRpbzogMTAvODtcbn1cblxuLnByZWdhbWUtY2FyZDpob3ZlciB7XG4gIGJvcmRlcjogMC4xMjVyZW0gc29saWQgd2hpdGU7XG59XG5cbi5wcmVnYW1lLWNhcmQgaDEge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgbGluZS1oZWlnaHQ6IDE7XG4gIGZvbnQtZmFtaWx5OiAnQW50b24nLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDVyZW07XG4gIGxldHRlci1zcGFjaW5nOiAwLjFyZW07XG59XG5cbi5wcmVnYW1lLWNhcmQgLm5hbWUtZm9ybSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiA1JTtcblxuICBtYXJnaW46IDAgYXV0bztcbiAgbWF4LXdpZHRoOiA4MCU7XG59XG5cbi5uYW1lLWZvcm0gLm5hbWUtaW5wdXQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgd2lkdGg6IDEwMCU7XG5cbiAgZm9udC1zaXplOiBtaW4oY2FsYygwLjZyZW0gKyAwLjZ2dyksIDFyZW0pO1xuICBjb2xvcjogdmFyKC0tbWFpbi1jb2xvcik7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG5cbiAgcGFkZGluZy1pbmxpbmU6IDAuNXJlbTtcbiAgcGFkZGluZy1ibG9jazogMC43cmVtO1xuXG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLWJvdHRvbTogMC4xcmVtIHNvbGlkIHZhcigtLXRyYW5zcGFyZW50LWxvdy1ncmV5LWNvbG9yKTtcbn1cblxuLm5hbWUtZm9ybSAubmFtZS1pbnB1dDo6cGxhY2Vob2xkZXIge1xuICBjb2xvcjogdmFyKC0tdHJhbnNwYXJlbnQtbG93LWdyZXktY29sb3IpO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5uYW1lLWZvcm0gLm5hbWUtaW5wdXQ6aXMoOmhvdmVyLCA6Zm9jdXMpIHtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZDogdmFyKC0taW5wdXQtYmFja2dyb3VuZC1jb2xvcik7XG59XG5cbi5uYW1lLWZvcm0gLm5hbWUtaW5wdXQ6aXMoOmhvdmVyLCA6Zm9jdXMpfi5pbnB1dC1ib3JkZXIge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLm5hbWUtZm9ybSAuaW5wdXQtYm9yZGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWNvbG9yKTtcbiAgd2lkdGg6IDAlO1xuICBoZWlnaHQ6IDAuMTI1cmVtO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHRyYW5zaXRpb246IDAuM3M7XG59XG5cbi5wbGF5LW5vdy1idXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXNrOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSkgbm8tcmVwZWF0IGNlbnRlcjtcbiAgLXdlYmtpdC1tYXNrOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSkgbm8tcmVwZWF0IGNlbnRlcjtcblxuICBtYXNrLXNpemU6IDEwMCU7XG4gIC13ZWJraXQtbWFzay1zaXplOiAxMDAlO1xuXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgXG4gIHdpZHRoOiAxMDAlO1xuICBtaW4td2lkdGg6IDA7XG4gIGFzcGVjdC1yYXRpbzogNC8xO1xuXG4gIG1hcmdpbjogMCBhdXRvO1xuICBib3JkZXI6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuXG4gIGN1cnNvcjogY3Jvc3NoYWlyO1xufVxuXG4ucGxheS1ub3ctYnV0dG9uOjpiZWZvcmUge1xuICBjb250ZW50OiAnJztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAtMTtcblxuICBsZWZ0OiA1MCU7XG4gIHRvcDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgdHJhbnNpdGlvbjogd2lkdGggMC44cyBlYXNlO1xuICBcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMDtcbiAgXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tY29sb3IpO1xufVxuXG4ucGxheS1ub3ctYnV0dG9uOmhvdmVyOjpiZWZvcmUsXG4ucGxheS1ub3ctYnV0dG9uOmZvY3VzOjpiZWZvcmUge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLnBsYXktbm93LWJ1dHRvbiAudGV4dC1wbGF5LWJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlKTtcbiAgYm90dG9tOiAwO1xuXG4gIHdpZHRoOiAxMDAlO1xuICBcbiAgbGluZS1oZWlnaHQ6IDIuNTtcbiAgXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMC41dncpLCAwLjk1cmVtKTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMTg3NXJlbTs7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6IHZhcigtLW1haW4tY29sb3IpO1xuICBcbiAgdHJhbnNpdGlvbjogY29sb3IgMC44cyBlYXNlO1xuICBcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwO1xufVxuXG4ucGxheS1ub3ctYnV0dG9uOmhvdmVyIC50ZXh0LXBsYXktYnV0dG9uLFxuLnBsYXktbm93LWJ1dHRvbjpmb2N1cyAudGV4dC1wbGF5LWJ1dHRvbiB7XG4gIGNvbG9yOiB2YXIoLS1tYWluLW9wcG9zaXRlLWNvbG9yKTtcbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzByZW0pIHtcbiAgLnByZWdhbWUtY2FyZCBoMSB7XG4gICAgZm9udC1zaXplOiAzcmVtO1xuICB9XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvcHJlZ2FtZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxzQ0FBc0M7RUFDdEMscUNBQXFDO0VBQ3JDLHVDQUF1QztFQUN2QyxxQkFBcUI7RUFDckIsbUNBQW1DO0VBQ25DLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLHdDQUF3Qzs7RUFFeEMsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qiw4QkFBOEI7O0VBRTlCLFdBQVc7RUFDWCxvQkFBb0I7O0VBRXBCLDZCQUE2QjtFQUM3QixrQ0FBa0M7RUFDbEMsbUJBQW1CO0VBQ25CLDhEQUE4RDs7RUFFOUQsa0JBQWtCO0VBQ2xCLDZCQUE2Qjs7RUFFN0Isa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsNEJBQTRCO0FBQzlCOztBQUVBO0VBQ0Usa0JBQWtCOztFQUVsQixjQUFjO0VBQ2QsZ0NBQWdDO0VBQ2hDLGVBQWU7RUFDZixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsT0FBTzs7RUFFUCxjQUFjO0VBQ2QsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGtCQUFrQjs7RUFFbEIsV0FBVzs7RUFFWCwwQ0FBMEM7RUFDMUMsd0JBQXdCOztFQUV4Qiw2QkFBNkI7O0VBRTdCLHNCQUFzQjtFQUN0QixxQkFBcUI7O0VBRXJCLFlBQVk7RUFDWiw2REFBNkQ7QUFDL0Q7O0FBRUE7RUFDRSx3Q0FBd0M7RUFDeEMsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixtQ0FBbUM7RUFDbkMsU0FBUztFQUNULGdCQUFnQjtFQUNoQixTQUFTO0VBQ1QsT0FBTztFQUNQLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1COztFQUVuQiw4REFBMkQ7RUFDM0Qsc0VBQW1FOztFQUVuRSxlQUFlO0VBQ2YsdUJBQXVCOztFQUV2QixrQkFBa0I7O0VBRWxCLFdBQVc7RUFDWCxZQUFZO0VBQ1osaUJBQWlCOztFQUVqQixjQUFjO0VBQ2QsWUFBWTtFQUNaLDZCQUE2Qjs7RUFFN0IsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixXQUFXOztFQUVYLFNBQVM7RUFDVCxRQUFRO0VBQ1IsZ0NBQWdDO0VBQ2hDLDJCQUEyQjs7RUFFM0IsWUFBWTtFQUNaLFFBQVE7O0VBRVIsbUNBQW1DO0FBQ3JDOztBQUVBOztFQUVFLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QsMEJBQTBCO0VBQzFCLFNBQVM7O0VBRVQsV0FBVzs7RUFFWCxnQkFBZ0I7O0VBRWhCLDZDQUE2QztFQUM3Qyx5QkFBeUI7RUFDekIsa0JBQWtCO0VBQ2xCLHdCQUF3Qjs7RUFFeEIsMkJBQTJCOztFQUUzQixVQUFVO0VBQ1YsU0FBUztBQUNYOztBQUVBOztFQUVFLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFO0lBQ0UsZUFBZTtFQUNqQjtBQUNGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjpyb290IHtcXG4gIC0tbWFpbi1iYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNzUpO1xcbiAgLS10cmFuc3BhcmVudC1zaGFkb3ctY29sb3I6ICMwMDAwMDA0ZDtcXG4gIC0tdHJhbnNwYXJlbnQtbG93LWdyZXktY29sb3I6ICNmZmZmZmZhNjtcXG4gIC0tbWFpbi1jb2xvcjogI2ZmZmZmZjtcXG4gIC0taW5wdXQtYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDMzO1xcbiAgLS1tYWluLW9wcG9zaXRlLWNvbG9yOiAjMDAwMDAwO1xcbn1cXG5cXG4ucHJlZ2FtZS1jYXJkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tYmFja2dyb3VuZCk7XFxuXFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG5cXG4gIHdpZHRoOiAxMDAlO1xcbiAgbWF4LXdpZHRoOiAyOC4xMjVyZW07XFxuXFxuICBwYWRkaW5nOiBtaW4oY2FsYygxMCUpLCAzcmVtKTtcXG4gIGJvcmRlcjogMC4xMjVyZW0gc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm94LXNoYWRvdzogMCAwIDMwcHggMC4wNjI1cmVtIHZhcigtLXRyYW5zcGFyZW50LXNoYWRvdy1jb2xvcik7XFxuXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC41cztcXG5cXG4gIGFzcGVjdC1yYXRpbzogMTAvODtcXG59XFxuXFxuLnByZWdhbWUtY2FyZDpob3ZlciB7XFxuICBib3JkZXI6IDAuMTI1cmVtIHNvbGlkIHdoaXRlO1xcbn1cXG5cXG4ucHJlZ2FtZS1jYXJkIGgxIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbiAgZm9udC1mYW1pbHk6ICdBbnRvbicsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDVyZW07XFxuICBsZXR0ZXItc3BhY2luZzogMC4xcmVtO1xcbn1cXG5cXG4ucHJlZ2FtZS1jYXJkIC5uYW1lLWZvcm0ge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdG9wOiA1JTtcXG5cXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgbWF4LXdpZHRoOiA4MCU7XFxufVxcblxcbi5uYW1lLWZvcm0gLm5hbWUtaW5wdXQge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcblxcbiAgd2lkdGg6IDEwMCU7XFxuXFxuICBmb250LXNpemU6IG1pbihjYWxjKDAuNnJlbSArIDAuNnZ3KSwgMXJlbSk7XFxuICBjb2xvcjogdmFyKC0tbWFpbi1jb2xvcik7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cXG4gIHBhZGRpbmctaW5saW5lOiAwLjVyZW07XFxuICBwYWRkaW5nLWJsb2NrOiAwLjdyZW07XFxuXFxuICBib3JkZXI6IG5vbmU7XFxuICBib3JkZXItYm90dG9tOiAwLjFyZW0gc29saWQgdmFyKC0tdHJhbnNwYXJlbnQtbG93LWdyZXktY29sb3IpO1xcbn1cXG5cXG4ubmFtZS1mb3JtIC5uYW1lLWlucHV0OjpwbGFjZWhvbGRlciB7XFxuICBjb2xvcjogdmFyKC0tdHJhbnNwYXJlbnQtbG93LWdyZXktY29sb3IpO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubmFtZS1mb3JtIC5uYW1lLWlucHV0OmlzKDpob3ZlciwgOmZvY3VzKSB7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgYmFja2dyb3VuZDogdmFyKC0taW5wdXQtYmFja2dyb3VuZC1jb2xvcik7XFxufVxcblxcbi5uYW1lLWZvcm0gLm5hbWUtaW5wdXQ6aXMoOmhvdmVyLCA6Zm9jdXMpfi5pbnB1dC1ib3JkZXIge1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5uYW1lLWZvcm0gLmlucHV0LWJvcmRlciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluLWNvbG9yKTtcXG4gIHdpZHRoOiAwJTtcXG4gIGhlaWdodDogMC4xMjVyZW07XFxuICBib3R0b206IDA7XFxuICBsZWZ0OiAwO1xcbiAgdHJhbnNpdGlvbjogMC4zcztcXG59XFxuXFxuLnBsYXktbm93LWJ1dHRvbiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcblxcbiAgbWFzazogdXJsKCcuLi9hc3NldHMvaW1hZ2VzL2NhcnJpZXJYLnN2ZycpIG5vLXJlcGVhdCBjZW50ZXI7XFxuICAtd2Via2l0LW1hc2s6IHVybCgnLi4vYXNzZXRzL2ltYWdlcy9jYXJyaWVyWC5zdmcnKSBuby1yZXBlYXQgY2VudGVyO1xcblxcbiAgbWFzay1zaXplOiAxMDAlO1xcbiAgLXdlYmtpdC1tYXNrLXNpemU6IDEwMCU7XFxuXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBcXG4gIHdpZHRoOiAxMDAlO1xcbiAgbWluLXdpZHRoOiAwO1xcbiAgYXNwZWN0LXJhdGlvOiA0LzE7XFxuXFxuICBtYXJnaW46IDAgYXV0bztcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcblxcbiAgY3Vyc29yOiBjcm9zc2hhaXI7XFxufVxcblxcbi5wbGF5LW5vdy1idXR0b246OmJlZm9yZSB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHotaW5kZXg6IC0xO1xcblxcbiAgbGVmdDogNTAlO1xcbiAgdG9wOiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gIHRyYW5zaXRpb246IHdpZHRoIDAuOHMgZWFzZTtcXG4gIFxcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDA7XFxuICBcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1haW4tY29sb3IpO1xcbn1cXG5cXG4ucGxheS1ub3ctYnV0dG9uOmhvdmVyOjpiZWZvcmUsXFxuLnBsYXktbm93LWJ1dHRvbjpmb2N1czo6YmVmb3JlIHtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucGxheS1ub3ctYnV0dG9uIC50ZXh0LXBsYXktYnV0dG9uIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUpO1xcbiAgYm90dG9tOiAwO1xcblxcbiAgd2lkdGg6IDEwMCU7XFxuICBcXG4gIGxpbmUtaGVpZ2h0OiAyLjU7XFxuICBcXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMC41dncpLCAwLjk1cmVtKTtcXG4gIGxldHRlci1zcGFjaW5nOiAwLjE4NzVyZW07O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6IHZhcigtLW1haW4tY29sb3IpO1xcbiAgXFxuICB0cmFuc2l0aW9uOiBjb2xvciAwLjhzIGVhc2U7XFxuICBcXG4gIHBhZGRpbmc6IDA7XFxuICBtYXJnaW46IDA7XFxufVxcblxcbi5wbGF5LW5vdy1idXR0b246aG92ZXIgLnRleHQtcGxheS1idXR0b24sXFxuLnBsYXktbm93LWJ1dHRvbjpmb2N1cyAudGV4dC1wbGF5LWJ1dHRvbiB7XFxuICBjb2xvcjogdmFyKC0tbWFpbi1vcHBvc2l0ZS1jb2xvcik7XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDMwcmVtKSB7XFxuICAucHJlZ2FtZS1jYXJkIGgxIHtcXG4gICAgZm9udC1zaXplOiAzcmVtO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcbiAgLS1zZXR1cC1tYXgtd2lkdGg6IDQ2Ljg3NXJlbTtcbiAgLS1mb250LXNpemUtbm9ybWFsLXJlc3BvbnNpdmU6IG1pbihjYWxjKDAuNXJlbSArIDF2dyksIDFyZW0pO1xuICAtLWJsdWUtbGlnaHQtY29sb3I6ICM4N2NlZWI7XG59XG5cbi5zZXR1cC13cmFwcGVyIHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5zZXR1cC13cmFwcGVyPioge1xuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43NSk7XG4gIG1heC13aWR0aDogdmFyKC0tc2V0dXAtbWF4LXdpZHRoKTtcbn1cblxuLm1lc3NhZ2Uuc2V0dXAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xuXG4gIG1hcmdpbjogMCBhdXRvIDAuNXJlbTtcbiAgcGFkZGluZzogMXJlbTtcbiAgZm9udC1zaXplOiB2YXIoLS1mb250LXNpemUtbm9ybWFsLXJlc3BvbnNpdmUpO1xufVxuXG4ubWVzc2FnZS5zZXR1cCAubWVzc2FnZS1pbWFnZSB7XG4gIGhlaWdodDogbWluKGNhbGMoMS4yNXJlbSArIDJ2dyksIDIuNzVyZW0pO1xufVxuXG4ubWVzc2FnZS5zZXR1cCAubWVzc2FnZS1jb250YWluZXIge1xuICBkaXNwbGF5OiBpbmxpbmU7XG4gIHRleHQtYWxpZ246IHN0YXJ0O1xufVxuXG4ubWVzc2FnZS1jb250YWluZXIgLm1lc3NhZ2UtY2FwdGFpbiB7XG4gIGRpc3BsYXk6IGlubGluZTtcbiAgY29sb3I6IHZhcigtLWJsdWUtbGlnaHQtY29sb3IpO1xufVxuXG4ubWVzc2FnZS1jb250YWluZXIgLnR5cGVkLWN1cnNvciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbGVmdDogMC4wNjI1cmVtO1xuICBib3R0b206IC0wLjE4NzVyZW07XG5cbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXG4gIHdpZHRoOiAwLjVyZW07XG4gIGhlaWdodDogMXJlbTtcblxuICBjb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJsdWUtbGlnaHQtY29sb3IpO1xuXG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi5zZXR1cC1jb250YWluZXIge1xuICBtYXJnaW46IDAgYXV0bztcbiAgcGFkZGluZzogMXJlbTtcbn1cblxuLmJvYXJkLWZsZWV0LWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBnYXA6IDFyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cblxuLyogYm9hcmQgc3R5bGVzIGFyZSBpbiB0aGUgZmlsZSBib2FyZC5jc3MqL1xuXG4uZmxlZXQtc2V0dXAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG59XG5cbi5zaGlwLWNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZmxleDogMTtcblxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgbWF4LXdpZHRoOiA5LjM3NXJlbTtcbiAgbWluLXdpZHRoOiA2LjI1cmVtO1xuXG4gIG1hcmdpbjogY2FsYygwLjI1cmVtICsgMC41dncpO1xuICBwYWRkaW5nOiAwLjI1cmVtO1xuICBib3JkZXI6IDAuMTI1cmVtIHNvbGlkIHdoaXRlO1xuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XG5cbiAgY29sb3I6ICNmZmZmZmY7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XG4gIGJveC1zaGFkb3c6IDAgMCAxMHB4IDAgIzg3Y2VlYjtcblxuICB0cmFuc2l0aW9uOiBhbGwgMC4wNXMgbGluZWFyLCB2aXNpYmlsaXR5IDAuMDFzIGxpbmVhcjtcbiAgZmlsdGVyOiBicmlnaHRuZXNzKDAuNSk7XG59XG5cbi5zaGlwLWNhcmQgLnNoaXAtY29udGVudCAuc2hpcC1pbWFnZSB7XG4gIGhlaWdodDogbWluKGNhbGMoMXJlbSArIDEuNXZ3KSwgMnJlbSk7XG4gIG1heC13aWR0aDogMTAwJTtcblxuICBmaWx0ZXI6IGludmVydCgxMDAlKSBzZXBpYSg4JSkgc2F0dXJhdGUoMzclKSBodWUtcm90YXRlKDMyOGRlZykgYnJpZ2h0bmVzcygxMDUlKSBjb250cmFzdCgxMDAlKTtcblxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcblxuICAvKlxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDM7XG4gICovXG59XG5cbi5zaGlwLWNhcmQgLnNoaXAtY29udGVudCAuc2hpcC1uYW1lIHtcbiAgLypcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAzO1xuICAqL1xuXG4gIGZvbnQtc2l6ZTogMC44NXJlbTtcbn1cblxuLnNoaXAtY2FyZDo6YmVmb3JlLFxuLnNoaXAtY2FyZDo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IC0xO1xuXG4gIGJhY2tncm91bmQ6IHJnYigwLCAwLCAwKTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgbGluZWFyLCB2aXNpYmlsaXR5IDAuMDFzIGxpbmVhcjtcbn1cblxuLnNoaXAtY2FyZDo6YmVmb3JlIHtcbiAgd2lkdGg6IGNhbGMoMTAwJSArIDAuMjVyZW0pO1xuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDFyZW0pO1xuXG4gIHRvcDogMC41cmVtO1xuICBsZWZ0OiAtMC4xMjVyZW07XG59XG5cbi5zaGlwLWNhcmQ6OmFmdGVyIHtcbiAgd2lkdGg6IGNhbGMoMTAwJSAtIDFyZW0pO1xuICBoZWlnaHQ6IGNhbGMoMTAwJSArIDAuMjVyZW0pO1xuICB0b3A6IC0wLjEyNXJlbTtcbiAgbGVmdDogMC41cmVtO1xufVxuXG4uc2hpcC1jYXJkOmhvdmVyOjpiZWZvcmUsXG4uc2hpcC1jYXJkOmZvY3VzOjpiZWZvcmUge1xuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDJyZW0pO1xuICB0b3A6IDFyZW07XG59XG5cbi5zaGlwLWNhcmQ6aG92ZXI6OmFmdGVyLFxuLnNoaXAtY2FyZDpmb2N1czo6YWZ0ZXIge1xuICB3aWR0aDogY2FsYygxMDAlIC0gMnJlbSk7XG4gIGxlZnQ6IDFyZW07XG59XG5cbi5zaGlwLWNhcmQ6YWN0aXZlIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcbn1cblxuLnNoaXAtY2FyZDpob3ZlciB7XG4gIGN1cnNvcjogZ3JhYjtcbn1cblxuLnNoaXAtY2FyZDpmb2N1cyB7XG4gIGJveC1zaGFkb3c6IG5vbmU7XG4gIGZpbHRlcjogYnJpZ2h0bmVzcygxKTtcbn1cblxuLnNoaXAtY2FyZDpmb2N1cyAuc2hpcC1jb250ZW50IHtcbiAgLypcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAxO1xuICAqL1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuLnNoaXAtY2FyZDpmb2N1cyAuc2hpcC1jb250ZW50IC5zaGlwLWltYWdlIHtcbiAgLypcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAyO1xuICAqL1xuICBmaWx0ZXI6IGludmVydCgxMDAlKSBzZXBpYSgwJSkgc2F0dXJhdGUoMCUpIGh1ZS1yb3RhdGUoOGRlZykgYnJpZ2h0bmVzcygxMDAlKSBjb250cmFzdCgxMDQlKTtcbn1cblxuLnNoaXAtY2FyZC5oaWRkZW4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNzUpO1xuXG4gIGJveC1zaGFkb3c6IG5vbmU7XG5cbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG5cbiAgb3BhY2l0eTogMC41O1xuXG4gIGZpbHRlcjogYnJpZ2h0bmVzcygwLjUpO1xufVxuXG4uc2hpcC1jYXJkLmhpZGRlbjo6YmVmb3JlLFxuLnNoaXAtY2FyZC5oaWRkZW46OmFmdGVyIHtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG59XG5cbi5zaGlwLWNhcmQuaGlkZGVuIC5zaGlwLWNvbnRlbnQge1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG59XG5cbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2NhcnJpZXInXSB7XG4gIG9yZGVyOiAxO1xufVxuXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdjYXJyaWVyJ10gaW1nIHtcbiAgYXNwZWN0LXJhdGlvOiA0LzE7XG59XG5cbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2JhdHRsZXNoaXAnXSB7XG4gIG9yZGVyOiAyO1xufVxuXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdiYXR0bGVzaGlwJ10gaW1nIHtcbiAgYXNwZWN0LXJhdGlvOiA0LzE7XG59XG5cbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2NydWlzZXInXSB7XG4gIG9yZGVyOiAzO1xufVxuXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdjcnVpc2VyJ10gaW1nIHtcbiAgYXNwZWN0LXJhdGlvOiAzLzE7XG59XG5cbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J3N1Ym1hcmluZSddIHtcbiAgb3JkZXI6IDQ7XG59XG5cbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J3N1Ym1hcmluZSddIGltZyB7XG4gIGFzcGVjdC1yYXRpbzogMy8xO1xufVxuXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdkZXN0cm95ZXInXSB7XG4gIG9yZGVyOiA1O1xufVxuXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdkZXN0cm95ZXInXSBpbWcge1xuICBhc3BlY3QtcmF0aW86IDIvMTtcbn1cblxuLnJlc2V0LWNvbnRpbnVlLXNlY3Rpb24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBnYXA6IG1pbigxMCUsIDJyZW0pO1xuXG4gIG1hcmdpbjogMC41cmVtIGF1dG8gMDtcbiAgcGFkZGluZzogMXJlbTtcbn1cblxuYnV0dG9uIHtcbiAgb3V0bGluZTogbm9uZTtcbn1cblxuYnV0dG9uOmZvY3VzLFxuLnNoaXAtY2FyZDpmb2N1cyB7XG4gIG91dGxpbmU6IDAuMTI1cmVtIHNvbGlkICM4N2NlZWI7XG4gIG91dGxpbmUtb2Zmc2V0OiAwLjEyNXJlbTtcbn1cblxuLyogU0hPVyBPVVRMSU5FIE9OIFRBQlMgT05MWSAqL1xuYnV0dG9uOmZvY3VzOm5vdCg6Zm9jdXMtdmlzaWJsZSksXG4uc2hpcC1jYXJkOmZvY3VzOm5vdCg6Zm9jdXMtdmlzaWJsZSkge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG4uYXhpcy1idXR0b24tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgZ2FwOiBtaW4oMTAlLCAycmVtKTtcbn1cblxuLmF4aXMtYnV0dG9uLFxuLnJlc2V0LWJ1dHRvbixcbi5jb250aW51ZS1idXR0b24ge1xuICBhcHBlYXJhbmNlOiBub25lO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cbiAgbWluLXdpZHRoOiAwO1xuICBcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwLjc1cmVtIDNyZW07XG4gIGJvcmRlcjogMC4wNjI1cmVtIHNvbGlkICNmZmZmZmY7XG5cbiAgZm9udC1zaXplOiBtaW4oY2FsYygwLjVyZW0gKyAxdncpLCAxcmVtKTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogI2ZmZmZmZjtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcblxuICB0cmFuc2l0aW9uOiBhbGwgMzAwbXMgY3ViaWMtYmV6aWVyKDAuMjMsIDEsIDAuMzIsIDEpO1xuICBcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uYXhpcy1idXR0b246aG92ZXIsXG4ucmVzZXQtYnV0dG9uOmhvdmVyLFxuLmNvbnRpbnVlLWJ1dHRvbi5lbmFibGVkOmhvdmVyXG57XG4gIGJveC1zaGFkb3c6IDAgMC41cmVtIDAuOTM3NXJlbSByZ2JhKDAsIDAsIDAsIDAuMjUpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTAuMTI1cmVtKTtcbn1cblxuLmF4aXMtYnV0dG9uOmFjdGl2ZSxcbi5yZXNldC1idXR0b246YWN0aXZlLFxuLmNvbnRpbnVlLWJ1dHRvbi5hY3RpdmU6YWN0aXZlLFxuLmF4aXMtYnV0dG9uLnNlbGVjdGVkIHtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG59XG5cbi5jb250aW51ZS1idXR0b24uZGlzYWJsZWQge1xuICBib3JkZXItY29sb3I6ICNmZmZmZmZhNjtcbiAgY29sb3I6ICNmZmZmZmZhNjtcbiAgcG9pbnRlci1ldmVudHM6IGFsbDtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cblxuLmNvbnRpbnVlLWJ1dHRvbi5kaXNhYmxlZDphY3RpdmUge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NmNDA0MDgwO1xufVxuXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzMHJlbSkge1xuICAuYXBwLnNldHVwIC5zZXR1cC1jb250YWluZXIgLmJvYXJkLWZsZWV0LWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB9XG5cbiAgLmJvYXJkLWZsZWV0LWNvbnRhaW5lciAuZmxlZXQtc2V0dXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgfVxufVxuXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzMHJlbSkge1xuICAuc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdjYXJyaWVyJ10ge1xuICAgIG9yZGVyOiA1O1xuICB9XG5cbiAgLnNoaXAtY2FyZFtkYXRhLXNoaXAtbmFtZT0nYmF0dGxlc2hpcCddIHtcbiAgICBvcmRlcjogNDtcbiAgfVxuXG4gIC5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2NydWlzZXInXSB7XG4gICAgb3JkZXI6IDM7XG4gIH1cblxuICAuc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdzdWJtYXJpbmUnXSB7XG4gICAgb3JkZXI6IDI7XG4gIH1cblxuICAuc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdkZXN0cm95ZXInXSB7XG4gICAgb3JkZXI6IDE7XG4gIH1cbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9zZXR1cC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSw0QkFBNEI7RUFDNUIsNERBQTREO0VBQzVELDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLFdBQVc7QUFDYjs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQixxQ0FBcUM7RUFDckMsaUNBQWlDO0FBQ25DOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDJCQUEyQjtFQUMzQixtQkFBbUI7RUFDbkIsV0FBVzs7RUFFWCxxQkFBcUI7RUFDckIsYUFBYTtFQUNiLDZDQUE2QztBQUMvQzs7QUFFQTtFQUNFLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLGVBQWU7RUFDZixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixrQkFBa0I7O0VBRWxCLHFCQUFxQjs7RUFFckIsYUFBYTtFQUNiLFlBQVk7O0VBRVosa0JBQWtCO0VBQ2xCLHlDQUF5Qzs7RUFFekMsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsY0FBYztFQUNkLGFBQWE7QUFDZjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsU0FBUztFQUNULGtCQUFrQjtBQUNwQjs7QUFFQSwwQ0FBMEM7O0FBRTFDO0VBQ0UsYUFBYTtFQUNiLGVBQWU7RUFDZixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLE9BQU87O0VBRVAsa0JBQWtCOztFQUVsQixtQkFBbUI7RUFDbkIsa0JBQWtCOztFQUVsQiw2QkFBNkI7RUFDN0IsZ0JBQWdCO0VBQ2hCLDRCQUE0QjtFQUM1QixxQkFBcUI7O0VBRXJCLGNBQWM7RUFDZCx5QkFBeUI7RUFDekIsOEJBQThCOztFQUU5QixxREFBcUQ7RUFDckQsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0UscUNBQXFDO0VBQ3JDLGVBQWU7O0VBRWYsK0ZBQStGOztFQUUvRixvQkFBb0I7O0VBRXBCOzs7R0FHQztBQUNIOztBQUVBO0VBQ0U7OztHQUdDOztFQUVELGtCQUFrQjtBQUNwQjs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLFdBQVc7O0VBRVgsd0JBQXdCO0VBQ3hCLG9EQUFvRDtBQUN0RDs7QUFFQTtFQUNFLDJCQUEyQjtFQUMzQix5QkFBeUI7O0VBRXpCLFdBQVc7RUFDWCxlQUFlO0FBQ2pCOztBQUVBO0VBQ0Usd0JBQXdCO0VBQ3hCLDRCQUE0QjtFQUM1QixjQUFjO0VBQ2QsWUFBWTtBQUNkOztBQUVBOztFQUVFLHlCQUF5QjtFQUN6QixTQUFTO0FBQ1g7O0FBRUE7O0VBRUUsd0JBQXdCO0VBQ3hCLFVBQVU7QUFDWjs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRTs7O0dBR0M7RUFDRCxvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRTs7O0dBR0M7RUFDRCw0RkFBNEY7QUFDOUY7O0FBRUE7RUFDRSxxQ0FBcUM7O0VBRXJDLGdCQUFnQjs7RUFFaEIsb0JBQW9COztFQUVwQixZQUFZOztFQUVaLHVCQUF1QjtBQUN6Qjs7QUFFQTs7RUFFRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjs7RUFFbkIsbUJBQW1COztFQUVuQixxQkFBcUI7RUFDckIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsYUFBYTtBQUNmOztBQUVBOztFQUVFLCtCQUErQjtFQUMvQix3QkFBd0I7QUFDMUI7O0FBRUEsOEJBQThCO0FBQzlCOztFQUVFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1COztFQUVuQixtQkFBbUI7QUFDckI7O0FBRUE7OztFQUdFLGdCQUFnQjtFQUNoQixxQkFBcUI7O0VBRXJCLFlBQVk7O0VBRVosU0FBUztFQUNULHFCQUFxQjtFQUNyQiwrQkFBK0I7O0VBRS9CLHdDQUF3QztFQUN4QyxrQkFBa0I7RUFDbEIsY0FBYzs7RUFFZCw2QkFBNkI7O0VBRTdCLG9EQUFvRDs7RUFFcEQsZUFBZTtBQUNqQjs7QUFFQTs7OztFQUlFLGtEQUFrRDtFQUNsRCxnQ0FBZ0M7QUFDbEM7O0FBRUE7Ozs7RUFJRSxjQUFjO0VBQ2QseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFO0lBQ0UsYUFBYTtJQUNiLHNCQUFzQjtFQUN4Qjs7RUFFQTtJQUNFLGFBQWE7SUFDYixtQkFBbUI7RUFDckI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsUUFBUTtFQUNWOztFQUVBO0lBQ0UsUUFBUTtFQUNWOztFQUVBO0lBQ0UsUUFBUTtFQUNWOztFQUVBO0lBQ0UsUUFBUTtFQUNWOztFQUVBO0lBQ0UsUUFBUTtFQUNWO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiOnJvb3Qge1xcbiAgLS1zZXR1cC1tYXgtd2lkdGg6IDQ2Ljg3NXJlbTtcXG4gIC0tZm9udC1zaXplLW5vcm1hbC1yZXNwb25zaXZlOiBtaW4oY2FsYygwLjVyZW0gKyAxdncpLCAxcmVtKTtcXG4gIC0tYmx1ZS1saWdodC1jb2xvcjogIzg3Y2VlYjtcXG59XFxuXFxuLnNldHVwLXdyYXBwZXIge1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5zZXR1cC13cmFwcGVyPioge1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjc1KTtcXG4gIG1heC13aWR0aDogdmFyKC0tc2V0dXAtbWF4LXdpZHRoKTtcXG59XFxuXFxuLm1lc3NhZ2Uuc2V0dXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDAuNXJlbTtcXG5cXG4gIG1hcmdpbjogMCBhdXRvIDAuNXJlbTtcXG4gIHBhZGRpbmc6IDFyZW07XFxuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS1ub3JtYWwtcmVzcG9uc2l2ZSk7XFxufVxcblxcbi5tZXNzYWdlLnNldHVwIC5tZXNzYWdlLWltYWdlIHtcXG4gIGhlaWdodDogbWluKGNhbGMoMS4yNXJlbSArIDJ2dyksIDIuNzVyZW0pO1xcbn1cXG5cXG4ubWVzc2FnZS5zZXR1cCAubWVzc2FnZS1jb250YWluZXIge1xcbiAgZGlzcGxheTogaW5saW5lO1xcbiAgdGV4dC1hbGlnbjogc3RhcnQ7XFxufVxcblxcbi5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1jYXB0YWluIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG4gIGNvbG9yOiB2YXIoLS1ibHVlLWxpZ2h0LWNvbG9yKTtcXG59XFxuXFxuLm1lc3NhZ2UtY29udGFpbmVyIC50eXBlZC1jdXJzb3Ige1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbGVmdDogMC4wNjI1cmVtO1xcbiAgYm90dG9tOiAtMC4xODc1cmVtO1xcblxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcblxcbiAgd2lkdGg6IDAuNXJlbTtcXG4gIGhlaWdodDogMXJlbTtcXG5cXG4gIGNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJsdWUtbGlnaHQtY29sb3IpO1xcblxcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuLnNldHVwLWNvbnRhaW5lciB7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIHBhZGRpbmc6IDFyZW07XFxufVxcblxcbi5ib2FyZC1mbGVldC1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xcbn1cXG5cXG4vKiBib2FyZCBzdHlsZXMgYXJlIGluIHRoZSBmaWxlIGJvYXJkLmNzcyovXFxuXFxuLmZsZWV0LXNldHVwIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxufVxcblxcbi5zaGlwLWNhcmQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGZsZXg6IDE7XFxuXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFxuICBtYXgtd2lkdGg6IDkuMzc1cmVtO1xcbiAgbWluLXdpZHRoOiA2LjI1cmVtO1xcblxcbiAgbWFyZ2luOiBjYWxjKDAuMjVyZW0gKyAwLjV2dyk7XFxuICBwYWRkaW5nOiAwLjI1cmVtO1xcbiAgYm9yZGVyOiAwLjEyNXJlbSBzb2xpZCB3aGl0ZTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG5cXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXG4gIGJveC1zaGFkb3c6IDAgMCAxMHB4IDAgIzg3Y2VlYjtcXG5cXG4gIHRyYW5zaXRpb246IGFsbCAwLjA1cyBsaW5lYXIsIHZpc2liaWxpdHkgMC4wMXMgbGluZWFyO1xcbiAgZmlsdGVyOiBicmlnaHRuZXNzKDAuNSk7XFxufVxcblxcbi5zaGlwLWNhcmQgLnNoaXAtY29udGVudCAuc2hpcC1pbWFnZSB7XFxuICBoZWlnaHQ6IG1pbihjYWxjKDFyZW0gKyAxLjV2dyksIDJyZW0pO1xcbiAgbWF4LXdpZHRoOiAxMDAlO1xcblxcbiAgZmlsdGVyOiBpbnZlcnQoMTAwJSkgc2VwaWEoOCUpIHNhdHVyYXRlKDM3JSkgaHVlLXJvdGF0ZSgzMjhkZWcpIGJyaWdodG5lc3MoMTA1JSkgY29udHJhc3QoMTAwJSk7XFxuXFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG5cXG4gIC8qXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiAzO1xcbiAgKi9cXG59XFxuXFxuLnNoaXAtY2FyZCAuc2hpcC1jb250ZW50IC5zaGlwLW5hbWUge1xcbiAgLypcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHotaW5kZXg6IDM7XFxuICAqL1xcblxcbiAgZm9udC1zaXplOiAwLjg1cmVtO1xcbn1cXG5cXG4uc2hpcC1jYXJkOjpiZWZvcmUsXFxuLnNoaXAtY2FyZDo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB6LWluZGV4OiAtMTtcXG5cXG4gIGJhY2tncm91bmQ6IHJnYigwLCAwLCAwKTtcXG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGxpbmVhciwgdmlzaWJpbGl0eSAwLjAxcyBsaW5lYXI7XFxufVxcblxcbi5zaGlwLWNhcmQ6OmJlZm9yZSB7XFxuICB3aWR0aDogY2FsYygxMDAlICsgMC4yNXJlbSk7XFxuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDFyZW0pO1xcblxcbiAgdG9wOiAwLjVyZW07XFxuICBsZWZ0OiAtMC4xMjVyZW07XFxufVxcblxcbi5zaGlwLWNhcmQ6OmFmdGVyIHtcXG4gIHdpZHRoOiBjYWxjKDEwMCUgLSAxcmVtKTtcXG4gIGhlaWdodDogY2FsYygxMDAlICsgMC4yNXJlbSk7XFxuICB0b3A6IC0wLjEyNXJlbTtcXG4gIGxlZnQ6IDAuNXJlbTtcXG59XFxuXFxuLnNoaXAtY2FyZDpob3Zlcjo6YmVmb3JlLFxcbi5zaGlwLWNhcmQ6Zm9jdXM6OmJlZm9yZSB7XFxuICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDJyZW0pO1xcbiAgdG9wOiAxcmVtO1xcbn1cXG5cXG4uc2hpcC1jYXJkOmhvdmVyOjphZnRlcixcXG4uc2hpcC1jYXJkOmZvY3VzOjphZnRlciB7XFxuICB3aWR0aDogY2FsYygxMDAlIC0gMnJlbSk7XFxuICBsZWZ0OiAxcmVtO1xcbn1cXG5cXG4uc2hpcC1jYXJkOmFjdGl2ZSB7XFxuICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpO1xcbn1cXG5cXG4uc2hpcC1jYXJkOmhvdmVyIHtcXG4gIGN1cnNvcjogZ3JhYjtcXG59XFxuXFxuLnNoaXAtY2FyZDpmb2N1cyB7XFxuICBib3gtc2hhZG93OiBub25lO1xcbiAgZmlsdGVyOiBicmlnaHRuZXNzKDEpO1xcbn1cXG5cXG4uc2hpcC1jYXJkOmZvY3VzIC5zaGlwLWNvbnRlbnQge1xcbiAgLypcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHotaW5kZXg6IDE7XFxuICAqL1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5zaGlwLWNhcmQ6Zm9jdXMgLnNoaXAtY29udGVudCAuc2hpcC1pbWFnZSB7XFxuICAvKlxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogMjtcXG4gICovXFxuICBmaWx0ZXI6IGludmVydCgxMDAlKSBzZXBpYSgwJSkgc2F0dXJhdGUoMCUpIGh1ZS1yb3RhdGUoOGRlZykgYnJpZ2h0bmVzcygxMDAlKSBjb250cmFzdCgxMDQlKTtcXG59XFxuXFxuLnNoaXAtY2FyZC5oaWRkZW4ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjc1KTtcXG5cXG4gIGJveC1zaGFkb3c6IG5vbmU7XFxuXFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG5cXG4gIG9wYWNpdHk6IDAuNTtcXG5cXG4gIGZpbHRlcjogYnJpZ2h0bmVzcygwLjUpO1xcbn1cXG5cXG4uc2hpcC1jYXJkLmhpZGRlbjo6YmVmb3JlLFxcbi5zaGlwLWNhcmQuaGlkZGVuOjphZnRlciB7XFxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLnNoaXAtY2FyZC5oaWRkZW4gLnNoaXAtY29udGVudCB7XFxuICB2aXNpYmlsaXR5OiBoaWRkZW47XFxufVxcblxcbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2NhcnJpZXInXSB7XFxuICBvcmRlcjogMTtcXG59XFxuXFxuLnNoaXAtY2FyZFtkYXRhLXNoaXAtbmFtZT0nY2FycmllciddIGltZyB7XFxuICBhc3BlY3QtcmF0aW86IDQvMTtcXG59XFxuXFxuLnNoaXAtY2FyZFtkYXRhLXNoaXAtbmFtZT0nYmF0dGxlc2hpcCddIHtcXG4gIG9yZGVyOiAyO1xcbn1cXG5cXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdiYXR0bGVzaGlwJ10gaW1nIHtcXG4gIGFzcGVjdC1yYXRpbzogNC8xO1xcbn1cXG5cXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdjcnVpc2VyJ10ge1xcbiAgb3JkZXI6IDM7XFxufVxcblxcbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2NydWlzZXInXSBpbWcge1xcbiAgYXNwZWN0LXJhdGlvOiAzLzE7XFxufVxcblxcbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J3N1Ym1hcmluZSddIHtcXG4gIG9yZGVyOiA0O1xcbn1cXG5cXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdzdWJtYXJpbmUnXSBpbWcge1xcbiAgYXNwZWN0LXJhdGlvOiAzLzE7XFxufVxcblxcbi5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2Rlc3Ryb3llciddIHtcXG4gIG9yZGVyOiA1O1xcbn1cXG5cXG4uc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdkZXN0cm95ZXInXSBpbWcge1xcbiAgYXNwZWN0LXJhdGlvOiAyLzE7XFxufVxcblxcbi5yZXNldC1jb250aW51ZS1zZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFxuICBnYXA6IG1pbigxMCUsIDJyZW0pO1xcblxcbiAgbWFyZ2luOiAwLjVyZW0gYXV0byAwO1xcbiAgcGFkZGluZzogMXJlbTtcXG59XFxuXFxuYnV0dG9uIHtcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcblxcbmJ1dHRvbjpmb2N1cyxcXG4uc2hpcC1jYXJkOmZvY3VzIHtcXG4gIG91dGxpbmU6IDAuMTI1cmVtIHNvbGlkICM4N2NlZWI7XFxuICBvdXRsaW5lLW9mZnNldDogMC4xMjVyZW07XFxufVxcblxcbi8qIFNIT1cgT1VUTElORSBPTiBUQUJTIE9OTFkgKi9cXG5idXR0b246Zm9jdXM6bm90KDpmb2N1cy12aXNpYmxlKSxcXG4uc2hpcC1jYXJkOmZvY3VzOm5vdCg6Zm9jdXMtdmlzaWJsZSkge1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuXFxuLmF4aXMtYnV0dG9uLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcblxcbiAgZ2FwOiBtaW4oMTAlLCAycmVtKTtcXG59XFxuXFxuLmF4aXMtYnV0dG9uLFxcbi5yZXNldC1idXR0b24sXFxuLmNvbnRpbnVlLWJ1dHRvbiB7XFxuICBhcHBlYXJhbmNlOiBub25lO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcblxcbiAgbWluLXdpZHRoOiAwO1xcbiAgXFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwLjc1cmVtIDNyZW07XFxuICBib3JkZXI6IDAuMDYyNXJlbSBzb2xpZCAjZmZmZmZmO1xcblxcbiAgZm9udC1zaXplOiBtaW4oY2FsYygwLjVyZW0gKyAxdncpLCAxcmVtKTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuXFxuICB0cmFuc2l0aW9uOiBhbGwgMzAwbXMgY3ViaWMtYmV6aWVyKDAuMjMsIDEsIDAuMzIsIDEpO1xcbiAgXFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5heGlzLWJ1dHRvbjpob3ZlcixcXG4ucmVzZXQtYnV0dG9uOmhvdmVyLFxcbi5jb250aW51ZS1idXR0b24uZW5hYmxlZDpob3ZlclxcbntcXG4gIGJveC1zaGFkb3c6IDAgMC41cmVtIDAuOTM3NXJlbSByZ2JhKDAsIDAsIDAsIDAuMjUpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0wLjEyNXJlbSk7XFxufVxcblxcbi5heGlzLWJ1dHRvbjphY3RpdmUsXFxuLnJlc2V0LWJ1dHRvbjphY3RpdmUsXFxuLmNvbnRpbnVlLWJ1dHRvbi5hY3RpdmU6YWN0aXZlLFxcbi5heGlzLWJ1dHRvbi5zZWxlY3RlZCB7XFxuICBjb2xvcjogIzAwMDAwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxufVxcblxcbi5jb250aW51ZS1idXR0b24uZGlzYWJsZWQge1xcbiAgYm9yZGVyLWNvbG9yOiAjZmZmZmZmYTY7XFxuICBjb2xvcjogI2ZmZmZmZmE2O1xcbiAgcG9pbnRlci1ldmVudHM6IGFsbDtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbi5jb250aW51ZS1idXR0b24uZGlzYWJsZWQ6YWN0aXZlIHtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NmNDA0MDgwO1xcbn1cXG5cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzMHJlbSkge1xcbiAgLmFwcC5zZXR1cCAuc2V0dXAtY29udGFpbmVyIC5ib2FyZC1mbGVldC1jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgfVxcblxcbiAgLmJvYXJkLWZsZWV0LWNvbnRhaW5lciAuZmxlZXQtc2V0dXAge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzMHJlbSkge1xcbiAgLnNoaXAtY2FyZFtkYXRhLXNoaXAtbmFtZT0nY2FycmllciddIHtcXG4gICAgb3JkZXI6IDU7XFxuICB9XFxuXFxuICAuc2hpcC1jYXJkW2RhdGEtc2hpcC1uYW1lPSdiYXR0bGVzaGlwJ10ge1xcbiAgICBvcmRlcjogNDtcXG4gIH1cXG5cXG4gIC5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2NydWlzZXInXSB7XFxuICAgIG9yZGVyOiAzO1xcbiAgfVxcblxcbiAgLnNoaXAtY2FyZFtkYXRhLXNoaXAtbmFtZT0nc3VibWFyaW5lJ10ge1xcbiAgICBvcmRlcjogMjtcXG4gIH1cXG5cXG4gIC5zaGlwLWNhcmRbZGF0YS1zaGlwLW5hbWU9J2Rlc3Ryb3llciddIHtcXG4gICAgb3JkZXI6IDE7XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLndpbi1tb2RhbC1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxcmVtO1xuXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43NSk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcblxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDEwO1xuICB0b3A6IDUwJTtcbiAgbGVmdDogNTAlO1xuXG4gIHdpZHRoOiBtaW4oMzByZW0sIDgwJSk7XG4gIGFzcGVjdC1yYXRpbzogMSAvIDE7XG5cbiAgcGFkZGluZzogMnJlbTtcblxuICBib3JkZXItcmFkaXVzOiAycmVtO1xuXG4gIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0O1xuICBhbmltYXRpb246IHBvcCAwLjVzIDEgZm9yd2FyZHM7XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyLnBsYXllciB7XG4gIGJveC1zaGFkb3c6IDAgMCAycmVtICM4N2NlZWI7XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyLmVuZW15IHtcbiAgYm94LXNoYWRvdzogMCAwIDJyZW0gI2YzYTY0MDtcbn1cblxuLndpbi1tb2RhbC1jb250YWluZXIgLnRpdGxlLWNhcHRhaW4td2luLFxuLndpbi1tb2RhbC1jb250YWluZXIgLnRpdGxlLWVuZW15LXdpbiB7XG4gIGZvbnQtc2l6ZTogMnJlbTtcbiAgZm9udC1zdHlsZTogaXRhbGljO1xuICBmb250LXdlaWdodDogNDAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyIC50aXRsZS1jYXB0YWluLXdpbiB7XG4gIGNvbG9yOiAjODdjZWViO1xufVxuXG4ud2luLW1vZGFsLWNvbnRhaW5lciAudGl0bGUtZW5lbXktd2luIHtcbiAgY29sb3I6ICNmM2E2NDA7XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZS5lbmVteS13aW4sXG4ud2luLW1vZGFsLWNvbnRhaW5lciAubWVzc2FnZS5iYXR0bGUuY2FwdGFpbi13aW4ge1xuICBtYXgtd2lkdGg6IDE4cmVtO1xufVxuXG4ud2luLW1vZGFsLWNvbnRhaW5lciAubWVzc2FnZS5iYXR0bGUuZW5lbXktd2luIGltZyxcbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZS5jYXB0YWluLXdpbiBpbWcge1xuICBoZWlnaHQ6IDNyZW07XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZS5lbmVteS13aW4gLnR5cGVkLWN1cnNvcixcbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZS5jYXB0YWluLXdpbiAudHlwZWQtY3Vyc29yIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLndpbi1tb2RhbC1jb250YWluZXIgIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1jYXB0YWluLXdpbixcbi53aW4tbW9kYWwtY29udGFpbmVyICAubWVzc2FnZS1jb250YWluZXIgLm1lc3NhZ2UtZW5lbXktd2luIHtcbiAgZGlzcGxheTogaW5saW5lO1xuICB3aWR0aDogMTAwJTtcbiAgZm9udC1zaXplOiBtaW4oY2FsYygwLjVyZW0gKyAxdncpLCAxLjEyNXJlbSk7XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZSAubWVzc2FnZS1jb250YWluZXIgLm1lc3NhZ2UtY2FwdGFpbi13aW4ge1xuICBjb2xvcjogIzg3Y2VlYjtcbn1cblxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1lbmVteS13aW4ge1xuICBjb2xvcjogI2YzYTY0MDtcbn1cblxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1jYXB0YWluLXdpbisudHlwZWQtY3Vyc29yIHtcbiAgY29sb3I6ICM4N2NlZWI7XG59XG5cbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZSAubWVzc2FnZS1jb250YWluZXIgLm1lc3NhZ2UtZW5lbXktd2luKy50eXBlZC1jdXJzb3Ige1xuICBjb2xvcjogI2YzYTY0MDtcbn1cblxuLndpbi1vdmVybGF5IHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNzUpO1xuXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogNTtcblxuICBhbmltYXRpb246IG9wYWNpdHlTaG93IDAuNXMgMSBmb3J3YXJkcztcbn1cblxuQGtleWZyYW1lcyBwb3Age1xuICAwJSB7XG4gICAgb3BhY2l0eTogMC4yNTtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDApIHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgfVxuXG4gIDgwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSkgdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICB9XG5cbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIG9wYWNpdHlTaG93IHtcbiAgMCUge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cblxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG59XG5cbmJ1dHRvbiB7XG4gIG91dGxpbmU6IG5vbmU7XG59XG5cbmJ1dHRvbjpmb2N1cyB7XG4gIG91dGxpbmU6IDAuMTI1cmVtIHNvbGlkICM4N2NlZWI7XG4gIG91dGxpbmUtb2Zmc2V0OiAwLjEyNXJlbTtcbn1cblxuYnV0dG9uOmZvY3VzOm5vdCg6Zm9jdXMtdmlzaWJsZSkge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG4uZW5lbXktd2luICsgLm5ldy1nYW1lLWJ1dHRvbjpmb2N1cyB7XG4gIG91dGxpbmUtY29sb3I6ICNmM2E2NDA7XG59XG5cbi5uZXctZ2FtZS1idXR0b24ge1xuICBhcHBlYXJhbmNlOiBub25lO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cbiAgbWluLXdpZHRoOiAwO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDAuNzVyZW0gM3JlbTtcbiAgYm9yZGVyOiAwLjA2MjVyZW0gc29saWQgI2ZmZmZmZjtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMXZ3KSwgMXJlbSk7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICNmZmZmZmY7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIHRyYW5zaXRpb246IGFsbCAzMDBtcyBjdWJpYy1iZXppZXIoMC4yMywgMSwgMC4zMiwgMSk7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLm5ldy1nYW1lLWJ1dHRvbjpob3ZlciB7XG4gIGJveC1zaGFkb3c6IHJnYmEoMCwgMCwgMCwgMC4yNSkgMCAwLjVyZW0gMC45Mzc1cmVtO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTAuMTI1cmVtKTtcbn1cblxuLm5ldy1nYW1lLWJ1dHRvbjphY3RpdmUge1xuICBjb2xvcjogIzAwMDAwMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy93aW5uZXJNb2RhbC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsU0FBUzs7RUFFVCxxQ0FBcUM7RUFDckMsMkJBQTJCOztFQUUzQixrQkFBa0I7RUFDbEIsV0FBVztFQUNYLFFBQVE7RUFDUixTQUFTOztFQUVULHNCQUFzQjtFQUN0QixtQkFBbUI7O0VBRW5CLGFBQWE7O0VBRWIsbUJBQW1COztFQUVuQiwwQkFBMEI7RUFDMUIsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UsNEJBQTRCO0FBQzlCOztBQUVBO0VBQ0UsNEJBQTRCO0FBQzlCOztBQUVBOztFQUVFLGVBQWU7RUFDZixrQkFBa0I7RUFDbEIsZ0JBQWdCO0VBQ2hCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7QUFDckI7O0FBRUE7O0VBRUUsZ0JBQWdCO0FBQ2xCOztBQUVBOztFQUVFLFlBQVk7QUFDZDs7QUFFQTs7RUFFRSxxQkFBcUI7O0VBRXJCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTs7RUFFRSxlQUFlO0VBQ2YsV0FBVztFQUNYLDRDQUE0QztBQUM5Qzs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsWUFBWTs7RUFFWixxQ0FBcUM7O0VBRXJDLGtCQUFrQjtFQUNsQixVQUFVOztFQUVWLHNDQUFzQztBQUN4Qzs7QUFFQTtFQUNFO0lBQ0UsYUFBYTtJQUNiLHlDQUF5QztFQUMzQzs7RUFFQTtJQUNFLFVBQVU7SUFDViwyQ0FBMkM7RUFDN0M7O0VBRUE7SUFDRSxVQUFVO0lBQ1YseUNBQXlDO0VBQzNDO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLFVBQVU7RUFDWjs7RUFFQTtJQUNFLFVBQVU7RUFDWjtBQUNGOztBQUVBO0VBQ0UsYUFBYTtBQUNmOztBQUVBO0VBQ0UsK0JBQStCO0VBQy9CLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixxQkFBcUI7O0VBRXJCLFlBQVk7RUFDWixTQUFTO0VBQ1QscUJBQXFCO0VBQ3JCLCtCQUErQjtFQUMvQixxQkFBcUI7O0VBRXJCLHdDQUF3QztFQUN4QyxrQkFBa0I7RUFDbEIsY0FBYzs7RUFFZCw2QkFBNkI7RUFDN0Isb0RBQW9EO0VBQ3BELGVBQWU7QUFDakI7O0FBRUE7RUFDRSxrREFBa0Q7RUFDbEQsZ0NBQWdDO0FBQ2xDOztBQUVBO0VBQ0UsY0FBYztFQUNkLHlCQUF5QjtBQUMzQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIud2luLW1vZGFsLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43NSk7XFxuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTBweCk7XFxuXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB6LWluZGV4OiAxMDtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogNTAlO1xcblxcbiAgd2lkdGg6IG1pbigzMHJlbSwgODAlKTtcXG4gIGFzcGVjdC1yYXRpbzogMSAvIDE7XFxuXFxuICBwYWRkaW5nOiAycmVtO1xcblxcbiAgYm9yZGVyLXJhZGl1czogMnJlbTtcXG5cXG4gIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0O1xcbiAgYW5pbWF0aW9uOiBwb3AgMC41cyAxIGZvcndhcmRzO1xcbn1cXG5cXG4ud2luLW1vZGFsLWNvbnRhaW5lci5wbGF5ZXIge1xcbiAgYm94LXNoYWRvdzogMCAwIDJyZW0gIzg3Y2VlYjtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIuZW5lbXkge1xcbiAgYm94LXNoYWRvdzogMCAwIDJyZW0gI2YzYTY0MDtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIgLnRpdGxlLWNhcHRhaW4td2luLFxcbi53aW4tbW9kYWwtY29udGFpbmVyIC50aXRsZS1lbmVteS13aW4ge1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgZm9udC1zdHlsZTogaXRhbGljO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIgLnRpdGxlLWNhcHRhaW4td2luIHtcXG4gIGNvbG9yOiAjODdjZWViO1xcbn1cXG5cXG4ud2luLW1vZGFsLWNvbnRhaW5lciAudGl0bGUtZW5lbXktd2luIHtcXG4gIGNvbG9yOiAjZjNhNjQwO1xcbn1cXG5cXG4ud2luLW1vZGFsLWNvbnRhaW5lciAubWVzc2FnZS5iYXR0bGUge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ud2luLW1vZGFsLWNvbnRhaW5lciAubWVzc2FnZS5iYXR0bGUuZW5lbXktd2luLFxcbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZS5jYXB0YWluLXdpbiB7XFxuICBtYXgtd2lkdGg6IDE4cmVtO1xcbn1cXG5cXG4ud2luLW1vZGFsLWNvbnRhaW5lciAubWVzc2FnZS5iYXR0bGUuZW5lbXktd2luIGltZyxcXG4ud2luLW1vZGFsLWNvbnRhaW5lciAubWVzc2FnZS5iYXR0bGUuY2FwdGFpbi13aW4gaW1nIHtcXG4gIGhlaWdodDogM3JlbTtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlLmVuZW15LXdpbiAudHlwZWQtY3Vyc29yLFxcbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZS5jYXB0YWluLXdpbiAudHlwZWQtY3Vyc29yIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG5cXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi53aW4tbW9kYWwtY29udGFpbmVyICAubWVzc2FnZS1jb250YWluZXIgLm1lc3NhZ2UtY2FwdGFpbi13aW4sXFxuLndpbi1tb2RhbC1jb250YWluZXIgIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1lbmVteS13aW4ge1xcbiAgZGlzcGxheTogaW5saW5lO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBmb250LXNpemU6IG1pbihjYWxjKDAuNXJlbSArIDF2dyksIDEuMTI1cmVtKTtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1jYXB0YWluLXdpbiB7XFxuICBjb2xvcjogIzg3Y2VlYjtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1lbmVteS13aW4ge1xcbiAgY29sb3I6ICNmM2E2NDA7XFxufVxcblxcbi53aW4tbW9kYWwtY29udGFpbmVyIC5tZXNzYWdlLmJhdHRsZSAubWVzc2FnZS1jb250YWluZXIgLm1lc3NhZ2UtY2FwdGFpbi13aW4rLnR5cGVkLWN1cnNvciB7XFxuICBjb2xvcjogIzg3Y2VlYjtcXG59XFxuXFxuLndpbi1tb2RhbC1jb250YWluZXIgLm1lc3NhZ2UuYmF0dGxlIC5tZXNzYWdlLWNvbnRhaW5lciAubWVzc2FnZS1lbmVteS13aW4rLnR5cGVkLWN1cnNvciB7XFxuICBjb2xvcjogI2YzYTY0MDtcXG59XFxuXFxuLndpbi1vdmVybGF5IHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcblxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjc1KTtcXG5cXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHotaW5kZXg6IDU7XFxuXFxuICBhbmltYXRpb246IG9wYWNpdHlTaG93IDAuNXMgMSBmb3J3YXJkcztcXG59XFxuXFxuQGtleWZyYW1lcyBwb3Age1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwLjI1O1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDApIHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gIH1cXG5cXG4gIDgwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS4xKSB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgb3BhY2l0eVNob3cge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxufVxcblxcbmJ1dHRvbiB7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG5idXR0b246Zm9jdXMge1xcbiAgb3V0bGluZTogMC4xMjVyZW0gc29saWQgIzg3Y2VlYjtcXG4gIG91dGxpbmUtb2Zmc2V0OiAwLjEyNXJlbTtcXG59XFxuXFxuYnV0dG9uOmZvY3VzOm5vdCg6Zm9jdXMtdmlzaWJsZSkge1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuXFxuLmVuZW15LXdpbiArIC5uZXctZ2FtZS1idXR0b246Zm9jdXMge1xcbiAgb3V0bGluZS1jb2xvcjogI2YzYTY0MDtcXG59XFxuXFxuLm5ldy1nYW1lLWJ1dHRvbiB7XFxuICBhcHBlYXJhbmNlOiBub25lO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcblxcbiAgbWluLXdpZHRoOiAwO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMC43NXJlbSAzcmVtO1xcbiAgYm9yZGVyOiAwLjA2MjVyZW0gc29saWQgI2ZmZmZmZjtcXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcXG5cXG4gIGZvbnQtc2l6ZTogbWluKGNhbGMoMC41cmVtICsgMXZ3KSwgMXJlbSk7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBjb2xvcjogI2ZmZmZmZjtcXG5cXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgdHJhbnNpdGlvbjogYWxsIDMwMG1zIGN1YmljLWJlemllcigwLjIzLCAxLCAwLjMyLCAxKTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLm5ldy1nYW1lLWJ1dHRvbjpob3ZlciB7XFxuICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMjUpIDAgMC41cmVtIDAuOTM3NXJlbTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMC4xMjVyZW0pO1xcbn1cXG5cXG4ubmV3LWdhbWUtYnV0dG9uOmFjdGl2ZSB7XFxuICBjb2xvcjogIzAwMDAwMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9iYXR0bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2JvYXJkLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYm9hcmQuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9wcmVnYW1lLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcHJlZ2FtZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc2V0dXAuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zZXR1cC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vd2lubmVyTW9kYWwuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi93aW5uZXJNb2RhbC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsImZ1bmN0aW9uIHQoKXtyZXR1cm4gdD1PYmplY3QuYXNzaWduP09iamVjdC5hc3NpZ24uYmluZCgpOmZ1bmN0aW9uKHQpe2Zvcih2YXIgcz0xO3M8YXJndW1lbnRzLmxlbmd0aDtzKyspe3ZhciBlPWFyZ3VtZW50c1tzXTtmb3IodmFyIG4gaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxuKSYmKHRbbl09ZVtuXSl9cmV0dXJuIHR9LHQuYXBwbHkodGhpcyxhcmd1bWVudHMpfXZhciBzPXtzdHJpbmdzOltcIlRoZXNlIGFyZSB0aGUgZGVmYXVsdCB2YWx1ZXMuLi5cIixcIllvdSBrbm93IHdoYXQgeW91IHNob3VsZCBkbz9cIixcIlVzZSB5b3VyIG93biFcIixcIkhhdmUgYSBncmVhdCBkYXkhXCJdLHN0cmluZ3NFbGVtZW50Om51bGwsdHlwZVNwZWVkOjAsc3RhcnREZWxheTowLGJhY2tTcGVlZDowLHNtYXJ0QmFja3NwYWNlOiEwLHNodWZmbGU6ITEsYmFja0RlbGF5OjcwMCxmYWRlT3V0OiExLGZhZGVPdXRDbGFzczpcInR5cGVkLWZhZGUtb3V0XCIsZmFkZU91dERlbGF5OjUwMCxsb29wOiExLGxvb3BDb3VudDpJbmZpbml0eSxzaG93Q3Vyc29yOiEwLGN1cnNvckNoYXI6XCJ8XCIsYXV0b0luc2VydENzczohMCxhdHRyOm51bGwsYmluZElucHV0Rm9jdXNFdmVudHM6ITEsY29udGVudFR5cGU6XCJodG1sXCIsb25CZWdpbjpmdW5jdGlvbih0KXt9LG9uQ29tcGxldGU6ZnVuY3Rpb24odCl7fSxwcmVTdHJpbmdUeXBlZDpmdW5jdGlvbih0LHMpe30sb25TdHJpbmdUeXBlZDpmdW5jdGlvbih0LHMpe30sb25MYXN0U3RyaW5nQmFja3NwYWNlZDpmdW5jdGlvbih0KXt9LG9uVHlwaW5nUGF1c2VkOmZ1bmN0aW9uKHQscyl7fSxvblR5cGluZ1Jlc3VtZWQ6ZnVuY3Rpb24odCxzKXt9LG9uUmVzZXQ6ZnVuY3Rpb24odCl7fSxvblN0b3A6ZnVuY3Rpb24odCxzKXt9LG9uU3RhcnQ6ZnVuY3Rpb24odCxzKXt9LG9uRGVzdHJveTpmdW5jdGlvbih0KXt9fSxlPW5ldygvKiNfX1BVUkVfXyovZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7fXZhciBuPWUucHJvdG90eXBlO3JldHVybiBuLmxvYWQ9ZnVuY3Rpb24oZSxuLGkpe2lmKGUuZWw9XCJzdHJpbmdcIj09dHlwZW9mIGk/ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpKTppLGUub3B0aW9ucz10KHt9LHMsbiksZS5pc0lucHV0PVwiaW5wdXRcIj09PWUuZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLGUuYXR0cj1lLm9wdGlvbnMuYXR0cixlLmJpbmRJbnB1dEZvY3VzRXZlbnRzPWUub3B0aW9ucy5iaW5kSW5wdXRGb2N1c0V2ZW50cyxlLnNob3dDdXJzb3I9IWUuaXNJbnB1dCYmZS5vcHRpb25zLnNob3dDdXJzb3IsZS5jdXJzb3JDaGFyPWUub3B0aW9ucy5jdXJzb3JDaGFyLGUuY3Vyc29yQmxpbmtpbmc9ITAsZS5lbENvbnRlbnQ9ZS5hdHRyP2UuZWwuZ2V0QXR0cmlidXRlKGUuYXR0cik6ZS5lbC50ZXh0Q29udGVudCxlLmNvbnRlbnRUeXBlPWUub3B0aW9ucy5jb250ZW50VHlwZSxlLnR5cGVTcGVlZD1lLm9wdGlvbnMudHlwZVNwZWVkLGUuc3RhcnREZWxheT1lLm9wdGlvbnMuc3RhcnREZWxheSxlLmJhY2tTcGVlZD1lLm9wdGlvbnMuYmFja1NwZWVkLGUuc21hcnRCYWNrc3BhY2U9ZS5vcHRpb25zLnNtYXJ0QmFja3NwYWNlLGUuYmFja0RlbGF5PWUub3B0aW9ucy5iYWNrRGVsYXksZS5mYWRlT3V0PWUub3B0aW9ucy5mYWRlT3V0LGUuZmFkZU91dENsYXNzPWUub3B0aW9ucy5mYWRlT3V0Q2xhc3MsZS5mYWRlT3V0RGVsYXk9ZS5vcHRpb25zLmZhZGVPdXREZWxheSxlLmlzUGF1c2VkPSExLGUuc3RyaW5ncz1lLm9wdGlvbnMuc3RyaW5ncy5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQudHJpbSgpfSksZS5zdHJpbmdzRWxlbWVudD1cInN0cmluZ1wiPT10eXBlb2YgZS5vcHRpb25zLnN0cmluZ3NFbGVtZW50P2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZS5vcHRpb25zLnN0cmluZ3NFbGVtZW50KTplLm9wdGlvbnMuc3RyaW5nc0VsZW1lbnQsZS5zdHJpbmdzRWxlbWVudCl7ZS5zdHJpbmdzPVtdLGUuc3RyaW5nc0VsZW1lbnQuc3R5bGUuY3NzVGV4dD1cImNsaXA6IHJlY3QoMCAwIDAgMCk7Y2xpcC1wYXRoOmluc2V0KDUwJSk7aGVpZ2h0OjFweDtvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2hpdGUtc3BhY2U6bm93cmFwO3dpZHRoOjFweDtcIjt2YXIgcj1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoZS5zdHJpbmdzRWxlbWVudC5jaGlsZHJlbiksbz1yLmxlbmd0aDtpZihvKWZvcih2YXIgYT0wO2E8bzthKz0xKWUuc3RyaW5ncy5wdXNoKHJbYV0uaW5uZXJIVE1MLnRyaW0oKSl9Zm9yKHZhciB1IGluIGUuc3RyUG9zPTAsZS5jdXJyZW50RWxDb250ZW50PXRoaXMuZ2V0Q3VycmVudEVsQ29udGVudChlKSxlLmN1cnJlbnRFbENvbnRlbnQmJmUuY3VycmVudEVsQ29udGVudC5sZW5ndGg+MCYmKGUuc3RyUG9zPWUuY3VycmVudEVsQ29udGVudC5sZW5ndGgtMSxlLnN0cmluZ3MudW5zaGlmdChlLmN1cnJlbnRFbENvbnRlbnQpKSxlLnNlcXVlbmNlPVtdLGUuc3RyaW5ncyllLnNlcXVlbmNlW3VdPXU7ZS5hcnJheVBvcz0wLGUuc3RvcE51bT0wLGUubG9vcD1lLm9wdGlvbnMubG9vcCxlLmxvb3BDb3VudD1lLm9wdGlvbnMubG9vcENvdW50LGUuY3VyTG9vcD0wLGUuc2h1ZmZsZT1lLm9wdGlvbnMuc2h1ZmZsZSxlLnBhdXNlPXtzdGF0dXM6ITEsdHlwZXdyaXRlOiEwLGN1clN0cmluZzpcIlwiLGN1clN0clBvczowfSxlLnR5cGluZ0NvbXBsZXRlPSExLGUuYXV0b0luc2VydENzcz1lLm9wdGlvbnMuYXV0b0luc2VydENzcyxlLmF1dG9JbnNlcnRDc3MmJih0aGlzLmFwcGVuZEN1cnNvckFuaW1hdGlvbkNzcyhlKSx0aGlzLmFwcGVuZEZhZGVPdXRBbmltYXRpb25Dc3MoZSkpfSxuLmdldEN1cnJlbnRFbENvbnRlbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQuYXR0cj90LmVsLmdldEF0dHJpYnV0ZSh0LmF0dHIpOnQuaXNJbnB1dD90LmVsLnZhbHVlOlwiaHRtbFwiPT09dC5jb250ZW50VHlwZT90LmVsLmlubmVySFRNTDp0LmVsLnRleHRDb250ZW50fSxuLmFwcGVuZEN1cnNvckFuaW1hdGlvbkNzcz1mdW5jdGlvbih0KXt2YXIgcz1cImRhdGEtdHlwZWQtanMtY3Vyc29yLWNzc1wiO2lmKHQuc2hvd0N1cnNvciYmIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbXCIrcytcIl1cIikpe3ZhciBlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtlLnNldEF0dHJpYnV0ZShzLFwidHJ1ZVwiKSxlLmlubmVySFRNTD1cIlxcbiAgICAgICAgLnR5cGVkLWN1cnNvcntcXG4gICAgICAgICAgb3BhY2l0eTogMTtcXG4gICAgICAgIH1cXG4gICAgICAgIC50eXBlZC1jdXJzb3IudHlwZWQtY3Vyc29yLS1ibGlua3tcXG4gICAgICAgICAgYW5pbWF0aW9uOiB0eXBlZGpzQmxpbmsgMC43cyBpbmZpbml0ZTtcXG4gICAgICAgICAgLXdlYmtpdC1hbmltYXRpb246IHR5cGVkanNCbGluayAwLjdzIGluZmluaXRlO1xcbiAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogdHlwZWRqc0JsaW5rIDAuN3MgaW5maW5pdGU7XFxuICAgICAgICB9XFxuICAgICAgICBAa2V5ZnJhbWVzIHR5cGVkanNCbGlua3tcXG4gICAgICAgICAgNTAlIHsgb3BhY2l0eTogMC4wOyB9XFxuICAgICAgICB9XFxuICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgdHlwZWRqc0JsaW5re1xcbiAgICAgICAgICAwJSB7IG9wYWNpdHk6IDE7IH1cXG4gICAgICAgICAgNTAlIHsgb3BhY2l0eTogMC4wOyB9XFxuICAgICAgICAgIDEwMCUgeyBvcGFjaXR5OiAxOyB9XFxuICAgICAgICB9XFxuICAgICAgXCIsZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlKX19LG4uYXBwZW5kRmFkZU91dEFuaW1hdGlvbkNzcz1mdW5jdGlvbih0KXt2YXIgcz1cImRhdGEtdHlwZWQtZmFkZW91dC1qcy1jc3NcIjtpZih0LmZhZGVPdXQmJiFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW1wiK3MrXCJdXCIpKXt2YXIgZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7ZS5zZXRBdHRyaWJ1dGUocyxcInRydWVcIiksZS5pbm5lckhUTUw9XCJcXG4gICAgICAgIC50eXBlZC1mYWRlLW91dHtcXG4gICAgICAgICAgb3BhY2l0eTogMDtcXG4gICAgICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMjVzO1xcbiAgICAgICAgfVxcbiAgICAgICAgLnR5cGVkLWN1cnNvci50eXBlZC1jdXJzb3ItLWJsaW5rLnR5cGVkLWZhZGUtb3V0e1xcbiAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogMDtcXG4gICAgICAgICAgYW5pbWF0aW9uOiAwO1xcbiAgICAgICAgfVxcbiAgICAgIFwiLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZSl9fSxlfSgpKSxuPW5ldygvKiNfX1BVUkVfXyovZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7fXZhciBzPXQucHJvdG90eXBlO3JldHVybiBzLnR5cGVIdG1sQ2hhcnM9ZnVuY3Rpb24odCxzLGUpe2lmKFwiaHRtbFwiIT09ZS5jb250ZW50VHlwZSlyZXR1cm4gczt2YXIgbj10LnN1YnN0cmluZyhzKS5jaGFyQXQoMCk7aWYoXCI8XCI9PT1ufHxcIiZcIj09PW4pe3ZhciBpO2ZvcihpPVwiPFwiPT09bj9cIj5cIjpcIjtcIjt0LnN1YnN0cmluZyhzKzEpLmNoYXJBdCgwKSE9PWkmJiEoMSsgKytzPnQubGVuZ3RoKTspO3MrK31yZXR1cm4gc30scy5iYWNrU3BhY2VIdG1sQ2hhcnM9ZnVuY3Rpb24odCxzLGUpe2lmKFwiaHRtbFwiIT09ZS5jb250ZW50VHlwZSlyZXR1cm4gczt2YXIgbj10LnN1YnN0cmluZyhzKS5jaGFyQXQoMCk7aWYoXCI+XCI9PT1ufHxcIjtcIj09PW4pe3ZhciBpO2ZvcihpPVwiPlwiPT09bj9cIjxcIjpcIiZcIjt0LnN1YnN0cmluZyhzLTEpLmNoYXJBdCgwKSE9PWkmJiEoLS1zPDApOyk7cy0tfXJldHVybiBzfSx0fSgpKSxpPS8qI19fUFVSRV9fKi9mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxzKXtlLmxvYWQodGhpcyxzLHQpLHRoaXMuYmVnaW4oKX12YXIgcz10LnByb3RvdHlwZTtyZXR1cm4gcy50b2dnbGU9ZnVuY3Rpb24oKXt0aGlzLnBhdXNlLnN0YXR1cz90aGlzLnN0YXJ0KCk6dGhpcy5zdG9wKCl9LHMuc3RvcD1mdW5jdGlvbigpe3RoaXMudHlwaW5nQ29tcGxldGV8fHRoaXMucGF1c2Uuc3RhdHVzfHwodGhpcy50b2dnbGVCbGlua2luZyghMCksdGhpcy5wYXVzZS5zdGF0dXM9ITAsdGhpcy5vcHRpb25zLm9uU3RvcCh0aGlzLmFycmF5UG9zLHRoaXMpKX0scy5zdGFydD1mdW5jdGlvbigpe3RoaXMudHlwaW5nQ29tcGxldGV8fHRoaXMucGF1c2Uuc3RhdHVzJiYodGhpcy5wYXVzZS5zdGF0dXM9ITEsdGhpcy5wYXVzZS50eXBld3JpdGU/dGhpcy50eXBld3JpdGUodGhpcy5wYXVzZS5jdXJTdHJpbmcsdGhpcy5wYXVzZS5jdXJTdHJQb3MpOnRoaXMuYmFja3NwYWNlKHRoaXMucGF1c2UuY3VyU3RyaW5nLHRoaXMucGF1c2UuY3VyU3RyUG9zKSx0aGlzLm9wdGlvbnMub25TdGFydCh0aGlzLmFycmF5UG9zLHRoaXMpKX0scy5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZXNldCghMSksdGhpcy5vcHRpb25zLm9uRGVzdHJveSh0aGlzKX0scy5yZXNldD1mdW5jdGlvbih0KXt2b2lkIDA9PT10JiYodD0hMCksY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVvdXQpLHRoaXMucmVwbGFjZVRleHQoXCJcIiksdGhpcy5jdXJzb3ImJnRoaXMuY3Vyc29yLnBhcmVudE5vZGUmJih0aGlzLmN1cnNvci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuY3Vyc29yKSx0aGlzLmN1cnNvcj1udWxsKSx0aGlzLnN0clBvcz0wLHRoaXMuYXJyYXlQb3M9MCx0aGlzLmN1ckxvb3A9MCx0JiYodGhpcy5pbnNlcnRDdXJzb3IoKSx0aGlzLm9wdGlvbnMub25SZXNldCh0aGlzKSx0aGlzLmJlZ2luKCkpfSxzLmJlZ2luPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLm9wdGlvbnMub25CZWdpbih0aGlzKSx0aGlzLnR5cGluZ0NvbXBsZXRlPSExLHRoaXMuc2h1ZmZsZVN0cmluZ3NJZk5lZWRlZCh0aGlzKSx0aGlzLmluc2VydEN1cnNvcigpLHRoaXMuYmluZElucHV0Rm9jdXNFdmVudHMmJnRoaXMuYmluZEZvY3VzRXZlbnRzKCksdGhpcy50aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXswPT09dC5zdHJQb3M/dC50eXBld3JpdGUodC5zdHJpbmdzW3Quc2VxdWVuY2VbdC5hcnJheVBvc11dLHQuc3RyUG9zKTp0LmJhY2tzcGFjZSh0LnN0cmluZ3NbdC5zZXF1ZW5jZVt0LmFycmF5UG9zXV0sdC5zdHJQb3MpfSx0aGlzLnN0YXJ0RGVsYXkpfSxzLnR5cGV3cml0ZT1mdW5jdGlvbih0LHMpe3ZhciBlPXRoaXM7dGhpcy5mYWRlT3V0JiZ0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmZhZGVPdXRDbGFzcykmJih0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5mYWRlT3V0Q2xhc3MpLHRoaXMuY3Vyc29yJiZ0aGlzLmN1cnNvci5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuZmFkZU91dENsYXNzKSk7dmFyIGk9dGhpcy5odW1hbml6ZXIodGhpcy50eXBlU3BlZWQpLHI9MTshMCE9PXRoaXMucGF1c2Uuc3RhdHVzP3RoaXMudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cz1uLnR5cGVIdG1sQ2hhcnModCxzLGUpO3ZhciBpPTAsbz10LnN1YnN0cmluZyhzKTtpZihcIl5cIj09PW8uY2hhckF0KDApJiYvXlxcXlxcZCsvLnRlc3Qobykpe3ZhciBhPTE7YSs9KG89L1xcZCsvLmV4ZWMobylbMF0pLmxlbmd0aCxpPXBhcnNlSW50KG8pLGUudGVtcG9yYXJ5UGF1c2U9ITAsZS5vcHRpb25zLm9uVHlwaW5nUGF1c2VkKGUuYXJyYXlQb3MsZSksdD10LnN1YnN0cmluZygwLHMpK3Quc3Vic3RyaW5nKHMrYSksZS50b2dnbGVCbGlua2luZyghMCl9aWYoXCJgXCI9PT1vLmNoYXJBdCgwKSl7Zm9yKDtcImBcIiE9PXQuc3Vic3RyaW5nKHMrcikuY2hhckF0KDApJiYocisrLCEocytyPnQubGVuZ3RoKSk7KTt2YXIgdT10LnN1YnN0cmluZygwLHMpLHA9dC5zdWJzdHJpbmcodS5sZW5ndGgrMSxzK3IpLGM9dC5zdWJzdHJpbmcocytyKzEpO3Q9dStwK2Msci0tfWUudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS50b2dnbGVCbGlua2luZyghMSkscz49dC5sZW5ndGg/ZS5kb25lVHlwaW5nKHQscyk6ZS5rZWVwVHlwaW5nKHQscyxyKSxlLnRlbXBvcmFyeVBhdXNlJiYoZS50ZW1wb3JhcnlQYXVzZT0hMSxlLm9wdGlvbnMub25UeXBpbmdSZXN1bWVkKGUuYXJyYXlQb3MsZSkpfSxpKX0saSk6dGhpcy5zZXRQYXVzZVN0YXR1cyh0LHMsITApfSxzLmtlZXBUeXBpbmc9ZnVuY3Rpb24odCxzLGUpezA9PT1zJiYodGhpcy50b2dnbGVCbGlua2luZyghMSksdGhpcy5vcHRpb25zLnByZVN0cmluZ1R5cGVkKHRoaXMuYXJyYXlQb3MsdGhpcykpO3ZhciBuPXQuc3Vic3RyaW5nKDAscys9ZSk7dGhpcy5yZXBsYWNlVGV4dChuKSx0aGlzLnR5cGV3cml0ZSh0LHMpfSxzLmRvbmVUeXBpbmc9ZnVuY3Rpb24odCxzKXt2YXIgZT10aGlzO3RoaXMub3B0aW9ucy5vblN0cmluZ1R5cGVkKHRoaXMuYXJyYXlQb3MsdGhpcyksdGhpcy50b2dnbGVCbGlua2luZyghMCksdGhpcy5hcnJheVBvcz09PXRoaXMuc3RyaW5ncy5sZW5ndGgtMSYmKHRoaXMuY29tcGxldGUoKSwhMT09PXRoaXMubG9vcHx8dGhpcy5jdXJMb29wPT09dGhpcy5sb29wQ291bnQpfHwodGhpcy50aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLmJhY2tzcGFjZSh0LHMpfSx0aGlzLmJhY2tEZWxheSkpfSxzLmJhY2tzcGFjZT1mdW5jdGlvbih0LHMpe3ZhciBlPXRoaXM7aWYoITAhPT10aGlzLnBhdXNlLnN0YXR1cyl7aWYodGhpcy5mYWRlT3V0KXJldHVybiB0aGlzLmluaXRGYWRlT3V0KCk7dGhpcy50b2dnbGVCbGlua2luZyghMSk7dmFyIGk9dGhpcy5odW1hbml6ZXIodGhpcy5iYWNrU3BlZWQpO3RoaXMudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cz1uLmJhY2tTcGFjZUh0bWxDaGFycyh0LHMsZSk7dmFyIGk9dC5zdWJzdHJpbmcoMCxzKTtpZihlLnJlcGxhY2VUZXh0KGkpLGUuc21hcnRCYWNrc3BhY2Upe3ZhciByPWUuc3RyaW5nc1tlLmFycmF5UG9zKzFdO2Uuc3RvcE51bT1yJiZpPT09ci5zdWJzdHJpbmcoMCxzKT9zOjB9cz5lLnN0b3BOdW0/KHMtLSxlLmJhY2tzcGFjZSh0LHMpKTpzPD1lLnN0b3BOdW0mJihlLmFycmF5UG9zKyssZS5hcnJheVBvcz09PWUuc3RyaW5ncy5sZW5ndGg/KGUuYXJyYXlQb3M9MCxlLm9wdGlvbnMub25MYXN0U3RyaW5nQmFja3NwYWNlZCgpLGUuc2h1ZmZsZVN0cmluZ3NJZk5lZWRlZCgpLGUuYmVnaW4oKSk6ZS50eXBld3JpdGUoZS5zdHJpbmdzW2Uuc2VxdWVuY2VbZS5hcnJheVBvc11dLHMpKX0saSl9ZWxzZSB0aGlzLnNldFBhdXNlU3RhdHVzKHQscywhMSl9LHMuY29tcGxldGU9ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMub25Db21wbGV0ZSh0aGlzKSx0aGlzLmxvb3A/dGhpcy5jdXJMb29wKys6dGhpcy50eXBpbmdDb21wbGV0ZT0hMH0scy5zZXRQYXVzZVN0YXR1cz1mdW5jdGlvbih0LHMsZSl7dGhpcy5wYXVzZS50eXBld3JpdGU9ZSx0aGlzLnBhdXNlLmN1clN0cmluZz10LHRoaXMucGF1c2UuY3VyU3RyUG9zPXN9LHMudG9nZ2xlQmxpbmtpbmc9ZnVuY3Rpb24odCl7dGhpcy5jdXJzb3ImJih0aGlzLnBhdXNlLnN0YXR1c3x8dGhpcy5jdXJzb3JCbGlua2luZyE9PXQmJih0aGlzLmN1cnNvckJsaW5raW5nPXQsdD90aGlzLmN1cnNvci5jbGFzc0xpc3QuYWRkKFwidHlwZWQtY3Vyc29yLS1ibGlua1wiKTp0aGlzLmN1cnNvci5jbGFzc0xpc3QucmVtb3ZlKFwidHlwZWQtY3Vyc29yLS1ibGlua1wiKSkpfSxzLmh1bWFuaXplcj1mdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKnQvMikrdH0scy5zaHVmZmxlU3RyaW5nc0lmTmVlZGVkPWZ1bmN0aW9uKCl7dGhpcy5zaHVmZmxlJiYodGhpcy5zZXF1ZW5jZT10aGlzLnNlcXVlbmNlLnNvcnQoZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5yYW5kb20oKS0uNX0pKX0scy5pbml0RmFkZU91dD1mdW5jdGlvbigpe3ZhciB0PXRoaXM7cmV0dXJuIHRoaXMuZWwuY2xhc3NOYW1lKz1cIiBcIit0aGlzLmZhZGVPdXRDbGFzcyx0aGlzLmN1cnNvciYmKHRoaXMuY3Vyc29yLmNsYXNzTmFtZSs9XCIgXCIrdGhpcy5mYWRlT3V0Q2xhc3MpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmFycmF5UG9zKyssdC5yZXBsYWNlVGV4dChcIlwiKSx0LnN0cmluZ3MubGVuZ3RoPnQuYXJyYXlQb3M/dC50eXBld3JpdGUodC5zdHJpbmdzW3Quc2VxdWVuY2VbdC5hcnJheVBvc11dLDApOih0LnR5cGV3cml0ZSh0LnN0cmluZ3NbMF0sMCksdC5hcnJheVBvcz0wKX0sdGhpcy5mYWRlT3V0RGVsYXkpfSxzLnJlcGxhY2VUZXh0PWZ1bmN0aW9uKHQpe3RoaXMuYXR0cj90aGlzLmVsLnNldEF0dHJpYnV0ZSh0aGlzLmF0dHIsdCk6dGhpcy5pc0lucHV0P3RoaXMuZWwudmFsdWU9dDpcImh0bWxcIj09PXRoaXMuY29udGVudFR5cGU/dGhpcy5lbC5pbm5lckhUTUw9dDp0aGlzLmVsLnRleHRDb250ZW50PXR9LHMuYmluZEZvY3VzRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLmlzSW5wdXQmJih0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLGZ1bmN0aW9uKHMpe3Quc3RvcCgpfSksdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLGZ1bmN0aW9uKHMpe3QuZWwudmFsdWUmJjAhPT10LmVsLnZhbHVlLmxlbmd0aHx8dC5zdGFydCgpfSkpfSxzLmluc2VydEN1cnNvcj1mdW5jdGlvbigpe3RoaXMuc2hvd0N1cnNvciYmKHRoaXMuY3Vyc29yfHwodGhpcy5jdXJzb3I9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksdGhpcy5jdXJzb3IuY2xhc3NOYW1lPVwidHlwZWQtY3Vyc29yXCIsdGhpcy5jdXJzb3Iuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwhMCksdGhpcy5jdXJzb3IuaW5uZXJIVE1MPXRoaXMuY3Vyc29yQ2hhcix0aGlzLmVsLnBhcmVudE5vZGUmJnRoaXMuZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5jdXJzb3IsdGhpcy5lbC5uZXh0U2libGluZykpKX0sdH0oKTtleHBvcnR7aSBhcyBkZWZhdWx0fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXR5cGVkLm1vZHVsZS5qcy5tYXBcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZXMvbWFpbi5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGVzL3ByZWdhbWUuY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy9zZXR1cC5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGVzL2JvYXJkLmNzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZXMvYmF0dGxlLmNzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZXMvd2lubmVyTW9kYWwuY3NzXCJcblxuaW1wb3J0IHZpZXcgZnJvbSBcIi4vZG9tL3ZpZXdcIjtcblxudmlldy5sb2FkQ29udGVudCgpO1xuIl0sIm5hbWVzIjpbIkdhbWUiLCJoZWxwZXIiLCJmbGVldCIsIkNvbXBvbmVudCIsIk1lc3NhZ2UiLCJCYXR0bGUiLCJsb2FkQmF0dGxlQ29udGVudCIsImRlbGV0ZUFwcENvbnRlbnQiLCJhcHAiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY2xhc3NMaXN0IiwicmVwbGFjZSIsImFwcGVuZENoaWxkIiwiY3JlYXRlQmF0dGxlV3JhcHBlciIsImRpc3BsYXlQbGF5ZXJTaGlwcyIsImdldEdhbWUiLCJhdXRvUGxhY2VDb21wdXRlclBsYXllciIsImRpc3BsYXlCYXR0bGVTdGFydE1lc3NhZ2UiLCJpbml0Qm9hcmRGaWVsZHMiLCJzdHlsZU9uVHVybiIsInF1ZXJ5U2VsZWN0b3IiLCJ3cmFwcGVyIiwiY3JlYXRlIiwiY2xhc3NOYW1lIiwiYXBwZW5kQWxsIiwiY3JlYXRlUGxheWVyTWFwIiwiY3JlYXRlQ29tcHV0ZXJNYXAiLCJjcmVhdGVNZXNzYWdlU2VjdGlvbiIsIm1hcCIsImNyZWF0ZU1hcCIsImNyZWF0ZU1hcFRpdGxlIiwidGV4dCIsImNvbnRhaW5lciIsIm1hcFRpdGxlIiwidGV4dENvbnRlbnQiLCJjcmVhdGVXaW5uZXJNb2RhbCIsImRhdGEiLCJ3aW5uZXJNb2RhbCIsImlkIiwiYWRkIiwidGl0bGUiLCJtZXNzYWdlIiwiYnV0dG9uIiwiY3JlYXRlV2luT3ZlcmxheSIsInNob3dFbmVteVdpbk1vZGFsIiwiZGlzcGxheVdpbk1lc3NhZ2UiLCJpbml0TmV3R2FtZUJ1dHRvbiIsInNob3dQbGF5ZXJXaW5Nb2RhbCIsInVuSW5pdEJvYXJkRmllbGRzIiwiY29tcHV0ZXJCb2FyZCIsImNoaWxkcmVuIiwiZm9yRWFjaCIsImZpZWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZUZpZWxkQ2xpY2siLCJhZGRGaWVsZEhvdmVyV2hlbk9uVHVybiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZW1vdmVGaWVsZEhvdmVyV2hlbk9mZlR1cm4iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCIsImV2ZW50IiwidGFyZ2V0IiwicGxheWVyUmVzdWx0IiwicGxheWVyVHVybiIsImNvbXB1dGVyUmVzdWx0IiwiY29tcHV0ZXJUdXJuIiwidGFyZ2V0Tm9kZSIsIm5vZGVJbmRleCIsInBhcmVudE5vZGUiLCJpbmRleE9mIiwicm93IiwiY29sdW1uIiwiZ2V0Q29vcmRpbmF0ZXNGcm9tSW5kZXgiLCJ0YXJnZXRPbkNvbXB1dGVyQm9hcmQiLCJwbGF5ZXJBdHRhY2siLCJzaG90T25UdXJuUGxheSIsInJlcyIsInBsYXllck1pc3MiLCJwbGF5ZXJIaXQiLCJ0dXJuRW5kIiwiZmllbGROb2RlIiwiYWRkTWlzc1N0eWxlIiwidGltZW91dE1pc3NpbGVMZW5ndGgiLCJkaXNwbGF5UGxheWVyTWVzc2FnZSIsInRpbWVvdXRPbmVTZWNvbmQiLCJzaGlwIiwiYWRkSGl0U3R5bGUiLCJsb2FkU2hpcElmU3VuayIsImdldENvbXB1dGVyUGxheWVyIiwiZ2V0R2FtZWJvYXJkIiwiaXNHYW1lT3ZlciIsImF1dG9Db21wdXRlckF0dGFjayIsInRhcmdldE9uVXNlckJvYXJkIiwiQXJyYXkiLCJpc0FycmF5IiwiY29vcmQiLCJkaXNwbGF5UGxheWVyTm9Db21tZW50TWVzc2FnZSIsImNvbXB1dGVyTWlzcyIsImNvbXB1dGVySGl0IiwicGxheWVyQm9hcmQiLCJpbmRleCIsImdldEluZGV4RnJvbUNvb3JkaW5hdGVzIiwiZGlzcGxheUNvbXB1dGVyTWVzc2FnZSIsImdldFVzZXJQbGF5ZXIiLCJjaGFyYWN0ZXIiLCJ0aW1lT3V0SGFsZlNlY29uZCIsInRpbWVvdXRPbmVBbmRIYWxmU2Vjb25kIiwic3R5bGVPZmZUdXJuIiwicmVzaXplUGxheWVyT2ZmVHVybiIsInJlc2l6ZVBsYXllck9uVHVybiIsInVzZXJCb2FyZCIsImxvYWRGbGVldCIsImNvbnNvbGUiLCJsb2ciLCJnZXRMZW5ndGgiLCJpc1N1bmsiLCJyb3dPcmlnaW4iLCJjb2x1bW5PcmlnaW4iLCJnZXRTaGlwSW5pdGlhbFBvc2l0aW9uIiwiZ2V0TmFtZSIsImZpZWxkQ29udGFpbmVyIiwibG9hZFNoaXBPbkJvYXJkIiwiYWRkVHlwZVdyaXR0ZXJNZXNzYWdlIiwiZ2V0QmF0dGxlU3RhcnRNZXNzYWdlIiwiZ2V0RW5lbXlCYXR0bGVTdGFydE1lc3NhZ2UiLCJjYXB0YWluIiwiZW5lbXkiLCJkaXNwbGF5TWVzc2FnZSIsImdldE5ld0VuZW15SGl0TWVzc2FnZSIsImdldE5ld0VuZW15U3Vua01lc3NhZ2UiLCJnZXROZXdQbGF5ZXJNaXNzTWVzc2FnZSIsImdldE5vQ29tbWVudE1lc3NhZ2UiLCJnZXROZXdQbGF5ZXJIaXRNZXNzYWdlIiwiZ2V0TmV3UGxheWVyU3Vua01lc3NhZ2UiLCJnZXROZXdFbmVteU1pc3NNZXNzYWdlIiwibm9kZSIsImNsZWFyVHlwZVdyaXR0ZXIiLCJnZXRQbGF5ZXJXaW5NZXNzYWdlIiwiZ2V0RW5lbXlXaW5NZXNzYWdlIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwicmVtb3ZlIiwiZWxlbWVudCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsIkRyYWdEcm9wIiwiaW5pdERyYWdnYWJsZUZpZWxkcyIsImRyYWdTdGFydCIsImRyYWdFbnRlciIsImRyYWdPdmVyIiwiZHJhZ0xlYXZlIiwiZHJhZ0Ryb3AiLCJtb2JpbGVEcmFnIiwibW9iaWxlRHJvcCIsImZpZWxkUXVldWUiLCJlbXB0eUZpZWxkUXVldWUiLCJmbGVldENvbnRhaW5lciIsImRyYWdTdGFydEhhbmRsZXIiLCJkcmFnRW50ZXJIYW5kbGVyIiwiZHJhZ092ZXJIYW5kbGVyIiwiZHJhZ0xlYXZlSGFuZGxlciIsImRyYWdEcm9wSGFuZGxlciIsInByZXZlbnREZWZhdWx0IiwidG91Y2hTdGFydEhhbmRsZXIiLCJ0b3VjaE1vdmVIYW5kbGVyIiwidG91Y2hFbmRIYW5kbGVyIiwiYWRkU2hpcE9uRHJhZ1N0YXJ0Iiwic3RvcFByb3BhZ2F0aW9uIiwic3R5bGVGaWVsZHNGb3JEcm9wIiwicmVzZXRGaWVsZFN0eWxpbmciLCJ4IiwieSIsImlzUGxhY2VkIiwic2hpcE9uRHJhZyIsImRyb3BJZlZhbGlkIiwiaGlkZUlmUGxhY2VkIiwicmVtb3ZlUGxhY2VkU2hpcHNUYWJJbmRleCIsInRvdWNoWCIsInRhcmdldFRvdWNoZXMiLCJjbGllbnRYIiwidG91Y2hZIiwiY2xpZW50WSIsInBvc2l0aW9uTm9kZU9uU2NyZWVuIiwiaG92ZXJlZEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY29udGFpbnMiLCJpbmRleEhvdmVyZWRFbGVtZW50IiwiY2hhbmdlZFRvdWNoZXMiLCJyZXBvc2l0aW9uSW50b0ZsZWV0U2V0dXAiLCJzZXRTaGlwT25EcmFnIiwibmFtZSIsImRhdGFzZXQiLCJzaGlwTmFtZSIsImxlbmd0aCIsInNoaXBMZW5ndGgiLCJnYW1lYm9hcmQiLCJnZXRTaGlwT25EcmFnIiwiYXhpcyIsImlzVGFrZW4iLCJpIiwiZ2V0TmVhcmVzdFRlbiIsInB1c2giLCJnZXRTaGlwIiwiZXJyb3IiLCJwbGFjZVNoaXAiLCJiYXR0bGVzaGlwIiwiZW5hYmxlQ29udGludWVCdXR0b25JZkFsbFBsYWNlZCIsInNoaXBzIiwicXVlcnlTZWxlY3RvckFsbCIsInByZXZlbnRFbnRlckRlZmF1bHQiLCJrZXkiLCJzaGlwQ2FyZHMiLCJzaGlwQ2FyZCIsInNldEF0dHJpYnV0ZSIsInN0eWxlIiwicG9zaXRpb24iLCJ0b3AiLCJsZWZ0IiwiekluZGV4IiwiY2FycmllciIsImNydWlzZXIiLCJzdWJtYXJpbmUiLCJkZXN0cm95ZXIiLCJwbGF5ZXIiLCJoZWlnaHQiLCJ3aWR0aCIsImdldEF4aXMiLCJyb3RhdGlvbiIsInRyYW5zZm9ybSIsInRyYW5zZm9ybU9yaWdpbiIsIm1hc2tJbWFnZSIsImltYWdlIiwic3JjIiwibG9hZFNoaXBJbWFnZSIsImFzcGVjdFJhdGlvIiwic2hpcEltYWdlIiwicmVwbGFjZUNoaWxkcmVuIiwidHlwZSIsImNyZWF0ZUVsZW1lbnQiLCJ2YWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJub2RlQXJyYXkiLCJkZXNjcmlwdGlvbiIsImNyZWF0ZUxldHRlcnNTZWN0aW9uIiwiY3JlYXRlTnVtYmVyc1NlY3Rpb24iLCJjcmVhdGVCb2FyZCIsImxldHRlckNvbnRhaW5lciIsImxldHRlcnMiLCJsZXR0ZXIiLCJudW1iZXJDb250YWluZXIiLCJudW1iZXJzIiwibnVtYmVyIiwiYm9hcmQiLCJqIiwibnVtIiwiTWF0aCIsInRydW5jIiwicHJlZ2FtZSIsImxvYWRDYXJkIiwiY3JlYXRlUHJlZ2FtZUNhcmQiLCJzZWN0aW9uIiwiY3JlYXRlVGl0bGUiLCJjcmVhdGVOYW1lRm9ybSIsImNyZWF0ZVBsYXlOb3dCdXR0b24iLCJpbnB1dCIsInBsYWNlaG9sZGVyIiwibWluTGVuZ3RoIiwibWF4TGVuZ3RoIiwiYm9yZGVyIiwiVHlwZWQiLCJpbWFnZXMiLCJjbGFzc05hbWVzQXJyYXkiLCJpbWFnZU5hbWUiLCJjcmVhdGVNZXNzYWdlIiwiY3JlYXRlU2hpcENhcmQiLCJjYXJkIiwiZHJhZ2dhYmxlIiwiY29udGVudCIsInBvcHVsYXRlQ2FyZCIsImRhdGFTaGlwTmFtZSIsImRhdGFTaGlwTGVuZ3RoIiwiaW1hZ2VTcmMiLCJuYW1lVGV4dCIsInN0cmluZ0FycmF5IiwidHlwZWQiLCJzdHJpbmdzIiwidHlwZVNwZWVkIiwic2V0dXAiLCJsb2FkU2V0dXBDb250ZW50IiwiY3JlYXRlU2V0dXBXcmFwcGVyIiwiZGlzcGxheVdlbGNvbWVNZXNzYWdlIiwiaW5pdEJ1dHRvbnMiLCJjcmVhdGVNYXBGbGVldFNlY3Rpb24iLCJjcmVhdGVSZXNldENvbnRpbnVlU2VjdGlvbiIsImNyZWF0ZU1hcEZsZWV0IiwiY3JlYXRlRmxlZXRTZWxlY3RTZWN0aW9uIiwiY3JlYXRlQXhpc0J1dHRvbnMiLCJidXR0b25YIiwiYnV0dG9uWSIsInJlc2V0QnV0dG9uIiwiY29udGludWVCdXR0b24iLCJnZXRXZWxjb21lTWVzc2FnZSIsImluaXRBeGlzQnV0dG9ucyIsImluaXRSZXNldENvbnRpbnVlQnV0dG9ucyIsInNldFRhYkluZGV4Q2FyZHMiLCJkaXNhYmxlQ29udGludWVCdXR0b24iLCJoYW5kbGVCdXR0b24iLCJvcHBvc2l0ZUJ1dHRvbiIsImhhbmRsZVJlc2V0IiwiaGFuZGxlQ29udGludWUiLCJyZXNldEZsZWV0U2VsZWN0IiwiY2xlYXJCb2FyZCIsInJlbW92ZVBsYWNlZFNoaXBzIiwiZ2V0RmxlZXROdW1iZXIiLCJ2aWV3IiwibG9hZENvbnRlbnQiLCJpbml0UGxheUJ1dHRvbiIsImxvYWRTZXR1cCIsInNldFBsYXllck5hbWUiLCJ0b1N0cmluZyIsInRyaW0iLCJzdGFydEdhbWUiLCJQbGF5ZXIiLCJnYW1lIiwidXNlck5hbWUiLCJ1c2VyUGxheWVyIiwiY29tcHV0ZXJQbGF5ZXIiLCJjb21wdXRlclRhcmdldFF1ZXVlIiwicmFuZG9tIiwiaG9yaXpvbnRhbCIsImUiLCJyZXN1bHQiLCJhdHRhY2tFbmVteSIsInNoaWZ0IiwicG9wdWxhdGVRdWV1ZSIsImRyb3ciLCJkY29sIiwibmV3Um93IiwibmV3Q29sdW1uIiwiRXJyb3IiLCJTaGlwIiwiR2FtZUJvYXJkIiwicm93cyIsImNvbHVtbnMiLCJmcm9tIiwiZmlsbCIsInNoaXBQb3MiLCJzaGlwTGVuZ3RocyIsInN1bmtTaGlwcyIsImZsZWV0TnVtYmVyIiwiZ2V0Qm9hcmQiLCJuZXdTaGlwIiwicmVjZWl2ZUF0dGFjayIsImhpdCIsInNoaXBJbmZvIiwiZW5lbXlHYW1lYm9hcmQiLCJudW1iZXJPZkhpdHMiLCJzdW5rIiwiZ2V0TnVtYmVyT2ZIaXRzIiwibWVzc2FnZXMiLCJ3ZWxjb21lIiwiYmF0dGxlU3RhcnRQbGF5ZXIiLCJiYXR0bGVTdGFydEVuZW15IiwiZW5lbXlIaXQiLCJlbmVteVN1bmsiLCJwbGF5ZXJTdW5rIiwiZW5lbXlNaXNzIiwicGxheWVyV2luIiwiZW5lbXlXaW4iLCJwcmV2TWVzc2FnZSIsIm5ld01lc3NhZ2UiLCJyYW5kb21DaG9pY2UiLCJvcHRpb25MZW5ndGgiXSwic291cmNlUm9vdCI6IiJ9
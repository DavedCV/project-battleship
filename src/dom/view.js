import helper from "./helper";
import pregame from "./pregame";
import setup from "./setup";
import Game from "../logic/game";
import DragDrop from "./dragDrop";

function view() {
  function loadContent() {
    helper.deleteAppContent();
    pregame.loadCard();
    initPlayButton();
  }

  function initPlayButton() {
    const button = document.getElementById("play-now-button");
    button.addEventListener("click", loadSetup);
  }

  function loadSetup() {
    setPlayerName();
    helper.deleteAppContent();
    setup.loadSetupContent();
    DragDrop.initDraggableFields();
  }

  function setPlayerName() {
    const name = document.getElementById("name-input").value.toString().trim();
    Game.startGame(name || "Cool Player");
    console.log(name);
  }

  return {
    loadContent,
  };
}

export default view();

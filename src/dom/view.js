import helper from "./helper";
import pregame from "./pregame";
import setup from "./setup";
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
    //DragDrop.initDraggableFields();
  }

  function setPlayerName() {
    const name = document.getElementById("name-input").value.toString().trim();
    // TODO: set the player name to the player object
    console.log(name);
  }

  return {
    loadContent,
  };
}

export default view();

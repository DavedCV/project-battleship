import helper from "./helper";
import pregame from "./pregame";

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
  }

  return {
    loadContent,
  };
}

export default view();

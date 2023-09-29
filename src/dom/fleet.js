// assets
import carrier from "../assets/images/carrierX.svg";
import battleship from "../assets/images/battleshipX.svg";
import cruiser from "../assets/images/cruiserX.svg";
import submarine from "../assets/images/submarineX.svg";
import destroyer from "../assets/images/destroyerX.svg";

// factory
import Game from "../logic/game";
import helper from "./helper";

function fleet() {
  function loadFleet(fieldContainer) {
    const player = Game.getGame().getUserPlayer();
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
            column,
          });
        } catch (error) {
          continue;
        }
      }
    }
  }

  function loadShipOnBoard(data) {
    const ship = data.ship;

    if (
      data.fieldContainer.querySelector(
        `.ship-image-container .${ship.getName()}`,
      )
    )
      return;

    const length = ship.getLength();
    const [height, width] = [`10%`, `${length * 10}%`];
    const [top, left] = [`${data.row * 10}%`, `${data.column * 10}%`];
    const axis = ship.getAxis();

    let rotation =
      axis === "X" ? "rotate(0deg)" : "rotate(90deg) translateY(-100%)";

    const container = helper.create("div", {
      className: "ship-image-container bleep",
    });

    container.style.position = "absolute";
    container.style.zIndex = "-1";
    container.style.top = top;
    container.style.left = left;
    container.style.width = width;
    container.style.height = height;
    container.style.transform = rotation;
    container.style.transformOrigin = "top left";
    container.style.maskImage = carrier;

    const image = helper.create("img", {
      className: ship.getName(),
      src: loadShipImage(ship.getName()),
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
        shipImage = carrier;
        break;
      case "battleship":
        shipImage = battleship;
        break;
      case "cruiser":
        shipImage = cruiser;
        break;
      case "submarine":
        shipImage = submarine;
        break;
      case "destroyer":
        shipImage = destroyer;
        break;
      default:
        shipImage = "";
    }
    return shipImage;
  }

  return { loadFleet, loadShipOnBoard };
}

export default fleet();

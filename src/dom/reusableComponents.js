import helper from "./helper";

// library
import Typed from "typed.js";

// assets
import captain from "../assets/images/captain.png";
import enemy from "../assets/images/enemy.png";
import carrier from "../assets/images/cruiserX.svg";
import battleship from "../assets/images/battleshipX.svg";
import cruiser from "../assets/images/cruiserX.svg";
import submarine from "../assets/images/submarineX.svg";
import destroyer from "../assets/images/destroyerX.svg";

function Component() {
  // from webpack images loading
  const images = { captain, enemy };

  function createMessageSection(classNamesArray) {
    const section = helper.create("section", { className: "message" });

    // set all passed classes
    classNamesArray.forEach((className) => section.classList.add(className));

    const character = classNamesArray[1];

    const imageName =
      character == "captain" || character == "captain-win"
        ? "captain"
        : "enemy";
    const image = helper.create("img", {
      className: "message-image",
      src: images[imageName],
    });

    helper.appendAll(section, [image, createMessage(character)]);

    return section;
  }

  function createMessage(character) {
    const container = helper.create("div", {
      id: "message-container",
      className: "message-container",
    });

    const text = helper.create("div", {
      id: `message-${character}`,
      className: `message-${character}`,
    });

    container.appendChild(text);

    return container;
  }

  function createShipCard(shipName) {
    const card = helper.create("div", {
      className: "ship-card",
      draggable: "true",
    });

    const content = helper.create("div", { className: "ship-content" });
    const image = helper.create("img", { className: "ship-image" });
    const name = helper.create("p", { className: "ship-name" });

    switch (shipName) {
      case "carrier":
        populateCard(card, image, name, "carrier", 5, carrier, "carrier (5f)");
        break;
      case "battleship":
        populateCard(
          card,
          image,
          name,
          "battleship",
          4,
          battleship,
          "battleship (4f)",
        );
        break;
      case "cruiser":
        populateCard(card, image, name, "cruiser", 3, cruiser, "cruiser (3f)");
        break;
      case "submarine":
        populateCard(
          card,
          image,
          name,
          "submarine",
          3,
          submarine,
          "submarine (3f)",
        );
        break;
      case "destroyer":
        populateCard(
          card,
          image,
          name,
          "destroyer",
          2,
          destroyer,
          "destroyer (2f)",
        );
        break;
      default:
        break;
    }

    helper.appendAll(content, [image, name]);
    card.appendChild(content);

    return card;
  }

  function populateCard(
    card,
    image,
    name,
    dataShipName,
    dataShipLength,
    imageSrc,
    nameText,
  ) {
    card.dataset.shipName = dataShipName;
    card.dataset.shipLength = dataShipLength;
    image.src = imageSrc;
    name.textContent = nameText;
  }

  function addTypeWritterMessage(element, stringArray) {
    const typed = new Typed(element, {
      strings: stringArray,
      typeSpeed: 10,
    });
  }

  return { createMessageSection, createShipCard, addTypeWritterMessage };
}

export default Component();

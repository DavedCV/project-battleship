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
    nodeArray.forEach((node) => container.appendChild(node));
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

    letters.forEach((element) => {
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

    numbers.forEach((element) => {
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

  return {
    deleteAppContent,
    create,
    appendAll,
    createMap,
  };
}

export default helper();

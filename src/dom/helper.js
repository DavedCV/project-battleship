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

  return {
    deleteAppContent,
    create,
    appendAll
  };
}

export default helper();

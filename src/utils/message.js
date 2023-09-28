function Message() {
  const messages = {
    welcome: [
      "Welcome aboard",
      "Plan our formation by selecting the axis and dragging and dropping ships on the map.",
    ],
  };

  function getWelcomeMessage() {
    // add the name of the ingresed by te player
    // welcome[0] += `${}`;
    return messages.welcome;
  }

  return {getWelcomeMessage};
}

export default Message();

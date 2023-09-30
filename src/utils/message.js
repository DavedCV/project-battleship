import Game from "../logic/game";

function Message() {
  const messages = {
    welcome: [
      "Welcome aboard",
      "Plan our formation by selecting the axis and dragging and dropping ships on the map.",
    ],
    battleStartPlayer: [
      "all systems are online and ready for action. Let's give 'em hell!",
    ],
    battleStartEnemy: [
      "Prepare yourself for a battle unlike any other, for I shall be as ruthless as fate itself, just as your forebears were to mine. This ocean will bear witness to our contest, and I promise you, there shall be no quarter given nor asked.",
    ],
    enemyHit: [
      "They've just caught a cannonball to the hull, sir!",
      "Our precision strikes are taking a toll on their ship, Captain.",
      "The enemy vessel is feeling the weight of our firepower, sir.",
      "Their ship is in a downward spiral, just like their hopes of victory!",
      "That shot was a masterpiece, Captain. Their fate is sealed.",
      "Direct hit, Captain! The enemy ship's defenses are crumbling.",
      "We've scored a solid hit on the enemy vessel, sir.",
      "A thunderous blow, Captain! The enemy ship is in dire straits.",
      "KABOOM! The enemy ship is taking a beating. They won't last long.",
      "Another precise hit, Captain. Their combat capabilities are in shambles.",
    ],
    enemySunk: [
      "Captain, their ship is going under. That was a shot for the history books.",
      "Sir, we've sent the enemy ship to the abyss. It's sunk.",
      "The enemy ship has met its end, Captain. They won't trouble us again.",
      "Captain, we've dealt the final blow. The enemy ship is sunk.",
      "We've consigned the enemy ship to the depths, Captain. Well done.",
      "Captain, the enemy ship is no more. They won't pester us again.",
      "That shot was the nail in the coffin, Captain. The enemy ship is at rest beneath the waves.",
      "Direct hit, Captain. The enemy ship now rests on the ocean floor.",
      "The enemy ship is out of commission. They won't trouble us anymore.",
      "We've just given the enemy ship a one-way trip to the ocean's depths, Captain.",
    ],
    playerMiss: [
      "A near miss, but no cigar, captain.",
      "Our shots need refining, captain. They slipped through our fingers.",
      "Negative, captain. That shot missed the mark.",
      "We've come up empty-handed, captain. Keep the fire burning!",
      "That was a close shave, sir, but no hit.",
      "No luck this time. Keep up the effort!",
      "The enemy is proving elusive, sir. Let's stay vigilant.",
      "Time to fine-tune our aim, sir. They won't elude us for long.",
      "Our sights are slightly off, sir. We'll get them next time.",
      "Progress is slow, captain. What's the next move in our strategy?",
    ],
    playerHit: [
      "Your fate is sealed!",
      "Hehehe, your fortunes are dwindling,",
      "Prepare for the storm of destruction!",
      "That was just a glimpse of your impending doom.",
      "The ocean's embrace awaits you, my foe.",
      "My torpedoes have found their mark, your end is nigh!",
      "So easily anticipated, you're not even a challenge.",
      "How does it feel to face the fury of my onslaught?",
      "Your fortune has deserted you, and there's no escape!",
      "Seems I've struck a nerve. Ready for a taste of your own medicine?",
    ],
    playerSunk: [
      "Looks like you're headed for a watery grave. Hehehe.",
      "You fought like a coward and met a fitting end.",
      "Your ship was no match for our overwhelming firepower.",
      "Another one bites the dust. Crushing your kind is too easy.",
      "Your fate was sealed from the beginning. The sea claims its victims.",
      "Did you truly believe you could stand against us? How naive.",
      "It's regrettable that your vessel crumbled before our might.",
      "The ocean favors the strong. Your ship was doomed.",
      "Challenging me was a grave error. Your defeat was inevitable.",
      "Surrender was your only sensible choice. Now look at the consequences.",
    ],
    enemyMiss: [
      "I'll have my revenge soon enough.",
      "It's my turn to strike back, just you wait.",
      "Missed, but I won't miss twice.",
      "You can try to hide, but you won't elude me for long.",
      "I'll find you, no matter where you try to escape.",
      "Your luck is merely delaying the inevitable, my friend.",
      "My torpedoes are relentless; they'll track you down.",
      "You may have evaded one, but the next one won't miss.",
      "Consider that a warning shot; the real barrage is on its way.",
      "You're toying with danger, and my arsenal is boundless.",
    ],
    playerWin: [
      "Mission accomplished, Captain! You truly are the master of the seas.",
    ],
    enemyWin: ["You were no match for me scum."],
  };

  function getWelcomeMessage() {
    // add the name of the ingresed by te player
    messages.welcome[0] += ` ${Game.getGame().getUserPlayer().getName()}!`;
    return messages.welcome;
  }

  function getBattleStartMessage() {
    return `${Game.getGame().getUserPlayer().getName()} ${
      messages.battleStartPlayer[0]
    }`;
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
      newMessage =
        messages.playerMiss[randomChoice(messages.playerMiss.length)];
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
      newMessage =
        messages.playerSunk[randomChoice(messages.playerSunk.length)];
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
    getPlayerWinMessage,
  };
}

export default Message();

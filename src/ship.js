export function Ship(name, length) {
  let numberOfHits = 0;
  let sunk = false;

  const getName = () => name;

  const getNumberOfHits = () => numberOfHits;

  const hit = () => numberOfHits++;

  const isSunk = () => {
    if (numberOfHits === length) sunk = true;
    return sunk;
  };

  return { getName, getNumberOfHits, hit, isSunk };
}

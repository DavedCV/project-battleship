export function Ship(name, length, axis) {
  let numberOfHits = 0;
  let sunk = false;

  const getName = () => name;

  const getLength = () => length;

  const getAxis = () => axis;

  const getNumberOfHits = () => numberOfHits;

  const hit = () => numberOfHits++;

  const isSunk = () => numberOfHits === length;

  return { getName, getLength, getAxis, getNumberOfHits, hit, isSunk };
}

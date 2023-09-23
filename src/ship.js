export function Ship(length) {
  let numberOfHits = 0;
  let sunk = false;

  const getNumberOfHits = () => numberOfHits;
  const hit = () => numberOfHits++;
  const isSunk = () => {
    if (numberOfHits === length) sunk = true;
    return sunk;
  };

  return { getNumberOfHits, hit, isSunk };
}

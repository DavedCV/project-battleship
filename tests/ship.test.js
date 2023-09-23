import { Ship } from "../src/ship";

describe("test ship", () => {
  test("create a ship with length 3, hit it 3 times, check if it is sunk", () => {
    const ship = Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("check if the number of hits is 3", () => {
    const ship = Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.getNumberOfHits()).toBe(3);
  });

  test("check that the ship is not sunk after 2 hits when it has a length of 3", () => {
    const ship = Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });
});

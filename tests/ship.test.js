import { Ship } from "../src/logic/ship";

describe("test ship object", () => {
  test("test isSunk method: sink ship", () => {
    const ship = Ship("cruiser", 3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("test isSunk method: dont sink ship", () => {
    const ship = Ship("cruiser", 3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("test getNumberOfHits", () => {
    const ship = Ship("cruiser", 3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.getNumberOfHits()).toBe(3);
  });
});

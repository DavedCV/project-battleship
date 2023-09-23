import { GameBoard } from "../src/gameboard";
import { Ship } from "../src/ship";

const gameboard = GameBoard();
jest.mock("../src/ship");
jest.spyOn(gameboard, "getShip");

beforeEach(() => {
  Ship.mockClear();
  gameboard.getShip.mockClear();
});

describe("test carrier ship placing", () => {
  beforeEach(() => {
    Ship.mockReturnValue({ getName: jest.fn(() => "carrier") });
  });

  test("test horizontal placing of a carrier ship", () => {
    gameboard.placeShip(0, 0, "carrier", true);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/carrier/);
    expect(gameboard.getShip(0, 1)).toMatch(/carrier/);
    expect(gameboard.getShip(0, 2)).toMatch(/carrier/);
    expect(gameboard.getShip(0, 3)).toMatch(/carrier/);
    expect(gameboard.getShip(0, 4)).toMatch(/carrier/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(5);
  });

  test("test vertical placing of a carrier ship", () => {
    gameboard.placeShip(0, 0, "carrier", false);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/carrier/);
    expect(gameboard.getShip(1, 0)).toMatch(/carrier/);
    expect(gameboard.getShip(2, 0)).toMatch(/carrier/);
    expect(gameboard.getShip(3, 0)).toMatch(/carrier/);
    expect(gameboard.getShip(4, 0)).toMatch(/carrier/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(5);
  });
});

describe("test battleship ship placing", () => {
  beforeEach(() => {
    Ship.mockReturnValue({ getName: jest.fn(() => "battleship") });
  });

  test("test horizontal placing of a battleship ship", () => {
    gameboard.placeShip(0, 0, "battleship", true);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/battleship/);
    expect(gameboard.getShip(0, 1)).toMatch(/battleship/);
    expect(gameboard.getShip(0, 2)).toMatch(/battleship/);
    expect(gameboard.getShip(0, 3)).toMatch(/battleship/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(4);
  });

  test("test vertical placing of a battleship ship", () => {
    gameboard.placeShip(0, 0, "battleship", false);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/battleship/);
    expect(gameboard.getShip(1, 0)).toMatch(/battleship/);
    expect(gameboard.getShip(2, 0)).toMatch(/battleship/);
    expect(gameboard.getShip(3, 0)).toMatch(/battleship/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(4);
  });
});

// write the remaining test to the remaining ships
describe("test cruiser ship placing", () => {
  beforeEach(() => {
    Ship.mockReturnValue({ getName: jest.fn(() => "cruiser") });
  });

  test("test horizontal placing of a cruiser ship", () => {
    gameboard.placeShip(0, 0, "cruiser", true);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/cruiser/);
    expect(gameboard.getShip(0, 1)).toMatch(/cruiser/);
    expect(gameboard.getShip(0, 2)).toMatch(/cruiser/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(3);
  });

  test("test vertical placing of a cruiser ship", () => {
    gameboard.placeShip(0, 0, "cruiser", false);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/cruiser/);
    expect(gameboard.getShip(1, 0)).toMatch(/cruiser/);
    expect(gameboard.getShip(2, 0)).toMatch(/cruiser/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(3);
  });
});

describe("test submarine ship placing", () => {
  beforeEach(() => {
    Ship.mockReturnValue({ getName: jest.fn(() => "submarine") });
  });

  test("test horizontal placing of a submarine ship", () => {
    gameboard.placeShip(0, 0, "submarine", true);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/submarine/);
    expect(gameboard.getShip(0, 1)).toMatch(/submarine/);
    expect(gameboard.getShip(0, 2)).toMatch(/submarine/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(3);
  });

  test("test vertical placing of a submarine ship", () => {
    gameboard.placeShip(0, 0, "submarine", false);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/submarine/);
    expect(gameboard.getShip(1, 0)).toMatch(/submarine/);
    expect(gameboard.getShip(2, 0)).toMatch(/submarine/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(3);
  });
});

describe("test destroyer ship placing", () => {
  beforeEach(() => {
    Ship.mockReturnValue({ getName: jest.fn(() => "destroyer") });
  });

  test("test horizontal placing of a destroyer ship", () => {
    gameboard.placeShip(0, 0, "destroyer", true);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/destroyer/);
    expect(gameboard.getShip(0, 1)).toMatch(/destroyer/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(2);
  });

  test("test vertical placing of a destroyer ship", () => {
    gameboard.placeShip(0, 0, "destroyer", false);
    expect(Ship).toHaveBeenCalledTimes(1);

    expect(gameboard.getShip(0, 0)).toMatch(/destroyer/);
    expect(gameboard.getShip(1, 0)).toMatch(/destroyer/);
    expect(gameboard.getShip).toHaveBeenCalledTimes(2);
  });
});

import { GameBoard } from "../src/gameboard";
import { Ship } from "../src/ship";

jest.mock("../src/ship");

describe("test ship retrieval", () => {
  Ship.mockReturnValue({ getName: jest.fn(() => "destroyer") });
  const testShip = Ship();

  const gameboard = GameBoard();
  const getShip = jest
    .spyOn(gameboard, "getShip")
    .mockImplementation((row, column) => {
      const board = [
        [testShip, testShip],
        [null, null],
      ];
      return board[row][column].getName();
    });

  test("get ship in position (0, 0)", () => {
    expect(getShip(0, 0)).toMatch(/destroyer/);
    expect(getShip).toHaveBeenCalledTimes(1);
  });

  test("get ship in position (0, 1)", () => {
    expect(getShip(0, 1)).toMatch(/destroyer/);
    expect(getShip).toHaveBeenCalledTimes(2);
  });
});

describe("test ship placing", () => {
  const gameboard = GameBoard();
  const getShip = jest.spyOn(gameboard, "getShip");
  const placeShip = jest.spyOn(gameboard, "placeShip");

  beforeEach(() => {
    Ship.mockClear();
    gameboard.clearBoard();
    getShip.mockClear();
    placeShip.mockClear();
  });

  describe("test carrier ship placing", () => {
    beforeEach(() => {
      Ship.mockReturnValue({ getName: jest.fn(() => "carrier") });
    });

    test("test horizontal placing of a carrier ship", () => {
      placeShip(0, 0, "carrier", true);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/carrier/);
      expect(getShip(0, 1)).toMatch(/carrier/);
      expect(getShip(0, 2)).toMatch(/carrier/);
      expect(getShip(0, 3)).toMatch(/carrier/);
      expect(getShip(0, 4)).toMatch(/carrier/);
      expect(getShip).toHaveBeenCalledTimes(5);
    });

    test("test vertical placing of a carrier ship", () => {
      placeShip(0, 0, "carrier", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/carrier/);
      expect(getShip(1, 0)).toMatch(/carrier/);
      expect(getShip(2, 0)).toMatch(/carrier/);
      expect(getShip(3, 0)).toMatch(/carrier/);
      expect(getShip(4, 0)).toMatch(/carrier/);
      expect(getShip).toHaveBeenCalledTimes(5);
    });
  });

  describe("test battleship ship placing", () => {
    beforeEach(() => {
      Ship.mockReturnValue({ getName: jest.fn(() => "battleship") });
    });

    test("test horizontal placing of a battleship ship", () => {
      placeShip(0, 0, "battleship", true);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/battleship/);
      expect(getShip(0, 1)).toMatch(/battleship/);
      expect(getShip(0, 2)).toMatch(/battleship/);
      expect(getShip(0, 3)).toMatch(/battleship/);
      expect(getShip).toHaveBeenCalledTimes(4);
    });

    test("test vertical placing of a battleship ship", () => {
      placeShip(0, 0, "battleship", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/battleship/);
      expect(getShip(1, 0)).toMatch(/battleship/);
      expect(getShip(2, 0)).toMatch(/battleship/);
      expect(getShip(3, 0)).toMatch(/battleship/);
      expect(getShip).toHaveBeenCalledTimes(4);
    });
  });

  describe("test cruiser ship placing", () => {
    beforeEach(() => {
      Ship.mockReturnValue({ getName: jest.fn(() => "cruiser") });
    });

    test("test horizontal placing of a cruiser ship", () => {
      placeShip(0, 0, "cruiser", true);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/cruiser/);
      expect(getShip(0, 1)).toMatch(/cruiser/);
      expect(getShip(0, 2)).toMatch(/cruiser/);
      expect(getShip).toHaveBeenCalledTimes(3);
    });

    test("test vertical placing of a cruiser ship", () => {
      placeShip(0, 0, "cruiser", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/cruiser/);
      expect(getShip(1, 0)).toMatch(/cruiser/);
      expect(getShip(2, 0)).toMatch(/cruiser/);
      expect(getShip).toHaveBeenCalledTimes(3);
    });
  });

  describe("test submarine ship placing", () => {
    beforeEach(() => {
      Ship.mockReturnValue({ getName: jest.fn(() => "submarine") });
    });

    test("test horizontal placing of a submarine ship", () => {
      placeShip(0, 0, "submarine", true);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/submarine/);
      expect(getShip(0, 1)).toMatch(/submarine/);
      expect(getShip(0, 2)).toMatch(/submarine/);
      expect(getShip).toHaveBeenCalledTimes(3);
    });

    test("test vertical placing of a submarine ship", () => {
      placeShip(0, 0, "submarine", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/submarine/);
      expect(getShip(1, 0)).toMatch(/submarine/);
      expect(getShip(2, 0)).toMatch(/submarine/);
      expect(getShip).toHaveBeenCalledTimes(3);
    });
  });

  describe("test destroyer ship placing", () => {
    beforeEach(() => {
      Ship.mockReturnValue({ getName: jest.fn(() => "destroyer") });
    });

    test("test horizontal placing of a destroyer ship", () => {
      placeShip(0, 0, "destroyer", true);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/destroyer/);
      expect(getShip(0, 1)).toMatch(/destroyer/);
      expect(getShip).toHaveBeenCalledTimes(2);
    });

    test("test vertical placing of a destroyer ship", () => {
      placeShip(0, 0, "destroyer", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0)).toMatch(/destroyer/);
      expect(getShip(1, 0)).toMatch(/destroyer/);
      expect(getShip).toHaveBeenCalledTimes(2);
    });
  });

  describe("test error placing of a ship in a given position", () => {
    test("test error placing of a ship in a taken position horizontal", () => {
      placeShip(0, 0, "destroyer", false);
      expect(() => placeShip(0, 0, "carrier", false)).toThrow(Error);
    });

    test("test error placing of a ship in a taken position horizontal", () => {
      placeShip(0, 0, "destroyer", false);
      expect(() => placeShip(0, 0, "carrier", true)).toThrow(Error);
    });
  });
});

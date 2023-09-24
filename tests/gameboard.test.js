import { experiments } from "webpack";
import { GameBoard } from "../src/gameboard";
import { Ship } from "../src/ship";

jest.mock("../src/ship");

describe("test get board", () => {
  test("test get board", () => {
    const gameboard = GameBoard();
    expect(gameboard.getBoard()).toEqual(Array(10).fill(Array(10).fill(null)));
  });
});

describe("test clear board", () => {
  const gameboard = GameBoard();

  test("test clear board", () => {
    gameboard.clearBoard();
    expect(gameboard.getBoard()).toEqual(Array(10).fill(Array(10).fill(null)));
  });
});

describe("test ship retrieval", () => {
  Ship.mockReturnValue({ getName: jest.fn(() => "destroyer") });

  const gameboard = GameBoard();

  const getShip = jest.spyOn(gameboard, "getShip");
  const placeShip = jest
    .spyOn(gameboard, "placeShip")
    .mockImplementation(() => {
      const testShip = Ship();
      gameboard.getBoard()[0][0] = testShip;
      gameboard.getBoard()[0][1] = testShip;
    });

  placeShip();
  expect(placeShip).toHaveBeenCalledTimes(1);

  test("get ship in position (0, 0)", () => {
    expect(getShip(0, 0).getName()).toMatch(/destroyer/);
    expect(getShip).toHaveBeenCalledTimes(1);
  });

  test("get ship in position (0, 1)", () => {
    expect(getShip(0, 1).getName()).toMatch(/destroyer/);
    expect(getShip).toHaveBeenCalledTimes(2);
  });

  placeShip.mockRestore();
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

      expect(getShip(0, 0).getName()).toMatch(/carrier/);
      expect(getShip(0, 1).getName()).toMatch(/carrier/);
      expect(getShip(0, 2).getName()).toMatch(/carrier/);
      expect(getShip(0, 3).getName()).toMatch(/carrier/);
      expect(getShip(0, 4).getName()).toMatch(/carrier/);
      expect(getShip).toHaveBeenCalledTimes(5);
    });

    test("test vertical placing of a carrier ship", () => {
      placeShip(0, 0, "carrier", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0).getName()).toMatch(/carrier/);
      expect(getShip(1, 0).getName()).toMatch(/carrier/);
      expect(getShip(2, 0).getName()).toMatch(/carrier/);
      expect(getShip(3, 0).getName()).toMatch(/carrier/);
      expect(getShip(4, 0).getName()).toMatch(/carrier/);
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

      expect(getShip(0, 0).getName()).toMatch(/battleship/);
      expect(getShip(0, 1).getName()).toMatch(/battleship/);
      expect(getShip(0, 2).getName()).toMatch(/battleship/);
      expect(getShip(0, 3).getName()).toMatch(/battleship/);
      expect(getShip).toHaveBeenCalledTimes(4);
    });

    test("test vertical placing of a battleship ship", () => {
      placeShip(0, 0, "battleship", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0).getName()).toMatch(/battleship/);
      expect(getShip(1, 0).getName()).toMatch(/battleship/);
      expect(getShip(2, 0).getName()).toMatch(/battleship/);
      expect(getShip(3, 0).getName()).toMatch(/battleship/);
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

      expect(getShip(0, 0).getName()).toMatch(/cruiser/);
      expect(getShip(0, 1).getName()).toMatch(/cruiser/);
      expect(getShip(0, 2).getName()).toMatch(/cruiser/);
      expect(getShip).toHaveBeenCalledTimes(3);
    });

    test("test vertical placing of a cruiser ship", () => {
      placeShip(0, 0, "cruiser", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0).getName()).toMatch(/cruiser/);
      expect(getShip(1, 0).getName()).toMatch(/cruiser/);
      expect(getShip(2, 0).getName()).toMatch(/cruiser/);
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

      expect(getShip(0, 0).getName()).toMatch(/submarine/);
      expect(getShip(0, 1).getName()).toMatch(/submarine/);
      expect(getShip(0, 2).getName()).toMatch(/submarine/);
      expect(getShip).toHaveBeenCalledTimes(3);
    });

    test("test vertical placing of a submarine ship", () => {
      placeShip(0, 0, "submarine", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0).getName()).toMatch(/submarine/);
      expect(getShip(1, 0).getName()).toMatch(/submarine/);
      expect(getShip(2, 0).getName()).toMatch(/submarine/);
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

      expect(getShip(0, 0).getName()).toMatch(/destroyer/);
      expect(getShip(0, 1).getName()).toMatch(/destroyer/);
      expect(getShip).toHaveBeenCalledTimes(2);
    });

    test("test vertical placing of a destroyer ship", () => {
      placeShip(0, 0, "destroyer", false);
      expect(Ship).toHaveBeenCalledTimes(1);
      expect(placeShip).toHaveBeenCalledTimes(1);

      expect(getShip(0, 0).getName()).toMatch(/destroyer/);
      expect(getShip(1, 0).getName()).toMatch(/destroyer/);
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

describe("test receive attack", () => {
  const gameboard = GameBoard();

  Ship.mockReturnValue({
    length: 5,
    numberOfHits: 0,
    hit() {
      this.numberOfHits++;
    },
    isSunk() {
      return this.numberOfHits === this.length;
    },
  });

  const placeShip = jest
    .spyOn(gameboard, "placeShip")
    .mockImplementation((testShip) => {
      for (let i = 0; i < testShip.length; i++) {
        gameboard.getBoard()[0][i] = testShip;
      }
    });

  const testShip = Ship();
  const hitSpy = jest.spyOn(testShip, "hit");
  placeShip(testShip);

  test("test receive attack in a ship", () => {
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    expect(gameboard.getBoard()[0][0]).toMatch(/hit/);
    expect(gameboard.getBoard()[0][0]).toMatch(/hit/);
    expect(hitSpy).toHaveBeenCalledTimes(2);
  });

  test("test receive attack and sink a ship", () => {
    gameboard.receiveAttack(0, 2);
    gameboard.receiveAttack(0, 3);
    gameboard.receiveAttack(0, 4);
    expect(testShip.isSunk()).toBe(true);
    expect(hitSpy).toHaveBeenCalledTimes(5);
  });

  placeShip.mockRestore();
});

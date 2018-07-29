import tournament3 from "../tournament3.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the best individuals of the tournament3, greater", () => {
  jest.spyOn(Math, "random").mockImplementation(
    stubRandom(0.25, index => {
      return index * 1.5;
    })
  );

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fitnessComparator = (first, second) => {
    return first > second;
  };

  const firstTournamentSurvivor = tournament3(population, fitnessComparator);

  expect(firstTournamentSurvivor).toEqual("best");
});

it("return the best individuals of the tournament3, lesser", () => {
  jest.spyOn(Math, "random").mockImplementation(
    stubRandom(0.2, index => {
      return index * 2;
    })
  );

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fitnessComparator = (first, second) => {
    return first < second;
  };

  const firstTournamentSurvivor = tournament3(population, fitnessComparator);

  expect(firstTournamentSurvivor).toEqual("bad");
});

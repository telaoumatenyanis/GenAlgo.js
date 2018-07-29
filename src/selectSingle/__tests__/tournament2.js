import tournament2 from "../tournament2.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the best individuals of two tournament2, greater", () => {
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

  const firstTournamentSurvivor = tournament2(population, fitnessComparator);

  expect(firstTournamentSurvivor).toEqual("best");

  const secondTournamentSurvivor = tournament2(population, fitnessComparator);

  expect(secondTournamentSurvivor).toEqual("almostGood");
});

it("return the best individuals of two tournament2, lesser", () => {
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
    return first < second;
  };

  const firstTournamentSurvivor = tournament2(population, fitnessComparator);

  expect(firstTournamentSurvivor).toEqual("almostGood");

  const secondTournamentSurvivor = tournament2(population, fitnessComparator);

  expect(secondTournamentSurvivor).toEqual("bad");
});

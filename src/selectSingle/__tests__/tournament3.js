import tournament3 from "../tournament3.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the best individuals of the tournament3, greater", () => {
  stubRandom([0, 0.4, 0.8]);

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
  stubRandom([0, 0.4, 0.8]);

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

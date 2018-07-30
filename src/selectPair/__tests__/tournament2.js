import tournament2 from "../tournament2.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the best pair of individuals of two tournament2, greater", () => {
  stubRandom([0, 0.4, 0.4, 0.8]);

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fitnessComparator = (first, second) => {
    return first > second;
  };

  const tournamentSurvivors = tournament2(population, fitnessComparator);

  expect(tournamentSurvivors).toEqual(["best", "almostGood"]);
});

it("return the best pair of individuals of two tournament2, lesser", () => {
  stubRandom([0, 0.4, 0.4, 0.8]);

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fitnessComparator = (first, second) => {
    return first < second;
  };
  const tournamentSurvivors = tournament2(population, fitnessComparator);

  expect(tournamentSurvivors).toEqual(["almostGood", "bad"]);
});

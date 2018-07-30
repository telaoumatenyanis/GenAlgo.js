import tournament3 from "../tournament3.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the best pair individuals of two tournament3, greater comparator", () => {
  stubRandom([0, 0.4, 0.8, 0.4, 0.4, 0.8]);

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fitnessComparator = (first, second) => {
    return first > second;
  };

  const tournamentSurvivors = tournament3(population, fitnessComparator);

  expect(tournamentSurvivors).toEqual(["best", "almostGood"]);
});

it("return the best pair of individuals of two tournament3, lesser comparator", () => {
  stubRandom([0, 0.4, 0.8, 0, 0.4, 0.4]);

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fitnessComparator = (first, second) => {
    return first < second;
  };

  const tournamentSurvivors = tournament3(population, fitnessComparator);

  expect(tournamentSurvivors).toEqual(["bad", "almostGood"]);
});

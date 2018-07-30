import randomLinearRank from "../randomLinearRank.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the 4th and 6th individuals of the population", () => {
  stubRandom([0.35, 0.15]);

  const population = [
    { entity: "thefittest", fitness: 4 },
    { entity: "best", fitness: 3 },
    { entity: "almostGoodFirst", fitness: 2 },
    { entity: "almostGoodSecond", fitness: 2 },
    { entity: "almostGoodThird", fitness: 2 },
    { entity: "almostGoodFourth", fitness: 2 },
    { entity: "badFirst", fitness: 1 },
    { entity: "badSecond", fitness: 1 },
    { entity: "badThird", fitness: 1 },
    { entity: "badFourth", fitness: 1 }
  ];

  const chosenIndividuals = randomLinearRank(population);

  expect(chosenIndividuals).toEqual(["almostGoodSecond", "almostGoodFourth"]);
});

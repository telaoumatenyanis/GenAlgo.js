import randomLinearRank, { linearRank } from "../randomLinearRank.js";
import stubRandom from "../../utils/testing/stubRandom";

it("Verify if the linear rank is correct", () => {
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

  const ranks = linearRank(population);

  expect(ranks).toEqual([
    1,
    0.8,
    0.6222222222222222,
    0.4666666666666667,
    0.33333333333333326,
    0.2222222222222221,
    0.1333333333333332,
    0.06666666666666654,
    0.022222222222222143,
    0,
    0
  ]);
});

it("return the 4th individual of the population", () => {
  stubRandom([0.35]);

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

  const chosenIndividual = randomLinearRank(population);

  expect(chosenIndividual).toEqual("almostGoodSecond");
});

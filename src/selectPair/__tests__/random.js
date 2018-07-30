import random from "../random.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the best and bad individuals", () => {
  stubRandom([0, 0.8]);

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const randomIndividuals = random(population);

  expect(randomIndividuals).toEqual(["best", "bad"]);
});

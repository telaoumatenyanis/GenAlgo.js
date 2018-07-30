import fittestRandom from "../fittestRandom.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the fittest and the bad one", () => {
  stubRandom([0.8]);

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fittestRandomIndividuals = fittestRandom(population);

  expect(fittestRandomIndividuals).toEqual(["best", "bad"]);
});

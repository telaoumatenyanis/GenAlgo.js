import fittest from "../fittest.js";

it("return the fittest of the population", () => {
  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fittestIndividual = fittest(population);

  expect(fittestIndividual).toEqual("best");
});

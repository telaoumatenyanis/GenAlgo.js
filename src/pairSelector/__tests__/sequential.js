import sequential from "../sequential.js";

it("return a sequence containing all the population", () => {
  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGoodFirst", fitness: 2 },
    { entity: "almostGoodSecond", fitness: 2 },
    { entity: "badFirst", fitness: 1 },
    { entity: "badSecond", fitness: 1 }
  ];

  const followingIndividuals = sequential(population);

  expect(followingIndividuals).toEqual(["best", "almostGoodFirst"]);
});

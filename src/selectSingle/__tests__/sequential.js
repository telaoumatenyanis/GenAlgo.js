import sequential from "../sequential.js";
import stubRandom from "../../utils/testing/stubRandom";
import map from "lodash/fp/map";

it("return a sequence containing all the population", () => {
  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGoodFirst", fitness: 2 },
    { entity: "almostGoodSecond", fitness: 2 },
    { entity: "badFirst", fitness: 1 },
    { entity: "badSecond", fitness: 1 }
  ];

  const sequence = map(() => {
    return sequential(population);
  }, population);

  expect(sequence).toEqual([
    "best",
    "almostGoodFirst",
    "almostGoodSecond",
    "badFirst",
    "badSecond"
  ]);
});

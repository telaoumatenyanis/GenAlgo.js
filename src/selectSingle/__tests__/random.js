import random from "../random.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the first two individual", () => {
  stubRandom([0, 0.4, 0.8]);

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const firstRandom = random(population);

  expect(firstRandom).toEqual("best");

  const secondRandom = random(population);

  expect(secondRandom).toEqual("almostGood");
});

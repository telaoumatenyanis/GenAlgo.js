import random from "../random.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the first two individual", () => {
  jest.spyOn(Math, "random").mockImplementation(
    stubRandom(0.2, index => {
      return index * 2;
    })
  );

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

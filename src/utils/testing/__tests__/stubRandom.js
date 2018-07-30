import stubRandom from "../stubRandom.js";

it("Math.random() should be stubbed", () => {
  stubRandom([3, 14, 159, 2653]);

  expect(Math.random()).toEqual(3);

  expect(Math.random()).toEqual(14);

  expect(Math.random()).toEqual(159);

  expect(Math.random()).toEqual(2653);
});

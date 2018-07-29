import tournament2 from "../tournament2.js";
import stubRandom from "../../utils/testing/stubRandom";

it("return the first two individual", () => {
  jest.spyOn(Math, "random").mockImplementation(
    stubRandom(0.25, index => {
      return index * 1.5;
    })
  );

  const population = [
    { entity: "best", fitness: 3 },
    { entity: "almostGood", fitness: 2 },
    { entity: "bad", fitness: 1 }
  ];

  const fitnessComparator = (first, second) => {
    return first > second;
  };

  const firstTournamentSurvivor = tournament2(population, fitnessComparator);

  expect(firstTournamentSurvivor).toEqual("best");

  const secondTournamentSurvivor = tournament2(population, fitnessComparator);

  expect(secondTournamentSurvivor).toEqual("almostGood");
});

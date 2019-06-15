import roulettePair from "../../pairSelector/roulette.js";
import stubRandom from "../../utils/testing/stubRandom";

it("Verify if the roulette rank is correct", () => {
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
  console.log(roulettePair(population));
});

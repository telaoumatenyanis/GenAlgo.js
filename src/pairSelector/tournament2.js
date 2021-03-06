import tournament2Single from "../singleSelector/tournament2.js";

/**
 * Compare two individuals, two times and return a pair
 * @param   population                      population of the iteration
 * @param   fitnessComparator               function used to compare the individuals
 * @return                                  a pair of the best of the two groups of two inviduals
 */
function tournament2(
  population: Array<{ entity: any, fitness: number }>,
  fitnessComparator: (number, number) => boolean
): [any, any] {
  return [
    tournament2Single(population, fitnessComparator),
    tournament2Single(population, fitnessComparator)
  ];
}

export default tournament2;

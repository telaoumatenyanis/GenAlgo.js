import tournament3Single from "../singleSelector/tournament3.js";

/**
 * Compare three individuals, two times and return a pair
 * @param   population                      population of the iteration
 * @param   fitnessComparator               function used to compare the individuals
 * @return                                  a pair of the best of the two groups of three inviduals
 */
function tournament3(
  population: Array<{ entity: any, fitness: number }>,
  fitnessComparator: (number, number) => boolean
): [any, any] {
  return [
    tournament3Single(population, fitnessComparator),
    tournament3Single(population, fitnessComparator)
  ];
}

export default tournament3;

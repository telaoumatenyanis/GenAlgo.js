import tournament2Single from "../selectSingle/tournament2.js";

/**
 * Compare two individuals, two times and return a pair
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @param  {function} fitnessComparator               function used to compare the individuals
 * @return {[*,*]}                                      a pair of the best of the two groups of two inviduals
 */
function tournament2(
  population: [{ entity: any, fitness: number }],
  fitnessComparator: (number, number) => boolean
) {
  return [
    tournament2Single(population, fitnessComparator),
    tournament2Single(population, fitnessComparator)
  ];
}

export default tournament2;

import tournament3Single from "../selectSingle/tournament3.js";

/**
 * Compare three individuals, two times and return a pair
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @param  {function} fitnessComparator               function used to compare the individuals
 * @return {[*]}                                      a pair of the best of the two groups of three inviduals
 */
function tournament3(
  population: [{ entity: any, fitness: number }],
  fitnessComparator: (number, number) => boolean
) {
  return [
    tournament3Single(population, fitnessComparator),
    tournament3Single(population, fitnessComparator)
  ];
}

export default tournament3;

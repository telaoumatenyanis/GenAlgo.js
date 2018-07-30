import randomLinearRankSingle from "../selectSingle/randomLinearRank.js";

/**
 * Select a pair of two individual according to a linear rank
 * @param   population population of the iteration
 * @return             random pair of individual
 */
function randomLinearRank(
  population: Array<{ entity: any, fitness: number }>
): [any, any] {
  return [
    randomLinearRankSingle(population),
    randomLinearRankSingle(population)
  ];
}

export default randomLinearRank;

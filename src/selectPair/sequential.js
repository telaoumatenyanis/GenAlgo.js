import sequentialSingle from "../selectSingle/randomLinearRank.js";

/**
 * Select a pair of two individual in the sequence
 * @param   population population of the iteration
 * @return             a pair of individual
 */
function sequential(
  population: Array<{ entity: any, fitness: number }>
): [any, any] {
  return [sequentialSingle(population), sequentialSingle(population)];
}

export default sequential;

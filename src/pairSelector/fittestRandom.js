import randomSingle from "../singleSelector/random.js";
import fittestSingle from "../singleSelector/fittest.js";

/**
 * Return a pair composed of the fittest and a random individual of the population
 * @param   population                         population of the iteration
 * @return                                     a pair composed of the fittest and a random individual
 */
function fittestRandom(
  population: Array<{ entity: any, fitness: number }>
): [any, any] {
  return [fittestSingle(population), randomSingle(population)];
}

export default fittestRandom;

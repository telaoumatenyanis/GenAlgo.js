import randomSingle from "../selectSingle/random.js";
import fittestSingle from "../selectSingle/fittest.js";

/**
 * Return a pair composed of the fittest and a random individual of the population
 * @param   population                         population of the iteration
 * @return                                     a pair composed of the fittest and a random individual
 */
function fittestRandom(population: Array<{ entity: any, fitness: number }>) {
  return [fittestSingle(population), randomSingle(population)];
}

export default fittestRandom;

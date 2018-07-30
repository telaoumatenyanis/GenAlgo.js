import randomSingle from "../selectSingle/random.js";

/**
 * Return a random pair of individuals of the population
 * @param   population                         population of the iteration
 * @return                                     a random pair of individual
 */
function random(population: Array<{ entity: any, fitness: number }>) {
  return [randomSingle(population), randomSingle(population)];
}

export default random;

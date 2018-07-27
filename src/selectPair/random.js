import randomSingle from "../selectSingle/random.js";

/**
 * Return a random individual of the population
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @return {*}                                        a random individual
 */
function random(population: [{ entity: any, fitness: number }]) {
  return [randomSingle(population), randomSingle(population)];
}

export default random;

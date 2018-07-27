/**
 * Return a random individual of the population
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @return {*}                                        a random individual
 */
function random(population: [{ entity: any, fitness: number }]) {
  return population[Math.floor(Math.random() * population.length)].entity;
}

export default random;

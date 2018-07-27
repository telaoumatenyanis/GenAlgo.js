/**
 * Return a random individual of the population
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @return {*}                                        a random individual
 */
function tournament2(population: [{ entity: any, fitness: number }]) {
  return population[Math.floor(Math.random() * population.length)].entity;
}

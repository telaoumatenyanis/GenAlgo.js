/**
 * Return the best individual of the population
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @return {*}                                        the best indivdual of the population
 */
function fittest(population: [{ entity: any, fitness: number }]) {
  return population[0].entity;
}

export default fittest;

/**
 * Return a random individual of the population
 * @param   population  population of the iteration
 * @return              a random individual
 */
function random(population: Array<{ entity: any, fitness: number }>): any {
  return population[Math.floor(Math.random() * population.length)].entity;
}

export default random;

/**
 * Return the best individual of the population
 * @param   population  population of the iteration sorted by fitness
 * @return              the best indivdual of the population
 */
function fittest(population: Array<{ entity: any, fitness: number }>) {
  return population[0].entity;
}

export default fittest;

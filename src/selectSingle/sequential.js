function sequential() {
  let index = 0;
  /**
   * Select individual sequentially
   * @param   population population of the iteration sorted by fitness
   * @return             next individual of the sequence
   */
  return function(population: Array<{ entity: any, fitness: number }>) {
    return population[index++ % population.length].entity;
  };
}

export default sequential();

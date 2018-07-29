function sequential() {
  let index = 0;
  /**
   * Select individual sequentially
   * @param  {[{entity:*, fitness:number}]} population population of the iteration sorted by fitness
   * @return {*}            next individual of the sequence
   */
  return function(population: [{ entity: any, fitness: number }]) {
    return population[index % population.length].entity;
  };
}

export default sequential();

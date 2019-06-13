import get from "../utils/get.js";

/**
 * Select individual sequentially
 * @param   population population of the iteration sorted by fitness
 * @return             next individual of the sequence
 */
function sequential(population: Array<{ entity: any, fitness: number }>): any {
  if (get(sequential, "args.index") == null) {
    sequential.args = { index: 0 };
  }

  return population[sequential.args.index++ % population.length].entity;
}

export default sequential;

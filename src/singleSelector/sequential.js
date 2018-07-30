import isNil from "lodash/fp/isNil";
import get from "lodash/fp/get";

/**
 * Select individual sequentially
 * @param   population population of the iteration sorted by fitness
 * @return             next individual of the sequence
 */
function sequential(population: Array<{ entity: any, fitness: number }>): any {
  if (isNil(get("args.index", sequential))) {
    sequential.args = { index: 0 };
  }

  return population[sequential.args.index++ % population.length].entity;
}

export default sequential;

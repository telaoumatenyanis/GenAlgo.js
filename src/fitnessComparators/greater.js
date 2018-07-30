// @flow

/**
 * Fitness Comparator where winner is the greater fitness
 * @param   fitness1 first fitness
 * @param   fitness2 second fitness
 * @return           true if fitness 1 is grater than fitness2
 */
function greater(fitness1: number, fitness2: number) {
  return fitness1 > fitness2;
}

export default greater;

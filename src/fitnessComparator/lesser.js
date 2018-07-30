// @flow

/**
 * Fitness Comparator where winner is the lesser fitness
 * @param   fitness1 first fitness
 * @param   fitness2 second fitness
 * @return           true if fitness 1 is lesser than fitness2
 */
function lesser(fitness1: number, fitness2: number): boolean {
  return fitness1 < fitness2;
}

export default lesser;

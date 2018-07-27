// @flow

/**
 * Fitness Comparator where winner is the greater fitness
 * @param  {number} fitness1 first fitness
 * @param  {number} fitness2 second fitness
 * @return {boolean}         true if fitness 1 is grater than fitness2
 */
function greater(fitness1: number, fitness2: number) {
  return fitness1 > fitness2;
}

export default greater;

// @flow

/**
 * Fitness Comparator where winner is the lesser fitness
 * @param  {number} fitness1 first fitness
 * @param  {number} fitness2 second fitness
 * @return {boolean}         true if fitness 1 is lesser than fitness2
 */
function lesser(fitness1: number, fitness2: number) {
  return fitness1 < fitness2;
}

export default lesser;

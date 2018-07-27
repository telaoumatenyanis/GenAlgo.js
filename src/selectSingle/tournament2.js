/**
 * Compare two individuals and return the best one
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @param  {function} fitnessComparator               function used to compare the individuals
 * @return {*}                                        the best of the two inviduals
 */
function tournament2(
  population: [{ entity: any, fitness: number }],
  fitnessComparator: (number, number) => boolean
) {
  const numberOfIndividuals = population.length;

  const individualA =
    population[Math.floor(Math.random() * numberOfIndividuals)];
  const individualB =
    population[Math.floor(Math.random() * numberOfIndividuals)];

  return fitnessComparator(a.fitness, b.fitness) ? a.entity : b.entity;
}

export default tournament2;

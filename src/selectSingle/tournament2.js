/**
 * Compare two individuals and return the best one
 * @param   population                      population of the iteration
 * @param   fitnessComparator               function used to compare the individuals
 * @return                                  the best of the two inviduals
 */
function tournament2(
  population: Array<{ entity: any, fitness: number }>,
  fitnessComparator: (number, number) => boolean
): any {
  const numberOfIndividuals = population.length;

  const individualA =
    population[Math.floor(Math.random() * numberOfIndividuals)];
  const individualB =
    population[Math.floor(Math.random() * numberOfIndividuals)];

  return fitnessComparator(individualA.fitness, individualB.fitness)
    ? individualA.entity
    : individualB.entity;
}

export default tournament2;

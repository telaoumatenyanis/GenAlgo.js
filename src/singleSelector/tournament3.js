/**
 * Compare three individuals and return the best one
 * @param   population                                population of the iteration
 * @param   fitnessComparator                         function used to compare the individuals
 * @return                                            the best of the three inviduals
 */
function tournament3(
  population: Array<{ entity: any, fitness: number }>,
  fitnessComparator: (number, number) => boolean
): any {
  const numberOfIndividuals = population.length;

  const individualA =
    population[Math.floor(Math.random() * numberOfIndividuals)];
  const individualB =
    population[Math.floor(Math.random() * numberOfIndividuals)];
  const individualC =
    population[Math.floor(Math.random() * numberOfIndividuals)];

  const best = fitnessComparator(individualA.fitness, individualB.fitness)
    ? individualA
    : individualB;
  return fitnessComparator(best.fitness, individualC.fitness)
    ? best.entity
    : individualC.entity;
}

export default tournament3;

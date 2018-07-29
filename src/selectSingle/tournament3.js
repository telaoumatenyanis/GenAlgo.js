/**
 * Compare three individuals and return the best one
 * @param  {[{entity:*, fitness:number}]} population  population of the iteration
 * @param  {function} fitnessComparator               function used to compare the individuals
 * @return {*}                                        the best of the three inviduals
 */
function tournament3(
  population: [{ entity: any, fitness: number }],
  fitnessComparator: (number, number) => boolean
) {
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
  return fitnessComparator(best.fitness, c.fitness)
    ? best.entity
    : individualC.entity;
}

export default tournament3;

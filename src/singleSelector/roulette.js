function roulette(population: Array<{ entity: any, fitness: number }>): any {
  const totalFitness = population.reduce(
    (sum, individual) => sum + individual.fitness,
    0
  );
  let roll = Math.random() * totalFitness;

  for (let i = 0; i < population.length; i++) {
    if (roll <= population[i].fitness) {
      return population[i].entity;
    }
    roll -= population[i].fitness;
  }
}

export default roulette;

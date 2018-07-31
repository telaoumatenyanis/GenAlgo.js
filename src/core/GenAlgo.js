// @flow
import isNil from "lodash/fp/isNil";
import cloneDeep from "lodash/fp/cloneDeep";
import orderBy from "lodash/fp/orderBy";
import map from "lodash/fp/map";
import fittest from "../singleSelector/fittest.js";
import tournament3 from "../pairSelector/tournament3.js";
import greater from "../fitnessComparator/greater.js";
import Promise from "bluebird";

type Parameters = {
  seed: any[],
  fitnessEvaluator: any => number,
  fitnessComparator: (number, number) => boolean,
  iterationCallback: ({
    iterationNumber: number,
    elapsedTime: number,
    bestFitness: number
  }) => boolean,
  mutationFunction: any => any,
  crossoverFunction: (any, any) => [any, any],
  selectSingleFunction: (
    Array<{ entity: any, fitness: number }>,
    (number, number) => boolean
  ) => any,
  selectPairFunction: (
    Array<{ entity: any, fitness: number }>,
    (number, number) => boolean
  ) => [any, any],
  iterationNumber: number,
  mutationProbability: number,
  crossoverProbability: number,
  spareFittest: boolean
};

class GenAlgo {
  seed: any[];
  populationSize: number;
  fitnessEvaluator: any => number;
  fitnessComparator: (number, number) => boolean;
  iterationCallback: ({
    iterationNumber: number,
    elapsedTime: number,
    bestFitness: number
  }) => boolean;
  mutationFunction: any => any;
  crossoverFunction: (any, any) => [any, any];
  selectSingleFunction: (
    Array<{ entity: any, fitness: number }>,
    (number, number) => boolean
  ) => any;
  selectPairFunction: (
    Array<{ entity: any, fitness: number }>,
    (number, number) => boolean
  ) => [any, any];
  iterationNumber: number;
  mutationProbability: number;
  crossoverProbability: number;
  spareFittest: boolean;
  individuals: any[];

  constructor({
    iterationNumber = 1000,
    mutationProbability = 0.7,
    crossoverProbability = 0.2,
    spareFittest = true,
    fitnessEvaluator,
    fitnessComparator = greater,
    seed,
    iterationCallback,
    mutationFunction,
    crossoverFunction,
    selectSingleFunction = fittest,
    selectPairFunction = tournament3
  }: Parameters) {
    this.iterationNumber = iterationNumber;
    this.mutationProbability = mutationProbability;
    this.crossoverProbability = crossoverProbability;
    this.spareFittest = spareFittest;
    this.fitnessEvaluator = fitnessEvaluator;
    this.fitnessComparator = fitnessComparator;
    this.seed = seed;
    this.iterationCallback = iterationCallback;
    this.mutationFunction = mutationFunction;
    this.crossoverFunction = crossoverFunction;
    this.selectSingleFunction = selectSingleFunction;
    this.selectPairFunction = selectPairFunction;

    this.individuals = [];
  }

  /**
   * Set the number of iteration to do
   * @param iterationNumber the number of iteration to do
   */
  setIterationNumber(iterationNumber: number): void {
    this.iterationNumber = iterationNumber;
  }

  /**
   * Set the probability for an individual to mutate
   * @param mutationProbability the probability to mutate
   */
  setMutationProbability(mutationProbability: number): void {
    this.mutationProbability = mutationProbability;
  }

  /**
   * Set the probabiltiy for two individual to have children
   * @param crossoverProbability the probability to have children
   */
  setCrossoverProbability(crossoverProbability: number): void {
    this.crossoverProbability = crossoverProbability;
  }

  /**
   * Set whether the fittest individual should always be spared or not
   * @param spareFittest true if spared, false otherwise
   */
  setSpareFittest(spareFittest: boolean): void {
    this.spareFittest = spareFittest;
  }

  /**
   * Set the list of individuals
   * @param seed list of individuals
   */
  setSeed(seed: any[]): void {
    this.seed = seed;
    this.populationSize = this.seed.length;
  }

  /**
   * Set the fitness evaluator used to compute the fitness of an individual
   * @param fitnessEvaluator the function used as a fitnessEvaluator, should take an individual and return a fitness
   */
  setFitnessEvaluator(fitnessEvaluator: any => number): void {
    this.fitnessEvaluator = fitnessEvaluator;
  }

  /**
   * Set the fitness comparator used to compare to fitness
   * @param  fitnessComparator the function used as a fitnessComparator, should take two numbers and return a boolean
   */
  setFitnessComparator(fitnessComparator: (number, number) => boolean): void {
    this.fitnessComparator = fitnessComparator;
  }

  /**
   * Set the function called at the end of an iteration
   * @param iterationCallback function that takes the best fitness and the time spended for the current iteration and return whether it should keep going or not
   */
  setIterationCallback(
    iterationCallback: ({
      iterationNumber: number,
      elapsedTime: number,
      bestFitness: number
    }) => boolean
  ): void {
    this.iterationCallback = iterationCallback;
  }

  /**
   * Set the function called to mutate an individual
   * @param  mutationFunction function that takes an individual as parameter and returned its mutated version.
   */
  setMutationFunction(mutationFunction: any => any): void {
    this.mutationFunction = mutationFunction;
  }

  /**
   * Set the function called when crossing two individual
   * @param crossoverFunction function that takes two individuals as parameters and return the two children of the crossover
   */

  setCrossoverFunction(crossoverFunction: (any, any) => [any, any]): void {
    this.crossoverFunction = crossoverFunction;
  }

  /**
   * Set the function called to select a single individual
   * @param  selectSingleFunction function that takes a population and a fitness evaluator and return a single individual
   */
  setSelectSingleFunction(
    selectSingleFunction: (
      Array<{ entity: any, fitness: number }>,
      (number, number) => boolean
    ) => any
  ): void {
    this.selectSingleFunction = selectSingleFunction;
  }

  /**
   * Set the function called to select a pair of individuals
   * @param selectSingleFunction function that takes a population and a fitness evaluator and return a pair of individuals
   */
  setSelectPairFunction(
    selectPairFunction: (
      Array<{ entity: any, fitness: number }>,
      (number, number) => boolean
    ) => [any, any]
  ): void {
    this.selectPairFunction = selectPairFunction;
  }

  getIndividuals(): Array<any> {
    return this.individuals;
  }

  /**
   * Check that required parameters are set.
   */
  _checkParameters(): void {
    if (isNil(this.seed)) {
      throw new Error("Seed can't be null");
    }

    if (isNil(this.fitnessEvaluator)) {
      throw new Error("Fitness evaluator can't be null");
    }

    if (isNil(this.iterationCallback)) {
      throw new Error("Iteration callback can't be null");
    }

    if (isNil(this.mutationFunction)) {
      throw new Error("Mutation function can't be null");
    }
    if (isNil(this.selectSingleFunction)) {
      throw new Error("Select single can't be null");
    }

    if (!isNil(this.crossoverFunction) && isNil(this.selectPairFunction)) {
      throw new Error(
        "Select pair function can't be null when crossover function is set"
      );
    }
    if (isNil(this.crossoverFunction) && !isNil(this.selectPairFunction)) {
      throw new Error(
        "Crossover function can't be null when select pair function is set"
      );
    }
  }

  _cloneAndSortIndividuals(
    individuals: any[]
  ): Array<{ entity: any, fitness: number }> {
    return map(
      individual => ({
        entity: cloneDeep(individual),
        fitness: this.fitnessEvaluator(individual)
      }),
      individuals
    ).sort((individualA, individualB) => {
      if (this.fitnessComparator(individualA.fitness, individualB.fitness)) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  /**
   * Mutate individual depending on mutation probability
   * @param  individual the individual to mutate
   * @return            the mutated individual
   */
  _mutateIndividual(individual: any): any {
    return Math.random() <= this.mutationProbability &&
      !isNil(this.mutationFunction)
      ? this.mutationFunction(cloneDeep(individual))
      : individual;
  }

  _getElapsedTime(startTime: number): number {
    const now = new Date();
    return (now - startTime) / 1000;
  }

  /**
   * Start the genetic algorithm if the required parameters has been set
   */
  startSync(callback): void {
    this._checkParameters();

    this.individuals = map(individual => cloneDeep(individual), this.seed);

    let population = this._cloneAndSortIndividuals(this.individuals);

    const startTime = new Date();

    let iterationNumber = 0;

    while (
      this.iterationCallback({
        iterationNumber,
        bestFitness: population[0].fitness,
        elapsedTime: this._getElapsedTime(startTime)
      }) &&
      iterationNumber < this.iterationNumber
    ) {
      this.selectSingleFunction.args = {};

      population = this._cloneAndSortIndividuals(this.individuals);

      const newPopulation = [];

      if (this.spareFittest) {
        newPopulation.push(population[0].entity);
      }

      while (newPopulation.length < this.populationSize) {
        if (
          !isNil(this.crossoverFunction) && // if crossoverFunction exists
          newPopulation.length + 1 < this.populationSize && // population can't exceed initial size
          Math.random() <= this.crossoverProbability // crossover happens
        ) {
          const parents = this.selectPairFunction(
            population,
            this.fitnessComparator
          );

          const children = map(
            child => this._mutateIndividual(child),
            this.crossoverFunction(cloneDeep(parents[0]), cloneDeep(parents[1]))
          );

          newPopulation.push(children[0], children[1]);
        } else {
          newPopulation.push(
            this._mutateIndividual(
              this.selectSingleFunction(population, this.fitnessComparator)
            )
          );
        }
      }

      this.individuals = newPopulation;

      iterationNumber++;
    }
    return !isNil(callback)
      ? callback(undefined, this.individuals[0])
      : this.individuals[0];
  }

  start = Promise.promisify(this.startSync);
}

export default GenAlgo;

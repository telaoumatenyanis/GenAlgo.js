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
    bestIndividual: { entity: any, fitness: number }
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
  spareFittest: boolean,
  resultSize: number
};

class GenAlgo {
  seed: any[];
  populationSize: number;
  fitnessEvaluator: any => number;
  fitnessComparator: (number, number) => boolean;
  iterationCallback: ({
    iterationNumber: number,
    elapsedTime: number,
    bestIndividual: { entity: any, fitness: number }
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
  resultSize: number;

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
    selectPairFunction = tournament3,
    resultSize
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
    this.resultSize = resultSize;
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
   * @param iterationCallback function that takes the best individual, the time spent and the iteration number for the current iteration and return whether it should keep going or not
   */
  setIterationCallback(
    iterationCallback: ({
      iterationNumber: number,
      elapsedTime: number,
      bestIndividual: { entity: any, fitness: number }
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

  /**
   * Set the number of individual to return at the end of the algorithm
   * @param resultSize the number of individuals to return
   */
  setResultSize(resultSize: number) {
    this.resultSize = resultSize;
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
  async start(callback: (any, any) => void): any {
    this._checkParameters();

    /**
     * Store the current individuals
     */
    this.individuals = map(individual => cloneDeep(individual), this.seed);

    /**
     * Create the first population
     */
    let population = this._cloneAndSortIndividuals(this.individuals);

    /**
     * Used to calculate elapsed time
     */
    const startTime = new Date();

    // Used to return iteration number
    let iterationNumber = 0;

    while (
      // Call the iteration callback, stop if it returns false
      this.iterationCallback({
        iterationNumber: iterationNumber,
        bestIndividual: population[0],
        elapsedTime: this._getElapsedTime(startTime)
      }) &&
      // Stop when all the iterations are done
      iterationNumber < this.iterationNumber
    ) {
      /**
       * Very important !
       * As GenAlgo is not using webworkers, this puts the next iteration
       * at the end of the call stack, allowing a web page to render without being
       * blocked by the running GenAlgo .
       */
      await Promise.delay(0);

      /**
       * Reset the args of the selectSingleFunction, this allows creation of
       * additional selector without having to add code in the core.
       */
      this.selectSingleFunction.args = {};

      /**
       * New population will be generated using mutations and possibly crossovers
       */
      const newPopulation = [];

      // Spare the fittest individual if spareFittest is set to true
      if (this.spareFittest) {
        newPopulation.push(population[0].entity);
      }

      // While the new population is not fully created, mutate and crossover

      while (newPopulation.length < this.populationSize) {
        // Check if it is possible to crossover (the algorithm is genetic)
        if (
          !isNil(this.crossoverFunction) &&
          newPopulation.length + 1 < this.populationSize &&
          Math.random() <= this.crossoverProbability
        ) {
          /**
           * Select two parents using the select pair function
           */
          const parents = this.selectPairFunction(
            population,
            this.fitnessComparator
          );

          /**
           * Children are generated using crossover and possibly mutated
           */
          const children = map(
            child => this._mutateIndividual(child),
            this.crossoverFunction(cloneDeep(parents[0]), cloneDeep(parents[1]))
          );

          // Add the children to the new population
          newPopulation.push(children[0], children[1]);
          // Otherwise the algorithm is evolutionary
        } else {
          // Select an individual using the select single function and possibly mutate it
          newPopulation.push(
            this._mutateIndividual(
              this.selectSingleFunction(population, this.fitnessComparator)
            )
          );
        }
      }

      /**
       * New indivuals are stored
       */
      this.individuals = newPopulation;

      /**
       * Population is cloned and sorted according to the new fitnesses
       */
      population = this._cloneAndSortIndividuals(this.individuals);

      // Increment iteration number
      iterationNumber++;
    }

    const populationToReturn = !isNil(this.resultSize)
      ? population.slice(0, this.resultSize)
      : population;

    return !isNil(callback)
      ? callback(undefined, populationToReturn)
      : populationToReturn;
  }
}

export default GenAlgo;

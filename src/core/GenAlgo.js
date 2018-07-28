// @flow
import isNil from "lodash/fp/isNil";
import cloneDeep from "lodash/fp/cloneDeep";
import orderBy from "lodash/fp/orderBy";
import map from "lodash/fp/map";

import greater from "../fitnessComparator/greater.js";

type Props = {
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
  iterationCallback: (number, number) => boolean;
  mutationFunction: any => any;
  crossoverFunction: (any, any) => [any, any];
  selectSingleFunction: (
    [{ entity: any, fitness: number }],
    (number, number) => boolean
  ) => any;
  selectPairFunction: (
    [{ entity: any, fitness: number }],
    (number, number) => boolean
  ) => [any, any];
  iterationNumber: number;
  mutationProbability: number;
  crossoverProbability: number;
  spareFittest: boolean;
  individuals: any[];

  constructor({
    iterationNumber = 1000,
    mutationProbability = 0.2,
    crossoverProbability = 0.8,
    spareFittest = true
  }) {
    this.iterationNumber = iterationNumber;
    this.mutationProbability = mutationProbability;
    this.crossoverProbability = crossoverProbability;
    this.spareFittest = spareFittest;
    this.individuals = [];
  }

  /**
   * Set the list of individuals
   * @param {[*]} seed list of individuals
   */
  setSeed(seed: any[]) {
    this.seed = seed;
    this.populationSize = this.seed.length;
  }

  /**
   * Set the fitness evaluator used to compute the fitness of an individual
   * @param {function} fitnessEvaluator the function used as a fitnessEvaluator, should take an individual and return a fitness
   */
  setFitnessEvaluator(fitnessEvaluator: any => number) {
    this.fitnessEvaluator = fitnessEvaluator;
  }

  /**
   * Set the fitness comparator used to compare to fitness
   * @param {function} fitnessComparator the function used as a fitnessComparator, should take two numbers and return a boolean
   */
  setFitnessComparator(
    fitnessComparator: (number, number) => boolean = greater
  ) {
    this.fitnessComparator = fitnessComparator;
  }

  /**
   * Set the function called at the end of an iteration
   * @param {function} iterationCallback function that takes the best fitness and the time spended for the current iteration and return whether it should keep going or not
   */
  setIterationCallback(iterationCallback: (number, number) => boolean) {
    this.iterationCallback = iterationCallback;
  }

  /**
   * Set the function called to mutate an individual
   * @param {function} mutationFunction function that takes an individual as parameter and returned its mutated version.
   */
  setMutationFunction(mutationFunction: any => any) {
    this.mutationFunction = mutationFunction;
  }

  /**
   * Set the function called when crossing two individual
   * @param {function} crossoverFunction function that takes two individuals as parameters and return the two children of the crossover
   */

  setCrossoverFunction(crossoverFunction: (any, any) => [any, any]) {
    this.crossoverFunction = crossoverFunction;
  }

  /**
   * Set the function called to select a single individual
   * @param {function} selectSingleFunction function that takes a population and a fitness evaluator and return a single individual
   */
  setSelectSingleFunction(
    selectSingleFunction: (
      [{ entity: any, fitness: number }],
      (number, number) => boolean
    ) => any
  ) {
    this.selectSingleFunction = selectSingleFunction;
  }

  /**
   * Set the function called to select a pair of individuals
   * @param {function} selectSingleFunction function that takes a population and a fitness evaluator and return a pair of individuals
   */
  setSelectPairFunction(
    selectPairFunction: (
      [{ entity: any, fitness: number }],
      (number, number) => boolean
    ) => [any, any]
  ) {
    this.selectPairFunction = selectPairFunction;
  }

  /**
   * Check that required parameters are set.
   */
  _checkParameters() {
    if (isNil(this.seed)) {
      throw new Error("Seed can't be null");
    }

    if (isNil(this.fitnessEvaluator)) {
      throw new Error("Fitness evaluator can't be null");
    }

    if (isNil(this.iterationCallback)) {
      throw new Error("Iteration callback can't be null");
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
    if (!isNil(this.mutationFunction) && isNil(this.selectSingleFunction)) {
      throw new Error(
        "Select single function can't be null when mutation function is set"
      );
    }
    if (isNil(this.mutationFunction) && !isNil(this.selectSingleFunction)) {
      throw new Error(
        "Mutation function can't be null when select single function is set"
      );
    }
  }

  _cloneAndSortIndividuals(individuals: any[]) {
    return orderBy(
      "fitness",
      "desc",
      map(
        individual => ({
          entity: cloneDeep(individual),
          fitness: this.fitnessEvaluator(individual)
        }),
        individuals
      )
    );
  }

  /**
   * Mutate individual depending on mutation probability
   * @param  {*} individual the individual to mutate
   * @return {*}            the mutated individual
   */
  _mutateIndividual(individual: any) {
    return Math.random() <= this.mutationProbability &&
      !isNil(this.mutationFunction)
      ? this.mutationFunction(cloneDeep(individual))
      : individual;
  }

  /**
   * Start the genetic algorithm if the required parameters has been set
   */
  start() {
    this._checkParameters();

    this.individuals = map(individual => cloneDeep(individual), this.seed);

    while (this.iterationCallback()) {
      if (!isNil(this.selectSingleFunction.index)) {
        this.selectSingleFunction.index = 0;
      }

      const population = this._cloneAndSortIndividuals(this.individuals);

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
    }
  }
}

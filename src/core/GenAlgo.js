// @flow
import isNil from "lodash/fp/isNil";
import greater from "../fitnessComparator/greater.js";

type Props = {
  iterationNumber: number,
  mutationProbability: number,
  crossoverProbability: number,
  spareFittest: boolean
};

class GenAlgo {
  seed: any[];
  fitnessEvaluator: any => number;
  fitnessComparator: (number, number) => boolean;
  iterationCallback: (number, number) => boolean;
  mutateFunction: any => any;
  iterationNumber: number;
  mutationProbability: number;
  crossoverProbability: number;
  spareFittest: boolean;
  fittestIndividual: any;

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
  }

  /**
   * Set the list of individuals
   * @param {[*]} seed list of individuals
   */
  setSeed(seed: any[]) {
    this.seed = seed;
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
   * @param {function} mutateFunction function that takes an individual as parameter and returned its mutated version.
   */
  setMutateFunction(mutateFunction: any => void) {
    this.mutateFunction = mutateFunction;
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
  }

  /**
   * Start the genetic algorithm if the required parameters has been set
   */
  start() {
    this._checkParameters();

    while (this.iterationCallback()) {}
  }
}

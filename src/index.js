// @flow
import isNil from "lodash/fp/isNil";
import greater from "./fitnessComparator/greater";

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
  iterationNumber: number;
  mutationProbability: number;
  crossoverProbability: number;
  spareFittest: boolean;

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
   * @param {function} fitnessEvaluator the function used as a fitnessEvaluator
   */
  setFitnessEvaluator(fitnessEvaluator: any => number) {
    this.fitnessEvaluator = fitnessEvaluator;
  }

  /**
   * Set the fitness comparator used to compare to fitness
   * @param {function} fitnessComparator the function used as a fitnessComparator
   */
  setFitnessComparator(
    fitnessComparator: (number, number) => boolean = greater
  ) {
    this.fitnessComparator = fitnessComparator;
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
  }

  /**
   * Start the genetic algorithm if the required parameters has been set
   */
  start() {
    this._checkParameters();
  }
}

// @flow
import isNil from "lodash/fp/isNil";

class GenAlgo {
  seed: any[];
  fitnessEvaluator: any => number;

  constructor() {}

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

  start() {
    if (isNil(this.seed)) {
      throw new Error("Seed can't be null");
    }

    if (isNil(this.fitnessEvaluator)) {
      throw new Error("Fitness evaluator can't be null");
    }
  }
}

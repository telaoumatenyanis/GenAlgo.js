// @flow
import isNil from "lodash/fp/isNil";

type Props = {
  iterationNumber: number,
  mutationProbability: number,
  crossoverProbability: number,
  spareFittest: boolean
};

class GenAlgo {
  seed: any[];
  fitnessEvaluator: any => number;
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
   * Start the genetic algorithm if the required parameters has been set
   */
  start() {
    if (isNil(this.seed)) {
      throw new Error("Seed can't be null");
    }

    if (isNil(this.fitnessEvaluator)) {
      throw new Error("Fitness evaluator can't be null");
    }
  }
}

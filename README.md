# GenAlgo.js

![logo](./public/templogo.png)

Genetic and evolutionary algorithms in Javascript made simple !

## Motivation

This package was written in order to provide a JS genetic algorithm boilerplate. Older libraries were not maintained, had flaws in their documentation or implementation.

This library is inspired by :

- My work at [Sterblue](https://www.sterblue.com/)
- _Tobias Blickle and Lothar Thiele_, **A Comparison of Selection Schemes used in Genetic Algorithms**
- [Sub Protocol Genetic.js](https://github.com/subprotocol/genetic-js)

## Installation

Coming soon

## Examples

Website with examples in progress (polynomial extrema, bin packing, maybe travelling salesman)

## Usage

### Creation of a GenAlgo object

```
const algo = new GenAlgo({})
```

#### Parameters

All of the following parameters can be set during the GenAlgo object creation, or using the corresponding setter.

By not providing a crossover function, you are creating an evolutionary algorithm.

Crossover function and pair selection function are linked must both be set in order to create a genetic algorithm.

| Parameter            |                                      Type                                      |   Default   | Required | Description                                                                                                                                        |
| -------------------- | :----------------------------------------------------------------------------: | :---------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| crossoverFunction    |              (Individual, Individual) => [Individual, Individual]              |  undefined  |          | function used when crossover of two Individuals occurs                                                                                             |
| crossoverProbability |                                     number                                     |     0.8     |          | probability of crossover                                                                                                                           |
| fitnessComparator    |                          (number, number) => boolean                           |   Greater   |          | function used to compare two fitness and return whether the first is better or not                                                                 |
| fitnessEvaluator     |                             (Individual) => number                             |  undefined  |    X     | function used to evaluate fitness of an Individual                                                                                                 |
| iterationCallback    | ({iterationNumber:number, elapsedTime:number, bestFitness: number}) => boolean |  undefined  |    X     | function called after each iteration giving some information to the main program. Should return false if the algorithm has to stop, true otherwise |
| iterationNumber      |                                     number                                     |    1000     |          | number of iterations to do                                                                                                                         |
| mutationFunction     |                           (Individual) => Individual                           |  undefined  |    X     | function used when mutation of an Individual occurs                                                                                                |
| mutationProbability  |                                     number                                     |     0.8     |          | probability of mutation                                                                                                                            |
| selectPairFunction   |    Array<{entity:Individual, fitness:number}\>, (number, number) => boolean    | tournament3 |          | function taking the population and a fitnessComparator as parameters, returning a pair of individual                                               |
| selectSingleFunction |    Array<{entity:Individual, fitness:number}\>, (number, number) => boolean    |   fittest   |    X     | function taking the population and a fitnessComparator as parameters, returning a single individual                                                |
| spareFittest         |                                    boolean                                     |    true     |          | spare the fittest indivual during each iteration or not                                                                                            |
| seed                 |                               Array<Individual\>                               |  undefined  |    X     | first population of the algorithm                                                                                                                  |

#### Selection Function

GenAlgo provides a set of selection function that can be used by setting them to the corresponding attribute of the GenAlgo object.

##### Single Selectors

Select a single individual.

| Selector         | Description                                          |
| ---------------- | ---------------------------------------------------- |
| fittest          | select the fittest individual                        |
| random           | select a random individual                           |
| randomLinearRank | select a random individual based on a linear ranking |
| sequential       | select the individual in the order of the array      |
| tournament2      | select the best individual between two               |
| tournament3      | select the best individual between two               |

##### Pair Selectors

Select a pair of individuals.

| Selector         | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| fittestRandom    | select a pair composed of the fittest and a random individual |
| random           | select a pair of random individuals                           |
| randomLinearRank | select a pair of random individuals based on a linear ranking |
| sequential       | select a pair of individuals in the order of the array        |
| tournament2      | select the best two individuals of two tournament2            |
| tournament3      | select the best two individuals of two tournament3            |

#### Fitness Comparators

GenAlgo allows you to maximize or minimize the fitness by setting the comparator to the corresponding attribute

| Comparator | Description          |
| ---------- | -------------------- |
| greater    | maximize the fitness |
| lesser     | minimize the fitness |

## Polynomial extremum example

```
import GenAlgo from "../../src/core/GenAlgo.js";
import lesser from "../../src/fitnessComparator/lesser.js";
import tournament3 from "../../src/singleSelector/tournament3.js";
import tournament3Pair from "../../src/pairSelector/tournament3.js";
import rangeStep from "lodash/fp/rangeStep";


function tryToFindPolynomialExtremum(func: number => number, min: boolean) {

  // Create a GenAlgo object with simple parameters
  const algo = new GenAlgo({
    mutationProbability: 0.2,
    crossoverProbability: 0.8,
    iterationNumber: 100
  });

  // Function used to mutate an individual
  const mutation = number => {
    return number + Math.random();
  };

  // Function used to crossover two individuals
  const crossover = (number1, number2) => {
    return [(number1 + number2) / 2, number1 + number2];
  };

  // Will be called at each iteration
  const iterationCallback = ({ bestFitness, elapsedTime, iterationNumber }) => {
    console.log("Iteration " + iterationNumber);
    console.log("Best fitness : " + bestFitness);
    console.log("Elapsed time : " + elapsedTime);
    return true;
  };

  // Seed generation
  const seed = rangeStep(10, -10000, 10000);

  algo.setSeed(seed);

  algo.setFitnessEvaluator(func);

  if (min) {
    algo.setFitnessComparator(lesser);
  }

  algo.setMutationFunction(mutation);

  algo.setCrossoverFunction(crossover);

  algo.setSelectSingleFunction(tournament3);

  algo.setSelectPairFunction(tournament3Pair);

  algo.setIterationCallback(iterationCallback);

  algo.start();
}
```

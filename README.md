# GenAlgo.js

Genetic algorithm implementation in Javascript.

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
const functionExtremum = new GenAlgo({})
```

#### Parameters

All of the following parameters can be set during the GenAlgo object creation, or using the corresponding setter.

| Parameter            |                                      Type                                      |   Default   | Description                                                                                                                                        |
| -------------------- | :----------------------------------------------------------------------------: | :---------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| crossoverFunction    |              (Individual, Individual) => [Individual, Individual]              |  undefined  | function used when crossover of two Individuals occurs                                                                                             |
| crossoverProbability |                                     number                                     |     0.8     | probability of crossover                                                                                                                           |
| fitnessComparator    |                          (number, number) => boolean                           |   Greater   | function used to compare two fitness and return whether the first is better or not                                                                 |
| fitnessEvaluator     |                             (Individual) => number                             |  undefined  | function used to evaluate fitness of an Individual                                                                                                 |
| iterationCallback    | ({iterationNumber:number, elapsedTime:number, bestFitness: number}) => boolean |    null     | function called after each iteration giving some information to the main program. Should return false if the algorithm has to stop, true otherwise |
| iterationNumber      |                                     number                                     |    1000     | number of iterations to do                                                                                                                         |
| mutationFunction     |                           (Individual) => Individual                           |  undefined  | function used when mutation of an Individual occurs                                                                                                |
| mutationProbability  |                                     number                                     |     0.8     | probability of mutation                                                                                                                            |
| selectPairFunction   |    Array<{entity:Individual, fitness:number}\>, (number, number) => boolean    | tournament3 | function taking the population and a fitnessComparator as parameters, returning a pair of individual                                               |
| selectSingleFunction |    Array<{entity:Individual, fitness:number}\>, (number, number) => boolean    |   fittest   | function taking the population and a fitnessComparator as parameters, returning a single individual                                                |
| spareFittest         |                                    boolean                                     |    true     | spare the fittest indivual during each iteration or not                                                                                            |
| seed                 |                               Array<Individual\>                               |  undefined  | first population of the algorithm                                                                                                                  |

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

| Selector         | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| fittestRandom    | select the fittest individual                                 |
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

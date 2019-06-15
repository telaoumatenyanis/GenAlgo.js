import React, { Component } from "react";
import {
  GenAlgo,
  fittestSingle,
  randomSingle,
  randomLinearRankSingle,
  sequentialSingle,
  tournament2Single,
  tournament3Single,
  fittestRandomPair,
  randomPair,
  randomLinearRankPair,
  sequentialPair,
  tournament2Pair,
  tournament3Pair,
  lesser
} from "genalgo";
import { Parser } from "expr-eval";
import range from "lodash/fp/range";
import map from "lodash/fp/map";
import isNil from "lodash/fp/isNil";
import compact from "lodash/fp/compact";
import reduce from "lodash/fp/reduce";
import concat from "lodash/fp/concat";

import Parameters from "./parameters";
import ParametersProvider from "./parametersProvider";

const mapUncapped = map.convert({ cap: false });

class Knapsack extends Component {
  algo;

  constructor(props) {
    super(props);
    this.state = {
      bestFitness: "",
      elapsedTime: "",
      iterationNumber: "",
      isRunning: false,
      objects: [],
      result: null
    };
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginRight: 20 }}>
          <ParametersProvider>
            {({
              error,
              selectSingle,
              selectPair,
              comparator,
              maxIterationNumber,
              crossoverProbability,
              mutationProbability,
              spareFittest,
              populationSize,
              handleChangeSpareFittest,
              handleChangeCrossoverProbability,
              handleChangeMutationProbability,
              handleSelectSingle,
              handleSelectPair,
              handleSelectComparator,
              handleChangeIterationNumber,
              handleChangePopulationSize,
              handleError
            }) => (
              <React.Fragment>
                <div style={{ color: "red" }}>{error}</div>
                <Parameters
                  error={error}
                  selectSingle={selectSingle}
                  selectPair={selectPair}
                  comparator={comparator}
                  maxIterationNumber={maxIterationNumber}
                  crossoverProbability={crossoverProbability}
                  mutationProbability={mutationProbability}
                  spareFittest={spareFittest}
                  populationSize={populationSize}
                  handleChangeSpareFittest={handleChangeSpareFittest}
                  handleChangeCrossoverProbability={
                    handleChangeCrossoverProbability
                  }
                  handleChangeMutationProbability={
                    handleChangeMutationProbability
                  }
                  handleSelectSingle={handleSelectSingle}
                  handleSelectPair={handleSelectPair}
                  handleSelectComparator={handleSelectComparator}
                  handleChangeIterationNumber={handleChangeIterationNumber}
                  handleChangePopulationSize={handleChangePopulationSize}
                />
                <button
                  disabled={this.state.isRunning}
                  onClick={async () => {
                    try {
                      const algo = new GenAlgo({
                        mutationProbability: mutationProbability,
                        crossoverProbability: crossoverProbability,
                        iterationNumber: maxIterationNumber
                      });

                      const generateObjects = (
                        size,
                        minWeight,
                        maxWeight,
                        minValue,
                        maxValue
                      ) => {
                        return map(
                          value => ({
                            weight:
                              Math.floor(
                                Math.random() * (maxWeight - minWeight + 1)
                              ) + minWeight,
                            value:
                              Math.floor(
                                Math.random() * (maxValue - minValue + 1)
                              ) + minValue
                          }),
                          range(0, size)
                        );
                      };
                      const objects = generateObjects(10, 1, 15, 1, 15);

                      this.setState({ objects, result: null });

                      const weightLimit = 15;

                      // Function used to mutate an individual
                      const mutation = array => {
                        const changeIndex = Math.floor(
                          Math.random() * array.length
                        );
                        array[changeIndex] = !array[changeIndex];
                        return array;
                      };

                      // Function used to crossover two individuals
                      const crossover = (a, b) => {
                        const cutIndex = Math.floor(a.length / 2);
                        const newA = concat(
                          a.slice(0, cutIndex),
                          b.slice(cutIndex)
                        );
                        const newB = concat(
                          b.slice(0, cutIndex),
                          a.slice(cutIndex)
                        );
                        return [newA, newB];
                      };

                      const fitnessEvaluator = array => {
                        let valueSum = 0;
                        let weightSum = 0;
                        // Sum of the values
                        for (let index = 0; index < array.length; index++) {
                          if (array[index] === true) {
                            valueSum += objects[index].value;
                            weightSum += objects[index].weight;
                          }
                        }

                        // Penalty depending on whether the weightLimit is exceeded or not
                        if (weightSum > weightLimit) {
                          return valueSum - 7 * (weightSum - weightLimit);
                        }
                        return valueSum;
                      };

                      const generateSeed = size => {
                        return map(value => {
                          const individual = [];
                          for (let obj in objects) {
                            individual.push(Math.random() > 0.5);
                          }
                          return individual;
                        }, range(0, size));
                      };

                      // Seed generation
                      const seed = generateSeed(populationSize);

                      // Will be called at each iteration
                      const iterationCallback = ({
                        bestIndividual,
                        elapsedTime,
                        iterationNumber
                      }) => {
                        this.setState({
                          bestFitness: bestIndividual.fitness,
                          elapsedTime,
                          iterationNumber
                        });

                        return true;
                      };

                      algo.setSpareFittest(spareFittest);

                      algo.setSeed(seed);

                      algo.setFitnessEvaluator(fitnessEvaluator);

                      if (comparator === "min") {
                        algo.setFitnessComparator(lesser);
                      }

                      algo.setMutationFunction(mutation);

                      algo.setCrossoverFunction(crossover);

                      switch (selectSingle) {
                        case "fittest":
                          algo.setSelectSingleFunction(fittestSingle);
                          break;
                        case "random":
                          algo.setSelectSingleFunction(randomSingle);
                          break;
                        case "randomLinearRank":
                          algo.setSelectSingleFunction(randomLinearRankSingle);
                          break;
                        case "sequential":
                          algo.setSelectSingleFunction(sequentialSingle);
                          break;
                        case "tournament2":
                          algo.setSelectSingleFunction(tournament2Single);
                          break;
                        case "tournament3":
                          algo.setSelectSingleFunction(tournament3Single);
                          break;
                      }

                      switch (selectPair) {
                        case "fittestRandom":
                          algo.setSelectPairFunction(fittestRandomPair);
                          break;
                        case "random":
                          algo.setSelectPairFunction(randomPair);
                          break;
                        case "randomLinearRank":
                          algo.setSelectPairFunction(randomLinearRankPair);
                          break;
                        case "sequential":
                          algo.setSelectPairFunction(sequentialPair);
                          break;
                        case "tournament2":
                          algo.setSelectPairFunction(tournament2Pair);
                          break;
                        case "tournament3":
                          algo.setSelectPairFunction(tournament3Pair);
                          break;
                      }

                      algo.setIterationCallback(iterationCallback);

                      algo.setResultSize(1);

                      this.setState({ isRunning: true });

                      const result = await algo.start();

                      this.setState({
                        isRunning: false,
                        result: result[0].entity
                      });
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  Start
                </button>
              </React.Fragment>
            )}
          </ParametersProvider>

          <br />
          <span>Iteration Number : {this.state.iterationNumber}</span>
          <br />
          <span>Elapsed Time : {this.state.elapsedTime}</span>
          <br />
          <span>Best Fitness : {this.state.bestFitness}</span>
        </div>
        <div
          style={{
            flexGrow: 1,
            padding: 5,
            display: "flex",
            border: "1px solid black"
          }}
        >
          {mapUncapped(
            (object, index) => (
              <div
                key={index}
                style={{
                  width: 40,
                  height: 40,
                  border:
                    !isNil(this.state.result) && this.state.result[index]
                      ? "2px solid lightgreen"
                      : "1px solid red",
                  margin: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {object.weight}-{object.value}
              </div>
            ),
            this.state.objects
          )}
        </div>
      </div>
    );
  }
}

export default Knapsack;

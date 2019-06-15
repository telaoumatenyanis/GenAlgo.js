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
import rangeStep from "lodash/fp/rangeStep";
import map from "lodash/fp/map";
import Plot from "react-plotly.js";
import isNil from "lodash/fp/isNil";
import compact from "lodash/fp/compact";

import Parameters from "./parameters";
import ParametersProvider from "./parametersProvider";

class Polynomial extends Component {
  algo;

  constructor(props) {
    super(props);
    this.parser = new Parser();
    this.state = {
      function: "-x^2-30*x",
      bestFitness: "",
      elapsedTime: "",
      iterationNumber: "",
      isRunning: false,
      plot: null,
      visualize: false
    };
    this.handleChangeFunction = this.handleChangeFunction.bind(this);
  }

  handleChangeFunction(event, handleError) {
    this.setState({ function: event.target.value }, () => {
      try {
        const func = this.parser.parse(this.state.function).toJSFunction("x");
        handleError("");
        const x = rangeStep(0.05, -100, 100);
        this.setState({
          plot: this.getPlotComponent(func, x)
        });
      } catch (e) {
        handleError("Function is not valid");
      }
    });
  }

  getPlotComponent(func, x, point) {
    const y = map(value => func(value), x);

    const pointGraph = !isNil(point)
      ? {
          x: [point],
          y: [func(point)],
          mode: "markers",
          marker: { color: "red" }
        }
      : undefined;
    const data = compact([
      {
        x,
        y,
        mode: "lines",
        marker: { color: "blue" }
      },
      pointGraph
    ]);
    return <Plot data={data} />;
  }

  componentDidMount() {
    const func = this.parser.parse(this.state.function).toJSFunction("x");
    const x = rangeStep(1, -100, 100);
    this.setState({ plot: this.getPlotComponent(func, x) });
  }

  render() {
    return (
      <div>
        <div style={{ float: "right" }}>{this.state.plot}</div>
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
              <span> Function : </span>
              <input
                style={{ width: 400 }}
                type="text"
                value={this.state.function}
                onChange={event =>
                  this.handleChangeFunction(event, handleError)
                }
              />
              <br />
              <span>
                Visualize on graph (this will slow the iteration as graph is
                rerendered each time) :
                <input
                  name="Visualize"
                  type="checkbox"
                  checked={this.state.visualize}
                  onChange={event => {
                    this.setState({ visualize: event.target.checked });
                  }}
                />
              </span>
              <br />
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
                    const func = this.parser
                      .parse(this.state.function)
                      .toJSFunction("x");
                    handleError("");

                    const algo = new GenAlgo({
                      mutationProbability: mutationProbability,
                      crossoverProbability: crossoverProbability,
                      iterationNumber: maxIterationNumber
                    });

                    // Function used to mutate an individual
                    const mutation = number => {
                      return number + Math.random();
                    };

                    // Function used to crossover two individuals
                    const crossover = (number1, number2) => {
                      return [(number1 + number2) / 2, number1 + number2];
                    };

                    // Seed generation
                    const seed = rangeStep(
                      20000 / populationSize,
                      -10000,
                      10000
                    );

                    const plotSeed = rangeStep(0.05, -100, 100);

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
                      if (this.state.visualize) {
                        this.setState({
                          plot: this.getPlotComponent(
                            func,
                            plotSeed,
                            bestIndividual.entity
                          )
                        });
                      }
                      return true;
                    };

                    algo.setSeed(seed);

                    algo.setFitnessEvaluator(func);

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

                    algo.setSpareFittest(spareFittest);

                    algo.setIterationCallback(iterationCallback);

                    algo.setResultSize(10);

                    this.setState({ isRunning: true });

                    const result = await algo.start();

                    this.setState({
                      isRunning: false,
                      plot: this.getPlotComponent(
                        func,
                        plotSeed,
                        result[0].entity
                      )
                    });
                  } catch (e) {
                    console.error(e);
                    handleError("Function is not valid");
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
    );
  }
}

export default Polynomial;

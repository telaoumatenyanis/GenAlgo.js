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
  tournament3Pair
} from "genalgo";
import { Parser } from "expr-eval";
import rangeStep from "lodash/fp/rangeStep";
import map from "lodash/fp";

class GenAlgoComponent extends Component {
  algo;

  constructor(props) {
    super(props);
    this.parser = new Parser();
    this.state = {
      error: "",
      function: "-x^2-3*x",
      selectSingleFunction: "fittest",
      selectPairFunction: "fittestRandom",
      comparator: "max",
      bestFitness: "",
      elapsedTime: "",
      iterationNumber: "",
      isRunning: false,
      maxIterationNumber: 100
    };
    this.handleChangeFunction = this.handleChangeFunction.bind(this);
    this.handleSelectSingle = this.handleSelectSingle.bind(this);
    this.handleSelectPair = this.handleSelectPair.bind(this);
    this.handleSelectComparator = this.handleSelectComparator.bind(this);
    this.handleChangeIterationNumber = this.handleChangeIterationNumber.bind(
      this
    );
  }

  handleChangeFunction(event) {
    this.setState({ function: event.target.value });
  }

  handleSelectSingle(event) {
    this.setState({ selectSingleFunction: event.target.value });
  }

  handleSelectPair(event) {
    this.setState({ selectPairFunction: event.target.value });
  }

  handleSelectComparator(event) {
    this.setState({ comparator: event.target.value });
  }

  handleChangeIterationNumber(event) {
    try {
      if (event.target.value != "") {
        const number = parseInt(event.target.value);
        this.setState({ maxIterationNumber: number });
      } else {
        this.setState({ maxIterationNumber: 0 });
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        {this.state.error}
        <span> Function : </span>
        <input
          type="text"
          value={this.state.function}
          onChange={this.handleChangeFunction}
        />
        <br />
        <span> Select single : </span>
        <select
          value={this.state.selectSingleFunction}
          onChange={this.handleSelectSingle}
        >
          <option value="fittest">Fittest</option>
          <option value="random">Random</option>
          <option value="randomLinearRank">RandomLinearRank</option>
          <option value="sequential">Sequential</option>
          <option value="tournament2">Tournament2</option>
          <option value="tournament3">Tournament3</option>
        </select>
        <br />
        <span> Select pair : </span>
        <select
          value={this.state.selectPairFunction}
          onChange={this.handleSelectPair}
        >
          <option value="fittestRandom">FittestRandom</option>
          <option value="random">Random</option>
          <option value="randomLinearRank">RandomLinearRank</option>
          <option value="sequential">Sequential</option>
          <option value="tournament2">Tournament2</option>
          <option value="tournament3">Tournament3</option>
        </select>
        <br />
        <span> min/max : </span>
        <select
          value={this.state.comparator}
          onChange={this.handleSelectComparator}
        >
          <option value="min">Min</option>
          <option value="max">Max</option>
        </select>
        <br />
        <span>
          Number of iteration :
          <input
            style={{ marginLeft: 10, width: 50 }}
            type="text"
            value={this.state.maxIterationNumber}
            onChange={this.handleChangeIterationNumber}
          />
        </span>
        <br />
        <button
          disabled={this.state.isRunning}
          onClick={async () => {
            try {
              const func = this.parser
                .parse(this.state.function)
                .toJSFunction("x");
              this.setState({ error: "" });

              const algo = new GenAlgo({
                mutationProbability: 0.2,
                crossoverProbability: 0.8,
                iterationNumber: this.state.maxIterationNumber
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
              const iterationCallback = ({
                bestFitness,
                elapsedTime,
                iterationNumber
              }) => {
                console.log(bestFitness);
                this.setState({ bestFitness, elapsedTime, iterationNumber });
                return true;
              };

              // Seed generation
              const seed = rangeStep(10, -10000, 10000);

              algo.setSeed(seed);

              algo.setFitnessEvaluator(func);

              if (this.state.comparator === "min") {
                algo.setFitnessComparator(lesser);
              }

              algo.setMutationFunction(mutation);

              algo.setCrossoverFunction(crossover);

              switch (this.state.selectSingleFunction) {
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

              switch (this.state.selectPairFunction) {
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
              this.setState({ isRunning: true });
              await algo.start();
              this.setState({ isRunning: false });
            } catch (e) {
              console.error(e);
              this.setState({ error: "Function is not valid" });
            }
          }}
        >
          Start
        </button>
        <br />
        <span>Best Fitness : {this.state.bestFitness}</span>
      </div>
    );
  }
}

export default GenAlgoComponent;

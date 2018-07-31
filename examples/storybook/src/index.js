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
      iterationNumber: ""
    };
    this.handleChangeFunction = this.handleChangeFunction.bind(this);
    this.handleSelectSingle = this.handleSelectSingle.bind(this);
    this.handleSelectPair = this.handleSelectPair.bind(this);
    this.handleSelectComparator = this.handleSelectComparator.bind(this);
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
        <span> min/max : </span>
        <select
          value={this.state.comparator}
          onChange={this.handleSelectComparator}
        >
          <option value="min">Min</option>
          <option value="max">Max</option>
        </select>
        <br />
        <br />
        <span>Iteration number : {this.state.iterationNumber}</span>
        <br />
        <span>Elapsed time : {this.state.elapsedTime}</span>
        <br />
        <span>Best fitness : {this.state.bestFitness}</span>
        <br /> <br />
        <button
          onClick={() => {
            try {
              const func = this.parser
                .parse(this.state.function)
                .toJSFunction("x");
              this.setState({ error: "" });

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

              algo.start();
            } catch (e) {
              console.error(e);
              this.setState({ error: "Function is not valid" });
            }
          }}
        >
          Start
        </button>
      </div>
    );
  }
}

export default GenAlgoComponent;

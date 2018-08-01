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

class GenAlgoComponent extends Component {
  algo;

  constructor(props) {
    super(props);
    this.parser = new Parser();
    this.state = {
      error: "",
      function: "-x^2-30*x",
      selectSingleFunction: "fittest",
      selectPairFunction: "fittestRandom",
      comparator: "max",
      bestFitness: "",
      elapsedTime: "",
      iterationNumber: "",
      isRunning: false,
      maxIterationNumber: 100,
      plot: null,
      visualize: false
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
    this.setState({ function: event.target.value }, () => {
      try {
        const func = this.parser.parse(this.state.function).toJSFunction("x");
        this.setState({ error: "" });
        const x = rangeStep(0.05, -100, 100);
        this.setState({
          plot: this.getPlotComponent(func, x)
        });
      } catch (e) {
        this.setState({ error: "Function is not valid" });
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
        <div style={{ float: "right" }}>{this.state.plot}</div>
        <br />
        <span> Function : </span>
        <input
          style={{ width: 400 }}
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

              // Seed generation
              const seed = rangeStep(10, -10000, 10000);

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

              algo.setResultSize(10);

              this.setState({ isRunning: true });

              const result = await algo.start();

              this.setState({
                isRunning: false,
                plot: this.getPlotComponent(func, plotSeed, result[0].entity)
              });
            } catch (e) {
              console.error(e);
              this.setState({ error: "Function is not valid" });
            }
          }}
        >
          Start
        </button>
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

export default GenAlgoComponent;

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
import shuffle from "lodash/fp/shuffle";
import contains from "lodash/fp/contains";

import Parameters from "./parameters";
import ParametersProvider from "./parametersProvider";
import FitnessVisualizer from "./fitnessVisualizer";

class TSP extends Component {
  algo;
  problemCanvas;
  problemCtx;
  solutionCanvas;
  solutionCtx;
  problem;
  values = [];

  constructor(props) {
    super(props);
    this.state = {
      bestFitness: "",
      elapsedTime: "",
      iterationNumber: "",
      isRunning: false,
      visualize: false,
      result: null
    };
  }

  componentDidMount() {
    this.problemCanvas = document.getElementById("problem");
    this.problemCtx = this.problemCanvas.getContext("2d");
    this.solutionCanvas = document.getElementById("solution");
    this.solutionCtx = this.solutionCanvas.getContext("2d");
    this.problem = this.generateProblem();
    this.drawProblem();
  }

  drawProblem() {
    this.problemCtx.fillStyle = "#000";

    for (const city of this.problem) {
      this.problemCtx.beginPath();
      this.problemCtx.arc(city.x, city.y, 5, 0, 2 * Math.PI);
      this.problemCtx.stroke();
    }
  }

  clearCtx(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  drawIndividual(individual) {
    this.solutionCtx.fillStyle = "#000";

    this.solutionCtx.beginPath();
    for (const cityNumber of individual) {
      const city = this.problem[cityNumber];
      this.solutionCtx.lineTo(city.x, city.y);
    }
    this.solutionCtx.stroke();
  }

  generateProblem(cityNumber = 20) {
    const problem = [];

    for (let i = 0; i < cityNumber; i++) {
      problem.push({
        x: Math.floor(Math.random() * this.problemCanvas.offsetWidth),
        y: Math.floor(Math.random() * this.problemCanvas.offsetHeight)
      });
    }

    return problem;
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
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
              handleChangeCrossoverProbability,
              handleChangeMutationProbability,
              handleSelectSingle,
              handleSelectPair,
              handleSelectComparator,
              handleChangeIterationNumber,
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
                />
                <button
                  disabled={this.state.isRunning}
                  onClick={() => {
                    this.clearCtx(this.problemCanvas);
                    this.clearCtx(this.solutionCanvas);
                    this.values = [];
                    this.problem = this.generateProblem();
                    this.drawProblem();
                    this.forceUpdate();
                  }}
                >
                  Generate problem
                </button>
                <button
                  disabled={this.state.isRunning}
                  onClick={async () => {
                    try {
                      const algo = new GenAlgo({
                        mutationProbability: mutationProbability,
                        crossoverProbability: crossoverProbability,
                        iterationNumber: maxIterationNumber
                      });

                      // Function used to mutate an individual
                      const mutation = individual => {
                        const rand = () =>
                          Math.floor(Math.random() * individual.length);
                        const rand1 = rand();
                        let rand2 = rand();
                        while (rand1 == rand2) {
                          rand2 = rand();
                        }

                        const temp = individual[rand1];
                        individual[rand1] = individual[rand2];
                        individual[rand2] = temp;
                        return individual;
                      };

                      const OX = (start, end, firstParent, secondParent) => {
                        const child = Array(firstParent.length);
                        const sample = firstParent.slice(start, end);
                        for (let i = start; i < end; i++) {
                          child[i] = firstParent[i];
                        }

                        for (const secondChild of secondParent) {
                          if (!contains(secondChild, sample)) {
                            child[end % firstParent.length] = secondChild;
                            end++;
                          }
                        }
                        return child;
                      };

                      // Function used to crossover two individuals
                      const crossover = (a, b) => {
                        let start = Math.floor(Math.random() * a.length);
                        let end = Math.floor(Math.random() * a.length);

                        if (start > end) {
                          start = start + end;
                          end = start - end;
                          start = start - end;
                        }

                        return [OX(start, end, a, b), OX(start, end, b, a)];
                      };

                      const fitnessEvaluator = individual => {
                        let distance = 0;

                        for (let i = 1; i < individual.length; i++) {
                          const previousCity = this.problem[individual[i - 1]];
                          const currentCity = this.problem[individual[i]];

                          distance += Math.sqrt(
                            (currentCity.x - previousCity.x) ** 2 +
                              (currentCity.x - previousCity.y) ** 2
                          );
                        }

                        return distance;
                      };

                      const generateSeed = size => {
                        const inOrderPath = range(0, this.problem.length);
                        return map(
                          value => shuffle(inOrderPath),
                          range(0, size)
                        );
                      };

                      // Seed generation
                      const seed = generateSeed(10);

                      // Will be called at each iteration
                      const iterationCallback = ({
                        bestIndividual,
                        elapsedTime,
                        iterationNumber
                      }) => {
                        this.values.push(bestIndividual.fitness);
                        this.setState({
                          bestFitness: bestIndividual.fitness,
                          elapsedTime,
                          iterationNumber
                        });
                        this.clearCtx(this.solutionCanvas);
                        this.drawIndividual(bestIndividual.entity);

                        return true;
                      };

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

                      this.values = [];

                      algo.setSpareFittest(true);
                      const result = await algo.start();

                      this.setState({
                        isRunning: false,
                        result: result[0].entity
                      });
                      this.clearCtx(this.solutionCanvas);
                      this.drawIndividual(result[0].entity);
                    } catch (e) {
                      console.error(e);
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
              </React.Fragment>
            )}
          </ParametersProvider>
        </div>
        <br />
        <div style={{ width: "100%", position: "relative", height: 150 }}>
          <canvas style={{ position: "absolute" }} id="problem"></canvas>
          <canvas style={{ position: "absolute" }} id="solution"></canvas>
        </div>
        <div style={{ width: "100%", position: "relative" }}>
          <FitnessVisualizer
            values={this.values}
            width={500}
            height={150}
            verticalScale={0.01}
            horizontalScale={0.5}
          />
        </div>
      </div>
    );
  }
}

export default TSP;

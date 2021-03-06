import React, { Component } from "react";
import {
  GenAlgo,
  fittestSingle,
  randomSingle,
  randomLinearRankSingle,
  sequentialSingle,
  tournament2Single,
  tournament3Single,
  roulette,
  fittestRandomPair,
  randomPair,
  randomLinearRankPair,
  sequentialPair,
  tournament2Pair,
  tournament3Pair,
  roulettePair,
  lesser
} from "../../../lib/genalgo.js";
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
      fitness: "",
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
    this.problemBestCanvas = document.getElementById("problemBest");
    this.problemBestCtx = this.problemBestCanvas.getContext("2d");
    this.solutionBestCanvas = document.getElementById("solutionBest");
    this.solutionBestCtx = this.solutionBestCanvas.getContext("2d");

    this.problem = this.generateProblem();

    this.drawProblem(this.problemCtx);
    this.drawProblem(this.problemBestCtx);
  }

  drawProblem(ctx) {
    ctx.fillStyle = "#000";

    for (const city of this.problem) {
      ctx.beginPath();
      ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  clearCtx(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  drawIndividual(ctx, individual) {
    ctx.fillStyle = "#000";

    ctx.beginPath();
    for (const cityNumber of individual) {
      const city = this.problem[cityNumber];
      ctx.lineTo(city.x, city.y);
    }
    ctx.stroke();
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

  generateCircleProblem(cityNumber = 20) {
    const problem = [];

    const centerX = this.problemCanvas.offsetWidth / 2;
    const centerY = this.problemCanvas.offsetHeight / 2;

    const radius = 60;

    for (let i = 0; i < cityNumber; i++) {
      const random = Math.random();

      problem.push({
        x: centerX + radius * Math.cos((2 * Math.PI * i) / cityNumber),
        y: centerY + radius * Math.sin((2 * Math.PI * i) / cityNumber)
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
                  onClick={() => {
                    this.clearCtx(this.problemCanvas);
                    this.clearCtx(this.solutionCanvas);
                    this.clearCtx(this.problemBestCanvas);
                    this.clearCtx(this.solutionBestCanvas);
                    this.values = [];
                    this.problem = this.generateProblem();
                    this.drawProblem(this.problemCtx);
                    this.drawProblem(this.problemBestCtx);
                    this.forceUpdate();
                  }}
                >
                  Random problem
                </button>
                <button
                  disabled={this.state.isRunning}
                  onClick={() => {
                    this.clearCtx(this.problemCanvas);
                    this.clearCtx(this.solutionCanvas);
                    this.clearCtx(this.problemBestCanvas);
                    this.clearCtx(this.solutionBestCanvas);

                    this.values = [];
                    this.problem = this.generateCircleProblem();
                    this.drawProblem(this.problemCtx);
                    this.drawProblem(this.problemBestCtx);
                    this.forceUpdate();
                  }}
                >
                  Circle problem
                </button>
                <br />
                <button
                  disabled={this.state.isRunning}
                  onClick={async () => {
                    try {
                      const algo = new GenAlgo({
                        mutationProbability: mutationProbability,
                        crossoverProbability: crossoverProbability,
                        iterationNumber: maxIterationNumber
                      });
                      await this.setState({ bestFitness: "" });

                      // Function used to mutate an individual
                      const mutation = individual => {
                        const rand = () =>
                          Math.floor(Math.random() * individual.length);

                        for (const city of individual) {
                          if (Math.random() > 0.5) {
                            const rand = Math.floor(
                              Math.random() * individual.length
                            );
                            const temp = individual[city];
                            individual[city] = individual[rand];
                            individual[rand] = temp;
                          }
                        }
                        return individual;
                      };

                      const OX = (start, end, firstParent, secondParent) => {
                        const child = firstParent.slice(start, end);
                        const length = firstParent.length;

                        for (let i = 0; i < length; i++) {
                          const index = (end + i) % length;
                          const parentCity = secondParent[index];

                          if (!child.some(city => city == parentCity)) {
                            child.push(parentCity);
                          }
                        }
                        return rotate(child, start);
                      };

                      function rotate(array, index) {
                        const offset = array.length - index;
                        return [
                          ...array.slice(offset),
                          ...array.slice(0, offset)
                        ];
                      }

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
                        let prev = this.problem[individual[0]];

                        let distance = individual.reduce(
                          (totalDist, location) => {
                            const city = this.problem[location];
                            const distToAdd = Math.hypot(
                              city.x - prev.x,
                              city.y - prev.y
                            );
                            prev = city;
                            return totalDist + distToAdd;
                          },
                          0
                        );

                        const first = this.problem[individual[0]];
                        const last = this.problem[
                          individual[individual.length - 1]
                        ];

                        distance += Math.hypot(
                          first.x - last.x,
                          first.y - last.y
                        );

                        return 1 / distance;
                      };

                      const generateSeed = size => {
                        const inOrderPath = range(0, this.problem.length);

                        return map(
                          value => shuffle(inOrderPath),
                          range(0, size)
                        );
                      };

                      // Seed generation
                      const seed = generateSeed(populationSize);

                      // Will be called at each iteration
                      const iterationCallback = ({
                        bestIndividual,
                        elapsedTime,
                        iterationNumber,
                        population
                      }) => {
                        this.values.push(1 / bestIndividual.fitness);
                        const shouldChangeValue = algo.fitnessComparator(
                          bestIndividual.fitness,
                          this.state.bestFitness
                        );

                        this.setState({
                          bestFitness:
                            this.state.bestFitness == ""
                              ? bestIndividual.fitness
                              : shouldChangeValue
                              ? bestIndividual.fitness
                              : this.state.bestFitness,
                          fitness: bestIndividual.fitness,
                          elapsedTime,
                          iterationNumber
                        });
                        if (shouldChangeValue) {
                          this.clearCtx(this.solutionBestCanvas);
                          this.drawIndividual(
                            this.solutionBestCtx,
                            bestIndividual.entity
                          );
                        }

                        this.clearCtx(this.solutionCanvas);
                        this.drawIndividual(
                          this.solutionCtx,
                          bestIndividual.entity
                        );

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
                        case "roulette":
                          algo.setSelectPairFunction(roulette);
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
                        case "roulette":
                          algo.setSelectPairFunction(roulettePair);
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

                      algo.setResultSize(1);

                      this.setState({ isRunning: true });

                      this.values = [];

                      const result = await algo.start();

                      this.setState({
                        isRunning: false,
                        result: result[0].entity
                      });
                      this.clearCtx(this.solutionCanvas);
                      this.drawIndividual(this.solutionCtx, result[0].entity);
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
                <br />
                <span>Generation Fitness : {this.state.fitness}</span>
              </React.Fragment>
            )}
          </ParametersProvider>
        </div>
        <br />
        <hr style={{ width: "100%" }} />
        <div style={{ display: "flex", marginBottom: 30 }}>
          <div style={{ width: "100%", position: "relative", height: 150 }}>
            Generation best:
            <br />
            <canvas style={{ position: "absolute" }} id="problem"></canvas>
            <canvas style={{ position: "absolute" }} id="solution"></canvas>
          </div>
          <div style={{ width: "100%", position: "relative", height: 150 }}>
            Best ever found:
            <br />
            <canvas style={{ position: "absolute" }} id="problemBest"></canvas>
            <canvas style={{ position: "absolute" }} id="solutionBest"></canvas>
          </div>
        </div>
        <div style={{ width: "100%", position: "relative" }}>
          Generation fitness: <br />
          <FitnessVisualizer
            values={this.values}
            width={500}
            height={150}
            verticalScale={0.02}
            horizontalScale={0.5}
          />
        </div>
      </div>
    );
  }
}

export default TSP;

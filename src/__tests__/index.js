import GenAlgo from "../core/GenAlgo.js";
import lesser from "../fitnessComparator/lesser.js";
import tournament3 from "..//singleSelector/tournament3.js";
import tournament3Pair from "../pairSelector/tournament3.js";
import rangeStep from "lodash/fp/rangeStep";

function tryToFindFunctionExtremum(func: number => number, min: boolean) {
  const algo = new GenAlgo({
    mutationProbability: 0.2,
    crossoverProbability: 0.8,
    iterationNumber: 100
  });

  const mutation = number => {
    return number + Math.random();
  };

  const crossover = (number1, number2) => {
    return [(number1 + number2) / 2, number1 + number2];
  };

  const iterationCallback = ({ bestFitness, elapsedTime, iterationNumber }) => {
    return true;
  };

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

  return algo.getIndividuals()[0];
}

it("Minimum of (x+50)^2-5000*e^(-50*(x-5)^2)-54*cos((x-5)*5)-100*cos((x-5)*0.5) : should be near 5 in perfect case, near -45 in good cases", () => {
  try {
    expect(
      tryToFindFunctionExtremum(number => {
        return (
          (number + 50) ** 2 -
          5000 * Math.exp(-50 * (number - 5) ** 2) -
          54 * Math.cos((number - 5) * 5) -
          100 * Math.cos((number - 5) * 0.5)
        );
      }, true)
    ).toBeCloseTo(4.99, 1);
  } catch (e) {
    console.log(e);
  }
});

it("Maximum of -9x^4-3x^3 : should be near -0.25", () => {
  try {
    expect(
      tryToFindFunctionExtremum(number => {
        return -9 * number ** 4 - 3 * number ** 3;
      })
    ).toBeCloseTo(-0.25, 1);
  } catch (e) {
    console.log(e);
  }
});

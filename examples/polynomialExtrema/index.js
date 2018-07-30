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

console.log(
  "Minimum of (x+50)^2-5000*e^(-50*(x-5)^2)-54*cos((x-5)*5)-100*cos((x-5)*0.5) : should be near 5 in perfect case, near -45 in good cases"
);
tryToFindPolynomialExtremum(number => {
  return (
    (number + 50) ** 2 -
    5000 * Math.exp(-50 * (number - 5) ** 2) -
    54 * Math.cos((number - 5) * 5) -
    100 * Math.cos((number - 5) * 0.5)
  );
}, true);

console.log("Maximum of -9x^4-3x^3 : should be near -0.25");
tryToFindPolynomialExtremum(number => {
  return -9 * number ** 4 - 3 * number ** 3;
});
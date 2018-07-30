import map from "lodash/fp/map";
import range from "lodash/fp/range";
import get from "lodash/fp/get";
import isNil from "lodash/fp/isNil";

export function linearRank(
  population: Array<{ entity: any, fitness: number }>
): number[] {
  let probabilitySum = 0;
  const probabilityArray = [1];

  map(index => {
    // The probability is calculated using the formula from https://www.tik.ee.ethz.ch/file/6c0e384dceb283cd4301339a895b72b8/TIK-Report11.pdf
    probabilitySum +=
      ((1 / population.length) * 2 * (population.length - 1 - index)) /
      (population.length - 1);
    probabilityArray.push(1 - probabilitySum);
  }, range(0, population.length));

  return probabilityArray;
}

/**
 * Select individual according to a linear rank
 * @param   population population of the iteration
 * @return             random individual
 */
function randomLinearRank(
  population: Array<{ entity: any, fitness: number }>
): any {
  if (
    isNil(get("args.ranks", randomLinearRank)) ||
    randomLinearRank.args.ranks === 0
  ) {
    randomLinearRank.args = {
      ranks: linearRank(population)
    };
  }
  const random = Math.random();

  for (let i = 0; i < population.length; i++) {
    if (
      random <= randomLinearRank.args.ranks[i] &&
      random > randomLinearRank.args.ranks[i + 1]
    ) {
      return population[i].entity;
    }
  }
}

export default randomLinearRank;

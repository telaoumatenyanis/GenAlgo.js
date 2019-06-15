import rouletteSingle from "../singleSelector/roulette.js";

function roulette(
  population: Array<{ entity: any, fitness: number }>
): [any, any] {
  return [rouletteSingle(population), rouletteSingle(population)];
}

export default roulette;

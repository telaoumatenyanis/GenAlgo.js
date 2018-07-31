export { default as GenAlgo } from "./core/GenAlgo.js";

export { default as fittestRandomPair } from "./pairSelector/fittestRandom.js";
export { default as randomPair } from "./pairSelector/random.js";
export {
  default as randomLinearRankPair
} from "./pairSelector/randomLinearRank.js";
export { default as sequentialPair } from "./pairSelector/sequential.js";
export { default as tournament2Pair } from "./pairSelector/tournament2.js";
export { default as tournament3Pair } from "./pairSelector/tournament3.js";

export { default as fittestSingle } from "./singleSelector/fittest.js";
export { default as randomSingle } from "./singleSelector/random.js";
export {
  default as randomLinearRankSingle
} from "./singleSelector/randomLinearRank.js";
export { default as sequentialSingle } from "./singleSelector/sequential.js";
export { default as tournament2Single } from "./singleSelector/tournament2.js";
export { default as tournament3Single } from "./singleSelector/tournament3.js";

export { default as greater } from "./fitnessComparator/greater.js";
export { default as lesser } from "./fitnessComparator/lesser.js";

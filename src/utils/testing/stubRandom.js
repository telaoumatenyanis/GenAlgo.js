// @flow

/**
 * Stub Math.random() in order to test selection
 * @param  randomList list of the random number to return by Math.random()
 */
function stubRandom(randomList: number[]): void {
  let index = 0;
  const mathStub = Object.create(global.Math);
  mathStub.random = () => randomList[index++];
  global.Math = mathStub;
}

export default stubRandom;

// @flow

function stubRandom(
  firstRandom: number,
  increaseRandomFunction: number => number
) {
  let random = firstRandom;

  function stub() {
    const toReturn = random;
    random = increaseRandomFunction(random);
    return toReturn;
  }
  return stub;
}

export default stubRandom;

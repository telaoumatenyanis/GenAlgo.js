import React, { Component } from "react";

class Parameters extends Component {
  render() {
    const {
      selectSingleFunction,
      selectPairFunction,
      comparator,
      maxIterationNumber,
      handleSelectSingle,
      handleSelectPair,
      handleSelectComparator,
      handleChangeIterationNumber,
      children
    } = this.props;

    return (
      <div>
        <br />
        <span> Select single : </span>
        <select value={selectSingleFunction} onChange={handleSelectSingle}>
          <option value="fittest">Fittest</option>
          <option value="random">Random</option>
          <option value="randomLinearRank">RandomLinearRank</option>
          <option value="sequential">Sequential</option>
          <option value="tournament2">Tournament2</option>
          <option value="tournament3">Tournament3</option>
        </select>
        <br />
        <span> Select pair : </span>
        <select value={selectPairFunction} onChange={handleSelectPair}>
          <option value="fittestRandom">FittestRandom</option>
          <option value="random">Random</option>
          <option value="randomLinearRank">RandomLinearRank</option>
          <option value="sequential">Sequential</option>
          <option value="tournament2">Tournament2</option>
          <option value="tournament3">Tournament3</option>
        </select>
        <br />
        <span> min/max : </span>
        <select value={comparator} onChange={handleSelectComparator}>
          <option value="min">Min</option>
          <option value="max">Max</option>
        </select>
        <br />
        <span>
          Number of iteration :
          <input
            style={{ marginLeft: 10, width: 50 }}
            type="text"
            value={maxIterationNumber}
            onChange={handleChangeIterationNumber}
          />
        </span>
        {children}
      </div>
    );
  }
}

export default Parameters;

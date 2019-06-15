import React, { Component } from "react";
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";

const SliderWithTooltip = createSliderWithTooltip(Slider);

class Parameters extends Component {
  render() {
    const {
      selectSingleFunction,
      selectPairFunction,
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
        <span style={{ marginBottom: 20 }}>
          Number of iteration :
          <input
            style={{ marginLeft: 10, width: 50 }}
            type="text"
            value={maxIterationNumber}
            onChange={handleChangeIterationNumber}
          />
        </span>
        <div style={{ display: "flex" }}>
          <span style={{ width: 100 }}> Crossover:</span>
          <SliderWithTooltip
            min={0}
            max={1}
            step={0.01}
            onChange={handleChangeCrossoverProbability}
            value={crossoverProbability}
          />
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: 100 }}> Mutation:</span>
          <SliderWithTooltip
            min={0}
            max={1}
            step={0.01}
            onChange={handleChangeMutationProbability}
            value={mutationProbability}
          />
        </div>
        <br />
        {children}
      </div>
    );
  }
}

export default Parameters;

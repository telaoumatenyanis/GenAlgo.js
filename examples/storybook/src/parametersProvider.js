import React, { Component } from "react";

class ParametersProvider extends Component {
  state = {
    error: "",
    selectSingle: "fittest",
    selectPair: "fittestRandom",
    comparator: "max",
    mutationProbability: 0.2,
    crossoverProbability: 0.8,
    maxIterationNumber: 100,
    populationSize: 10,
    spareFittest: true
  };

  handleSelectSingle = event => {
    this.setState({ selectSingleFunction: event.target.value });
  };

  handleSelectPair = event => {
    this.setState({ selectPairFunction: event.target.value });
  };

  handleSelectComparator = event => {
    this.setState({ comparator: event.target.value });
  };

  handleChangeCrossoverProbability = value => {
    this.setState({ crossoverProbability: value });
  };

  handleChangeMutationProbability = value => {
    this.setState({ mutationProbability: value });
  };

  handleChangeSpareFittest = event => {
    this.setState({ spareFittest: !this.state.spareFittest });
  };

  handleChangeIterationNumber = event => {
    try {
      if (event.target.value != "") {
        const number = parseInt(event.target.value);
        this.setState({ maxIterationNumber: number });
      } else {
        this.setState({ maxIterationNumber: 0 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleChangePopulationSize = event => {
    try {
      if (event.target.value != "") {
        const number = parseInt(event.target.value);
        this.setState({ populationSize: number });
      } else {
        this.setState({ populationSize: 0 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleError = error => {
    this.setState({ error });
  };

  render() {
    return this.props.children({
      handleSelectSingle: this.handleSelectSingle,
      handleSelectPair: this.handleSelectPair,
      handleSelectComparator: this.handleSelectComparator,
      handleChangeCrossoverProbability: this.handleChangeCrossoverProbability,
      handleChangeMutationProbability: this.handleChangeMutationProbability,
      handleChangeIterationNumber: this.handleChangeIterationNumber,
      handleChangeSpareFittest: this.handleChangeSpareFittest,
      handleChangePopulationSize: this.handleChangePopulationSize,
      handleError: this.handleError,
      error: this.state.error,
      selectSingle: this.state.selectSingle,
      selectPair: this.state.selectPair,
      comparator: this.state.comparator,
      maxIterationNumber: this.state.maxIterationNumber,
      crossoverProbability: this.state.crossoverProbability,
      mutationProbability: this.state.mutationProbability,
      spareFittest: this.state.spareFittest,
      populationSize: this.state.populationSize
    });
  }
}

export default ParametersProvider;

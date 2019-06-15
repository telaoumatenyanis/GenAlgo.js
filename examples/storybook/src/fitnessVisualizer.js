import React, { Component } from "react";

export default class FitnessVisualizer extends Component {
  fitnessVisualizerCtx;
  fitnessVisualizerCanvas;

  componentDidMount() {
    this.fitnessVisualizerCanvas = document.getElementById("fitnessVisualizer");
    this.fitnessVisualizerCtx = this.fitnessVisualizerCanvas.getContext("2d");
    this.fitnessVisualizerCtx.beginPath();
  }

  clearCtx() {
    this.fitnessVisualizerCtx.closePath();

    this.fitnessVisualizerCtx.clearRect(
      0,
      0,
      this.fitnessVisualizerCanvas.width,
      this.fitnessVisualizerCanvas.height
    );

    this.fitnessVisualizerCtx.beginPath();
  }

  componentDidUpdate(prevProps) {
    const { values, height, verticalScale, horizontalScale } = this.props;

    if (values.length < prevProps.values.length) {
      this.clearCtx();
    }

    this.fitnessVisualizerCtx.lineTo(
      values.length * horizontalScale,
      height - values[values.length - 1] * verticalScale
    );
    this.fitnessVisualizerCtx.stroke();
  }

  render() {
    const { height, width } = this.props;
    return (
      <canvas id="fitnessVisualizer" height={height} width={width}></canvas>
    );
  }
}

const env = process.env.NODE_ENV;

if (env === "production") {
  module.exports = {
    comments: false,
    plugins: ["transform-runtime"],
    presets: ["env", "flow", "stage-2"]
  };
}

if (env === "test") {
  module.exports = {
    comments: false,
    plugins: ["transform-es2015-modules-commonjs"],
    presets: ["flow", "stage-2"]
  };
}

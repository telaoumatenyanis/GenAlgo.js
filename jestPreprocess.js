const babelOptions = {
  presets: ["@babel/preset-env", "@babel/preset-flow"],
  plugins: ["@babel/plugin-transform-runtime"]
};

module.exports = require("babel-jest").createTransformer(babelOptions);

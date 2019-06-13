const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "lib/"),
    filename: "genalgo.js",
    library: "genalgo",
    libraryTarget: "umd"
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-flow"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  }
};
module.exports = config;

module.exports = {
  verbose: true,
  transform: { "^.+\\.js$": "<rootDir>/jestPreprocess.js" },
  testURL: "http://localhost/"
};

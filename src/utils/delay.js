module.exports = function(delay) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, delay);
  });
};

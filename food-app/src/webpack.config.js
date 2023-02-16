const os = require("os-browserify");

module.exports = {
  resolve: {
    fallback: {
      os: os
    }
  }
};

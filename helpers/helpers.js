'use strict';
var relativePath = process.env.RELATIVE_PATH || '';

module.exports = {
  relativePath: () => {
    return relativePath;
  },
  resource: (path) => {
    return relativePath + '/content' + path;
  },
  url: function (path) {
    return relativePath + path;
  },
  toLowerCase: function (word){
    return word.toLowerCase();
  }
};

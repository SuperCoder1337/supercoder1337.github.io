var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};



//////////////////
// WEBPACK FOOTER
// ./~/isarray/index.js
// module id = 10
// module chunks = 0
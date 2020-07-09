const { pathToRegexp, match, parse, compile } = require('path-to-regexp');

const keys = [];
// const regexp = pathToRegexp('/foo/:bar', keys);
const regexp = pathToRegexp('.*', keys);
console.log(regexp);
console.log(keys);

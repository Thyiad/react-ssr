/* eslint-disable */
const { pathToRegexp, match, parse, compile } = require('path-to-regexp');
const envConfig = require('./webpack/./env-config');

console.log(JSON.stringify(envConfig, null, '    '));

// const keys = [];
// // const regexp = pathToRegexp('/foo/:bar', keys);
// const regexp = pathToRegexp('.*', keys);
// console.log(regexp);
// console.log(keys);

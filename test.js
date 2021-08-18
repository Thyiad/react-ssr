console.log(__filename);
return;
const path = require('path');
const s = path.join('node_modules', '@thyiad', 'antd-ui');
console.log(s.replace(/\\/g, '\\\\').replace(/\@/g, '\\@'));
return;

const { pathToRegexp, match, parse, compile } = require('path-to-regexp');

const keys = [];
// const regexp = pathToRegexp('/foo/:bar', keys);
const regexp = pathToRegexp('.*', keys);
console.log(regexp);
console.log(keys);

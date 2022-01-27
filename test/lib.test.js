const {mapCount} = require('../lib');
const {mapLocation} = require('../config');

const res = mapCount(mapLocation);
console.log(res);
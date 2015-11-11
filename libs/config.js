// @see: https://github.com/indexzero/nconf
var nconf = require('nconf');

nconf
    .argv()
    .env()
    .file('./app/config/config.json');

module.exports = nconf;

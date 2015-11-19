var Validation = require('./validation');

/**
 * Authorization
 */
var Authorization = function () {
    var validation = new Validation();

    return validation.checkEmail('a@a.aa');
}

module.exports = Authorization;

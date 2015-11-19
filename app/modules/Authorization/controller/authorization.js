var Validation = require('./validation');

var VALID_EMAIL = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

var Authorization = function () {
    var validation = new Validation();

    return validation.check('a-a.a@a.aa', VALID_EMAIL);
}

// Authorization.prototype.

module.exports = Authorization;

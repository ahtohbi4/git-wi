var Validation = require('./validation');

var Authorization = function () {
    var validation = new Validation();

    return validation.checkEmail('a@a.aa');
}

// Authorization.prototype.

module.exports = Authorization;

var Validation = require('./validation');

var Authorization = function () {
    var validation = new Validation();

    return validation.check('a-a.a@a.aa', /^[\w-.]+@[\w]+\.[\w]{2,4}$/i);
}

// Authorization.prototype.

module.exports = Authorization;

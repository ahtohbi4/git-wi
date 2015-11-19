/**
 * Validation
 */
var Validation = function () {}

Validation.prototype._requiredParam = function (param) {
    if (param === undefined) {
        throw new Error();
    } else {
        return true;
    }
}
/**
 * @method check
 * @param {string} test
 * @param {regexp} [pattern]
 */
Validation.prototype.check = function (test, pattern) {
    this._requiredParam(test);

    var pattern = pattern || /.*/ig;

    return pattern.test(test)
}

/**
 * @method checkEmail
 * @param {string} test
 */
Validation.prototype.checkEmail = function (test) {
    var PATTERN_EMAIL = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    return this.check(test, PATTERN_EMAIL);
}

/**
 * @method checkPassword
 * @param {string} test
 */
Validation.prototype.checkPassword = function (test) {
    var PATTERN_PASSWORD = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    return this.check(test, PATTERN_PASSWORD);
}

module.exports = Validation;

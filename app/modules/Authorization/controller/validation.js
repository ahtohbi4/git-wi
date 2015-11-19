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
 *
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
 *
 * @param {string} test
 */
Validation.prototype.checkEmail = function (test) {
    this._requiredParam(test);

    var PATTERN_EMAIL = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    return PATTERN_EMAIL.test(test);
}

module.exports = Validation;

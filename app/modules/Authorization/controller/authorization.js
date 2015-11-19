var Validation = require('./validation');

/**
 * Authorization
 */
var Authorization = function () {}

/**
 * @method authorize
 * @param {string} email
 * @param {string} password
 */
Authorization.prototype.authorize = function (email, password) {
    var validation = new Validation();

    var result = {
            success: true
        },
        errors = [];

    if (!validation.checkEmail(email)) {
        result.success = false;
        errors.push('Email is not valid.');
    }

    if (!validation.checkPassword(password)) {
        result.success = false;
        errors.push('Password is not valid.');
    }

    if (!result.success) {
        result.errors = errors;
    }

    return result;
}

module.exports = Authorization;

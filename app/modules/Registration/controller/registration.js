// TODO: It should be global
var validation = require('../../Authorization/controller/validation');

/**
 * Authorization
 */
var Registration = function () {}

/**
 * @method register
 * @param {string} email
 * @param {string} password
 * @param {string} confirm_password
 */
Registration.prototype.register = function (email, password, confirm_password) {
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
    } else if (!validation.checkEqualString(password, confirm_password)) {
        result.success = false;
        errors.push('Passwords must be equal.');
    }

    if (!result.success) {
        result.errors = errors;
    }

    return result;
}

module.exports =  new Registration();

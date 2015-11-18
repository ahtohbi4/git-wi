var Validation = function () {}

Validation.prototype.check = function (text, pattern) {
    if (text === undefined) {
        throw new Error('Required parameter was lost for method check(text, pattern) in:\n' + module.filename + '\n' + module.parent.filename);
    }

    var pattern = pattern || /.*/ig;

    return pattern.test(text)
}

module.exports = Validation;

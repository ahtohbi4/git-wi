module.exports = function (req, res) {
    res.type('html');
    res.end('Hi! I am the someController =)\nLocale: ' + req.params._locale);
}

module.exports = function (req, res) {
    res.end('Hi! I am the someController =)\nLocale: ' + req.params._locale);
}

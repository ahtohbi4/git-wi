var express = require('express');
var routes = express();

routes.all('*', function (req, res, next) {
    res.locals.lang = req.baseUrl.replace('/', '');

    next();
});

routes.get('/', function(req, res) {
    res.end('<h1>Main page</h1>');
});

routes.get('/foo/', function(req, res) {
    res.end('<h1>Foo page</h1>' + res.locals.lang);
});

module.exports = routes;

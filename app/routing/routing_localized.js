var express = require('express');
var routes = express();

var path = require('path');

routes.all('*', function (req, res, next) {
    res.locals.lang = req.baseUrl.replace('/', '');

    next();
});

routes.use(require(path.join(__dirname, 'routing_static')));

routes.get('/', function(req, res) {
    res.end('<h1>Main page</h1>');
});

routes.get('/foo/', function(req, res) {
    res.end('<h1>Foo page</h1>' + res.locals.lang);
});

module.exports = routes;

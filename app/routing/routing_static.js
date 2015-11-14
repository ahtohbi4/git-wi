var express = require('express');
var routes = express();

routes.get('/static/', function(req, res) {
    res.end('<h1>Static page</h1>' + res.locals.lang);
});

module.exports = routes;

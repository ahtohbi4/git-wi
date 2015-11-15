var express = require('express');
var routes = express();

routes.get('/:id', function(req, res) {
    res.end('<h1>Dynamic page</h1>' + req.params.id);
});

module.exports = routes;

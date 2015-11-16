var express = require('express');
var router = express.Router({
    strict: true
});

router.get('/:id([0-9]+)/', function(req, res) {
    res.end('<h1>Dynamic page</h1>' + req.params.id + ' ' + res.locals.lang);
});

module.exports = router;

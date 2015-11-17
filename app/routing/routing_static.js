var express = require('express');
var router = express.Router({
    strict: true
});

router.get('/', function(req, res) {
    res.end('<h1>Main page</h1>');
});

router.get('/static/', function(req, res) {
    res.end('<h1>Static page</h1>' + res.locals.lang);
});

module.exports = router;

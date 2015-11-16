var express = require('express');
var router = express.Router({
    strict: true
});

var path = require('path');

router.all('*', function (req, res, next) {
    res.locals.lang = req.baseUrl.replace('/', '');

    next();
});

router.use(require(path.join(__dirname, 'routing_static')));

router.get('/', function(req, res) {
    res.end('<h1>Main page</h1>');
});

router.get('/foo/', function(req, res) {
    res.end('<h1>Foo page</h1>' + res.locals.lang);
});

// Default controller
router.use('/default', require(path.join(__dirname, '../controllers/Default/routing/routing')));

module.exports = router;

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

// Default module
router.use('/default', require(path.join(__dirname, '../modules/Default/routing/routing')));

// Authorization module
router.use('/login', require(path.join(__dirname, '../modules/Authorization/routing/routing')));

module.exports = router;

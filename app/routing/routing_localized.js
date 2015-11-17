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

// Default controller
router.use('/default', require(path.join(__dirname, '../controllers/Default/routing/routing')));

// Authorization controller
router.use('/login', require(path.join(__dirname, '../controllers/Authorization/routing/routing')));

module.exports = router;

var express = require('express');
var router = express.Router({
    strict: true
});
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.route('/')
    .get(function (req, res) {
        res.send('<h1>Authorization</h1><form action="" method="post"><input name="email" placeholder="email"><input type="password" name="password" placeholder="password"><button>Sign In</button></form>')
    })
    .post(function (req, res) {
        if (req.body.email === 'a@a.a') {
            res.redirect(301, '/' + res.locals.lang + '/');

        } else {
            res.send('<p>Authorization error</p>');
        }
    });

module.exports = router;

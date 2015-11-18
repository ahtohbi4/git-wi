var express = require('express');
var router = express.Router({
    strict: true
});
var bodyParser = require('body-parser');

var authorization = require('../controller/authorization');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.route('/')
    .get(function (req, res) {
        res.send(authorization());
    })
    // .get(function (req, res) {
    //     res.send('<h1>Sign In</h1><form action="" method="post"><input name="email" placeholder="email"><input type="password" name="password" placeholder="password"><button>Sign In</button></form><p><a href="/' + res.locals.lang + '/registration/">Sign Up</a></p>')
    // })
    .post(function (req, res) {
        if (req.body.email === 'a@a.a') {
            res.redirect(301, '/' + res.locals.lang + '/');

        } else {
            res.send('<h1>Sign In</h1><div style="color: #f30;">Autorization Error!</div><form action="" method="post"><input name="email" placeholder="email"><input type="password" name="password" placeholder="password"><button>Sign In</button></form><p><a href="/' + res.locals.lang + '/registration/">Sign Up</a></p>');
        }
    });

module.exports = router;

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
        res.send('<h1>Add User</h1><form action="" method="post"><input name="email" placeholder="email"><input type="password" name="password" placeholder="password"><button>Joint</button></form>')
    })
    .post(function (req, res) {
        var VALID_EMAIL = /^[\w]+@[\w]+.[\w]{2,4}$/i;

        if (!VALID_EMAIL.test(req.body.email) || req.body.password.length < 8) {
            res.send('<h1>Add User</h1><div style="color: #f30;">EMAIL or PASSWORD isn\'t correct!</div><form action="" method="post"><input name="email" placeholder="email"><input type="password" name="password" placeholder="password"><button>Joint</button></form>');

        } else {
            res.redirect(301, '/' + res.locals.lang + '/');
        }
    });

module.exports = router;

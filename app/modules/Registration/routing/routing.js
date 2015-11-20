var express = require('express');
var router = express.Router({
    strict: true
});
var bodyParser = require('body-parser');

var registration = require('../controller/registration');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

var template = '<h1>Add User</h1><!--errors--><form action="" method="post"><p><input name="email" placeholder="email"></p><p><input type="password" name="password" placeholder="password"></p><p><input type="password" name="confirm_password" placeholder="password"></p><p><button>Joint</button></p></form>';

router.route('/')
    .get(function (req, res) {
        res.send(template)
    })
    .post(function (req, res) {
        var register = registration.register(req.body.email, req.body.password, req.body.confirm_password);

        if (register.success) {
            res.redirect(301, '/' + res.locals.lang + '/');
        } else {
            res.send(template.replace('<!--errors-->', '<div style="color: #f30;">' + register.errors.join('<br>') + '</div>'));
        }
    });

module.exports = router;

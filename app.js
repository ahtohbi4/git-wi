// @see: http://expressjs.com/4x/api.html
var express = require('express'),
    app = express();
// @see: https://github.com/expressjs/morgan
var morgan = require('morgan');
// @see: https://github.com/expressjs/compression
var compression = require('compression');
var path = require('path');
var config = require(path.join(__dirname, 'libs/config'));
var log = require(path.join(__dirname, 'libs/log'))(module);

// app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
app.use(morgan('combined'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'compiled/')));

var router = require(path.join(__dirname, 'libs/router'))(app);

// for (var routeUri in router.uriMap) {
//     app.all(routeUri, function (req, res) {
//         var route = router.uriMap[req.route.path],
//             methods = route._methods ? (Array.isArray(route._methods) ? route._methods : [route._methods]) : ['all'];

//         if (methods.indexOf('all') != -1 || methods.indexOf(req.route.stack[0].method) != -1) {
//             res.send('Hi, I am route "' + req.route.path + '".<br>' + 'I am on lang "' + req.params._locale + '".<br>' + 'And I allowed "' + methods + '" methods.<br>' + 'Now it is a "' + req.route.stack[0].method + '".');
//         } else {
//             res.status(405);
//             res.send({
//                 error: 'Method Not Allowed'
//             });
//         }
//     });
// }

app.use(function (req, res){
    res.status(404);
    res.send({
        error: 'Not found'
    });

    return;
});

app.listen(config.get('port'), function (){
    log.info('Express server listening on port ' + config.get('port'));
});

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

var Twig = require('twig');
app.set('views', __dirname);
app.set('view engine', 'twig');

// router
var router = require(path.join(__dirname, 'libs/router'));
router(app, {
    host: config.get('host'),
    baseDir: __dirname,
    file: config.get('router').resource
});

app.listen(config.get('port'), function (){
    log.info('Express server listening on port ' + config.get('port'));
});

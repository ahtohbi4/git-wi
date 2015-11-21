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

var router = require(path.join(__dirname, 'libs/router'));
router.init({
    file: path.join(__dirname, 'app/config/routing.json')
});

// app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
app.use(morgan('combined'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'compiled/')));

app.use(Object.keys(config.get('i18n')).map(function (lang) {
    return '/' + lang;
}), require(path.join(__dirname, 'app/routing/routing_localized')));

app.use(function (req, res){
    res.status(404);
    res.send({
        error: 'Not found'
    });

    return;
});

app.use(function (err, req, res){
    res.status(err.status || 500);
    res.send({
        error: err.message
    });

    return;
});

app.listen(config.get('port'), function (){
    log.info('Express server listening on port ' + config.get('port'));
});

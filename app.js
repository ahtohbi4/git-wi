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

// router
var router = require(path.join(__dirname, 'libs/router'));
router(app, {
    file: path.join(__dirname, config.get('routing'))
});

app.listen(config.get('port'), function (){
    log.info('Express server listening on port ' + config.get('port'));
});

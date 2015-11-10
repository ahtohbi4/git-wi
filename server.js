// @see: http://expressjs.com/4x/api.html
var express = require('express'),
    app = express();
var router = express.Router();
// @see: https://github.com/expressjs/morgan
var morgan = require('morgan');
// @see: https://github.com/expressjs/compression
var compression = require('compression');
var path = require('path');
var config = require('./vendors/config');
var log = require('./vendors/log')(module);

// app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
app.use(morgan('combined'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'compiled/')));

app.get('/api', function (req, res) {
    res.send('API is running');
});

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

var fs = require('fs');
var path = require('path');
var config = require(path.join(__dirname, 'config'));

/**
 * Router
 */
var Router = function () {
    var _this = this;

    this.file = path.join(__dirname, config.get('routing'));

    this.routeMap = {};
    this._generateRouteMap();

    this.uriMap = {};
    this._generateUriMap();

    return function (app) {
        if (app === undefined) {
            throw new Error('Could not apply router to undefined application.');

        } else if (typeof app !== 'function') {
            throw new Error('Application should to be an express() function.');

        } else {
            _this.app = app;

        }

        _this.init();
    };
};

/**
 * @method init
 */
Router.prototype.init = function() {
    var _this = this;

    for (var routeUri in this.uriMap) {
        this.app.all(routeUri, function (req, res) {
            var route = _this.uriMap[req.route.path],
                methods = route._methods ? (Array.isArray(route._methods) ? route._methods : [route._methods]) : ['all'];

            if (methods.indexOf('all') != -1 || methods.indexOf(req.route.stack[0].method) != -1) {
                res.send('Hi, I am route "' + req.route.path + '".<br>' + 'I am on lang "' + req.params._locale + '".<br>' + 'And I allowed "' + methods + '" methods.<br>' + 'Now it is a "' + req.route.stack[0].method + '".');

            } else {
                _this.sendMethodNotAllowed(req, res);

            }
        });
    }

    this.app.use(function (req, res){
        _this.sendNotFaund(req, res);
    });
};

/**
 * @method _getRoutesFromFile
 * @param {string} file
 */
Router.prototype._getRoutesFromFile = function (file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * @method _parseLevel
 * @param {object} routes
 * @param {string} [prefix]
 */
Router.prototype._parseLevel = function (routes, prefix) {
    var _this = this,
        prefix = prefix || '';

    for (var routeName in routes) {
        var route = routes[routeName];

        if (route.resource !== undefined) {
            var nextLevel = _this._getRoutesFromFile(route.resource);
            var nextPrefix = prefix + (route.prefix || '');

            _this._parseLevel(nextLevel, nextPrefix);
        } else {
            _this.routeMap[routeName] = route;
            _this.routeMap[routeName].name = routeName;
            _this.routeMap[routeName].uri = prefix + _this.routeMap[routeName].uri;
        }
    }

    return this;
};

/**
 * @method _generateRouteMap
 */
Router.prototype._generateRouteMap = function () {
    this._parseLevel(this._getRoutesFromFile(this.file));

    return this;
};

/**
 * @method _generateUriMap
 */
Router.prototype._generateUriMap = function () {
    for (var routeName in this.routeMap) {
        var route = this.routeMap[routeName];

        this.uriMap[route.uri] = route;
    }
};

/**
 * @method sendNotFaund
 */
Router.prototype.sendNotFaund = function(req, res) {
    res.status(404);
    res.send({
        error: 'Not found'
    });

    return this;
};

/**
 * @method sendMethodNotAllowed
 */
Router.prototype.sendMethodNotAllowed = function(req, res) {
    res.status(405);
    res.send({
        error: 'Method Not Allowed'
    });

    return this;
};

module.exports = new Router();

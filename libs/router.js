var fs = require('fs');

/**
 * Router
 */
var Router = function () {
    var _this = this;

    return function (app, options) {
        if (app === undefined) {
            throw new Error('Could not apply router to undefined application.');

        } else if (typeof app !== 'function') {
            throw new Error('Application should to be an express() function.');

        } else {
            _this.app = app;

        }

        if (options.file === undefined) {
            throw new Error('Route\'s file have to be specified.');

        } else {
            _this.file = options.file;

        }

        _this.init();
    };
};

/**
 * @method init
 */
Router.prototype.init = function() {
    var _this = this;

    this.routeMap = {};
    this._generateRouteMap();

    this.uriMap = {};
    this._generateUriMap();

    for (var routeUri in this.uriMap) {
        this.app.all(routeUri, function (req, res) {
            var route = _this.uriMap[req.route.path],
                methods = _this.getMethods(route);

            if (methods.indexOf('all') != -1 || methods.indexOf(req.route.stack[0].method) != -1) {
                _this.getController(route)(req, res);

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
 * @return {json}
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
    var prefix = prefix || '';

    for (var routeName in routes) {
        var route = routes[routeName];

        if (route.resource !== undefined) {
            var nextLevel = this._getRoutesFromFile(route.resource);
            var nextPrefix = prefix + (route.prefix || '');

            this._parseLevel(nextLevel, nextPrefix);
        } else {
            this.routeMap[routeName] = route;
            this.routeMap[routeName].name = routeName;
            this.routeMap[routeName].uri = prefix + this.routeMap[routeName].uri;
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
 * @method getMethods
 * @param {object} route
 * @return {array}
 */
Router.prototype.getMethods = function(route) {
    var methods = route._methods || ['all'];

    if (!Array.isArray(methods)) {
        return [methods];
    } else {
        return methods;
    }
};

/**
 * @method getController
 * @param {object} router
 * @return {function}
 */
Router.prototype.getController = function(route) {
    return function (req, res) {
        res.send('Hi, I am route "' + req.route.path + '".<br>' + 'I am on lang "' + req.params._locale + '".<br>' + 'And I allowed "' + 'methods' + '" methods.<br>' + 'Now it is a "' + req.route.stack[0].method + '".');
    };
};

/**
 * @method getFormat
 * @param {object} router
 * @return {string}
 */
Router.prototype.getFormats = function(route) {
    var formats = [
            'html',
            'json',
            'xml'
        ],
        result;

    if (route._format === undefined or formats.indexOf(route._format) == -1) {
        result = 'html';
    } else {
        result = route._format;
    }

    return result;
};

/**
 * @method sendNotFaund
 * @param {object} req
 * @param {object} res
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
 * @param {object} req
 * @param {object} res
 */
Router.prototype.sendMethodNotAllowed = function(req, res) {
    res.status(405);
    res.send({
        error: 'Method Not Allowed'
    });

    return this;
};

/**
 * @method generateUri
 * @param {string} routeName
 * @param {object} attributes
 * @return {string}
 */
Router.prototype.generateUri = function(routeName, attributes) {
};

module.exports = new Router();

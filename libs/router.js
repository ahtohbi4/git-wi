var fs = require('fs');
var path = require('path');

/**
 * Router
 */
var Router = function () {
    var _this = this;

    /**
     * @constructs
     * @param {Express} app
     * @param {object} options
     * @param {string} options.file
     * @param {string} [options.baseDir=__dirname]
     */
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

        _this.baseDir = options.baseDir || __dirname;

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
    return JSON.parse(fs.readFileSync(path.join(this.baseDir, file), 'utf8'));
}

/**
 * @method _parseLevel
 * @param {object} routes
 * @param {string} [prefix]
 * @return {Router}
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
            this.routeMap[routeName].path = prefix + this.routeMap[routeName].path;
        }
    }

    return this;
};

/**
 * @method _generateRouteMap
 * @return {Router}
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

        this.uriMap[route.path] = route;
    }
};

/**
 * @method getMethods
 * @param {object} route
 * @return {array}
 */
Router.prototype.getMethods = function(route) {
    var result,
        methods = route._methods || ['all'];

    if (!Array.isArray(methods)) {
        result = [methods];
    } else {
        result = methods;
    }

    return result;
};

/**
 * @method getController
 * @param {object} router
 * @return {function}
 */
Router.prototype.getController = function(route) {
    var result;

    if (!route.controller || this.getFormat(route) == 'json') {
        result = function (req, res) {
            res.json({});
        };
    } else {
        result = require(path.join(this.baseDir, route.controller));
    }

    return result;
};

/**
 * @property FORMATS
 */
Router.prototype.FORMATS = {
    css: 'text/css',
    csv: 'text/csv',
    html: 'text/html',
    text: 'text/plain',
    xml: 'text/xml',
    javascript: 'application/javascript',
    json: 'application/json'
};

/**
 * @method getFormat
 * @param {object} router
 * @return {string}
 */
Router.prototype.getFormat = function(route) {
    var result;

    if (!this.getTemplate(route)) {
        result = 'json';
    } else if (route.format === undefined || this.FORMATS.hasOwnProperty(route.format)) {
        result = 'html';
    } else {
        result = route.format;
    }

    return result;
};

/**
 * @method getTemplate
 * @param {object} router
 * @return {string}
 */
Router.prototype.getTemplate = function(route) {
    var result;

    if (route.template === undefined) {
        result = '<!doctype html><html><head><title>' + route.name + '</title></head><body><h1>' + route.name + '</h1></body></html>'
    } else {
        if (!fs.statSync(route.template).isFile()) {
            throw new Error('Template ' + route.template + ' not found.');
        } else {
            result = fs.readFileSync(route.template, 'utf-8');
        }
    }

    return result;
};

/**
 * @method sendNotFaund
 * @param {object} req
 * @param {object} res
 * @return {Router}
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
 * @return {Router}
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
    var result;

    return result;
};

module.exports = new Router();

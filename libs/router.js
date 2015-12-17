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

        _this._start();
    };
};

/**
 * @method _start
 */
Router.prototype._start = function() {
    var _this = this;

    this.routeMap = {};
    this._normalizeRoutesMap(this._getRoutesFromFile(this.file));

    for (var name in this.routeMap) {
        this._applyRoute(this.routeMap[name]);
    }

    this.app.use(function (req, res) {
        _this.sendNotFaund(req, res);
    });
};

/**
 * @method _normalizeRoutesMap
 * @param {object} routes
 * @param {string} [prefix]
 * @return {Router}
 */
Router.prototype._normalizeRoutesMap = function (routes, prefix) {
    var prefix = prefix || '';

    for (var name in routes) {
        var route = routes[name];

        if (route.resource !== undefined) {
            var nextLevel = this._getRoutesFromFile(route.resource);
            var nextPrefix = prefix + (route.prefix || '');

            this._normalizeRoutesMap(nextLevel, nextPrefix);
        } else {
            this.routeMap[name] = route;
            this.routeMap[name].name = name;
            this.routeMap[name].path = prefix + this.routeMap[name].path;
        }
    }

    return this;
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
 * @methid _applyRoute
 * @param {object} route
 * @return {Router}
 */
Router.prototype._applyRoute = function(route) {
    var _this = this,
        methods = this.getMethods(route);

    methods.forEach(function (method) {
        _this.app[method](route.path, function(req, res) {
            res.render(_this.getTemplate(route), _this.getController(route)(req, res, _this));
        });
    });

    return this;
};

/**
 * @method getMethods
 * @param {object} route
 * @return {array}
 */
Router.prototype.getMethods = function(route) {
    var result,
        methods = route.methods || ['all'];

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
 * @const {object}
 * @see: https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_MIME-%D1%82%D0%B8%D0%BF%D0%BE%D0%B2
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
        // TODO: Replace this to link to the static page
        result = '<!doctype html><html><head><title>' + route.name + '</title></head><body><h1>' + route.name + '</h1></body></html>'
    } else {
        result = route.template;
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
 * @method generate
 * @param {string} routeName
 * @param {object} attributes
 * @return {string}
 */
Router.prototype.generate = function(routeName, attributes) {
    var result;

    if (this.routeMap[routeName] === undefined) {
        throw new Error('Route name ' + routeName + ' is undefined.');
    }

    result = this.routeMap[routeName].path;

    return result;
};

module.exports = new Router();

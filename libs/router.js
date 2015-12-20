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
            route.name = name;
            route.defaults = route.defaults || {};
            route.requirements = route.requirements || {};
            route.methods = route.methods || ['all'];
            route.path = prefix + route.path;

            this.routeMap[name] = route;
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
 * @method _applyRoute
 * @param {object} route
 * @return {Router}
 */
Router.prototype._applyRoute = function(route) {
    var _this = this,
        methods = this.getMethods(route);

    methods.forEach(function (method) {
        _this.app[method](_this._getPath(route), function(req, res) {
            res.render(_this.getTemplate(route), _this.getController(route)(req, res, _this));
        });
    });

    return this;
};

/**
 * @method _getPath
 * @param {object} route
 * @return {string}
 */
Router.prototype._getPath = function(route) {
    var result,
        path = route.path || '',
        PARAM_PATTERN = /\{([^}]+)\}/g;

    result = path.replace(PARAM_PATTERN, function (match, name) {
        var pattern = (route.requirements[name] !== undefined) ? '(' + route.requirements[name] + ')' : '';

        return ':' + name + pattern;
    });

    return result;
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

    if (!route.defaults._controller || this.getFormat(route) == 'json') {
        result = function (req, res) {
            return {};
        };
    } else {
        result = require(path.join(this.baseDir, route.defaults._controller));
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

    if (route.defaults._format !== undefined && this.FORMATS.hasOwnProperty(route.defaults._format)) {
        result = route.defaults._format;
    } else if (!this.getTemplate(route)) {
        result = 'html';
    } else {
        result = 'json';
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

    if (route.defaults._template === undefined) {
        // TODO: Replace this to link to the static page
        result = '<!doctype html><html><head><title>' + route.name + '</title></head><body><h1>' + route.name + '</h1></body></html>'
    } else {
        result = route.defaults._template;
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

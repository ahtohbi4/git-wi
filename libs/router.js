var fs = require('fs');

/**
 * Router
 */
var Router = function () {};

/**
 * @method init
 * @param {object} options
 * @param {string} file
 */
Router.prototype.init = function(options) {
    if (options === undefined || options.file === undefined) {
        throw new Error('Missed the required param!');
    } else {
        this.file = options.file;
    }

    this.routeMap = {};
    this._generateRouteMap();

    this.uriMap = {};
    this._generateUriMap();
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
Router.prototype._parseLevel = function(routes, prefix) {
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
Router.prototype._generateRouteMap = function() {
    this._parseLevel(this._getRoutesFromFile(this.file));

    return this;
};

/**
 * @method _generateUriMap
 */
Router.prototype._generateUriMap = function() {
    for (var routeName in this.routeMap) {
        var route = this.routeMap[routeName];

        this.uriMap[route.uri] = route;
    }
};

module.exports = new Router();

var fs = require('fs');
var path = require('path');
var config = require(path.join(__dirname, 'config'));

/**
 * Router
 */
var Router = function () {
    var _this = this;

    return function (app) {
        _this.file = path.join(__dirname, config.get('routing'));

        _this.routeMap = {};
        _this._generateRouteMap();

        _this.uriMap = {};
        _this._generateUriMap();
    };
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

module.exports = new Router();

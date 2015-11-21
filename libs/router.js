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

    this._routeMap = {};
    this._parseLevel(this._getRouteMapFromFile(this.file));
    console.log('_routeMap:\n' + JSON.stringify(this._routeMap));
};

/**
 * @method _getRouteMapFromFile
 * @param {string} file
 */
Router.prototype._getRouteMapFromFile = function (file) {
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

    for (routeName in routes) {
        if (routes[routeName].resource !== undefined) {
            var nextLevel = _this._getRouteMapFromFile(routes[routeName].resource);
            var nextPrefix = prefix + (routes[routeName].prefix || '');

            _this._parseLevel(nextLevel, nextPrefix);
        } else {
            _this._routeMap[routeName] = routes[routeName];
            _this._routeMap[routeName].uri = prefix + _this._routeMap[routeName].uri;
        }
    }

    return this;
};

module.exports = new Router();

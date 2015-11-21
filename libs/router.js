var fs = require('fs');

var Router = function () {};

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

Router.prototype._getRouteMapFromFile = function (file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

Router.prototype._parseLevel = function(routes, prefix) {
    var _this = this,
        prefix = prefix || '';

    for (routeName in routes) {
        if (routes[routeName].resource !== undefined) {
            _this._parseLevel(_this._getRouteMapFromFile(routes[routeName].resource), prefix + routes[routeName].prefix);
        } else {
            _this._routeMap[routeName] = routes[routeName];
            _this._routeMap[routeName].url = prefix + _this._routeMap[routeName].url;
        }
    }

    return this;
};

module.exports = new Router();

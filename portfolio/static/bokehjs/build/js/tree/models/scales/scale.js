"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty, slice = [].slice;
var transforms_1 = require("../transforms");
exports.Scale = (function (superClass) {
    extend(Scale, superClass);
    function Scale() {
        return Scale.__super__.constructor.apply(this, arguments);
    }
    Scale.prototype.map_to_target = function () {
        var rest, x;
        x = arguments[0], rest = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return this.compute.apply(this, [x].concat(slice.call(rest)));
    };
    Scale.prototype.v_map_to_target = function () {
        var rest, xs;
        xs = arguments[0], rest = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return this.v_compute.apply(this, [xs].concat(slice.call(rest)));
    };
    Scale.prototype.map_from_target = function (xprime) {
        return this.invert(xprime);
    };
    Scale.prototype.v_map_from_target = function (xprimes) {
        return this.v_invert(xprimes);
    };
    return Scale;
})(transforms_1.Transform);

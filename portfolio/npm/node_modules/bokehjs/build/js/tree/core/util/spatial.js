"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/// <reference types="@types/rbush" />
var rbush = require("rbush");
var SpatialIndex = (function () {
    function SpatialIndex() {
    }
    return SpatialIndex;
}());
exports.SpatialIndex = SpatialIndex;
var RBush = (function (_super) {
    tslib_1.__extends(RBush, _super);
    function RBush(points) {
        var _this = _super.call(this) || this;
        _this.index = rbush();
        _this.index.load(points);
        return _this;
    }
    Object.defineProperty(RBush.prototype, "bbox", {
        get: function () {
            var _a = this.index.toJSON(), minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
            return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        },
        enumerable: true,
        configurable: true
    });
    RBush.prototype.search = function (rect) {
        return this.index.search(rect);
    };
    RBush.prototype.indices = function (rect) {
        var points = this.search(rect);
        var n = points.length;
        var indices = new Array(n);
        for (var j = 0; j < n; j++) {
            indices[j] = points[j].i;
        }
        return indices;
    };
    return RBush;
}(SpatialIndex));
exports.RBush = RBush;

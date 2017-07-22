"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var linear_scale_1 = require("./linear_scale");
var types_1 = require("core/util/types");
exports.CategoricalScale = (function (superClass) {
    extend(CategoricalScale, superClass);
    function CategoricalScale() {
        return CategoricalScale.__super__.constructor.apply(this, arguments);
    }
    CategoricalScale.prototype.type = "CategoricalScale";
    CategoricalScale.prototype.compute = function (x, return_synthetic) {
        var factor, factors, percent, range, ref, result;
        if (return_synthetic == null) {
            return_synthetic = false;
        }
        if (types_1.isNumber(x)) {
            if (return_synthetic) {
                return x;
            }
            else {
                return CategoricalScale.__super__.compute.call(this, x);
            }
        }
        range = this.source_range;
        factors = range.factors;
        if (x.indexOf(':') >= 0) {
            ref = x.split(':'), factor = ref[0], percent = ref[1];
            percent = parseFloat(percent);
            result = factors.indexOf(factor) + 0.5 + range.offset + percent;
        }
        else {
            result = factors.indexOf(x) + 1 + range.offset;
        }
        if (return_synthetic) {
            return result;
        }
        else {
            return CategoricalScale.__super__.compute.call(this, result);
        }
    };
    CategoricalScale.prototype.v_compute = function (xs, return_synthetic) {
        var factor, factors, i, j, percent, range, ref, ref1, results, x;
        if (return_synthetic == null) {
            return_synthetic = false;
        }
        if (types_1.isNumber(xs[0])) {
            if (return_synthetic) {
                return xs;
            }
            else {
                return CategoricalScale.__super__.v_compute.call(this, xs);
            }
        }
        range = this.source_range;
        factors = range.factors;
        results = Array(xs.length);
        for (i = j = 0, ref = xs.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            x = xs[i];
            if (x.indexOf(':') >= 0) {
                ref1 = x.split(':'), factor = ref1[0], percent = ref1[1];
                percent = parseFloat(percent);
                results[i] = factors.indexOf(factor) + 0.5 + range.offset + percent;
            }
            else {
                results[i] = factors.indexOf(x) + 1 + range.offset;
            }
        }
        if (return_synthetic) {
            return results;
        }
        else {
            return CategoricalScale.__super__.v_compute.call(this, results);
        }
    };
    CategoricalScale.prototype.invert = function (xprime, skip_cat) {
        var factors, range;
        if (skip_cat == null) {
            skip_cat = false;
        }
        xprime = CategoricalScale.__super__.invert.call(this, xprime);
        if (skip_cat) {
            return xprime;
        }
        range = this.source_range;
        factors = range.factors;
        return factors[Math.floor(xprime - 0.5 - range.offset)];
    };
    CategoricalScale.prototype.v_invert = function (xprimes, skip_cat) {
        var factors, i, j, k, range, ref, ref1, result, x;
        if (skip_cat == null) {
            skip_cat = false;
        }
        x = CategoricalScale.__super__.v_invert.call(this, xprimes);
        for (i = j = 0, ref = x.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            x[i] = x[i];
        }
        if (skip_cat) {
            return x;
        }
        result = Array(x);
        range = this.source_range;
        factors = range.factors;
        for (i = k = 0, ref1 = xprimes.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
            result[i] = factors[Math.floor(x[i] - 0.5 - range.offset)];
        }
        return result;
    };
    return CategoricalScale;
})(linear_scale_1.LinearScale);

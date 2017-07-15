var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  Scale
} from "./scale";

import * as p from "core/properties";

export var LinearScale = (function(superClass) {
  extend(LinearScale, superClass);

  function LinearScale() {
    return LinearScale.__super__.constructor.apply(this, arguments);
  }

  LinearScale.prototype.type = "LinearScale";

  LinearScale.prototype.compute = function(x) {
    var factor, offset, ref;
    ref = this._compute_state(), factor = ref[0], offset = ref[1];
    return factor * x + offset;
  };

  LinearScale.prototype.v_compute = function(xs) {
    var factor, i, idx, len, offset, ref, result, x;
    ref = this._compute_state(), factor = ref[0], offset = ref[1];
    result = new Float64Array(xs.length);
    for (idx = i = 0, len = xs.length; i < len; idx = ++i) {
      x = xs[idx];
      result[idx] = factor * x + offset;
    }
    return result;
  };

  LinearScale.prototype.invert = function(xprime) {
    var factor, offset, ref;
    ref = this._compute_state(), factor = ref[0], offset = ref[1];
    return (xprime - offset) / factor;
  };

  LinearScale.prototype.v_invert = function(xprimes) {
    var factor, i, idx, len, offset, ref, result, xprime;
    ref = this._compute_state(), factor = ref[0], offset = ref[1];
    result = new Float64Array(xprimes.length);
    for (idx = i = 0, len = xprimes.length; i < len; idx = ++i) {
      xprime = xprimes[idx];
      result[idx] = (xprime - offset) / factor;
    }
    return result;
  };

  LinearScale.prototype._compute_state = function() {
    var factor, offset, source_end, source_start, target_end, target_start;
    source_start = this.source_range.start;
    source_end = this.source_range.end;
    target_start = this.target_range.start;
    target_end = this.target_range.end;
    factor = (target_end - target_start) / (source_end - source_start);
    offset = -(factor * source_start) + target_start;
    return [factor, offset];
  };

  LinearScale.internal({
    source_range: [p.Any],
    target_range: [p.Any]
  });

  return LinearScale;

})(Scale);

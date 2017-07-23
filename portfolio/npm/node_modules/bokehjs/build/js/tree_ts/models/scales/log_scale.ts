var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  Scale
} from "./scale";

import * as p from "core/properties";

export var LogScale = (function(superClass) {
  extend(LogScale, superClass);

  function LogScale() {
    return LogScale.__super__.constructor.apply(this, arguments);
  }

  LogScale.prototype.type = "LogScale";

  LogScale.prototype.compute = function(x) {
    var _x, factor, inter_factor, inter_offset, offset, ref, value;
    ref = this._compute_state(), factor = ref[0], offset = ref[1], inter_factor = ref[2], inter_offset = ref[3];
    if (inter_factor === 0) {
      value = 0;
    } else {
      _x = (Math.log(x) - inter_offset) / inter_factor;
      if (isFinite(_x)) {
        value = _x * factor + offset;
      } else {
        value = 0/0;
      }
    }
    return value;
  };

  LogScale.prototype.v_compute = function(xs) {
    var _x, factor, i, inter_factor, inter_offset, j, k, offset, ref, ref1, ref2, result, value;
    ref = this._compute_state(), factor = ref[0], offset = ref[1], inter_factor = ref[2], inter_offset = ref[3];
    result = new Float64Array(xs.length);
    if (inter_factor === 0) {
      for (i = j = 0, ref1 = xs.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
        result[i] = 0;
      }
    } else {
      for (i = k = 0, ref2 = xs.length; 0 <= ref2 ? k < ref2 : k > ref2; i = 0 <= ref2 ? ++k : --k) {
        _x = (Math.log(xs[i]) - inter_offset) / inter_factor;
        if (isFinite(_x)) {
          value = _x * factor + offset;
        } else {
          value = 0/0;
        }
        result[i] = value;
      }
    }
    return result;
  };

  LogScale.prototype.invert = function(xprime) {
    var factor, inter_factor, inter_offset, offset, ref, value;
    ref = this._compute_state(), factor = ref[0], offset = ref[1], inter_factor = ref[2], inter_offset = ref[3];
    value = (xprime - offset) / factor;
    return Math.exp(inter_factor * value + inter_offset);
  };

  LogScale.prototype.v_invert = function(xprimes) {
    var factor, i, inter_factor, inter_offset, j, offset, ref, ref1, result, value;
    ref = this._compute_state(), factor = ref[0], offset = ref[1], inter_factor = ref[2], inter_offset = ref[3];
    result = new Float64Array(xprimes.length);
    for (i = j = 0, ref1 = xprimes.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
      value = (xprimes[i] - offset) / factor;
      result[i] = Math.exp(inter_factor * value + inter_offset);
    }
    return result;
  };

  LogScale.prototype._get_safe_factor = function(orig_start, orig_end) {
    var end, log_val, ref, start;
    if (orig_start < 0) {
      start = 0;
    } else {
      start = orig_start;
    }
    if (orig_end < 0) {
      end = 0;
    } else {
      end = orig_end;
    }
    if (start === end) {
      if (start === 0) {
        ref = [1, 10], start = ref[0], end = ref[1];
      } else {
        log_val = Math.log(start) / Math.log(10);
        start = Math.pow(10, Math.floor(log_val));
        if (Math.ceil(log_val) !== Math.floor(log_val)) {
          end = Math.pow(10, Math.ceil(log_val));
        } else {
          end = Math.pow(10, Math.ceil(log_val) + 1);
        }
      }
    }
    return [start, end];
  };

  LogScale.prototype._compute_state = function() {
    var end, factor, inter_factor, inter_offset, offset, ref, screen_range, source_end, source_start, start, target_end, target_start;
    source_start = this.source_range.start;
    source_end = this.source_range.end;
    target_start = this.target_range.start;
    target_end = this.target_range.end;
    screen_range = target_end - target_start;
    ref = this._get_safe_factor(source_start, source_end), start = ref[0], end = ref[1];
    if (start === 0) {
      inter_factor = Math.log(end);
      inter_offset = 0;
    } else {
      inter_factor = Math.log(end) - Math.log(start);
      inter_offset = Math.log(start);
    }
    factor = screen_range;
    offset = target_start;
    return [factor, offset, inter_factor, inter_offset];
  };

  LogScale.internal({
    source_range: [p.Any],
    target_range: [p.Any]
  });

  return LogScale;

})(Scale);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  logger
} from "core/logging";

import {
  range
} from "core/util/array";

import {
  AdaptiveTicker
} from "./adaptive_ticker";

export var LogTicker = (function(superClass) {
  extend(LogTicker, superClass);

  function LogTicker() {
    return LogTicker.__super__.constructor.apply(this, arguments);
  }

  LogTicker.prototype.type = 'LogTicker';

  LogTicker.override({
    mantissas: [1, 5]
  });

  LogTicker.prototype.get_ticks_no_defaults = function(data_low, data_high, cross_loc, desired_n_ticks) {
    var base, end_factor, endlog, factor, factors, i, interval, j, k, l, len, len1, len2, len3, len4, len5, log_high, log_interval, log_low, m, minor_interval, minor_offsets, minor_ticks, n, num_minor_ticks, o, ref, start_factor, startlog, tick, ticks, x;
    num_minor_ticks = this.num_minor_ticks;
    minor_ticks = [];
    base = this.base;
    log_low = Math.log(data_low) / Math.log(base);
    log_high = Math.log(data_high) / Math.log(base);
    log_interval = log_high - log_low;
    if (!isFinite(log_interval)) {
      ticks = [];
    } else if (log_interval < 2) {
      interval = this.get_interval(data_low, data_high, desired_n_ticks);
      start_factor = Math.floor(data_low / interval);
      end_factor = Math.ceil(data_high / interval);
      factors = range(start_factor, end_factor + 1);
      ticks = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = factors.length; j < len; j++) {
          factor = factors[j];
          if (factor !== 0) {
            results.push(factor * interval);
          }
        }
        return results;
      })();
      ticks = ticks.filter(function(tick) {
        return (data_low <= tick && tick <= data_high);
      });
      if (num_minor_ticks > 0 && ticks.length > 0) {
        minor_interval = interval / num_minor_ticks;
        minor_offsets = (function() {
          var j, ref, results;
          results = [];
          for (i = j = 0, ref = num_minor_ticks; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            results.push(i * minor_interval);
          }
          return results;
        })();
        ref = minor_offsets.slice(1, +minor_offsets.length + 1 || 9e9);
        for (j = 0, len = ref.length; j < len; j++) {
          x = ref[j];
          minor_ticks.push(ticks[0] - x);
        }
        for (k = 0, len1 = ticks.length; k < len1; k++) {
          tick = ticks[k];
          for (l = 0, len2 = minor_offsets.length; l < len2; l++) {
            x = minor_offsets[l];
            minor_ticks.push(tick + x);
          }
        }
      }
    } else {
      startlog = Math.ceil(log_low * 0.999999);
      endlog = Math.floor(log_high * 1.000001);
      interval = Math.ceil((endlog - startlog) / 9.0);
      ticks = range(startlog, endlog + 1, interval);
      ticks = ticks.map(function(i) {
        return Math.pow(base, i);
      });
      ticks = ticks.filter(function(tick) {
        return (data_low <= tick && tick <= data_high);
      });
      if (num_minor_ticks > 0 && ticks.length > 0) {
        minor_interval = Math.pow(base, interval) / num_minor_ticks;
        minor_offsets = (function() {
          var m, ref1, results;
          results = [];
          for (i = m = 1, ref1 = num_minor_ticks; 1 <= ref1 ? m <= ref1 : m >= ref1; i = 1 <= ref1 ? ++m : --m) {
            results.push(i * minor_interval);
          }
          return results;
        })();
        for (m = 0, len3 = minor_offsets.length; m < len3; m++) {
          x = minor_offsets[m];
          minor_ticks.push(ticks[0] / x);
        }
        minor_ticks.push(ticks[0]);
        for (n = 0, len4 = ticks.length; n < len4; n++) {
          tick = ticks[n];
          for (o = 0, len5 = minor_offsets.length; o < len5; o++) {
            x = minor_offsets[o];
            minor_ticks.push(tick * x);
          }
        }
      }
    }
    return {
      major: ticks,
      minor: minor_ticks
    };
  };

  return LogTicker;

})(AdaptiveTicker);

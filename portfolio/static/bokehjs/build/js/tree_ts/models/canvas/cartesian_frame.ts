var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  CategoricalScale
} from "../scales/categorical_scale";

import {
  LinearScale
} from "../scales/linear_scale";

import {
  LogScale
} from "../scales/log_scale";

import {
  Range1d
} from "../ranges/range1d";

import {
  DataRange1d
} from "../ranges/data_range1d";

import {
  FactorRange
} from "../ranges/factor_range";

import {
  EQ,
  GE
} from "core/layout/solver";

import {
  LayoutCanvas
} from "core/layout/layout_canvas";

import {
  logger
} from "core/logging";

import * as p from "core/properties";

export var CartesianFrame = (function(superClass) {
  extend(CartesianFrame, superClass);

  function CartesianFrame() {
    return CartesianFrame.__super__.constructor.apply(this, arguments);
  }

  CartesianFrame.prototype.type = 'CartesianFrame';

  CartesianFrame.prototype.initialize = function(attrs, options) {
    CartesianFrame.__super__.initialize.call(this, attrs, options);
    this.panel = this;
    this._configure_scales();
    this.connect(this.change, (function(_this) {
      return function() {
        return _this._configure_scales();
      };
    })(this));
    return null;
  };

  CartesianFrame.prototype.contains = function(vx, vy) {
    return vx >= this._left.value && vx <= this._right.value && vy >= this._bottom.value && vy <= this._top.value;
  };

  CartesianFrame.prototype.map_to_screen = function(x, y, canvas, x_name, y_name) {
    var sx, sy, vx, vy;
    if (x_name == null) {
      x_name = 'default';
    }
    if (y_name == null) {
      y_name = 'default';
    }
    vx = this.xscales[x_name].v_compute(x);
    sx = canvas.v_vx_to_sx(vx);
    vy = this.yscales[y_name].v_compute(y);
    sy = canvas.v_vy_to_sy(vy);
    return [sx, sy];
  };

  CartesianFrame.prototype._get_ranges = function(range, extra_ranges) {
    var extra_range, name, ranges;
    ranges = {};
    ranges['default'] = range;
    if (extra_ranges != null) {
      for (name in extra_ranges) {
        extra_range = extra_ranges[name];
        ranges[name] = extra_range;
      }
    }
    return ranges;
  };

  CartesianFrame.prototype._get_scales = function(scale, ranges, frame_range) {
    var name, range, s, scales;
    scales = {};
    for (name in ranges) {
      range = ranges[name];
      if (range instanceof DataRange1d || range instanceof Range1d) {
        if (!(scale instanceof LogScale) && !(scale instanceof LinearScale)) {
          throw new Error("Range " + range.type + " is incompatible is Scale " + scale.type);
        }
        if (scale instanceof CategoricalScale) {
          throw new Error("Range " + range.type + " is incompatible is Scale " + scale.type);
        }
      }
      if (range instanceof FactorRange) {
        if (!(scale instanceof CategoricalScale)) {
          throw new Error("Range " + range.type + " is incompatible is Scale " + scale.type);
        }
      }
      if (scale instanceof LogScale && range instanceof DataRange1d) {
        range.scale_hint = "log";
      }
      s = scale.clone();
      s.setv({
        source_range: range,
        target_range: frame_range
      });
      scales[name] = s;
    }
    return scales;
  };

  CartesianFrame.prototype._configure_frame_ranges = function() {
    this._h_range = new Range1d({
      start: this._left.value,
      end: this._left.value + this._width.value
    });
    return this._v_range = new Range1d({
      start: this._bottom.value,
      end: this._bottom.value + this._height.value
    });
  };

  CartesianFrame.prototype._configure_scales = function() {
    this._configure_frame_ranges();
    this._x_ranges = this._get_ranges(this.x_range, this.extra_x_ranges);
    this._y_ranges = this._get_ranges(this.y_range, this.extra_y_ranges);
    this._xscales = this._get_scales(this.x_scale, this._x_ranges, this._h_range);
    return this._yscales = this._get_scales(this.y_scale, this._y_ranges, this._v_range);
  };

  CartesianFrame.prototype._update_scales = function() {
    var name, ref, ref1, scale;
    this._configure_frame_ranges();
    ref = this._xscales;
    for (name in ref) {
      scale = ref[name];
      scale.target_range = this._h_range;
    }
    ref1 = this._yscales;
    for (name in ref1) {
      scale = ref1[name];
      scale.target_range = this._v_range;
    }
    return null;
  };

  CartesianFrame.getters({
    h_range: function() {
      return this._h_range;
    },
    v_range: function() {
      return this._v_range;
    },
    x_ranges: function() {
      return this._x_ranges;
    },
    y_ranges: function() {
      return this._y_ranges;
    },
    xscales: function() {
      return this._xscales;
    },
    yscales: function() {
      return this._yscales;
    },
    x_mappers: function() {
      logger.warn("x_mappers attr is deprecated, use xscales");
      return this._xscales;
    },
    y_mappers: function() {
      logger.warn("y_mappers attr is deprecated, use yscales");
      return this._yscales;
    }
  });

  CartesianFrame.internal({
    extra_x_ranges: [p.Any, {}],
    extra_y_ranges: [p.Any, {}],
    x_range: [p.Instance],
    y_range: [p.Instance],
    x_scale: [p.Instance],
    y_scale: [p.Instance]
  });

  CartesianFrame.prototype.get_constraints = function() {
    return [GE(this._top), GE(this._bottom), GE(this._left), GE(this._right), GE(this._width), GE(this._height), EQ(this._left, this._width, [-1, this._right]), EQ(this._bottom, this._height, [-1, this._top])];
  };

  return CartesianFrame;

})(LayoutCanvas);

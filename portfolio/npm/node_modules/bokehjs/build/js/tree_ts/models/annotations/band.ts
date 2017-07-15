var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  Annotation,
  AnnotationView
} from "./annotation";

import {
  ColumnDataSource
} from "../sources/column_data_source";

import * as p from "core/properties";

export var BandView = (function(superClass) {
  extend(BandView, superClass);

  function BandView() {
    return BandView.__super__.constructor.apply(this, arguments);
  }

  BandView.prototype.initialize = function(options) {
    BandView.__super__.initialize.call(this, options);
    return this.set_data(this.model.source);
  };

  BandView.prototype.connect_signals = function() {
    BandView.__super__.connect_signals.call(this);
    this.connect(this.model.source.streaming, function() {
      return this.set_data(this.model.source);
    });
    this.connect(this.model.source.patching, function() {
      return this.set_data(this.model.source);
    });
    return this.connect(this.model.source.change, function() {
      return this.set_data(this.model.source);
    });
  };

  BandView.prototype.set_data = function(source) {
    BandView.__super__.set_data.call(this, source);
    this.visuals.warm_cache(source);
    return this.plot_view.request_render();
  };

  BandView.prototype._map_data = function() {
    var _base_vx, _lower, _lower_vx, _upper, _upper_vx, base_scale, i, j, limit_scale, ref, x_scale, y_scale;
    x_scale = this.plot_view.frame.xscales[this.model.x_range_name];
    y_scale = this.plot_view.frame.yscales[this.model.y_range_name];
    limit_scale = this.model.dimension === "height" ? y_scale : x_scale;
    base_scale = this.model.dimension === "height" ? x_scale : y_scale;
    if (this.model.lower.units === "data") {
      _lower_vx = limit_scale.v_compute(this._lower);
    } else {
      _lower_vx = this._lower;
    }
    if (this.model.upper.units === "data") {
      _upper_vx = limit_scale.v_compute(this._upper);
    } else {
      _upper_vx = this._upper;
    }
    if (this.model.base.units === "data") {
      _base_vx = base_scale.v_compute(this._base);
    } else {
      _base_vx = this._base;
    }
    ref = this.model._normals(), i = ref[0], j = ref[1];
    _lower = [_lower_vx, _base_vx];
    _upper = [_upper_vx, _base_vx];
    this._lower_sx = this.plot_model.canvas.v_vx_to_sx(_lower[i]);
    this._lower_sy = this.plot_model.canvas.v_vy_to_sy(_lower[j]);
    this._upper_sx = this.plot_model.canvas.v_vx_to_sx(_upper[i]);
    return this._upper_sy = this.plot_model.canvas.v_vy_to_sy(_upper[j]);
  };

  BandView.prototype.render = function() {
    var ctx, i, k, l, m, n, ref, ref1, ref2, ref3;
    if (!this.model.visible) {
      return;
    }
    this._map_data();
    ctx = this.plot_view.canvas_view.ctx;
    ctx.beginPath();
    ctx.moveTo(this._lower_sx[0], this._lower_sy[0]);
    for (i = k = 0, ref = this._lower_sx.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      ctx.lineTo(this._lower_sx[i], this._lower_sy[i]);
    }
    for (i = l = ref1 = this._upper_sx.length - 1; ref1 <= 0 ? l <= 0 : l >= 0; i = ref1 <= 0 ? ++l : --l) {
      ctx.lineTo(this._upper_sx[i], this._upper_sy[i]);
    }
    ctx.closePath();
    if (this.visuals.fill.doit) {
      this.visuals.fill.set_value(ctx);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(this._lower_sx[0], this._lower_sy[0]);
    for (i = m = 0, ref2 = this._lower_sx.length; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
      ctx.lineTo(this._lower_sx[i], this._lower_sy[i]);
    }
    if (this.visuals.line.doit) {
      this.visuals.line.set_value(ctx);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(this._upper_sx[0], this._upper_sy[0]);
    for (i = n = 0, ref3 = this._upper_sx.length; 0 <= ref3 ? n < ref3 : n > ref3; i = 0 <= ref3 ? ++n : --n) {
      ctx.lineTo(this._upper_sx[i], this._upper_sy[i]);
    }
    if (this.visuals.line.doit) {
      this.visuals.line.set_value(ctx);
      return ctx.stroke();
    }
  };

  return BandView;

})(AnnotationView);

export var Band = (function(superClass) {
  extend(Band, superClass);

  function Band() {
    return Band.__super__.constructor.apply(this, arguments);
  }

  Band.prototype.default_view = BandView;

  Band.prototype.type = 'Band';

  Band.mixins(['line', 'fill']);

  Band.define({
    lower: [p.DistanceSpec],
    upper: [p.DistanceSpec],
    base: [p.DistanceSpec],
    dimension: [p.Dimension, 'height'],
    source: [
      p.Instance, function() {
        return new ColumnDataSource();
      }
    ],
    x_range_name: [p.String, 'default'],
    y_range_name: [p.String, 'default']
  });

  Band.override({
    fill_color: "#fff9ba",
    fill_alpha: 0.4,
    line_color: "#cccccc",
    line_alpha: 0.3
  });

  Band.prototype._normals = function() {
    var i, j, ref, ref1;
    if (this.dimension === 'height') {
      ref = [1, 0], i = ref[0], j = ref[1];
    } else {
      ref1 = [0, 1], i = ref1[0], j = ref1[1];
    }
    return [i, j];
  };

  return Band;

})(Annotation);

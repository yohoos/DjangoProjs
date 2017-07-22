var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import * as hittest from "core/hittest";

import {
  RBush
} from "core/util/spatial";

import {
  Glyph,
  GlyphView
} from "./glyph";

export var SegmentView = (function(superClass) {
  extend(SegmentView, superClass);

  function SegmentView() {
    return SegmentView.__super__.constructor.apply(this, arguments);
  }

  SegmentView.prototype._index_data = function() {
    var i, j, points, ref;
    points = [];
    for (i = j = 0, ref = this._x0.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      if (!isNaN(this._x0[i] + this._x1[i] + this._y0[i] + this._y1[i])) {
        points.push({
          minX: Math.min(this._x0[i], this._x1[i]),
          minY: Math.min(this._y0[i], this._y1[i]),
          maxX: Math.max(this._x0[i], this._x1[i]),
          maxY: Math.max(this._y0[i], this._y1[i]),
          i: i
        });
      }
    }
    return new RBush(points);
  };

  SegmentView.prototype._render = function(ctx, indices, arg) {
    var i, j, len, results, sx0, sx1, sy0, sy1;
    sx0 = arg.sx0, sy0 = arg.sy0, sx1 = arg.sx1, sy1 = arg.sy1;
    if (this.visuals.line.doit) {
      results = [];
      for (j = 0, len = indices.length; j < len; j++) {
        i = indices[j];
        if (isNaN(sx0[i] + sy0[i] + sx1[i] + sy1[i])) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(sx0[i], sy0[i]);
        ctx.lineTo(sx1[i], sy1[i]);
        this.visuals.line.set_vectorize(ctx, i);
        results.push(ctx.stroke());
      }
      return results;
    }
  };

  SegmentView.prototype._hit_point = function(geometry) {
    var candidates, dist, hits, i, j, len, p0, p1, point, ref, ref1, result, threshold, vx, vy, x, y;
    ref = [geometry.vx, geometry.vy], vx = ref[0], vy = ref[1];
    x = this.renderer.xscale.invert(vx, true);
    y = this.renderer.yscale.invert(vy, true);
    point = {
      x: this.renderer.plot_view.canvas.vx_to_sx(vx),
      y: this.renderer.plot_view.canvas.vy_to_sy(vy)
    };
    hits = [];
    candidates = this.index.indices({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y
    });
    for (j = 0, len = candidates.length; j < len; j++) {
      i = candidates[j];
      threshold = Math.max(2, this.visuals.line.cache_select('line_width', i) / 2);
      ref1 = [
        {
          x: this.sx0[i],
          y: this.sy0[i]
        }, {
          x: this.sx1[i],
          y: this.sy1[i]
        }
      ], p0 = ref1[0], p1 = ref1[1];
      dist = hittest.dist_to_segment(point, p0, p1);
      if (dist < threshold) {
        hits.push(i);
      }
    }
    result = hittest.create_hit_test_result();
    result['1d'].indices = hits;
    return result;
  };

  SegmentView.prototype._hit_span = function(geometry) {
    var candidates, hits, hr, i, j, len, ref, ref1, ref2, result, v0, v1, val, vr, vx, vy;
    hr = this.renderer.plot_view.frame.h_range;
    vr = this.renderer.plot_view.frame.v_range;
    ref = [geometry.vx, geometry.vy], vx = ref[0], vy = ref[1];
    if (geometry.direction === 'v') {
      val = this.renderer.yscale.invert(vy);
      ref1 = [this._y0, this._y1], v0 = ref1[0], v1 = ref1[1];
    } else {
      val = this.renderer.xscale.invert(vx);
      ref2 = [this._x0, this._x1], v0 = ref2[0], v1 = ref2[1];
    }
    hits = [];
    candidates = this.index.indices({
      minX: this.renderer.xscale.invert(hr.min),
      minY: this.renderer.yscale.invert(vr.min),
      maxX: this.renderer.xscale.invert(hr.max),
      maxY: this.renderer.yscale.invert(vr.max)
    });
    for (j = 0, len = candidates.length; j < len; j++) {
      i = candidates[j];
      if ((v0[i] <= val && val <= v1[i]) || (v1[i] <= val && val <= v0[i])) {
        hits.push(i);
      }
    }
    result = hittest.create_hit_test_result();
    result['1d'].indices = hits;
    return result;
  };

  SegmentView.prototype.scx = function(i) {
    return (this.sx0[i] + this.sx1[i]) / 2;
  };

  SegmentView.prototype.scy = function(i) {
    return (this.sy0[i] + this.sy1[i]) / 2;
  };

  SegmentView.prototype.draw_legend_for_index = function(ctx, x0, x1, y0, y1, index) {
    return this._generic_line_legend(ctx, x0, x1, y0, y1, index);
  };

  return SegmentView;

})(GlyphView);

export var Segment = (function(superClass) {
  extend(Segment, superClass);

  function Segment() {
    return Segment.__super__.constructor.apply(this, arguments);
  }

  Segment.prototype.default_view = SegmentView;

  Segment.prototype.type = 'Segment';

  Segment.coords([['x0', 'y0'], ['x1', 'y1']]);

  Segment.mixins(['line']);

  return Segment;

})(Glyph);

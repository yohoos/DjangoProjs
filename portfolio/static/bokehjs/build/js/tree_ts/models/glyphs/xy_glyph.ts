var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  RBush
} from "core/util/spatial";

import {
  Glyph,
  GlyphView
} from "./glyph";

import {
  CategoricalScale
} from "../scales/categorical_scale";

export var XYGlyphView = (function(superClass) {
  extend(XYGlyphView, superClass);

  function XYGlyphView() {
    return XYGlyphView.__super__.constructor.apply(this, arguments);
  }

  XYGlyphView.prototype._index_data = function() {
    var i, j, points, ref, x, xx, y, yy;
    if (this.renderer.xscale instanceof CategoricalScale) {
      xx = this.renderer.xscale.v_compute(this._x, true);
    } else {
      xx = this._x;
    }
    if (this.renderer.yscale instanceof CategoricalScale) {
      yy = this.renderer.yscale.v_compute(this._y, true);
    } else {
      yy = this._y;
    }
    points = [];
    for (i = j = 0, ref = xx.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      x = xx[i];
      if (isNaN(x) || !isFinite(x)) {
        continue;
      }
      y = yy[i];
      if (isNaN(y) || !isFinite(y)) {
        continue;
      }
      points.push({
        minX: x,
        minY: y,
        maxX: x,
        maxY: y,
        i: i
      });
    }
    return new RBush(points);
  };

  return XYGlyphView;

})(GlyphView);

export var XYGlyph = (function(superClass) {
  extend(XYGlyph, superClass);

  function XYGlyph() {
    return XYGlyph.__super__.constructor.apply(this, arguments);
  }

  XYGlyph.prototype.type = "XYGlyph";

  XYGlyph.prototype.default_view = XYGlyphView;

  XYGlyph.coords([['x', 'y']]);

  return XYGlyph;

})(Glyph);

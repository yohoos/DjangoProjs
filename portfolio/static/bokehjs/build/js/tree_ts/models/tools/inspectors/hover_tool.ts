var _color_to_hex,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  InspectTool,
  InspectToolView
} from "./inspect_tool";

import {
  Tooltip
} from "../../annotations/tooltip";

import {
  GlyphRenderer
} from "../../renderers/glyph_renderer";

import * as hittest from "core/hittest";

import {
  replace_placeholders
} from "core/util/templating";

import {
  div,
  span
} from "core/dom";

import * as p from "core/properties";

import {
  values,
  isEmpty
} from "core/util/object";

import {
  isString,
  isFunction
} from "core/util/types";

import {
  build_views,
  remove_views
} from "core/build_views";

_color_to_hex = function(color) {
  var blue, digits, green, red, rgb;
  if (color.substr(0, 1) === '#') {
    return color;
  }
  digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
  red = parseInt(digits[2]);
  green = parseInt(digits[3]);
  blue = parseInt(digits[4]);
  rgb = blue | (green << 8) | (red << 16);
  return digits[1] + '#' + rgb.toString(16);
};

export var HoverToolView = (function(superClass) {
  extend(HoverToolView, superClass);

  function HoverToolView() {
    return HoverToolView.__super__.constructor.apply(this, arguments);
  }

  HoverToolView.prototype.initialize = function(options) {
    HoverToolView.__super__.initialize.call(this, options);
    return this.ttviews = {};
  };

  HoverToolView.prototype.remove = function() {
    remove_views(this.ttviews);
    return HoverToolView.__super__.remove.call(this);
  };

  HoverToolView.prototype.connect_signals = function() {
    var k, len, r, ref;
    HoverToolView.__super__.connect_signals.call(this);
    ref = this.computed_renderers;
    for (k = 0, len = ref.length; k < len; k++) {
      r = ref[k];
      this.connect(r.data_source.inspect, this._update);
    }
    this.connect(this.model.properties.renderers.change, function() {
      return this._computed_renderers = this._ttmodels = null;
    });
    this.connect(this.model.properties.names.change, function() {
      return this._computed_renderers = this._ttmodels = null;
    });
    this.connect(this.model.properties.plot.change, function() {
      return this._computed_renderers = this._ttmodels = null;
    });
    return this.connect(this.model.properties.tooltips.change, function() {
      return this._ttmodels = null;
    });
  };

  HoverToolView.prototype._compute_renderers = function() {
    var all_renderers, names, r, renderers;
    renderers = this.model.renderers;
    names = this.model.names;
    if (renderers.length === 0) {
      all_renderers = this.model.plot.renderers;
      renderers = (function() {
        var k, len, results;
        results = [];
        for (k = 0, len = all_renderers.length; k < len; k++) {
          r = all_renderers[k];
          if (r instanceof GlyphRenderer) {
            results.push(r);
          }
        }
        return results;
      })();
    }
    if (names.length > 0) {
      renderers = (function() {
        var k, len, results;
        results = [];
        for (k = 0, len = renderers.length; k < len; k++) {
          r = renderers[k];
          if (names.indexOf(r.name) >= 0) {
            results.push(r);
          }
        }
        return results;
      })();
    }
    return renderers;
  };

  HoverToolView.prototype._compute_ttmodels = function() {
    var k, l, len, len1, new_views, r, ref, tooltip, tooltips, ttmodels, view;
    ttmodels = {};
    tooltips = this.model.tooltips;
    if (tooltips != null) {
      ref = this.computed_renderers;
      for (k = 0, len = ref.length; k < len; k++) {
        r = ref[k];
        tooltip = new Tooltip({
          custom: isString(tooltips) || isFunction(tooltips),
          attachment: this.model.attachment,
          show_arrow: this.model.show_arrow
        });
        ttmodels[r.id] = tooltip;
      }
    }
    new_views = build_views(this.ttviews, values(ttmodels), {
      parent: this,
      plot_view: this.plot_view
    });
    for (l = 0, len1 = new_views.length; l < len1; l++) {
      view = new_views[l];
      view.connect_signals();
    }
    return ttmodels;
  };

  HoverToolView.getters({
    computed_renderers: function() {
      if (this._computed_renderers == null) {
        this._computed_renderers = this._compute_renderers();
      }
      return this._computed_renderers;
    },
    ttmodels: function() {
      if (this._ttmodels == null) {
        this._ttmodels = this._compute_ttmodels();
      }
      return this._ttmodels;
    }
  });

  HoverToolView.prototype._clear = function() {
    var ref, results, rid, tt;
    this._inspect(2e308, 2e308);
    ref = this.ttmodels;
    results = [];
    for (rid in ref) {
      tt = ref[rid];
      results.push(tt.clear());
    }
    return results;
  };

  HoverToolView.prototype._move = function(e) {
    var canvas, vx, vy;
    if (!this.model.active) {
      return;
    }
    canvas = this.plot_view.canvas;
    vx = canvas.sx_to_vx(e.bokeh.sx);
    vy = canvas.sy_to_vy(e.bokeh.sy);
    if (!this.plot_view.frame.contains(vx, vy)) {
      return this._clear();
    } else {
      return this._inspect(vx, vy);
    }
  };

  HoverToolView.prototype._move_exit = function() {
    return this._clear();
  };

  HoverToolView.prototype._inspect = function(vx, vy, e) {
    var geometry, hovered_indexes, hovered_renderers, k, len, r, ref, sm;
    geometry = {
      type: 'point',
      vx: vx,
      vy: vy
    };
    if (this.model.mode === 'mouse') {
      geometry['type'] = 'point';
    } else {
      geometry['type'] = 'span';
      if (this.model.mode === 'vline') {
        geometry.direction = 'h';
      } else {
        geometry.direction = 'v';
      }
    }
    hovered_indexes = [];
    hovered_renderers = [];
    ref = this.computed_renderers;
    for (k = 0, len = ref.length; k < len; k++) {
      r = ref[k];
      sm = r.data_source.selection_manager;
      sm.inspect(this, this.plot_view.renderer_views[r.id], geometry, {
        "geometry": geometry
      });
    }
    if (this.model.callback != null) {
      this._emit_callback(geometry);
    }
  };

  HoverToolView.prototype._update = function(arg) {
    var canvas, d1x, d1y, d2x, d2y, data_x, data_y, dist1, dist2, ds, frame, geometry, i, ii, indices, j, jj, k, l, len, len1, pt, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, renderer, rx, ry, sdatax, sdatay, sx, sy, tool, tooltip, vars, vx, vy, x, xscale, y, yscale;
    indices = arg[0], tool = arg[1], renderer = arg[2], ds = arg[3], (ref = arg[4], geometry = ref.geometry);
    if (!this.model.active) {
      return;
    }
    tooltip = (ref1 = this.ttmodels[renderer.model.id]) != null ? ref1 : null;
    if (tooltip == null) {
      return;
    }
    tooltip.clear();
    if (indices['0d'].glyph === null && indices['1d'].indices.length === 0) {
      return;
    }
    vx = geometry.vx;
    vy = geometry.vy;
    canvas = this.plot_model.canvas;
    frame = this.plot_model.frame;
    sx = canvas.vx_to_sx(vx);
    sy = canvas.vy_to_sy(vy);
    xscale = frame.xscales[renderer.model.x_range_name];
    yscale = frame.yscales[renderer.model.y_range_name];
    x = xscale.invert(vx);
    y = yscale.invert(vy);
    ref2 = indices['0d'].indices;
    for (k = 0, len = ref2.length; k < len; k++) {
      i = ref2[k];
      data_x = renderer.glyph._x[i + 1];
      data_y = renderer.glyph._y[i + 1];
      ii = i;
      switch (this.model.line_policy) {
        case "interp":
          ref3 = renderer.glyph.get_interpolation_hit(i, geometry), data_x = ref3[0], data_y = ref3[1];
          rx = xscale.compute(data_x);
          ry = yscale.compute(data_y);
          break;
        case "prev":
          rx = canvas.sx_to_vx(renderer.glyph.sx[i]);
          ry = canvas.sy_to_vy(renderer.glyph.sy[i]);
          break;
        case "next":
          rx = canvas.sx_to_vx(renderer.glyph.sx[i + 1]);
          ry = canvas.sy_to_vy(renderer.glyph.sy[i + 1]);
          ii = i + 1;
          break;
        case "nearest":
          d1x = renderer.glyph.sx[i];
          d1y = renderer.glyph.sy[i];
          dist1 = hittest.dist_2_pts(d1x, d1y, sx, sy);
          d2x = renderer.glyph.sx[i + 1];
          d2y = renderer.glyph.sy[i + 1];
          dist2 = hittest.dist_2_pts(d2x, d2y, sx, sy);
          if (dist1 < dist2) {
            ref4 = [d1x, d1y], sdatax = ref4[0], sdatay = ref4[1];
          } else {
            ref5 = [d2x, d2y], sdatax = ref5[0], sdatay = ref5[1];
            ii = i + 1;
          }
          data_x = renderer.glyph._x[i];
          data_y = renderer.glyph._y[i];
          rx = canvas.sx_to_vx(sdatax);
          ry = canvas.sy_to_vy(sdatay);
          break;
        default:
          ref6 = [vx, vy], rx = ref6[0], ry = ref6[1];
      }
      vars = {
        index: ii,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        sx: sx,
        sy: sy,
        data_x: data_x,
        data_y: data_y,
        rx: rx,
        ry: ry
      };
      tooltip.add(rx, ry, this._render_tooltips(ds, ii, vars));
    }
    ref7 = indices['1d'].indices;
    for (l = 0, len1 = ref7.length; l < len1; l++) {
      i = ref7[l];
      if (!isEmpty(indices['2d'].indices)) {
        ref8 = indices['2d'].indices;
        for (i in ref8) {
          j = ref8[i][0];
          data_x = renderer.glyph._xs[i][j];
          data_y = renderer.glyph._ys[i][j];
          jj = j;
          switch (this.model.line_policy) {
            case "interp":
              ref9 = renderer.glyph.get_interpolation_hit(i, j, geometry), data_x = ref9[0], data_y = ref9[1];
              rx = xscale.compute(data_x);
              ry = yscale.compute(data_y);
              break;
            case "prev":
              rx = canvas.sx_to_vx(renderer.glyph.sxs[i][j]);
              ry = canvas.sy_to_vy(renderer.glyph.sys[i][j]);
              break;
            case "next":
              rx = canvas.sx_to_vx(renderer.glyph.sxs[i][j + 1]);
              ry = canvas.sy_to_vy(renderer.glyph.sys[i][j + 1]);
              jj = j + 1;
              break;
            case "nearest":
              d1x = renderer.glyph.sxs[i][j];
              d1y = renderer.glyph.sys[i][j];
              dist1 = hittest.dist_2_pts(d1x, d1y, sx, sy);
              d2x = renderer.glyph.sxs[i][j + 1];
              d2y = renderer.glyph.sys[i][j + 1];
              dist2 = hittest.dist_2_pts(d2x, d2y, sx, sy);
              if (dist1 < dist2) {
                ref10 = [d1x, d1y], sdatax = ref10[0], sdatay = ref10[1];
              } else {
                ref11 = [d2x, d2y], sdatax = ref11[0], sdatay = ref11[1];
                jj = j + 1;
              }
              data_x = renderer.glyph._xs[i][j];
              data_y = renderer.glyph._ys[i][j];
              rx = canvas.sx_to_vx(sdatax);
              ry = canvas.sy_to_vy(sdatay);
          }
          vars = {
            index: i,
            segment_index: jj,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            sx: sx,
            sy: sy,
            data_x: data_x,
            data_y: data_y
          };
          tooltip.add(rx, ry, this._render_tooltips(ds, i, vars));
        }
      } else {
        data_x = (ref12 = renderer.glyph._x) != null ? ref12[i] : void 0;
        data_y = (ref13 = renderer.glyph._y) != null ? ref13[i] : void 0;
        if (this.model.point_policy === 'snap_to_data') {
          pt = renderer.glyph.get_anchor_point(this.model.anchor, i, [sx, sy]);
          if (pt == null) {
            pt = renderer.glyph.get_anchor_point("center", i, [sx, sy]);
          }
          rx = canvas.sx_to_vx(pt.x);
          ry = canvas.sy_to_vy(pt.y);
        } else {
          ref14 = [vx, vy], rx = ref14[0], ry = ref14[1];
        }
        vars = {
          index: i,
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          sx: sx,
          sy: sy,
          data_x: data_x,
          data_y: data_y
        };
        tooltip.add(rx, ry, this._render_tooltips(ds, i, vars));
      }
    }
    return null;
  };

  HoverToolView.prototype._emit_callback = function(geometry) {
    var callback, canvas, data, frame, indices, obj, r, ref, xscale, yscale;
    r = this.computed_renderers[0];
    indices = this.plot_view.renderer_views[r.id].hit_test(geometry);
    canvas = this.plot_model.canvas;
    frame = this.plot_model.frame;
    geometry['sx'] = canvas.vx_to_sx(geometry.vx);
    geometry['sy'] = canvas.vy_to_sy(geometry.vy);
    xscale = frame.xscales[r.x_range_name];
    yscale = frame.yscales[r.y_range_name];
    geometry['x'] = xscale.invert(geometry.vx);
    geometry['y'] = yscale.invert(geometry.vy);
    callback = this.model.callback;
    ref = [
      callback, {
        index: indices,
        geometry: geometry,
        renderer: r
      }
    ], obj = ref[0], data = ref[1];
    if (isFunction(callback)) {
      callback(obj, data);
    } else {
      callback.execute(obj, data);
    }
  };

  HoverToolView.prototype._render_tooltips = function(ds, i, vars) {
    var cell, colname, color, column, el, hex, k, label, len, match, opts, ref, ref1, row, rows, swatch, tooltips, value;
    tooltips = this.model.tooltips;
    if (isString(tooltips)) {
      el = div();
      el.innerHTML = replace_placeholders(tooltips, ds, i, this.model.formatters, vars);
      return el;
    } else if (isFunction(tooltips)) {
      return tooltips(ds, vars);
    } else {
      rows = div({
        style: {
          display: "table",
          borderSpacing: "2px"
        }
      });
      for (k = 0, len = tooltips.length; k < len; k++) {
        ref = tooltips[k], label = ref[0], value = ref[1];
        row = div({
          style: {
            display: "table-row"
          }
        });
        rows.appendChild(row);
        cell = div({
          style: {
            display: "table-cell"
          },
          "class": 'bk-tooltip-row-label'
        }, label + ": ");
        row.appendChild(cell);
        cell = div({
          style: {
            display: "table-cell"
          },
          "class": 'bk-tooltip-row-value'
        });
        row.appendChild(cell);
        if (value.indexOf("$color") >= 0) {
          ref1 = value.match(/\$color(\[.*\])?:(\w*)/), match = ref1[0], opts = ref1[1], colname = ref1[2];
          column = ds.get_column(colname);
          if (column == null) {
            el = span({}, colname + " unknown");
            cell.appendChild(el);
            continue;
          }
          hex = (opts != null ? opts.indexOf("hex") : void 0) >= 0;
          swatch = (opts != null ? opts.indexOf("swatch") : void 0) >= 0;
          color = column[i];
          if (color == null) {
            el = span({}, "(null)");
            cell.appendChild(el);
            continue;
          }
          if (hex) {
            color = _color_to_hex(color);
          }
          el = span({}, color);
          cell.appendChild(el);
          if (swatch) {
            el = span({
              "class": 'bk-tooltip-color-block',
              style: {
                backgroundColor: color
              }
            }, " ");
            cell.appendChild(el);
          }
        } else {
          value = value.replace("$~", "$data_");
          el = span();
          el.innerHTML = replace_placeholders(value, ds, i, this.model.formatters, vars);
          cell.appendChild(el);
        }
      }
      return rows;
    }
  };

  return HoverToolView;

})(InspectToolView);

export var HoverTool = (function(superClass) {
  extend(HoverTool, superClass);

  function HoverTool() {
    return HoverTool.__super__.constructor.apply(this, arguments);
  }

  HoverTool.prototype.default_view = HoverToolView;

  HoverTool.prototype.type = "HoverTool";

  HoverTool.prototype.tool_name = "Hover";

  HoverTool.prototype.icon = "bk-tool-icon-hover";

  HoverTool.define({
    tooltips: [p.Any, [["index", "$index"], ["data (x, y)", "($x, $y)"], ["canvas (x, y)", "($sx, $sy)"]]],
    formatters: [p.Any, {}],
    renderers: [p.Array, []],
    names: [p.Array, []],
    mode: [p.String, 'mouse'],
    point_policy: [p.String, 'snap_to_data'],
    line_policy: [p.String, 'nearest'],
    show_arrow: [p.Boolean, true],
    anchor: [p.String, 'center'],
    attachment: [p.String, 'horizontal'],
    callback: [p.Any]
  });

  return HoverTool;

})(InspectTool);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  GestureTool,
  GestureToolView
} from "./gesture_tool";

import {
  GlyphRenderer
} from "../../renderers/glyph_renderer";

import {
  logger
} from "core/logging";

import * as p from "core/properties";

import {
  clone
} from "core/util/object";

export var SelectToolView = (function(superClass) {
  extend(SelectToolView, superClass);

  function SelectToolView() {
    return SelectToolView.__super__.constructor.apply(this, arguments);
  }

  SelectToolView.prototype._keyup = function(e) {
    var ds, j, len, r, ref, results, sm;
    if (e.keyCode === 27) {
      ref = this.model.computed_renderers;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        ds = r.data_source;
        sm = ds.selection_manager;
        results.push(sm.clear());
      }
      return results;
    }
  };

  SelectToolView.prototype._save_geometry = function(geometry, final, append) {
    var g, geoms, i, j, ref, tool_events, xm, ym;
    g = clone(geometry);
    xm = this.plot_view.frame.xscales['default'];
    ym = this.plot_view.frame.yscales['default'];
    switch (g.type) {
      case 'point':
        g.x = xm.invert(g.vx);
        g.y = ym.invert(g.vy);
        break;
      case 'rect':
        g.x0 = xm.invert(g.vx0);
        g.y0 = ym.invert(g.vy0);
        g.x1 = xm.invert(g.vx1);
        g.y1 = ym.invert(g.vy1);
        break;
      case 'poly':
        g.x = new Array(g.vx.length);
        g.y = new Array(g.vy.length);
        for (i = j = 0, ref = g.vx.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          g.x[i] = xm.invert(g.vx[i]);
          g.y[i] = ym.invert(g.vy[i]);
        }
        break;
      default:
        logger.debug("Unrecognized selection geometry type: '" + g.type + "'");
    }
    if (final) {
      tool_events = this.plot_model.plot.tool_events;
      if (append) {
        geoms = tool_events.geometries;
        geoms.push(g);
      } else {
        geoms = [g];
      }
      tool_events.geometries = geoms;
    }
    return null;
  };

  return SelectToolView;

})(GestureToolView);

export var SelectTool = (function(superClass) {
  extend(SelectTool, superClass);

  function SelectTool() {
    return SelectTool.__super__.constructor.apply(this, arguments);
  }

  SelectTool.define({
    renderers: [p.Array, []],
    names: [p.Array, []]
  });

  SelectTool.internal({
    multi_select_modifier: [p.String, "shift"]
  });

  SelectTool.prototype.connect_signals = function() {
    SelectTool.__super__.connect_signals.call(this);
    this.connect(this.properties.renderers.change, function() {
      return this._computed_renderers = null;
    });
    this.connect(this.properties.names.change, function() {
      return this._computed_renderers = null;
    });
    return this.connect(this.properties.plot.change, function() {
      return this._computed_renderers = null;
    });
  };

  SelectTool.prototype._compute_renderers = function() {
    var all_renderers, names, r, renderers;
    renderers = this.renderers;
    names = this.names;
    if (renderers.length === 0) {
      all_renderers = this.plot.renderers;
      renderers = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = all_renderers.length; j < len; j++) {
          r = all_renderers[j];
          if (r instanceof GlyphRenderer) {
            results.push(r);
          }
        }
        return results;
      })();
    }
    if (names.length > 0) {
      renderers = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = renderers.length; j < len; j++) {
          r = renderers[j];
          if (names.indexOf(r.name) >= 0) {
            results.push(r);
          }
        }
        return results;
      })();
    }
    return renderers;
  };

  SelectTool.getters({
    computed_renderers: function() {
      if (this._computed_renderers == null) {
        this._computed_renderers = this._compute_renderers();
      }
      return this._computed_renderers;
    }
  });

  SelectTool.prototype._computed_renderers_by_data_source = function() {
    var j, len, r, ref, renderers_by_source;
    renderers_by_source = {};
    ref = this.computed_renderers;
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      if (!(r.data_source.id in renderers_by_source)) {
        renderers_by_source[r.data_source.id] = [r];
      } else {
        renderers_by_source[r.data_source.id] = renderers_by_source[r.data_source.id].concat([r]);
      }
    }
    return renderers_by_source;
  };

  return SelectTool;

})(GestureTool);

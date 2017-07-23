var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  SelectTool,
  SelectToolView
} from "./select_tool";

import * as p from "core/properties";

import {
  isFunction
} from "core/util/types";

export var TapToolView = (function(superClass) {
  extend(TapToolView, superClass);

  function TapToolView() {
    return TapToolView.__super__.constructor.apply(this, arguments);
  }

  TapToolView.prototype._tap = function(e) {
    var append, canvas, ref, vx, vy;
    canvas = this.plot_view.canvas;
    vx = canvas.sx_to_vx(e.bokeh.sx);
    vy = canvas.sy_to_vy(e.bokeh.sy);
    append = (ref = e.srcEvent.shiftKey) != null ? ref : false;
    return this._select(vx, vy, true, append);
  };

  TapToolView.prototype._select = function(vx, vy, final, append) {
    var _, callback, cb_data, did_hit, ds, geometry, i, len, r, ref, renderers, renderers_by_source, sm, view;
    geometry = {
      type: 'point',
      vx: vx,
      vy: vy
    };
    callback = this.model.callback;
    this._save_geometry(geometry, final, append);
    cb_data = {
      geometries: this.plot_model.plot.tool_events.geometries
    };
    if (this.model.behavior === "select") {
      renderers_by_source = this.model._computed_renderers_by_data_source();
      for (_ in renderers_by_source) {
        renderers = renderers_by_source[_];
        ds = renderers[0].data_source;
        sm = ds.selection_manager;
        did_hit = sm.select(this, (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = renderers.length; i < len; i++) {
            r = renderers[i];
            results.push(this.plot_view.renderer_views[r.id]);
          }
          return results;
        }).call(this), geometry, final, append);
        if (did_hit && (callback != null)) {
          if (isFunction(callback)) {
            callback(ds, cb_data);
          } else {
            callback.execute(ds, cb_data);
          }
        }
      }
      this.plot_view.push_state('tap', {
        selection: this.plot_view.get_selection()
      });
    } else {
      ref = this.model.computed_renderers;
      for (i = 0, len = ref.length; i < len; i++) {
        r = ref[i];
        ds = r.data_source;
        sm = ds.selection_manager;
        view = this.plot_view.renderer_views[r.id];
        did_hit = sm.inspect(this, view, geometry, {
          geometry: geometry
        });
        if (did_hit && (callback != null)) {
          if (isFunction(callback)) {
            callback(ds, cb_data);
          } else {
            callback.execute(ds, cb_data);
          }
        }
      }
    }
    return null;
  };

  return TapToolView;

})(SelectToolView);

export var TapTool = (function(superClass) {
  extend(TapTool, superClass);

  function TapTool() {
    return TapTool.__super__.constructor.apply(this, arguments);
  }

  TapTool.prototype.default_view = TapToolView;

  TapTool.prototype.type = "TapTool";

  TapTool.prototype.tool_name = "Tap";

  TapTool.prototype.icon = "bk-tool-icon-tap-select";

  TapTool.prototype.event_type = "tap";

  TapTool.prototype.default_order = 10;

  TapTool.define({
    behavior: [p.String, "select"],
    callback: [p.Any]
  });

  return TapTool;

})(SelectTool);

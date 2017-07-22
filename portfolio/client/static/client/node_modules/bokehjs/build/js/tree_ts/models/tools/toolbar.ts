var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

import * as p from "core/properties";

import {
  any,
  sortBy
} from "core/util/array";

import {
  ActionTool
} from "./actions/action_tool";

import {
  HelpTool
} from "./actions/help_tool";

import {
  GestureTool
} from "./gestures/gesture_tool";

import {
  InspectTool
} from "./inspectors/inspect_tool";

import {
  ToolbarBase,
  ToolbarBaseView
} from "./toolbar_base";

export var Toolbar = (function(superClass) {
  extend(Toolbar, superClass);

  function Toolbar() {
    return Toolbar.__super__.constructor.apply(this, arguments);
  }

  Toolbar.prototype.type = 'Toolbar';

  Toolbar.prototype.default_view = ToolbarBaseView;

  Toolbar.prototype.initialize = function(attrs, options) {
    Toolbar.__super__.initialize.call(this, attrs, options);
    this.connect(this.properties.tools.change, function() {
      return this._init_tools();
    });
    return this._init_tools();
  };

  Toolbar.prototype._init_tools = function() {
    var et, i, len, ref, results, tool, tools;
    ref = this.tools;
    for (i = 0, len = ref.length; i < len; i++) {
      tool = ref[i];
      if (tool instanceof InspectTool) {
        if (!any(this.inspectors, (function(_this) {
          return function(t) {
            return t.id === tool.id;
          };
        })(this))) {
          this.inspectors = this.inspectors.concat([tool]);
        }
      } else if (tool instanceof HelpTool) {
        if (!any(this.help, (function(_this) {
          return function(t) {
            return t.id === tool.id;
          };
        })(this))) {
          this.help = this.help.concat([tool]);
        }
      } else if (tool instanceof ActionTool) {
        if (!any(this.actions, (function(_this) {
          return function(t) {
            return t.id === tool.id;
          };
        })(this))) {
          this.actions = this.actions.concat([tool]);
        }
      } else if (tool instanceof GestureTool) {
        et = tool.event_type;
        if (!(et in this.gestures)) {
          logger.warn("Toolbar: unknown event type '" + et + "' for tool: " + tool.type + " (" + tool.id + ")");
          continue;
        }
        if (!any(this.gestures[et].tools, (function(_this) {
          return function(t) {
            return t.id === tool.id;
          };
        })(this))) {
          this.gestures[et].tools = this.gestures[et].tools.concat([tool]);
        }
        this.connect(tool.properties.active.change, this._active_change.bind(null, tool));
      }
    }
    if (this.active_inspect === 'auto') {

    } else if (this.active_inspect instanceof InspectTool) {
      this.inspectors.map((function(_this) {
        return function(inspector) {
          if (inspector !== _this.active_inspect) {
            return inspector.active = false;
          }
        };
      })(this));
    } else if (this.active_inspect instanceof Array) {
      this.inspectors.map((function(_this) {
        return function(inspector) {
          if (indexOf.call(_this.active_inspect, inspector) < 0) {
            return inspector.active = false;
          }
        };
      })(this));
    } else if (this.active_inspect === null) {
      this.inspectors.map(function(inspector) {
        return inspector.active = false;
      });
    }
    results = [];
    for (et in this.gestures) {
      tools = this.gestures[et].tools;
      if (tools.length === 0) {
        continue;
      }
      this.gestures[et].tools = sortBy(tools, function(tool) {
        return tool.default_order;
      });
      if (et === 'tap') {
        if (this.active_tap === null) {
          continue;
        }
        if (this.active_tap === 'auto') {
          this.gestures[et].tools[0].active = true;
        } else {
          this.active_tap.active = true;
        }
      }
      if (et === 'pan') {
        if (this.active_drag === null) {
          continue;
        }
        if (this.active_drag === 'auto') {
          this.gestures[et].tools[0].active = true;
        } else {
          this.active_drag.active = true;
        }
      }
      if (et === 'pinch' || et === 'scroll') {
        if (this.active_scroll === null || this.active_scroll === 'auto') {
          continue;
        }
        results.push(this.active_scroll.active = true);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Toolbar.define({
    active_drag: [p.Any, 'auto'],
    active_inspect: [p.Any, 'auto'],
    active_scroll: [p.Any, 'auto'],
    active_tap: [p.Any, 'auto']
  });

  return Toolbar;

})(ToolbarBase);

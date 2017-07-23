import * as Hammer from "hammerjs";

import {
  Signal
} from "./signaling";

import {
  logger
} from "./logging";

import {
  offset
} from "./dom";

import {
  getDeltaY
} from "./util/wheel";

import {
  extend,
  isEmpty
} from "./util/object";

import {
  BokehEvent
} from "./bokeh_events";

export var UIEvents = (function() {
  function UIEvents(plot_view, toolbar, hit_area, plot) {
    this.plot_view = plot_view;
    this.toolbar = toolbar;
    this.hit_area = hit_area;
    this.plot = plot;
    this.tap = new Signal(this, 'tap');
    this.doubletap = new Signal(this, 'doubletap');
    this.press = new Signal(this, 'press');
    this.pan_start = new Signal(this, 'pan:start');
    this.pan = new Signal(this, 'pan');
    this.pan_end = new Signal(this, 'pan:end');
    this.pinch_start = new Signal(this, 'pinch:start');
    this.pinch = new Signal(this, 'pinch');
    this.pinch_end = new Signal(this, 'pinch:end');
    this.rotate_start = new Signal(this, 'rotate:start');
    this.rotate = new Signal(this, 'rotate');
    this.rotate_end = new Signal(this, 'rotate:end');
    this.move_enter = new Signal(this, 'move:enter');
    this.move = new Signal(this, 'move');
    this.move_exit = new Signal(this, 'move:exit');
    this.scroll = new Signal(this, 'scroll');
    this.keydown = new Signal(this, 'keydown');
    this.keyup = new Signal(this, 'keyup');
    this._configure_hammerjs();
  }

  UIEvents.prototype._configure_hammerjs = function() {
    this.hammer = new Hammer(this.hit_area);
    this.hammer.get('doubletap').recognizeWith('tap');
    this.hammer.get('tap').requireFailure('doubletap');
    this.hammer.get('doubletap').dropRequireFailure('tap');
    this.hammer.on('doubletap', (function(_this) {
      return function(e) {
        return _this._doubletap(e);
      };
    })(this));
    this.hammer.on('tap', (function(_this) {
      return function(e) {
        return _this._tap(e);
      };
    })(this));
    this.hammer.on('press', (function(_this) {
      return function(e) {
        return _this._press(e);
      };
    })(this));
    this.hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL
    });
    this.hammer.on('panstart', (function(_this) {
      return function(e) {
        return _this._pan_start(e);
      };
    })(this));
    this.hammer.on('pan', (function(_this) {
      return function(e) {
        return _this._pan(e);
      };
    })(this));
    this.hammer.on('panend', (function(_this) {
      return function(e) {
        return _this._pan_end(e);
      };
    })(this));
    this.hammer.get('pinch').set({
      enable: true
    });
    this.hammer.on('pinchstart', (function(_this) {
      return function(e) {
        return _this._pinch_start(e);
      };
    })(this));
    this.hammer.on('pinch', (function(_this) {
      return function(e) {
        return _this._pinch(e);
      };
    })(this));
    this.hammer.on('pinchend', (function(_this) {
      return function(e) {
        return _this._pinch_end(e);
      };
    })(this));
    this.hammer.get('rotate').set({
      enable: true
    });
    this.hammer.on('rotatestart', (function(_this) {
      return function(e) {
        return _this._rotate_start(e);
      };
    })(this));
    this.hammer.on('rotate', (function(_this) {
      return function(e) {
        return _this._rotate(e);
      };
    })(this));
    this.hammer.on('rotateend', (function(_this) {
      return function(e) {
        return _this._rotate_end(e);
      };
    })(this));
    this.hit_area.addEventListener("mousemove", (function(_this) {
      return function(e) {
        return _this._mouse_move(e);
      };
    })(this));
    this.hit_area.addEventListener("mouseenter", (function(_this) {
      return function(e) {
        return _this._mouse_enter(e);
      };
    })(this));
    this.hit_area.addEventListener("mouseleave", (function(_this) {
      return function(e) {
        return _this._mouse_exit(e);
      };
    })(this));
    this.hit_area.addEventListener("wheel", (function(_this) {
      return function(e) {
        return _this._mouse_wheel(e);
      };
    })(this));
    document.addEventListener("keydown", (function(_this) {
      return function(e) {
        return _this._key_down(e);
      };
    })(this));
    return document.addEventListener("keyup", (function(_this) {
      return function(e) {
        return _this._key_up(e);
      };
    })(this));
  };

  UIEvents.prototype.register_tool = function(tool_view) {
    var et, id, type, v;
    et = tool_view.model.event_type;
    id = tool_view.model.id;
    type = tool_view.model.type;
    if (et == null) {
      logger.debug("Button tool: " + type);
      return;
    }
    v = tool_view;
    switch (et) {
      case "pan":
        if (v._pan_start != null) {
          v.connect(this.pan_start, function(x) {
            if (x.id === id) {
              return v._pan_start(x.e);
            }
          });
        }
        if (v._pan != null) {
          v.connect(this.pan, function(x) {
            if (x.id === id) {
              return v._pan(x.e);
            }
          });
        }
        if (v._pan_end != null) {
          v.connect(this.pan_end, function(x) {
            if (x.id === id) {
              return v._pan_end(x.e);
            }
          });
        }
        break;
      case "pinch":
        if (v._pinch_start != null) {
          v.connect(this.pinch_start, function(x) {
            if (x.id === id) {
              return v._pinch_start(x.e);
            }
          });
        }
        if (v._pinch != null) {
          v.connect(this.pinch, function(x) {
            if (x.id === id) {
              return v._pinch(x.e);
            }
          });
        }
        if (v._pinch_end != null) {
          v.connect(this.pinch_end, function(x) {
            if (x.id === id) {
              return v._pinch_end(x.e);
            }
          });
        }
        break;
      case "rotate":
        if (v._rotate_start != null) {
          v.connect(this.rotate_start, function(x) {
            if (x.id === id) {
              return v._rotate_start(x.e);
            }
          });
        }
        if (v._rotate != null) {
          v.connect(this.rotate, function(x) {
            if (x.id === id) {
              return v._rotate(x.e);
            }
          });
        }
        if (v._rotate_end != null) {
          v.connect(this.rotate_end, function(x) {
            if (x.id === id) {
              return v._rotate_end(x.e);
            }
          });
        }
        break;
      case "move":
        if (v._move_enter != null) {
          v.connect(this.move_enter, function(x) {
            if (x.id === id) {
              return v._move_enter(x.e);
            }
          });
        }
        if (v._move != null) {
          v.connect(this.move, function(x) {
            if (x.id === id) {
              return v._move(x.e);
            }
          });
        }
        if (v._move_exit != null) {
          v.connect(this.move_exit, function(x) {
            if (x.id === id) {
              return v._move_exit(x.e);
            }
          });
        }
        break;
      case "tap":
        if (v._tap != null) {
          v.connect(this.tap, function(x) {
            if (x.id === id) {
              return v._tap(x.e);
            }
          });
        }
        break;
      case "press":
        if (v._press != null) {
          v.connect(this.press, function(x) {
            if (x.id === id) {
              return v._press(x.e);
            }
          });
        }
        break;
      case "scroll":
        if (v._scroll != null) {
          v.connect(this.scroll, function(x) {
            if (x.id === id) {
              return v._scroll(x.e);
            }
          });
        }
        break;
      default:
        throw new Error("unsupported event_type: " + ev);
    }
    if (v._doubletap != null) {
      v.connect(this.doubletap, function(x) {
        return v._doubletap(x.e);
      });
    }
    if (v._keydown != null) {
      v.connect(this.keydown, function(x) {
        return v._keydown(x.e);
      });
    }
    if (v._keyup != null) {
      v.connect(this.keyup, function(x) {
        return v._keyup(x.e);
      });
    }
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      if (et === 'pinch') {
        logger.debug("Registering scroll on touch screen");
        return v.connect(this.scroll, function(x) {
          if (x.id === id) {
            return v._scroll(x.e);
          }
        });
      }
    }
  };

  UIEvents.prototype._hit_test_renderers = function(sx, sy) {
    var i, ref, ref1, view;
    ref = this.plot_view.get_renderer_views();
    for (i = ref.length - 1; i >= 0; i += -1) {
      view = ref[i];
      if (((ref1 = view.model.level) === 'annotation' || ref1 === 'overlay') && (view.bbox != null)) {
        if (view.bbox().contains(sx, sy)) {
          return view;
        }
      }
    }
    return null;
  };

  UIEvents.prototype._hit_test_frame = function(sx, sy) {
    var canvas, vx, vy;
    canvas = this.plot_view.canvas;
    vx = canvas.sx_to_vx(sx);
    vy = canvas.sy_to_vy(sy);
    return this.plot_view.frame.contains(vx, vy);
  };

  UIEvents.prototype._trigger = function(signal, e) {
    var active_gesture, active_inspectors, base, base_type, cursor, event_type, i, inspector, len, results, view;
    event_type = signal.name;
    base_type = event_type.split(":")[0];
    view = this._hit_test_renderers(e.bokeh.sx, e.bokeh.sy);
    switch (base_type) {
      case "move":
        active_inspectors = this.toolbar.inspectors.filter(function(t) {
          return t.active;
        });
        cursor = "default";
        if (view != null) {
          if (view.model.cursor != null) {
            cursor = view.model.cursor();
          }
          if (!isEmpty(active_inspectors)) {
            signal = this.move_exit;
            event_type = signal.name;
          }
        } else if (this._hit_test_frame(e.bokeh.sx, e.bokeh.sy)) {
          if (!isEmpty(active_inspectors)) {
            cursor = "crosshair";
          }
        }
        this.plot_view.set_cursor(cursor);
        results = [];
        for (i = 0, len = active_inspectors.length; i < len; i++) {
          inspector = active_inspectors[i];
          results.push(this.trigger(signal, e, inspector.id));
        }
        return results;
        break;
      case "tap":
        if (view != null) {
          if (typeof view.on_hit === "function") {
            view.on_hit(e.bokeh.sx, e.bokeh.sy);
          }
        }
        active_gesture = this.toolbar.gestures[base_type].active;
        if (active_gesture != null) {
          return this.trigger(signal, e, active_gesture.id);
        }
        break;
      case "scroll":
        base = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? "pinch" : "scroll";
        active_gesture = this.toolbar.gestures[base].active;
        if (active_gesture != null) {
          e.preventDefault();
          e.stopPropagation();
          return this.trigger(signal, e, active_gesture.id);
        }
        break;
      default:
        active_gesture = this.toolbar.gestures[base_type].active;
        if (active_gesture != null) {
          return this.trigger(signal, e, active_gesture.id);
        }
    }
  };

  UIEvents.prototype.trigger = function(signal, event, id) {
    if (id == null) {
      id = null;
    }
    return signal.emit({
      id: id,
      e: event
    });
  };

  UIEvents.prototype._bokify_hammer = function(e, extras) {
    var event_cls, left, ref, top, x, y;
    if (extras == null) {
      extras = {};
    }
    if (e.pointerType === 'mouse') {
      x = e.srcEvent.pageX;
      y = e.srcEvent.pageY;
    } else {
      x = e.pointers[0].pageX;
      y = e.pointers[0].pageY;
    }
    ref = offset(e.target), left = ref.left, top = ref.top;
    e.bokeh = {
      sx: x - left,
      sy: y - top
    };
    e.bokeh = extend(e.bokeh, extras);
    event_cls = BokehEvent.event_class(e);
    if (event_cls != null) {
      return this.plot.trigger_event(event_cls.from_event(e));
    } else {
      return logger.debug('Unhandled event of type ' + e.type);
    }
  };

  UIEvents.prototype._bokify_point_event = function(e, extras) {
    var event_cls, left, ref, top;
    if (extras == null) {
      extras = {};
    }
    ref = offset(e.currentTarget), left = ref.left, top = ref.top;
    e.bokeh = {
      sx: e.pageX - left,
      sy: e.pageY - top
    };
    e.bokeh = extend(e.bokeh, extras);
    event_cls = BokehEvent.event_class(e);
    if (event_cls != null) {
      return this.plot.trigger_event(event_cls.from_event(e));
    } else {
      return logger.debug('Unhandled event of type ' + e.type);
    }
  };

  UIEvents.prototype._tap = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.tap, e);
  };

  UIEvents.prototype._doubletap = function(e) {
    this._bokify_hammer(e);
    return this.trigger(this.doubletap, e);
  };

  UIEvents.prototype._press = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.press, e);
  };

  UIEvents.prototype._pan_start = function(e) {
    this._bokify_hammer(e);
    e.bokeh.sx -= e.deltaX;
    e.bokeh.sy -= e.deltaY;
    return this._trigger(this.pan_start, e);
  };

  UIEvents.prototype._pan = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.pan, e);
  };

  UIEvents.prototype._pan_end = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.pan_end, e);
  };

  UIEvents.prototype._pinch_start = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.pinch_start, e);
  };

  UIEvents.prototype._pinch = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.pinch, e);
  };

  UIEvents.prototype._pinch_end = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.pinch_end, e);
  };

  UIEvents.prototype._rotate_start = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.rotate_start, e);
  };

  UIEvents.prototype._rotate = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.rotate, e);
  };

  UIEvents.prototype._rotate_end = function(e) {
    this._bokify_hammer(e);
    return this._trigger(this.rotate_end, e);
  };

  UIEvents.prototype._mouse_enter = function(e) {
    this._bokify_point_event(e);
    return this._trigger(this.move_enter, e);
  };

  UIEvents.prototype._mouse_move = function(e) {
    this._bokify_point_event(e);
    return this._trigger(this.move, e);
  };

  UIEvents.prototype._mouse_exit = function(e) {
    this._bokify_point_event(e);
    return this._trigger(this.move_exit, e);
  };

  UIEvents.prototype._mouse_wheel = function(e) {
    this._bokify_point_event(e, {
      delta: getDeltaY(e)
    });
    return this._trigger(this.scroll, e);
  };

  UIEvents.prototype._key_down = function(e) {
    return this.trigger(this.keydown, e);
  };

  UIEvents.prototype._key_up = function(e) {
    return this.trigger(this.keyup, e);
  };

  return UIEvents;

})();

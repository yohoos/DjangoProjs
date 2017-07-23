var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  LayoutCanvas
} from "core/layout/layout_canvas";

import {
  DOMView
} from "core/dom_view";

import {
  GE,
  EQ
} from "core/layout/solver";

import {
  logger
} from "core/logging";

import * as p from "core/properties";

import {
  div,
  canvas
} from "core/dom";

import {
  isEqual
} from "core/util/eq";

import {
  fixup_ctx,
  get_scale_ratio
} from "core/util/canvas";

import * as canvas2svg from "canvas2svg";

if (window.CanvasPixelArray != null) {
  CanvasPixelArray.prototype.set = function(arr) {
    var i, j, ref, results;
    results = [];
    for (i = j = 0, ref = this.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      results.push(this[i] = arr[i]);
    }
    return results;
  };
}

export var CanvasView = (function(superClass) {
  extend(CanvasView, superClass);

  function CanvasView() {
    return CanvasView.__super__.constructor.apply(this, arguments);
  }

  CanvasView.prototype.className = "bk-canvas-wrapper";

  CanvasView.prototype.initialize = function(options) {
    CanvasView.__super__.initialize.call(this, options);
    this.map_el = this.model.map ? this.el.appendChild(div({
      "class": "bk-canvas-map"
    })) : null;
    this.events_el = this.el.appendChild(div({
      "class": "bk-canvas-events"
    }));
    this.overlays_el = this.el.appendChild(div({
      "class": "bk-canvas-overlays"
    }));
    switch (this.model.output_backend) {
      case "canvas":
      case "webgl":
        this.canvas_el = this.el.appendChild(canvas({
          "class": "bk-canvas"
        }));
        this._ctx = this.canvas_el.getContext('2d');
        break;
      case "svg":
        this._ctx = new canvas2svg();
        this.canvas_el = this.el.appendChild(this._ctx.getSvg());
    }
    this.ctx = this.get_ctx();
    fixup_ctx(this.ctx);
    return logger.debug("CanvasView initialized");
  };

  CanvasView.prototype.get_ctx = function() {
    return this._ctx;
  };

  CanvasView.prototype.get_canvas_element = function() {
    return this.canvas_el;
  };

  CanvasView.prototype.prepare_canvas = function() {
    var height, pixel_ratio, width;
    width = this.model._width.value;
    height = this.model._height.value;
    this.el.style.width = width + "px";
    this.el.style.height = height + "px";
    pixel_ratio = get_scale_ratio(this.ctx, this.model.use_hidpi, this.model.output_backend);
    this.model.pixel_ratio = pixel_ratio;
    this.canvas_el.style.width = width + "px";
    this.canvas_el.style.height = height + "px";
    this.canvas_el.setAttribute('width', width * pixel_ratio);
    this.canvas_el.setAttribute('height', height * pixel_ratio);
    return logger.debug("Rendering CanvasView with width: " + width + ", height: " + height + ", pixel ratio: " + pixel_ratio);
  };

  CanvasView.prototype.set_dims = function(arg) {
    var height, width;
    width = arg[0], height = arg[1];
    if (width === 0 || height === 0) {
      return;
    }
    if ((this._width_constraint != null) && this.solver.has_constraint(this._width_constraint)) {
      this.solver.remove_constraint(this._width_constraint);
    }
    if ((this._height_constraint != null) && this.solver.has_constraint(this._height_constraint)) {
      this.solver.remove_constraint(this._height_constraint);
    }
    this._width_constraint = EQ(this.model._width, -width);
    this.solver.add_constraint(this._width_constraint);
    this._height_constraint = EQ(this.model._height, -height);
    this.solver.add_constraint(this._height_constraint);
    return this.solver.update_variables();
  };

  return CanvasView;

})(DOMView);

export var Canvas = (function(superClass) {
  extend(Canvas, superClass);

  function Canvas() {
    return Canvas.__super__.constructor.apply(this, arguments);
  }

  Canvas.prototype.type = 'Canvas';

  Canvas.prototype.default_view = CanvasView;

  Canvas.internal({
    map: [p.Boolean, false],
    initial_width: [p.Number],
    initial_height: [p.Number],
    use_hidpi: [p.Boolean, true],
    pixel_ratio: [p.Number, 1],
    output_backend: [p.OutputBackend, "canvas"]
  });

  Canvas.prototype.initialize = function(attrs, options) {
    Canvas.__super__.initialize.call(this, attrs, options);
    return this.panel = this;
  };

  Canvas.prototype.vx_to_sx = function(x) {
    return x;
  };

  Canvas.prototype.vy_to_sy = function(y) {
    return this._height.value - (y + 1);
  };

  Canvas.prototype.v_vx_to_sx = function(xx) {
    return new Float64Array(xx);
  };

  Canvas.prototype.v_vy_to_sy = function(yy) {
    var _yy, height, idx, j, len, y;
    _yy = new Float64Array(yy.length);
    height = this._height.value;
    for (idx = j = 0, len = yy.length; j < len; idx = ++j) {
      y = yy[idx];
      _yy[idx] = height - (y + 1);
    }
    return _yy;
  };

  Canvas.prototype.sx_to_vx = function(x) {
    return x;
  };

  Canvas.prototype.sy_to_vy = function(y) {
    return this._height.value - (y + 1);
  };

  Canvas.prototype.v_sx_to_vx = function(xx) {
    return new Float64Array(xx);
  };

  Canvas.prototype.v_sy_to_vy = function(yy) {
    var _yy, height, idx, j, len, y;
    _yy = new Float64Array(yy.length);
    height = this._height.value;
    for (idx = j = 0, len = yy.length; j < len; idx = ++j) {
      y = yy[idx];
      _yy[idx] = height - (y + 1);
    }
    return _yy;
  };

  Canvas.prototype.get_constraints = function() {
    return Canvas.__super__.get_constraints.call(this).concat([GE(this._top), GE(this._bottom), GE(this._left), GE(this._right), GE(this._width), GE(this._height), EQ(this._width, [-1, this._right]), EQ(this._height, [-1, this._top])]);
  };

  return Canvas;

})(LayoutCanvas);

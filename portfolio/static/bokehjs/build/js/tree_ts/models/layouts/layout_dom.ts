var extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  Model
} from "../../model";

import {
  empty
} from "core/dom";

import * as p from "core/properties";

import {
  Solver,
  GE,
  EQ,
  Strength,
  Variable
} from "core/layout/solver";

import {
  build_views
} from "core/build_views";

import {
  DOMView
} from "core/dom_view";

import {
  logger
} from "core/logging";

import {
  extend
} from "core/util/object";

export var LayoutDOMView = (function(superClass) {
  extend1(LayoutDOMView, superClass);

  function LayoutDOMView() {
    return LayoutDOMView.__super__.constructor.apply(this, arguments);
  }

  LayoutDOMView.prototype.initialize = function(options) {
    LayoutDOMView.__super__.initialize.call(this, options);
    if (this.is_root) {
      this._solver = new Solver();
    }
    this.child_views = {};
    this.build_child_views();
    return this.connect_signals();
  };

  LayoutDOMView.prototype.remove = function() {
    var _, ref, view;
    ref = this.child_views;
    for (_ in ref) {
      view = ref[_];
      view.remove();
    }
    this.child_views = {};
    return LayoutDOMView.__super__.remove.call(this);
  };

  LayoutDOMView.prototype.has_finished = function() {
    var _, child, ref;
    if (!LayoutDOMView.__super__.has_finished.call(this)) {
      return false;
    }
    ref = this.child_views;
    for (_ in ref) {
      child = ref[_];
      if (!child.has_finished()) {
        return false;
      }
    }
    return true;
  };

  LayoutDOMView.prototype.notify_finished = function() {
    if (!this.is_root) {
      return LayoutDOMView.__super__.notify_finished.call(this);
    } else {
      if (!this._idle_notified && this.has_finished()) {
        if (this.model.document != null) {
          this._idle_notified = true;
          return this.model.document.notify_idle(this.model);
        }
      }
    }
  };

  LayoutDOMView.prototype._calc_width_height = function() {
    var height, measuring, ref, width;
    measuring = this.el;
    while (true) {
      measuring = measuring.parentNode;
      if (measuring == null) {
        logger.warn("detached element");
        width = height = null;
        break;
      }
      ref = measuring.getBoundingClientRect(), width = ref.width, height = ref.height;
      if (height !== 0) {
        break;
      }
    }
    return [width, height];
  };

  LayoutDOMView.prototype._init_solver = function() {
    var constraint, constraints, edit_variable, editables, i, j, len, len1, ref, strength, variables;
    this._root_width = new Variable("root_width");
    this._root_height = new Variable("root_height");
    this._solver.add_edit_variable(this._root_width);
    this._solver.add_edit_variable(this._root_height);
    editables = this.model.get_edit_variables();
    constraints = this.model.get_constraints();
    variables = this.model.get_constrained_variables();
    for (i = 0, len = editables.length; i < len; i++) {
      ref = editables[i], edit_variable = ref.edit_variable, strength = ref.strength;
      this._solver.add_edit_variable(edit_variable, strength);
    }
    for (j = 0, len1 = constraints.length; j < len1; j++) {
      constraint = constraints[j];
      this._solver.add_constraint(constraint);
    }
    if (variables.width != null) {
      this._solver.add_constraint(EQ(variables.width, this._root_width));
    }
    if (variables.height != null) {
      this._solver.add_constraint(EQ(variables.height, this._root_height));
    }
    return this._solver.update_variables();
  };

  LayoutDOMView.prototype._suggest_dims = function(width, height) {
    var ref, variables;
    variables = this.model.get_constrained_variables();
    if ((variables.width != null) || (variables.height != null)) {
      if (width === null || height === null) {
        ref = this._calc_width_height(), width = ref[0], height = ref[1];
      }
      if ((variables.width != null) && (width != null)) {
        this._solver.suggest_value(this._root_width, width);
      }
      if ((variables.height != null) && (height != null)) {
        this._solver.suggest_value(this._root_height, height);
      }
      return this._solver.update_variables();
    }
  };

  LayoutDOMView.prototype.resize = function(width, height) {
    if (width == null) {
      width = null;
    }
    if (height == null) {
      height = null;
    }
    if (!this.is_root) {
      return this.root.resize(width, height);
    } else {
      return this._do_layout(false, width, height);
    }
  };

  LayoutDOMView.prototype.layout = function(full) {
    if (full == null) {
      full = true;
    }
    if (!this.is_root) {
      return this.root.layout(full);
    } else {
      return this._do_layout(full);
    }
  };

  LayoutDOMView.prototype._do_layout = function(full, width, height) {
    if (width == null) {
      width = null;
    }
    if (height == null) {
      height = null;
    }
    if (full) {
      this._solver.clear();
      this._init_solver();
    }
    this._suggest_dims(width, height);
    this._layout();
    this._layout();
    this._layout(true);
    return this.notify_finished();
  };

  LayoutDOMView.prototype._layout = function(final) {
    var child, child_view, i, len, ref;
    if (final == null) {
      final = false;
    }
    ref = this.model.get_layoutable_children();
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child_view = this.child_views[child.id];
      if (child_view._layout != null) {
        child_view._layout(final);
      }
    }
    this.render();
    if (final) {
      return this._has_finished = true;
    }
  };

  LayoutDOMView.prototype.rebuild_child_views = function() {
    this.solver.clear();
    this.build_child_views();
    return this.layout();
  };

  LayoutDOMView.prototype.build_child_views = function() {
    var child, child_view, children, i, len, results;
    children = this.model.get_layoutable_children();
    build_views(this.child_views, children, {
      parent: this
    });
    empty(this.el);
    results = [];
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      child_view = this.child_views[child.id];
      results.push(this.el.appendChild(child_view.el));
    }
    return results;
  };

  LayoutDOMView.prototype.connect_signals = function() {
    LayoutDOMView.__super__.connect_signals.call(this);
    if (this.is_root) {
      window.addEventListener("resize", (function(_this) {
        return function() {
          return _this.resize();
        };
      })(this));
    }
    return this.connect(this.model.properties.sizing_mode.change, (function(_this) {
      return function() {
        return _this.layout();
      };
    })(this));
  };

  LayoutDOMView.prototype._render_classes = function() {
    var cls, i, len, ref, results;
    this.el.className = "";
    if (this.className != null) {
      this.el.classList.add(this.className);
    }
    if (this.model.sizing_mode != null) {
      this.el.classList.add("bk-layout-" + this.model.sizing_mode);
    }
    if (this.model.css_classes != null) {
      ref = this.model.css_classes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        cls = ref[i];
        results.push(this.el.classList.add(cls));
      }
      return results;
    }
  };

  LayoutDOMView.prototype.render = function() {
    var height, width;
    this._render_classes();
    switch (this.model.sizing_mode) {
      case 'fixed':
        if (this.model.width != null) {
          width = this.model.width;
        } else {
          width = this.get_width();
          this.model.setv({
            width: width
          }, {
            silent: true
          });
        }
        if (this.model.height != null) {
          height = this.model.height;
        } else {
          height = this.get_height();
          this.model.setv({
            height: height
          }, {
            silent: true
          });
        }
        this.solver.suggest_value(this.model._width, width);
        this.solver.suggest_value(this.model._height, height);
        this.solver.update_variables();
        this.el.style.position = "relative";
        this.el.style.left = "";
        this.el.style.top = "";
        this.el.style.width = width + "px";
        return this.el.style.height = height + "px";
      case 'scale_width':
        height = this.get_height();
        this.solver.suggest_value(this.model._height, height);
        this.solver.update_variables();
        this.el.style.position = "relative";
        this.el.style.left = "";
        this.el.style.top = "";
        this.el.style.width = this.model._width.value + "px";
        return this.el.style.height = this.model._height.value + "px";
      case 'scale_height':
        width = this.get_width();
        this.solver.suggest_value(this.model._width, width);
        this.solver.update_variables();
        this.el.style.position = "relative";
        this.el.style.left = "";
        this.el.style.top = "";
        this.el.style.width = this.model._width.value + "px";
        return this.el.style.height = this.model._height.value + "px";
      case 'stretch_both':
        this.el.style.position = "absolute";
        this.el.style.left = this.model._dom_left.value + "px";
        this.el.style.top = this.model._dom_top.value + "px";
        this.el.style.width = this.model._width.value + "px";
        return this.el.style.height = this.model._height.value + "px";
    }
  };

  LayoutDOMView.prototype.get_height = function() {
    return null;
  };

  LayoutDOMView.prototype.get_width = function() {
    return null;
  };

  return LayoutDOMView;

})(DOMView);

export var LayoutDOM = (function(superClass) {
  extend1(LayoutDOM, superClass);

  function LayoutDOM() {
    return LayoutDOM.__super__.constructor.apply(this, arguments);
  }

  LayoutDOM.prototype.type = "LayoutDOM";

  LayoutDOM.prototype.initialize = function(attrs, options) {
    LayoutDOM.__super__.initialize.call(this, attrs, options);
    this._width = new Variable("_width " + this.id);
    this._height = new Variable("_height " + this.id);
    this._left = new Variable("_left " + this.id);
    this._right = new Variable("_right " + this.id);
    this._top = new Variable("_top " + this.id);
    this._bottom = new Variable("_bottom " + this.id);
    this._dom_top = new Variable("_dom_top " + this.id);
    this._dom_left = new Variable("_dom_left " + this.id);
    this._width_minus_right = new Variable("_width_minus_right " + this.id);
    this._height_minus_bottom = new Variable("_height_minus_bottom " + this.id);
    this._whitespace_top = new Variable();
    this._whitespace_bottom = new Variable();
    this._whitespace_left = new Variable();
    return this._whitespace_right = new Variable();
  };

  LayoutDOM.getters({
    layout_bbox: function() {
      return {
        top: this._top.value,
        left: this._left.value,
        width: this._width.value,
        height: this._height.value,
        right: this._right.value,
        bottom: this._bottom.value,
        dom_top: this._dom_top.value,
        dom_left: this._dom_left.value
      };
    }
  });

  LayoutDOM.prototype.dump_layout = function() {
    var child, i, len, ref, results;
    console.log(this.toString(), this.layout_bbox);
    ref = this.get_layoutable_children();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      results.push(child.dump_layout());
    }
    return results;
  };

  LayoutDOM.prototype.get_constraints = function() {
    return [GE(this._dom_left), GE(this._dom_top), GE(this._left), GE(this._width, [-1, this._right]), GE(this._top), GE(this._height, [-1, this._bottom]), EQ(this._width_minus_right, [-1, this._width], this._right), EQ(this._height_minus_bottom, [-1, this._height], this._bottom)];
  };

  LayoutDOM.prototype.get_layoutable_children = function() {
    return [];
  };

  LayoutDOM.prototype.get_edit_variables = function() {
    var edit_variables;
    edit_variables = [];
    if (this.sizing_mode === 'fixed') {
      edit_variables.push({
        edit_variable: this._height,
        strength: Strength.strong
      });
      edit_variables.push({
        edit_variable: this._width,
        strength: Strength.strong
      });
    }
    if (this.sizing_mode === 'scale_width') {
      edit_variables.push({
        edit_variable: this._height,
        strength: Strength.strong
      });
    }
    if (this.sizing_mode === 'scale_height') {
      edit_variables.push({
        edit_variable: this._width,
        strength: Strength.strong
      });
    }
    return edit_variables;
  };

  LayoutDOM.prototype.get_constrained_variables = function() {
    var vars;
    vars = {
      origin_x: this._dom_left,
      origin_y: this._dom_top,
      whitespace_top: this._whitespace_top,
      whitespace_bottom: this._whitespace_bottom,
      whitespace_left: this._whitespace_left,
      whitespace_right: this._whitespace_right
    };
    switch (this.sizing_mode) {
      case 'stretch_both':
        vars.width = this._width;
        vars.height = this._height;
        break;
      case 'scale_width':
        vars.width = this._width;
        break;
      case 'scale_height':
        vars.height = this._height;
    }
    return vars;
  };

  LayoutDOM.define({
    height: [p.Number],
    width: [p.Number],
    disabled: [p.Bool, false],
    sizing_mode: [p.SizingMode, "fixed"],
    css_classes: [p.Array]
  });

  return LayoutDOM;

})(Model);

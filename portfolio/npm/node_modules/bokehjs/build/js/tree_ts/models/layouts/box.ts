var extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

import {
  EQ,
  GE,
  Variable,
  WEAK_EQ
} from "core/layout/solver";

import * as p from "core/properties";

import {
  isString
} from "core/util/types";

import {
  all,
  max,
  sum
} from "core/util/array";

import {
  extend
} from "core/util/object";

import {
  LayoutDOM,
  LayoutDOMView
} from "./layout_dom";

export var BoxView = (function(superClass) {
  extend1(BoxView, superClass);

  function BoxView() {
    return BoxView.__super__.constructor.apply(this, arguments);
  }

  BoxView.prototype.className = "bk-grid";

  BoxView.prototype.connect_signals = function() {
    BoxView.__super__.connect_signals.call(this);
    return this.connect(this.model.properties.children.change, (function(_this) {
      return function() {
        return _this.rebuild_child_views();
      };
    })(this));
  };

  BoxView.prototype.get_height = function() {
    var child_heights, children, height;
    children = this.model.get_layoutable_children();
    child_heights = children.map(function(child) {
      return child._height.value;
    });
    if (this.model._horizontal) {
      height = max(child_heights);
    } else {
      height = sum(child_heights);
    }
    return height;
  };

  BoxView.prototype.get_width = function() {
    var child_widths, children, width;
    children = this.model.get_layoutable_children();
    child_widths = children.map(function(child) {
      return child._width.value;
    });
    if (this.model._horizontal) {
      width = sum(child_widths);
    } else {
      width = max(child_widths);
    }
    return width;
  };

  return BoxView;

})(LayoutDOMView);

export var Box = (function(superClass) {
  extend1(Box, superClass);

  Box.prototype.default_view = BoxView;

  function Box(attrs, options) {
    Box.__super__.constructor.call(this, attrs, options);
    this._child_equal_size_width = new Variable();
    this._child_equal_size_height = new Variable();
    this._box_equal_size_top = new Variable();
    this._box_equal_size_bottom = new Variable();
    this._box_equal_size_left = new Variable();
    this._box_equal_size_right = new Variable();
    this._box_cell_align_top = new Variable();
    this._box_cell_align_bottom = new Variable();
    this._box_cell_align_left = new Variable();
    this._box_cell_align_right = new Variable();
  }

  Box.define({
    children: [p.Array, []]
  });

  Box.internal({
    spacing: [p.Number, 6]
  });

  Box.prototype.get_layoutable_children = function() {
    return this.children;
  };

  Box.prototype.get_edit_variables = function() {
    var child, edit_variables, j, len, ref;
    edit_variables = Box.__super__.get_edit_variables.call(this);
    ref = this.get_layoutable_children();
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      edit_variables = edit_variables.concat(child.get_edit_variables());
    }
    return edit_variables;
  };

  Box.prototype.get_constrained_variables = function() {
    return extend({}, Box.__super__.get_constrained_variables.call(this), {
      box_equal_size_top: this._box_equal_size_top,
      box_equal_size_bottom: this._box_equal_size_bottom,
      box_equal_size_left: this._box_equal_size_left,
      box_equal_size_right: this._box_equal_size_right,
      box_cell_align_top: this._box_cell_align_top,
      box_cell_align_bottom: this._box_cell_align_bottom,
      box_cell_align_left: this._box_cell_align_left,
      box_cell_align_right: this._box_cell_align_right
    });
  };

  Box.prototype.get_constraints = function() {
    var child, children, constraints, i, j, k, last, len, next, rect, ref, vars;
    constraints = [];
    children = this.get_layoutable_children();
    if (children.length === 0) {
      return constraints;
    }
    for (j = 0, len = children.length; j < len; j++) {
      child = children[j];
      vars = child.get_constrained_variables();
      rect = this._child_rect(vars);
      if (this._horizontal) {
        if (vars.height != null) {
          constraints.push(EQ(rect.height, [-1, this._height]));
        }
      } else {
        if (vars.width != null) {
          constraints.push(EQ(rect.width, [-1, this._width]));
        }
      }
      if (this._horizontal) {
        if ((vars.box_equal_size_left != null) && (vars.box_equal_size_right != null) && (vars.width != null)) {
          constraints.push(EQ([-1, vars.box_equal_size_left], [-1, vars.box_equal_size_right], vars.width, this._child_equal_size_width));
        }
      } else {
        if ((vars.box_equal_size_top != null) && (vars.box_equal_size_bottom != null) && (vars.height != null)) {
          constraints.push(EQ([-1, vars.box_equal_size_top], [-1, vars.box_equal_size_bottom], vars.height, this._child_equal_size_height));
        }
      }
      constraints = constraints.concat(child.get_constraints());
    }
    last = this._info(children[0].get_constrained_variables());
    constraints.push(EQ(last.span.start, 0));
    for (i = k = 1, ref = children.length; 1 <= ref ? k < ref : k > ref; i = 1 <= ref ? ++k : --k) {
      next = this._info(children[i].get_constrained_variables());
      if (last.span.size) {
        constraints.push(EQ(last.span.start, last.span.size, [-1, next.span.start]));
      }
      constraints.push(WEAK_EQ(last.whitespace.after, next.whitespace.before, 0 - this.spacing));
      constraints.push(GE(last.whitespace.after, next.whitespace.before, 0 - this.spacing));
      last = next;
    }
    if (this._horizontal) {
      if (vars.width != null) {
        constraints.push(EQ(last.span.start, last.span.size, [-1, this._width]));
      }
    } else {
      if (vars.height != null) {
        constraints.push(EQ(last.span.start, last.span.size, [-1, this._height]));
      }
    }
    constraints = constraints.concat(this._align_outer_edges_constraints(true), this._align_outer_edges_constraints(false), this._align_inner_cell_edges_constraints(), this._box_equal_size_bounds(true), this._box_equal_size_bounds(false), this._box_cell_align_bounds(true), this._box_cell_align_bounds(false), this._box_whitespace(true), this._box_whitespace(false));
    return constraints;
  };

  Box.prototype._child_rect = function(vars) {
    return {
      x: vars.origin_x,
      y: vars.origin_y,
      width: vars.width,
      height: vars.height
    };
  };

  Box.prototype._span = function(rect) {
    if (this._horizontal) {
      return {
        start: rect.x,
        size: rect.width
      };
    } else {
      return {
        start: rect.y,
        size: rect.height
      };
    }
  };

  Box.prototype._info = function(vars) {
    var span, whitespace;
    if (this._horizontal) {
      whitespace = {
        before: vars.whitespace_left,
        after: vars.whitespace_right
      };
    } else {
      whitespace = {
        before: vars.whitespace_top,
        after: vars.whitespace_bottom
      };
    }
    span = this._span(this._child_rect(vars));
    return {
      span: span,
      whitespace: whitespace
    };
  };

  Box.prototype._flatten_cell_edge_variables = function(horizontal) {
    var add_path, all_vars, arity, cell, cell_vars, child, children, direction, flattened, j, k, key, kind, len, len1, name, new_key, parsed, path, relevant_edges, variables;
    if (horizontal) {
      relevant_edges = Box._top_bottom_inner_cell_edge_variables;
    } else {
      relevant_edges = Box._left_right_inner_cell_edge_variables;
    }
    add_path = horizontal !== this._horizontal;
    children = this.get_layoutable_children();
    arity = children.length;
    flattened = {};
    cell = 0;
    for (j = 0, len = children.length; j < len; j++) {
      child = children[j];
      if (child instanceof Box) {
        cell_vars = child._flatten_cell_edge_variables(horizontal);
      } else {
        cell_vars = {};
      }
      all_vars = child.get_constrained_variables();
      for (k = 0, len1 = relevant_edges.length; k < len1; k++) {
        name = relevant_edges[k];
        if (name in all_vars) {
          cell_vars[name] = [all_vars[name]];
        }
      }
      for (key in cell_vars) {
        variables = cell_vars[key];
        if (add_path) {
          parsed = key.split(" ");
          kind = parsed[0];
          if (parsed.length > 1) {
            path = parsed[1];
          } else {
            path = "";
          }
          if (this._horizontal) {
            direction = "row";
          } else {
            direction = "col";
          }
          new_key = kind + " " + direction + "-" + arity + "-" + cell + "-" + path;
        } else {
          new_key = key;
        }
        if (new_key in flattened) {
          flattened[new_key] = flattened[new_key].concat(variables);
        } else {
          flattened[new_key] = variables;
        }
      }
      cell = cell + 1;
    }
    return flattened;
  };

  Box.prototype._align_inner_cell_edges_constraints = function() {
    var constraints, flattened, i, j, key, last, ref, variables;
    constraints = [];
    if ((this.document != null) && indexOf.call(this.document.roots(), this) >= 0) {
      flattened = this._flatten_cell_edge_variables(this._horizontal);
      for (key in flattened) {
        variables = flattened[key];
        if (variables.length > 1) {
          last = variables[0];
          for (i = j = 1, ref = variables.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
            constraints.push(EQ(variables[i], [-1, last]));
          }
        }
      }
    }
    return constraints;
  };

  Box.prototype._find_edge_leaves = function(horizontal) {
    var child, child_leaves, children, end, j, leaves, len, start;
    children = this.get_layoutable_children();
    leaves = [[], []];
    if (children.length > 0) {
      if (this._horizontal === horizontal) {
        start = children[0];
        end = children[children.length - 1];
        if (start instanceof Box) {
          leaves[0] = leaves[0].concat(start._find_edge_leaves(horizontal)[0]);
        } else {
          leaves[0].push(start);
        }
        if (end instanceof Box) {
          leaves[1] = leaves[1].concat(end._find_edge_leaves(horizontal)[1]);
        } else {
          leaves[1].push(end);
        }
      } else {
        for (j = 0, len = children.length; j < len; j++) {
          child = children[j];
          if (child instanceof Box) {
            child_leaves = child._find_edge_leaves(horizontal);
            leaves[0] = leaves[0].concat(child_leaves[0]);
            leaves[1] = leaves[1].concat(child_leaves[1]);
          } else {
            leaves[0].push(child);
            leaves[1].push(child);
          }
        }
      }
    }
    return leaves;
  };

  Box.prototype._align_outer_edges_constraints = function(horizontal) {
    var add_all_equal, collect_vars, end_edges, end_leaves, end_variable, ref, result, start_edges, start_leaves, start_variable;
    ref = this._find_edge_leaves(horizontal), start_leaves = ref[0], end_leaves = ref[1];
    if (horizontal) {
      start_variable = 'on_edge_align_left';
      end_variable = 'on_edge_align_right';
    } else {
      start_variable = 'on_edge_align_top';
      end_variable = 'on_edge_align_bottom';
    }
    collect_vars = function(leaves, name) {
      var edges, j, leaf, len, vars;
      edges = [];
      for (j = 0, len = leaves.length; j < len; j++) {
        leaf = leaves[j];
        vars = leaf.get_constrained_variables();
        if (name in vars) {
          edges.push(vars[name]);
        }
      }
      return edges;
    };
    start_edges = collect_vars(start_leaves, start_variable);
    end_edges = collect_vars(end_leaves, end_variable);
    result = [];
    add_all_equal = function(edges) {
      var edge, first, i, j, ref1;
      if (edges.length > 1) {
        first = edges[0];
        for (i = j = 1, ref1 = edges.length; 1 <= ref1 ? j < ref1 : j > ref1; i = 1 <= ref1 ? ++j : --j) {
          edge = edges[i];
          result.push(EQ([-1, first], edge));
        }
        return null;
      }
    };
    add_all_equal(start_edges);
    add_all_equal(end_edges);
    return result;
  };

  Box.prototype._box_insets_from_child_insets = function(horizontal, child_variable_prefix, our_variable_prefix, minimum) {
    var add_constraints, end_leaves, end_variable, our_end, our_start, ref, result, start_leaves, start_variable;
    ref = this._find_edge_leaves(horizontal), start_leaves = ref[0], end_leaves = ref[1];
    if (horizontal) {
      start_variable = child_variable_prefix + "_left";
      end_variable = child_variable_prefix + "_right";
      our_start = this[our_variable_prefix + "_left"];
      our_end = this[our_variable_prefix + "_right"];
    } else {
      start_variable = child_variable_prefix + "_top";
      end_variable = child_variable_prefix + "_bottom";
      our_start = this[our_variable_prefix + "_top"];
      our_end = this[our_variable_prefix + "_bottom"];
    }
    result = [];
    add_constraints = function(ours, leaves, name) {
      var edges, j, leaf, len, vars;
      edges = [];
      for (j = 0, len = leaves.length; j < len; j++) {
        leaf = leaves[j];
        vars = leaf.get_constrained_variables();
        if (name in vars) {
          if (minimum) {
            result.push(GE([-1, ours], vars[name]));
          } else {
            result.push(EQ([-1, ours], vars[name]));
          }
        }
      }
      return null;
    };
    add_constraints(our_start, start_leaves, start_variable);
    add_constraints(our_end, end_leaves, end_variable);
    return result;
  };

  Box.prototype._box_equal_size_bounds = function(horizontal) {
    return this._box_insets_from_child_insets(horizontal, 'box_equal_size', '_box_equal_size', false);
  };

  Box.prototype._box_cell_align_bounds = function(horizontal) {
    return this._box_insets_from_child_insets(horizontal, 'box_cell_align', '_box_cell_align', false);
  };

  Box.prototype._box_whitespace = function(horizontal) {
    return this._box_insets_from_child_insets(horizontal, 'whitespace', '_whitespace', true);
  };

  Box._left_right_inner_cell_edge_variables = ['box_cell_align_left', 'box_cell_align_right'];

  Box._top_bottom_inner_cell_edge_variables = ['box_cell_align_top', 'box_cell_align_bottom'];

  return Box;

})(LayoutDOM);

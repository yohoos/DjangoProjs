var ALPHABETIC, BOTTOM, CENTER, HANGING, LEFT, MIDDLE, RIGHT, TOP, _align_lookup, _align_lookup_negative, _align_lookup_positive, _angle_lookup, _baseline_lookup, pi2,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  EQ,
  GE
} from "./solver";

import {
  LayoutCanvas
} from "./layout_canvas";

import * as p from "core/properties";

import {
  logger
} from "core/logging";

import {
  isString
} from "core/util/types";

pi2 = Math.PI / 2;

ALPHABETIC = 'alphabetic';

TOP = 'top';

BOTTOM = 'bottom';

MIDDLE = 'middle';

HANGING = 'hanging';

LEFT = 'left';

RIGHT = 'right';

CENTER = 'center';

_angle_lookup = {
  above: {
    parallel: 0,
    normal: -pi2,
    horizontal: 0,
    vertical: -pi2
  },
  below: {
    parallel: 0,
    normal: pi2,
    horizontal: 0,
    vertical: pi2
  },
  left: {
    parallel: -pi2,
    normal: 0,
    horizontal: 0,
    vertical: -pi2
  },
  right: {
    parallel: pi2,
    normal: 0,
    horizontal: 0,
    vertical: pi2
  }
};

_baseline_lookup = {
  above: {
    justified: TOP,
    parallel: ALPHABETIC,
    normal: MIDDLE,
    horizontal: ALPHABETIC,
    vertical: MIDDLE
  },
  below: {
    justified: BOTTOM,
    parallel: HANGING,
    normal: MIDDLE,
    horizontal: HANGING,
    vertical: MIDDLE
  },
  left: {
    justified: TOP,
    parallel: ALPHABETIC,
    normal: MIDDLE,
    horizontal: MIDDLE,
    vertical: ALPHABETIC
  },
  right: {
    justified: TOP,
    parallel: ALPHABETIC,
    normal: MIDDLE,
    horizontal: MIDDLE,
    vertical: ALPHABETIC
  }
};

_align_lookup = {
  above: {
    justified: CENTER,
    parallel: CENTER,
    normal: LEFT,
    horizontal: CENTER,
    vertical: LEFT
  },
  below: {
    justified: CENTER,
    parallel: CENTER,
    normal: LEFT,
    horizontal: CENTER,
    vertical: LEFT
  },
  left: {
    justified: CENTER,
    parallel: CENTER,
    normal: RIGHT,
    horizontal: RIGHT,
    vertical: CENTER
  },
  right: {
    justified: CENTER,
    parallel: CENTER,
    normal: LEFT,
    horizontal: LEFT,
    vertical: CENTER
  }
};

_align_lookup_negative = {
  above: RIGHT,
  below: LEFT,
  left: RIGHT,
  right: LEFT
};

_align_lookup_positive = {
  above: LEFT,
  below: RIGHT,
  left: RIGHT,
  right: LEFT
};

export var update_panel_constraints = function(view) {
  var s;
  if ((view.model.props.visible != null) && !view.model.visible) {
    return;
  }
  s = view.solver;
  if ((view._size_constraint != null) && s.has_constraint(view._size_constraint)) {
    s.remove_constraint(view._size_constraint);
  }
  view._size_constraint = GE(view.model.panel._size, -view._get_size());
  s.add_constraint(view._size_constraint);
  if ((view._full_constraint != null) && s.has_constraint(view._full_constraint)) {
    s.remove_constraint(view._full_constraint);
  }
  view._full_constraint = (function() {
    switch (view.model.panel.side) {
      case 'above':
      case 'below':
        return EQ(view.model.panel._width, [-1, view.plot_model.canvas._width]);
      case 'left':
      case 'right':
        return EQ(view.model.panel._height, [-1, view.plot_model.canvas._height]);
    }
  })();
  return s.add_constraint(view._full_constraint);
};

export var SidePanel = (function(superClass) {
  extend(SidePanel, superClass);

  function SidePanel() {
    return SidePanel.__super__.constructor.apply(this, arguments);
  }

  SidePanel.internal({
    side: [p.String],
    plot: [p.Instance]
  });

  SidePanel.prototype.initialize = function(attrs, options) {
    SidePanel.__super__.initialize.call(this, attrs, options);
    switch (this.side) {
      case "above":
        this._dim = 0;
        this._normals = [0, -1];
        return this._size = this._height;
      case "below":
        this._dim = 0;
        this._normals = [0, 1];
        return this._size = this._height;
      case "left":
        this._dim = 1;
        this._normals = [-1, 0];
        return this._size = this._width;
      case "right":
        this._dim = 1;
        this._normals = [1, 0];
        return this._size = this._width;
      default:
        return logger.error("unrecognized side: '" + this.side + "'");
    }
  };

  SidePanel.prototype.get_constraints = function() {
    return [GE(this._top), GE(this._bottom), GE(this._left), GE(this._right), GE(this._width), GE(this._height), EQ(this._left, this._width, [-1, this._right]), EQ(this._bottom, this._height, [-1, this._top])];
  };

  SidePanel.prototype.apply_label_text_heuristics = function(ctx, orient) {
    var align, baseline, side;
    side = this.side;
    if (isString(orient)) {
      baseline = _baseline_lookup[side][orient];
      align = _align_lookup[side][orient];
    } else if (orient === 0) {
      baseline = _baseline_lookup[side][orient];
      align = _align_lookup[side][orient];
    } else if (orient < 0) {
      baseline = 'middle';
      align = _align_lookup_negative[side];
    } else if (orient > 0) {
      baseline = 'middle';
      align = _align_lookup_positive[side];
    }
    ctx.textBaseline = baseline;
    ctx.textAlign = align;
    return ctx;
  };

  SidePanel.prototype.get_label_angle_heuristic = function(orient) {
    var side;
    side = this.side;
    return _angle_lookup[side][orient];
  };

  return SidePanel;

})(LayoutCanvas);

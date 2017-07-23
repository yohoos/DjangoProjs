var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  ButtonTool,
  ButtonToolView,
  ButtonToolButtonView
} from "../button_tool";

import {
  Signal
} from "core/signaling";

export var ActionToolButtonView = (function(superClass) {
  extend(ActionToolButtonView, superClass);

  function ActionToolButtonView() {
    return ActionToolButtonView.__super__.constructor.apply(this, arguments);
  }

  ActionToolButtonView.prototype._clicked = function() {
    return this.model["do"].emit();
  };

  return ActionToolButtonView;

})(ButtonToolButtonView);

export var ActionToolView = (function(superClass) {
  extend(ActionToolView, superClass);

  function ActionToolView() {
    return ActionToolView.__super__.constructor.apply(this, arguments);
  }

  ActionToolView.prototype.initialize = function(options) {
    ActionToolView.__super__.initialize.call(this, options);
    return this.connect(this.model["do"], function() {
      return this.doit();
    });
  };

  return ActionToolView;

})(ButtonToolView);

export var ActionTool = (function(superClass) {
  extend(ActionTool, superClass);

  function ActionTool() {
    return ActionTool.__super__.constructor.apply(this, arguments);
  }

  ActionTool.prototype.initialize = function(attrs, options) {
    ActionTool.__super__.initialize.call(this, attrs, options);
    return this["do"] = new Signal(this, "do");
  };

  return ActionTool;

})(ButtonTool);

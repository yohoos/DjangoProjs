var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import * as p from "core/properties";

import {
  empty,
  prepend,
  nbsp,
  button
} from "core/dom";

import {
  build_views,
  remove_views
} from "core/build_views";

import {
  Widget,
  WidgetView
} from "./widget";

export var AbstractButtonView = (function(superClass) {
  extend(AbstractButtonView, superClass);

  function AbstractButtonView() {
    return AbstractButtonView.__super__.constructor.apply(this, arguments);
  }

  AbstractButtonView.prototype.initialize = function(options) {
    AbstractButtonView.__super__.initialize.call(this, options);
    this.icon_views = {};
    this.connect(this.model.change, function() {
      return this.render();
    });
    return this.render();
  };

  AbstractButtonView.prototype.remove = function() {
    remove_views(this.icon_views);
    return AbstractButtonView.__super__.remove.call(this);
  };

  AbstractButtonView.prototype.template = function() {
    return button({
      type: "button",
      disabled: this.model.disabled,
      "class": ["bk-bs-btn", "bk-bs-btn-" + this.model.button_type]
    }, this.model.label);
  };

  AbstractButtonView.prototype.render = function() {
    var buttonEl, icon;
    AbstractButtonView.__super__.render.call(this);
    empty(this.el);
    this.buttonEl = buttonEl = this.template();
    this.el.appendChild(buttonEl);
    icon = this.model.icon;
    if (icon != null) {
      build_views(this.icon_views, [icon], {
        parent: this
      });
      prepend(buttonEl, this.icon_views[icon.id].el, nbsp);
    }
    return this;
  };

  AbstractButtonView.prototype.change_input = function() {
    var ref;
    return (ref = this.model.callback) != null ? ref.execute(this.model) : void 0;
  };

  return AbstractButtonView;

})(WidgetView);

export var AbstractButton = (function(superClass) {
  extend(AbstractButton, superClass);

  function AbstractButton() {
    return AbstractButton.__super__.constructor.apply(this, arguments);
  }

  AbstractButton.prototype.type = "AbstractButton";

  AbstractButton.prototype.default_view = AbstractButtonView;

  AbstractButton.define({
    callback: [p.Instance],
    label: [p.String, "Button"],
    icon: [p.Instance],
    button_type: [p.String, "default"]
  });

  return AbstractButton;

})(Widget);

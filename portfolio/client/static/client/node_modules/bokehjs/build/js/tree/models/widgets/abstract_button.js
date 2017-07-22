"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var p = require("core/properties");
var dom_1 = require("core/dom");
var build_views_1 = require("core/build_views");
var widget_1 = require("./widget");
exports.AbstractButtonView = (function (superClass) {
    extend(AbstractButtonView, superClass);
    function AbstractButtonView() {
        return AbstractButtonView.__super__.constructor.apply(this, arguments);
    }
    AbstractButtonView.prototype.initialize = function (options) {
        AbstractButtonView.__super__.initialize.call(this, options);
        this.icon_views = {};
        this.connect(this.model.change, function () {
            return this.render();
        });
        return this.render();
    };
    AbstractButtonView.prototype.remove = function () {
        build_views_1.remove_views(this.icon_views);
        return AbstractButtonView.__super__.remove.call(this);
    };
    AbstractButtonView.prototype.template = function () {
        return dom_1.button({
            type: "button",
            disabled: this.model.disabled,
            "class": ["bk-bs-btn", "bk-bs-btn-" + this.model.button_type]
        }, this.model.label);
    };
    AbstractButtonView.prototype.render = function () {
        var buttonEl, icon;
        AbstractButtonView.__super__.render.call(this);
        dom_1.empty(this.el);
        this.buttonEl = buttonEl = this.template();
        this.el.appendChild(buttonEl);
        icon = this.model.icon;
        if (icon != null) {
            build_views_1.build_views(this.icon_views, [icon], {
                parent: this
            });
            dom_1.prepend(buttonEl, this.icon_views[icon.id].el, dom_1.nbsp);
        }
        return this;
    };
    AbstractButtonView.prototype.change_input = function () {
        var ref;
        return (ref = this.model.callback) != null ? ref.execute(this.model) : void 0;
    };
    return AbstractButtonView;
})(widget_1.WidgetView);
exports.AbstractButton = (function (superClass) {
    extend(AbstractButton, superClass);
    function AbstractButton() {
        return AbstractButton.__super__.constructor.apply(this, arguments);
    }
    AbstractButton.prototype.type = "AbstractButton";
    AbstractButton.prototype.default_view = exports.AbstractButtonView;
    AbstractButton.define({
        callback: [p.Instance],
        label: [p.String, "Button"],
        icon: [p.Instance],
        button_type: [p.String, "default"]
    });
    return AbstractButton;
})(widget_1.Widget);

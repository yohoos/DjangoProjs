"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var $ = require("jquery");
require("bootstrap/dropdown");
var dom_1 = require("core/dom");
var p = require("core/properties");
var abstract_button_1 = require("./abstract_button");
exports.DropdownView = (function (superClass) {
    extend(DropdownView, superClass);
    function DropdownView() {
        return DropdownView.__super__.constructor.apply(this, arguments);
    }
    DropdownView.prototype.template = function () {
        var el;
        el = dom_1.button({
            type: "button",
            disabled: this.model.disabled,
            value: this.model.default_value,
            "class": ["bk-bs-btn", "bk-bs-btn-" + this.model.button_type, "bk-bs-dropdown-toggle"]
        }, this.model.label, " ", dom_1.span({
            "class": "bk-bs-caret"
        }));
        el.dataset.bkBsToggle = "dropdown";
        return el;
    };
    DropdownView.prototype.render = function () {
        var i, item, itemEl, items, label, len, link, menuEl, ref, value;
        DropdownView.__super__.render.call(this);
        this.el.classList.add("bk-bs-dropdown");
        items = [];
        ref = this.model.menu;
        for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            if (item != null) {
                label = item[0], value = item[1];
                link = dom_1.a({}, label);
                link.dataset.value = value;
                link.addEventListener("click", (function (_this) {
                    return function (e) {
                        return _this.set_value(event.currentTarget.dataset.value);
                    };
                })(this));
                itemEl = dom_1.li({}, link);
            }
            else {
                itemEl = dom_1.li({
                    "class": "bk-bs-divider"
                });
            }
            items.push(itemEl);
        }
        menuEl = dom_1.ul({
            "class": "bk-bs-dropdown-menu"
        }, items);
        this.el.appendChild(menuEl);
        $(this.buttonEl).dropdown();
        return this;
    };
    DropdownView.prototype.set_value = function (value) {
        this.buttonEl.value = this.model.value = value;
        return this.change_input();
    };
    return DropdownView;
})(abstract_button_1.AbstractButtonView);
exports.Dropdown = (function (superClass) {
    extend(Dropdown, superClass);
    function Dropdown() {
        return Dropdown.__super__.constructor.apply(this, arguments);
    }
    Dropdown.prototype.type = "Dropdown";
    Dropdown.prototype.default_view = exports.DropdownView;
    Dropdown.define({
        value: [p.String],
        default_value: [p.String],
        menu: [p.Array, []]
    });
    Dropdown.override({
        label: "Dropdown"
    });
    return Dropdown;
})(abstract_button_1.AbstractButton);

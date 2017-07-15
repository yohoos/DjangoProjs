"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend1 = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var layout_dom_1 = require("./layout_dom");
var object_1 = require("core/util/object");
exports.SpacerView = (function (superClass) {
    extend1(SpacerView, superClass);
    function SpacerView() {
        return SpacerView.__super__.constructor.apply(this, arguments);
    }
    SpacerView.prototype.className = "bk-spacer-box";
    SpacerView.prototype.render = function () {
        SpacerView.__super__.render.call(this);
        if (this.sizing_mode === "fixed") {
            this.el.style.width = this.model.width + "px";
            return this.el.style.height = this.model.height + "px";
        }
    };
    SpacerView.prototype.get_height = function () {
        return 1;
    };
    return SpacerView;
})(layout_dom_1.LayoutDOMView);
exports.Spacer = (function (superClass) {
    extend1(Spacer, superClass);
    function Spacer() {
        return Spacer.__super__.constructor.apply(this, arguments);
    }
    Spacer.prototype.type = 'Spacer';
    Spacer.prototype.default_view = exports.SpacerView;
    Spacer.prototype.get_constrained_variables = function () {
        return object_1.extend({}, Spacer.__super__.get_constrained_variables.call(this), {
            on_edge_align_top: this._top,
            on_edge_align_bottom: this._height_minus_bottom,
            on_edge_align_left: this._left,
            on_edge_align_right: this._width_minus_right,
            box_cell_align_top: this._top,
            box_cell_align_bottom: this._height_minus_bottom,
            box_cell_align_left: this._left,
            box_cell_align_right: this._width_minus_right,
            box_equal_size_top: this._top,
            box_equal_size_bottom: this._height_minus_bottom,
            box_equal_size_left: this._left,
            box_equal_size_right: this._width_minus_right
        });
    };
    return Spacer;
})(layout_dom_1.LayoutDOM);

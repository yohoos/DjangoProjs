"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var view_1 = require("./view");
var DOM = require("./dom");
exports.DOMView = (function (superClass) {
    extend(DOMView, superClass);
    function DOMView() {
        return DOMView.__super__.constructor.apply(this, arguments);
    }
    DOMView.prototype.tagName = 'div';
    DOMView.prototype.initialize = function (options) {
        DOMView.__super__.initialize.call(this, options);
        this._has_finished = false;
        return this.el = this._createElement();
    };
    DOMView.prototype.remove = function () {
        DOM.removeElement(this.el);
        return DOMView.__super__.remove.call(this);
    };
    DOMView.prototype.layout = function () { };
    DOMView.prototype.render = function () { };
    DOMView.prototype.renderTo = function (element, replace) {
        if (replace == null) {
            replace = false;
        }
        if (!replace) {
            element.appendChild(this.el);
        }
        else {
            DOM.replaceWith(element, this.el);
        }
        return this.layout();
    };
    DOMView.prototype.has_finished = function () {
        return this._has_finished;
    };
    DOMView.prototype.notify_finished = function () {
        return this.root.notify_finished();
    };
    DOMView.getters({
        solver: function () {
            if (this.is_root) {
                return this._solver;
            }
            else {
                return this.parent.solver;
            }
        },
        is_idle: function () {
            return this.has_finished();
        }
    });
    DOMView.prototype._createElement = function () {
        return DOM.createElement(this.tagName, {
            id: this.id,
            "class": this.className
        });
    };
    return DOMView;
})(view_1.View);

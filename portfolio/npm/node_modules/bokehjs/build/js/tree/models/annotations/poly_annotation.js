"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var annotation_1 = require("./annotation");
var signaling_1 = require("core/signaling");
var p = require("core/properties");
exports.PolyAnnotationView = (function (superClass) {
    extend(PolyAnnotationView, superClass);
    function PolyAnnotationView() {
        return PolyAnnotationView.__super__.constructor.apply(this, arguments);
    }
    PolyAnnotationView.prototype.connect_signals = function () {
        PolyAnnotationView.__super__.connect_signals.call(this);
        this.connect(this.model.change, (function (_this) {
            return function () {
                return _this.plot_view.request_render();
            };
        })(this));
        return this.connect(this.model.data_update, (function (_this) {
            return function () {
                return _this.plot_view.request_render();
            };
        })(this));
    };
    PolyAnnotationView.prototype.render = function (ctx) {
        var canvas, i, j, ref, sx, sy, vx, vy, xs, ys;
        if (!this.model.visible) {
            return;
        }
        xs = this.model.xs;
        ys = this.model.ys;
        if (xs.length !== ys.length) {
            return null;
        }
        if (xs.length < 3 || ys.length < 3) {
            return null;
        }
        canvas = this.plot_view.canvas;
        ctx = this.plot_view.canvas_view.ctx;
        for (i = j = 0, ref = xs.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            if (this.model.xs_units === 'screen') {
                vx = xs[i];
            }
            if (this.model.ys_units === 'screen') {
                vy = ys[i];
            }
            sx = canvas.vx_to_sx(vx);
            sy = canvas.vy_to_sy(vy);
            if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
            }
            else {
                ctx.lineTo(sx, sy);
            }
        }
        ctx.closePath();
        if (this.visuals.line.doit) {
            this.visuals.line.set_value(ctx);
            ctx.stroke();
        }
        if (this.visuals.fill.doit) {
            this.visuals.fill.set_value(ctx);
            return ctx.fill();
        }
    };
    return PolyAnnotationView;
})(annotation_1.AnnotationView);
exports.PolyAnnotation = (function (superClass) {
    extend(PolyAnnotation, superClass);
    function PolyAnnotation() {
        return PolyAnnotation.__super__.constructor.apply(this, arguments);
    }
    PolyAnnotation.prototype.default_view = exports.PolyAnnotationView;
    PolyAnnotation.prototype.type = "PolyAnnotation";
    PolyAnnotation.mixins(['line', 'fill']);
    PolyAnnotation.define({
        xs: [p.Array, []],
        xs_units: [p.SpatialUnits, 'data'],
        ys: [p.Array, []],
        ys_units: [p.SpatialUnits, 'data'],
        x_range_name: [p.String, 'default'],
        y_range_name: [p.String, 'default']
    });
    PolyAnnotation.override({
        fill_color: "#fff9ba",
        fill_alpha: 0.4,
        line_color: "#cccccc",
        line_alpha: 0.3
    });
    PolyAnnotation.prototype.initialize = function (attrs, options) {
        PolyAnnotation.__super__.initialize.call(this, attrs, options);
        return this.data_update = new signaling_1.Signal(this, "data_update");
    };
    PolyAnnotation.prototype.update = function (arg) {
        var xs, ys;
        xs = arg.xs, ys = arg.ys;
        this.setv({
            xs: xs,
            ys: ys
        }, {
            silent: true
        });
        return this.data_update.emit();
    };
    return PolyAnnotation;
})(annotation_1.Annotation);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var annotation_1 = require("./annotation");
var dom_1 = require("core/dom");
var p = require("core/properties");
exports.SpanView = (function (superClass) {
    extend(SpanView, superClass);
    function SpanView() {
        return SpanView.__super__.constructor.apply(this, arguments);
    }
    SpanView.prototype.initialize = function (options) {
        SpanView.__super__.initialize.call(this, options);
        this.plot_view.canvas_overlays.appendChild(this.el);
        this.el.style.position = "absolute";
        return dom_1.hide(this.el);
    };
    SpanView.prototype.connect_signals = function () {
        SpanView.__super__.connect_signals.call(this);
        if (this.model.for_hover) {
            return this.connect(this.model.properties.computed_location.change, function () {
                return this._draw_span();
            });
        }
        else {
            if (this.model.render_mode === 'canvas') {
                this.connect(this.model.change, (function (_this) {
                    return function () {
                        return _this.plot_view.request_render();
                    };
                })(this));
                return this.connect(this.model.properties.location.change, (function (_this) {
                    return function () {
                        return _this.plot_view.request_render();
                    };
                })(this));
            }
            else {
                this.connect(this.model.change, function () {
                    return this.render();
                });
                return this.connect(this.model.properties.location.change, function () {
                    return this._draw_span();
                });
            }
        }
    };
    SpanView.prototype.render = function () {
        if (!this.model.visible && this.model.render_mode === 'css') {
            dom_1.hide(this.el);
        }
        if (!this.model.visible) {
            return;
        }
        return this._draw_span();
    };
    SpanView.prototype._draw_span = function () {
        var canvas, ctx, frame, height, loc, sleft, stop, width, xscale, yscale;
        if (this.model.for_hover) {
            loc = this.model.computed_location;
        }
        else {
            loc = this.model.location;
        }
        if (loc == null) {
            dom_1.hide(this.el);
            return;
        }
        frame = this.plot_model.frame;
        canvas = this.plot_model.canvas;
        xscale = this.plot_view.frame.xscales[this.model.x_range_name];
        yscale = this.plot_view.frame.yscales[this.model.y_range_name];
        if (this.model.dimension === 'width') {
            stop = canvas.vy_to_sy(this._calc_dim(loc, yscale));
            sleft = canvas.vx_to_sx(frame._left.value);
            width = frame._width.value;
            height = this.model.properties.line_width.value();
        }
        else {
            stop = canvas.vy_to_sy(frame._top.value);
            sleft = canvas.vx_to_sx(this._calc_dim(loc, xscale));
            width = this.model.properties.line_width.value();
            height = frame._height.value;
        }
        if (this.model.render_mode === "css") {
            this.el.style.top = stop + "px";
            this.el.style.left = sleft + "px";
            this.el.style.width = width + "px";
            this.el.style.height = height + "px";
            this.el.style.zIndex = 1000;
            this.el.style.backgroundColor = this.model.properties.line_color.value();
            this.el.style.opacity = this.model.properties.line_alpha.value();
            return dom_1.show(this.el);
        }
        else if (this.model.render_mode === "canvas") {
            ctx = this.plot_view.canvas_view.ctx;
            ctx.save();
            ctx.beginPath();
            this.visuals.line.set_value(ctx);
            ctx.moveTo(sleft, stop);
            if (this.model.dimension === "width") {
                ctx.lineTo(sleft + width, stop);
            }
            else {
                ctx.lineTo(sleft, stop + height);
            }
            ctx.stroke();
            return ctx.restore();
        }
    };
    SpanView.prototype._calc_dim = function (location, scale) {
        var vdim;
        if (this.model.location_units === 'data') {
            vdim = scale.compute(location);
        }
        else {
            vdim = location;
        }
        return vdim;
    };
    return SpanView;
})(annotation_1.AnnotationView);
exports.Span = (function (superClass) {
    extend(Span, superClass);
    function Span() {
        return Span.__super__.constructor.apply(this, arguments);
    }
    Span.prototype.default_view = exports.SpanView;
    Span.prototype.type = 'Span';
    Span.mixins(['line']);
    Span.define({
        render_mode: [p.RenderMode, 'canvas'],
        x_range_name: [p.String, 'default'],
        y_range_name: [p.String, 'default'],
        location: [p.Number, null],
        location_units: [p.SpatialUnits, 'data'],
        dimension: [p.Dimension, 'width']
    });
    Span.override({
        line_color: 'black'
    });
    Span.internal({
        for_hover: [p.Boolean, false],
        computed_location: [p.Number, null]
    });
    return Span;
})(annotation_1.Annotation);

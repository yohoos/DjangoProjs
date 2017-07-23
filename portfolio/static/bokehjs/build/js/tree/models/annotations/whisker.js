"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
var annotation_1 = require("./annotation");
var column_data_source_1 = require("../sources/column_data_source");
var arrow_head_1 = require("./arrow_head");
var p = require("core/properties");
exports.WhiskerView = (function (superClass) {
    extend(WhiskerView, superClass);
    function WhiskerView() {
        return WhiskerView.__super__.constructor.apply(this, arguments);
    }
    WhiskerView.prototype.initialize = function (options) {
        WhiskerView.__super__.initialize.call(this, options);
        return this.set_data(this.model.source);
    };
    WhiskerView.prototype.connect_signals = function () {
        WhiskerView.__super__.connect_signals.call(this);
        this.connect(this.model.source.streaming, function () {
            return this.set_data(this.model.source);
        });
        this.connect(this.model.source.patching, function () {
            return this.set_data(this.model.source);
        });
        return this.connect(this.model.source.change, function () {
            return this.set_data(this.model.source);
        });
    };
    WhiskerView.prototype.set_data = function (source) {
        WhiskerView.__super__.set_data.call(this, source);
        this.visuals.warm_cache(source);
        return this.plot_view.request_render();
    };
    WhiskerView.prototype._map_data = function () {
        var _base_vx, _lower, _lower_vx, _upper, _upper_vx, base_scale, i, j, limit_scale, ref, x_scale, y_scale;
        x_scale = this.plot_view.frame.xscales[this.model.x_range_name];
        y_scale = this.plot_view.frame.yscales[this.model.y_range_name];
        limit_scale = this.model.dimension === "height" ? y_scale : x_scale;
        base_scale = this.model.dimension === "height" ? x_scale : y_scale;
        if (this.model.lower.units === "data") {
            _lower_vx = limit_scale.v_compute(this._lower);
        }
        else {
            _lower_vx = this._lower;
        }
        if (this.model.upper.units === "data") {
            _upper_vx = limit_scale.v_compute(this._upper);
        }
        else {
            _upper_vx = this._upper;
        }
        if (this.model.base.units === "data") {
            _base_vx = base_scale.v_compute(this._base);
        }
        else {
            _base_vx = this._base;
        }
        ref = this.model._normals(), i = ref[0], j = ref[1];
        _lower = [_lower_vx, _base_vx];
        _upper = [_upper_vx, _base_vx];
        this._lower_sx = this.plot_model.canvas.v_vx_to_sx(_lower[i]);
        this._lower_sy = this.plot_model.canvas.v_vy_to_sy(_lower[j]);
        this._upper_sx = this.plot_model.canvas.v_vx_to_sx(_upper[i]);
        return this._upper_sy = this.plot_model.canvas.v_vy_to_sy(_upper[j]);
    };
    WhiskerView.prototype.render = function () {
        var angle, ctx, i, k, l, m, ref, ref1, ref2, results;
        if (!this.model.visible) {
            return;
        }
        this._map_data();
        ctx = this.plot_view.canvas_view.ctx;
        if (this.visuals.line.doit) {
            for (i = k = 0, ref = this._lower_sx.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
                this.visuals.line.set_vectorize(ctx, i);
                ctx.beginPath();
                ctx.moveTo(this._lower_sx[i], this._lower_sy[i]);
                ctx.lineTo(this._upper_sx[i], this._upper_sy[i]);
                ctx.stroke();
            }
        }
        angle = this.model.dimension === "height" ? 0 : Math.PI / 2;
        if (this.model.lower_head != null) {
            for (i = l = 0, ref1 = this._lower_sx.length; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
                ctx.save();
                ctx.translate(this._lower_sx[i], this._lower_sy[i]);
                ctx.rotate(angle + Math.PI);
                this.model.lower_head.render(ctx, i);
                ctx.restore();
            }
        }
        if (this.model.upper_head != null) {
            results = [];
            for (i = m = 0, ref2 = this._upper_sx.length; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
                ctx.save();
                ctx.translate(this._upper_sx[i], this._upper_sy[i]);
                ctx.rotate(angle);
                this.model.upper_head.render(ctx, i);
                results.push(ctx.restore());
            }
            return results;
        }
    };
    return WhiskerView;
})(annotation_1.AnnotationView);
exports.Whisker = (function (superClass) {
    extend(Whisker, superClass);
    function Whisker() {
        return Whisker.__super__.constructor.apply(this, arguments);
    }
    Whisker.prototype.default_view = exports.WhiskerView;
    Whisker.prototype.type = 'Whisker';
    Whisker.mixins(['line']);
    Whisker.define({
        lower: [p.DistanceSpec],
        lower_head: [
            p.Instance, function () {
                return new arrow_head_1.TeeHead({
                    level: "underlay",
                    size: 10
                });
            }
        ],
        upper: [p.DistanceSpec],
        upper_head: [
            p.Instance, function () {
                return new arrow_head_1.TeeHead({
                    level: "underlay",
                    size: 10
                });
            }
        ],
        base: [p.DistanceSpec],
        dimension: [p.Dimension, 'height'],
        source: [
            p.Instance, function () {
                return new column_data_source_1.ColumnDataSource();
            }
        ],
        x_range_name: [p.String, 'default'],
        y_range_name: [p.String, 'default']
    });
    Whisker.override({
        level: 'underlay'
    });
    Whisker.prototype._normals = function () {
        var i, j, ref, ref1;
        if (this.dimension === 'height') {
            ref = [1, 0], i = ref[0], j = ref[1];
        }
        else {
            ref1 = [0, 1], i = ref1[0], j = ref1[1];
        }
        return [i, j];
    };
    return Whisker;
})(annotation_1.Annotation);

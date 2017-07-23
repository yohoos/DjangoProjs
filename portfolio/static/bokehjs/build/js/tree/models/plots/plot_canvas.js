"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_glcanvas, extend1 = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty, indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item)
        return i;
} return -1; };
var canvas_1 = require("../canvas/canvas");
var cartesian_frame_1 = require("../canvas/cartesian_frame");
var data_range1d_1 = require("../ranges/data_range1d");
var glyph_renderer_1 = require("../renderers/glyph_renderer");
var layout_dom_1 = require("../layouts/layout_dom");
var signaling_1 = require("core/signaling");
var build_views_1 = require("core/build_views");
var ui_events_1 = require("core/ui_events");
var bokeh_events_1 = require("core/bokeh_events");
var layout_canvas_1 = require("core/layout/layout_canvas");
var visuals_1 = require("core/visuals");
var dom_view_1 = require("core/dom_view");
var solver_1 = require("core/layout/solver");
var logging_1 = require("core/logging");
var enums = require("core/enums");
var p = require("core/properties");
var throttle_1 = require("core/util/throttle");
var types_1 = require("core/util/types");
var array_1 = require("core/util/array");
var object_1 = require("core/util/object");
var side_panel_1 = require("core/layout/side_panel");
global_glcanvas = null;
exports.PlotCanvasView = (function (superClass) {
    extend1(PlotCanvasView, superClass);
    function PlotCanvasView() {
        return PlotCanvasView.__super__.constructor.apply(this, arguments);
    }
    PlotCanvasView.prototype.className = "bk-plot-wrapper";
    PlotCanvasView.prototype.state = {
        history: [],
        index: -1
    };
    PlotCanvasView.prototype.view_options = function () {
        return object_1.extend({
            plot_view: this,
            parent: this
        }, this.options);
    };
    PlotCanvasView.prototype.pause = function () {
        if (this._is_paused == null) {
            return this._is_paused = 1;
        }
        else {
            return this._is_paused += 1;
        }
    };
    PlotCanvasView.prototype.unpause = function (no_render) {
        if (no_render == null) {
            no_render = false;
        }
        this._is_paused -= 1;
        if (this._is_paused === 0 && !no_render) {
            return this.request_render();
        }
    };
    PlotCanvasView.prototype.request_render = function () {
        return this.request_paint();
    };
    PlotCanvasView.prototype.request_paint = function () {
        if (!this.is_paused) {
            this.throttled_paint();
        }
    };
    PlotCanvasView.prototype.remove = function () {
        build_views_1.remove_views(this.renderer_views);
        build_views_1.remove_views(this.tool_views);
        this.canvas_view.remove();
        this.canvas_view = null;
        return PlotCanvasView.__super__.remove.call(this);
    };
    PlotCanvasView.prototype.initialize = function (options) {
        var j, len, level, ref;
        this.pause();
        PlotCanvasView.__super__.initialize.call(this, options);
        this.force_paint = new signaling_1.Signal(this, "force_paint");
        this.state_changed = new signaling_1.Signal(this, "state_changed");
        this.lod_started = false;
        this.visuals = new visuals_1.Visuals(this.model.plot);
        this._initial_state_info = {
            range: null,
            selection: {},
            dimensions: {
                width: this.model.canvas._width.value,
                height: this.model.canvas._height.value
            }
        };
        this.frame = this.model.frame;
        this.canvas = this.model.canvas;
        this.canvas_view = new this.canvas.default_view({
            model: this.canvas,
            parent: this
        });
        this.el.appendChild(this.canvas_view.el);
        this.canvas_view.render();
        if (this.model.plot.output_backend === "webgl") {
            this.init_webgl();
        }
        this.throttled_paint = throttle_1.throttle(((function (_this) {
            return function () {
                return _this.force_paint.emit();
            };
        })(this)), 15);
        this.ui_event_bus = new ui_events_1.UIEvents(this, this.model.toolbar, this.canvas_view.el, this.model.plot);
        this.levels = {};
        ref = enums.RenderLevel;
        for (j = 0, len = ref.length; j < len; j++) {
            level = ref[j];
            this.levels[level] = {};
        }
        this.renderer_views = {};
        this.tool_views = {};
        this.build_levels();
        this.build_tools();
        this.connect_signals();
        this.update_dataranges();
        this.unpause(true);
        logging_1.logger.debug("PlotView initialized");
        return this;
    };
    PlotCanvasView.prototype.set_cursor = function (cursor) {
        if (cursor == null) {
            cursor = "default";
        }
        return this.canvas_view.el.style.cursor = cursor;
    };
    PlotCanvasView.getters({
        canvas_overlays: function () {
            return this.canvas_view.overlays_el;
        },
        is_paused: function () {
            return (this._is_paused != null) && this._is_paused !== 0;
        }
    });
    PlotCanvasView.prototype.init_webgl = function () {
        var ctx, glcanvas, opts;
        ctx = this.canvas_view.ctx;
        glcanvas = global_glcanvas;
        if (glcanvas == null) {
            global_glcanvas = glcanvas = document.createElement('canvas');
            opts = {
                'premultipliedAlpha': true
            };
            glcanvas.gl = glcanvas.getContext("webgl", opts) || glcanvas.getContext("experimental-webgl", opts);
        }
        if (glcanvas.gl != null) {
            return ctx.glcanvas = glcanvas;
        }
        else {
            return logging_1.logger.warn('WebGL is not supported, falling back to 2D canvas.');
        }
    };
    PlotCanvasView.prototype.prepare_webgl = function (ratio, frame_box) {
        var canvas, ctx, flipped_top, gl;
        ctx = this.canvas_view.ctx;
        canvas = this.canvas_view.get_canvas_element();
        if (ctx.glcanvas) {
            ctx.glcanvas.width = canvas.width;
            ctx.glcanvas.height = canvas.height;
            gl = ctx.glcanvas.gl;
            gl.viewport(0, 0, ctx.glcanvas.width, ctx.glcanvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.SCISSOR_TEST);
            flipped_top = ctx.glcanvas.height - ratio * (frame_box[1] + frame_box[3]);
            gl.scissor(ratio * frame_box[0], flipped_top, ratio * frame_box[2], ratio * frame_box[3]);
            gl.enable(gl.BLEND);
            return gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
        }
    };
    PlotCanvasView.prototype.blit_webgl = function (ratio) {
        var ctx;
        ctx = this.canvas_view.ctx;
        if (ctx.glcanvas) {
            logging_1.logger.debug('drawing with WebGL');
            ctx.restore();
            ctx.drawImage(ctx.glcanvas, 0, 0);
            ctx.save();
            ctx.scale(ratio, ratio);
            return ctx.translate(0.5, 0.5);
        }
    };
    PlotCanvasView.prototype.update_dataranges = function () {
        var bds, bounds, bounds_to_use, calculate_log_bounds, follow_enabled, frame, has_bounds, j, k, l, len, len1, len2, len3, len4, log_bds, log_bounds, m, n, o, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, v, xr, yr;
        frame = this.model.frame;
        bounds = {};
        log_bounds = {};
        calculate_log_bounds = false;
        ref = object_1.values(frame.x_ranges).concat(object_1.values(frame.y_ranges));
        for (j = 0, len = ref.length; j < len; j++) {
            r = ref[j];
            if (r instanceof data_range1d_1.DataRange1d) {
                if (r.scale_hint === "log") {
                    calculate_log_bounds = true;
                }
            }
        }
        ref1 = this.renderer_views;
        for (k in ref1) {
            v = ref1[k];
            bds = (ref2 = v.glyph) != null ? typeof ref2.bounds === "function" ? ref2.bounds() : void 0 : void 0;
            if (bds != null) {
                bounds[k] = bds;
            }
            if (calculate_log_bounds) {
                log_bds = (ref3 = v.glyph) != null ? typeof ref3.log_bounds === "function" ? ref3.log_bounds() : void 0 : void 0;
                if (log_bds != null) {
                    log_bounds[k] = log_bds;
                }
            }
        }
        follow_enabled = false;
        has_bounds = false;
        ref4 = object_1.values(frame.x_ranges);
        for (l = 0, len1 = ref4.length; l < len1; l++) {
            xr = ref4[l];
            if (xr instanceof data_range1d_1.DataRange1d) {
                bounds_to_use = xr.scale_hint === "log" ? log_bounds : bounds;
                xr.update(bounds_to_use, 0, this.model.id);
                if (xr.follow) {
                    follow_enabled = true;
                }
            }
            if (xr.bounds != null) {
                has_bounds = true;
            }
        }
        ref5 = object_1.values(frame.y_ranges);
        for (m = 0, len2 = ref5.length; m < len2; m++) {
            yr = ref5[m];
            if (yr instanceof data_range1d_1.DataRange1d) {
                bounds_to_use = yr.scale_hint === "log" ? log_bounds : bounds;
                yr.update(bounds_to_use, 1, this.model.id);
                if (yr.follow) {
                    follow_enabled = true;
                }
            }
            if (yr.bounds != null) {
                has_bounds = true;
            }
        }
        if (follow_enabled && has_bounds) {
            logging_1.logger.warn('Follow enabled so bounds are unset.');
            ref6 = object_1.values(frame.x_ranges);
            for (n = 0, len3 = ref6.length; n < len3; n++) {
                xr = ref6[n];
                xr.bounds = null;
            }
            ref7 = object_1.values(frame.y_ranges);
            for (o = 0, len4 = ref7.length; o < len4; o++) {
                yr = ref7[o];
                yr.bounds = null;
            }
        }
        return this.range_update_timestamp = Date.now();
    };
    PlotCanvasView.prototype.map_to_screen = function (x, y, x_name, y_name) {
        if (x_name == null) {
            x_name = 'default';
        }
        if (y_name == null) {
            y_name = 'default';
        }
        return this.frame.map_to_screen(x, y, this.canvas, x_name, y_name);
    };
    PlotCanvasView.prototype.push_state = function (type, info) {
        var prev_info, ref;
        prev_info = ((ref = this.state.history[this.state.index]) != null ? ref.info : void 0) || {};
        info = object_1.extend({}, this._initial_state_info, prev_info, info);
        this.state.history.slice(0, this.state.index + 1);
        this.state.history.push({
            type: type,
            info: info
        });
        this.state.index = this.state.history.length - 1;
        return this.state_changed.emit();
    };
    PlotCanvasView.prototype.clear_state = function () {
        this.state = {
            history: [],
            index: -1
        };
        return this.state_changed.emit();
    };
    PlotCanvasView.prototype.can_undo = function () {
        return this.state.index >= 0;
    };
    PlotCanvasView.prototype.can_redo = function () {
        return this.state.index < this.state.history.length - 1;
    };
    PlotCanvasView.prototype.undo = function () {
        if (this.can_undo()) {
            this.state.index -= 1;
            this._do_state_change(this.state.index);
            return this.state_changed.emit();
        }
    };
    PlotCanvasView.prototype.redo = function () {
        if (this.can_redo()) {
            this.state.index += 1;
            this._do_state_change(this.state.index);
            return this.state_changed.emit();
        }
    };
    PlotCanvasView.prototype._do_state_change = function (index) {
        var info, ref;
        info = ((ref = this.state.history[index]) != null ? ref.info : void 0) || this._initial_state_info;
        if (info.range != null) {
            this.update_range(info.range);
        }
        if (info.selection != null) {
            this.update_selection(info.selection);
        }
        if (info.dimensions != null) {
            return this.canvas_view.set_dims([info.dimensions.width, info.dimensions.height]);
        }
    };
    PlotCanvasView.prototype.reset_dimensions = function () {
        return this.update_dimensions(this.canvas.initial_width, this.canvas.initial_height);
    };
    PlotCanvasView.prototype.update_dimensions = function (width, height) {
        this.pause();
        this.model.plot.width = width;
        this.model.plot.height = height;
        this.parent.layout();
        return this.unpause();
    };
    PlotCanvasView.prototype.get_selection = function () {
        var j, len, ref, renderer, selected, selection;
        selection = [];
        ref = this.model.plot.renderers;
        for (j = 0, len = ref.length; j < len; j++) {
            renderer = ref[j];
            if (renderer instanceof glyph_renderer_1.GlyphRenderer) {
                selected = renderer.data_source.selected;
                selection[renderer.id] = selected;
            }
        }
        return selection;
    };
    PlotCanvasView.prototype.update_selection = function (selection) {
        var ds, j, len, ref, ref1, renderer, results;
        ref = this.model.plot.renderers;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
            renderer = ref[j];
            if (!(renderer instanceof glyph_renderer_1.GlyphRenderer)) {
                continue;
            }
            ds = renderer.data_source;
            if (selection != null) {
                if (ref1 = renderer.id, indexOf.call(selection, ref1) >= 0) {
                    results.push(ds.selected = selection[renderer.id]);
                }
                else {
                    results.push(void 0);
                }
            }
            else {
                results.push(ds.selection_manager.clear());
            }
        }
        return results;
    };
    PlotCanvasView.prototype.reset_selection = function () {
        return this.update_selection(null);
    };
    PlotCanvasView.prototype._update_ranges_together = function (range_info_iter) {
        var j, l, len, len1, range_info, ref, ref1, results, rng, weight;
        weight = 1.0;
        for (j = 0, len = range_info_iter.length; j < len; j++) {
            ref = range_info_iter[j], rng = ref[0], range_info = ref[1];
            weight = Math.min(weight, this._get_weight_to_constrain_interval(rng, range_info));
        }
        if (weight < 1) {
            results = [];
            for (l = 0, len1 = range_info_iter.length; l < len1; l++) {
                ref1 = range_info_iter[l], rng = ref1[0], range_info = ref1[1];
                range_info['start'] = weight * range_info['start'] + (1 - weight) * rng.start;
                results.push(range_info['end'] = weight * range_info['end'] + (1 - weight) * rng.end);
            }
            return results;
        }
    };
    PlotCanvasView.prototype._update_ranges_individually = function (range_info_iter, is_panning, is_scrolling) {
        var hit_bound, j, l, len, len1, max, min, new_interval, range_info, ref, ref1, results, reversed, rng, weight;
        hit_bound = false;
        for (j = 0, len = range_info_iter.length; j < len; j++) {
            ref = range_info_iter[j], rng = ref[0], range_info = ref[1];
            reversed = rng.start > rng.end;
            if (!is_scrolling) {
                weight = this._get_weight_to_constrain_interval(rng, range_info);
                if (weight < 1) {
                    range_info['start'] = weight * range_info['start'] + (1 - weight) * rng.start;
                    range_info['end'] = weight * range_info['end'] + (1 - weight) * rng.end;
                }
            }
            if (rng.bounds != null) {
                min = rng.bounds[0];
                max = rng.bounds[1];
                new_interval = Math.abs(range_info['end'] - range_info['start']);
                if (reversed) {
                    if (min != null) {
                        if (min >= range_info['end']) {
                            hit_bound = true;
                            range_info['end'] = min;
                            if ((is_panning != null) || (is_scrolling != null)) {
                                range_info['start'] = min + new_interval;
                            }
                        }
                    }
                    if (max != null) {
                        if (max <= range_info['start']) {
                            hit_bound = true;
                            range_info['start'] = max;
                            if ((is_panning != null) || (is_scrolling != null)) {
                                range_info['end'] = max - new_interval;
                            }
                        }
                    }
                }
                else {
                    if (min != null) {
                        if (min >= range_info['start']) {
                            hit_bound = true;
                            range_info['start'] = min;
                            if ((is_panning != null) || (is_scrolling != null)) {
                                range_info['end'] = min + new_interval;
                            }
                        }
                    }
                    if (max != null) {
                        if (max <= range_info['end']) {
                            hit_bound = true;
                            range_info['end'] = max;
                            if ((is_panning != null) || (is_scrolling != null)) {
                                range_info['start'] = max - new_interval;
                            }
                        }
                    }
                }
            }
        }
        if (is_scrolling && hit_bound) {
            return;
        }
        results = [];
        for (l = 0, len1 = range_info_iter.length; l < len1; l++) {
            ref1 = range_info_iter[l], rng = ref1[0], range_info = ref1[1];
            rng.have_updated_interactively = true;
            if (rng.start !== range_info['start'] || rng.end !== range_info['end']) {
                results.push(rng.setv(range_info));
            }
            else {
                results.push(void 0);
            }
        }
        return results;
    };
    PlotCanvasView.prototype._get_weight_to_constrain_interval = function (rng, range_info) {
        var max, max_interval, max_interval2, min, min_interval, new_interval, old_interval, ref, weight;
        min_interval = rng.min_interval;
        max_interval = rng.max_interval;
        weight = 1.0;
        if (rng.bounds != null) {
            ref = rng.bounds, min = ref[0], max = ref[1];
            if ((min != null) && (max != null)) {
                max_interval2 = Math.abs(max - min);
                max_interval = max_interval != null ? Math.min(max_interval, max_interval2) : max_interval2;
            }
        }
        if ((min_interval != null) || (max_interval != null)) {
            old_interval = Math.abs(rng.end - rng.start);
            new_interval = Math.abs(range_info['end'] - range_info['start']);
            if (min_interval > 0 && new_interval < min_interval) {
                weight = (old_interval - min_interval) / (old_interval - new_interval);
            }
            if (max_interval > 0 && new_interval > max_interval) {
                weight = (max_interval - old_interval) / (new_interval - old_interval);
            }
            weight = Math.max(0.0, Math.min(1.0, weight));
        }
        return weight;
    };
    PlotCanvasView.prototype.update_range = function (range_info, is_panning, is_scrolling) {
        var name, range_info_iter, ref, ref1, ref2, ref3, rng;
        this.pause();
        if (range_info == null) {
            ref = this.frame.x_ranges;
            for (name in ref) {
                rng = ref[name];
                rng.reset();
            }
            ref1 = this.frame.y_ranges;
            for (name in ref1) {
                rng = ref1[name];
                rng.reset();
            }
            this.update_dataranges();
        }
        else {
            range_info_iter = [];
            ref2 = this.frame.x_ranges;
            for (name in ref2) {
                rng = ref2[name];
                range_info_iter.push([rng, range_info.xrs[name]]);
            }
            ref3 = this.frame.y_ranges;
            for (name in ref3) {
                rng = ref3[name];
                range_info_iter.push([rng, range_info.yrs[name]]);
            }
            if (is_scrolling) {
                this._update_ranges_together(range_info_iter);
            }
            this._update_ranges_individually(range_info_iter, is_panning, is_scrolling);
        }
        return this.unpause();
    };
    PlotCanvasView.prototype.reset_range = function () {
        return this.update_range(null);
    };
    PlotCanvasView.prototype.build_levels = function () {
        var id_, j, l, len, len1, model, new_renderer_views, old_renderers, renderer_models, renderers_to_remove, view;
        renderer_models = this.model.plot.all_renderers;
        old_renderers = Object.keys(this.renderer_views);
        new_renderer_views = build_views_1.build_views(this.renderer_views, renderer_models, this.view_options());
        renderers_to_remove = array_1.difference(old_renderers, (function () {
            var j, len, results;
            results = [];
            for (j = 0, len = renderer_models.length; j < len; j++) {
                model = renderer_models[j];
                results.push(model.id);
            }
            return results;
        })());
        for (j = 0, len = renderers_to_remove.length; j < len; j++) {
            id_ = renderers_to_remove[j];
            delete this.levels.glyph[id_];
        }
        for (l = 0, len1 = new_renderer_views.length; l < len1; l++) {
            view = new_renderer_views[l];
            this.levels[view.model.level][view.model.id] = view;
            view.connect_signals();
        }
        return this;
    };
    PlotCanvasView.prototype.get_renderer_views = function () {
        var j, len, r, ref, results;
        ref = this.model.plot.renderers;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
            r = ref[j];
            results.push(this.levels[r.level][r.id]);
        }
        return results;
    };
    PlotCanvasView.prototype.build_tools = function () {
        var j, len, new_tool_views, results, tool_models, tool_view;
        tool_models = this.model.plot.toolbar.tools;
        new_tool_views = build_views_1.build_views(this.tool_views, tool_models, this.view_options());
        results = [];
        for (j = 0, len = new_tool_views.length; j < len; j++) {
            tool_view = new_tool_views[j];
            tool_view.connect_signals();
            results.push(this.ui_event_bus.register_tool(tool_view));
        }
        return results;
    };
    PlotCanvasView.prototype.connect_signals = function () {
        var name, ref, ref1, rng;
        PlotCanvasView.__super__.connect_signals.call(this);
        this.connect(this.force_paint, (function (_this) {
            return function () {
                return _this.paint();
            };
        })(this));
        ref = this.model.frame.x_ranges;
        for (name in ref) {
            rng = ref[name];
            this.connect(rng.change, function () {
                return this.request_render();
            });
        }
        ref1 = this.model.frame.y_ranges;
        for (name in ref1) {
            rng = ref1[name];
            this.connect(rng.change, function () {
                return this.request_render();
            });
        }
        this.connect(this.model.plot.properties.renderers.change, (function (_this) {
            return function () {
                return _this.build_levels();
            };
        })(this));
        this.connect(this.model.plot.toolbar.properties.tools.change, (function (_this) {
            return function () {
                _this.build_levels();
                return _this.build_tools();
            };
        })(this));
        return this.connect(this.model.plot.change, function () {
            return this.request_render();
        });
    };
    PlotCanvasView.prototype.set_initial_range = function () {
        var good_vals, name, ref, ref1, rng, xrs, yrs;
        good_vals = true;
        xrs = {};
        ref = this.frame.x_ranges;
        for (name in ref) {
            rng = ref[name];
            if ((rng.start == null) || (rng.end == null) || types_1.isStrictNaN(rng.start + rng.end)) {
                good_vals = false;
                break;
            }
            xrs[name] = {
                start: rng.start,
                end: rng.end
            };
        }
        if (good_vals) {
            yrs = {};
            ref1 = this.frame.y_ranges;
            for (name in ref1) {
                rng = ref1[name];
                if ((rng.start == null) || (rng.end == null) || types_1.isStrictNaN(rng.start + rng.end)) {
                    good_vals = false;
                    break;
                }
                yrs[name] = {
                    start: rng.start,
                    end: rng.end
                };
            }
        }
        if (good_vals) {
            this._initial_state_info.range = this.initial_range_info = {
                xrs: xrs,
                yrs: yrs
            };
            return logging_1.logger.debug("initial ranges set");
        }
        else {
            return logging_1.logger.warn('could not set initial ranges');
        }
    };
    PlotCanvasView.prototype.update_constraints = function () {
        var _, ref, view;
        this.solver.suggest_value(this.frame._width, this.canvas._width.value - 1);
        this.solver.suggest_value(this.frame._height, this.canvas._height.value - 1);
        ref = this.renderer_views;
        for (_ in ref) {
            view = ref[_];
            if (view.model.panel != null) {
                side_panel_1.update_panel_constraints(view);
            }
        }
        return this.solver.update_variables();
    };
    PlotCanvasView.prototype._layout = function (final) {
        if (final == null) {
            final = false;
        }
        this.render();
        if (final) {
            this.model.plot.setv({
                inner_width: Math.round(this.frame._width.value),
                inner_height: Math.round(this.frame._height.value),
                layout_width: Math.round(this.canvas._width.value),
                layout_height: Math.round(this.canvas._height.value)
            }, {
                no_change: true
            });
            return this.request_paint();
        }
    };
    PlotCanvasView.prototype.has_finished = function () {
        var _, ref, renderer_views, view;
        if (!PlotCanvasView.__super__.has_finished.call(this)) {
            return false;
        }
        ref = this.levels;
        for (_ in ref) {
            renderer_views = ref[_];
            for (_ in renderer_views) {
                view = renderer_views[_];
                if (!view.has_finished()) {
                    return false;
                }
            }
        }
        return true;
    };
    PlotCanvasView.prototype.render = function () {
        var height, width;
        width = this.model._width.value;
        height = this.model._height.value;
        this.canvas_view.set_dims([width, height]);
        this.update_constraints();
        this.el.style.position = 'absolute';
        this.el.style.left = this.model._dom_left.value + "px";
        this.el.style.top = this.model._dom_top.value + "px";
        this.el.style.width = this.model._width.value + "px";
        return this.el.style.height = this.model._height.value + "px";
    };
    PlotCanvasView.prototype.paint = function () {
        var ctx, frame_box, k, lod_timeout, ratio, ref, v;
        if (this.is_paused) {
            return;
        }
        logging_1.logger.trace("PlotCanvas.render() for " + this.model.id);
        this.canvas_view.prepare_canvas();
        if (Date.now() - this.interactive_timestamp < this.model.plot.lod_interval) {
            if (!this.lod_started) {
                this.model.plot.trigger_event(new bokeh_events_1.LODStart({}));
                this.lod_started = true;
            }
            this.interactive = true;
            lod_timeout = this.model.plot.lod_timeout;
            setTimeout((function (_this) {
                return function () {
                    if (_this.interactive && (Date.now() - _this.interactive_timestamp) > lod_timeout) {
                        _this.interactive = false;
                    }
                    return _this.request_render();
                };
            })(this), lod_timeout);
        }
        else {
            this.interactive = false;
            if (this.lod_started) {
                this.model.plot.trigger_event(new bokeh_events_1.LODEnd({}));
                this.lod_started = false;
            }
        }
        ref = this.renderer_views;
        for (k in ref) {
            v = ref[k];
            if ((this.range_update_timestamp == null) || v.set_data_timestamp > this.range_update_timestamp) {
                this.update_dataranges();
                break;
            }
        }
        this.model.frame._update_scales();
        ctx = this.canvas_view.ctx;
        ctx.pixel_ratio = ratio = this.canvas.pixel_ratio;
        ctx.save();
        ctx.scale(ratio, ratio);
        ctx.translate(0.5, 0.5);
        frame_box = [this.canvas.vx_to_sx(this.frame._left.value), this.canvas.vy_to_sy(this.frame._top.value), this.frame._width.value, this.frame._height.value];
        this._map_hook(ctx, frame_box);
        this._paint_empty(ctx, frame_box);
        this.prepare_webgl(ratio, frame_box);
        ctx.save();
        if (this.visuals.outline_line.doit) {
            this.visuals.outline_line.set_value(ctx);
            ctx.strokeRect.apply(ctx, frame_box);
        }
        ctx.restore();
        this._paint_levels(ctx, ['image', 'underlay', 'glyph'], frame_box);
        this.blit_webgl(ratio);
        this._paint_levels(ctx, ['annotation'], frame_box);
        this._paint_levels(ctx, ['overlay']);
        if (this.initial_range_info == null) {
            this.set_initial_range();
        }
        ctx.restore();
        if (!this._has_finished) {
            this._has_finished = true;
            return this.notify_finished();
        }
    };
    PlotCanvasView.prototype._paint_levels = function (ctx, levels, clip_region) {
        var i, indices, j, l, len, len1, len2, level, m, ref, renderer, renderer_view, renderer_views, sortKey;
        ctx.save();
        if ((clip_region != null) && this.model.plot.output_backend === "canvas") {
            ctx.beginPath();
            ctx.rect.apply(ctx, clip_region);
            ctx.clip();
        }
        indices = {};
        ref = this.model.plot.renderers;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            renderer = ref[i];
            indices[renderer.id] = i;
        }
        sortKey = function (renderer_view) {
            return indices[renderer_view.model.id];
        };
        for (l = 0, len1 = levels.length; l < len1; l++) {
            level = levels[l];
            renderer_views = array_1.sortBy(object_1.values(this.levels[level]), sortKey);
            for (m = 0, len2 = renderer_views.length; m < len2; m++) {
                renderer_view = renderer_views[m];
                renderer_view.render();
            }
        }
        return ctx.restore();
    };
    PlotCanvasView.prototype._map_hook = function (ctx, frame_box) { };
    PlotCanvasView.prototype._paint_empty = function (ctx, frame_box) {
        ctx.clearRect(0, 0, this.canvas_view.model._width.value, this.canvas_view.model._height.value);
        if (this.visuals.border_fill.doit) {
            this.visuals.border_fill.set_value(ctx);
            ctx.fillRect(0, 0, this.canvas_view.model._width.value, this.canvas_view.model._height.value);
            ctx.clearRect.apply(ctx, frame_box);
        }
        if (this.visuals.background_fill.doit) {
            this.visuals.background_fill.set_value(ctx);
            return ctx.fillRect.apply(ctx, frame_box);
        }
    };
    PlotCanvasView.prototype.save = function (name) {
        var blob, canvas, downloadLink, link, svg, svgblob;
        if (this.model.plot.output_backend === "canvas") {
            canvas = this.canvas_view.get_canvas_element();
            if (canvas.msToBlob != null) {
                blob = canvas.msToBlob();
                return window.navigator.msSaveBlob(blob, name);
            }
            else {
                link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = name + ".png";
                link.target = "_blank";
                return link.dispatchEvent(new MouseEvent('click'));
            }
        }
        else if (this.model.plot.output_backend === "svg") {
            svg = this.canvas_view.ctx.getSerializedSvg(true);
            svgblob = new Blob([svg], {
                type: 'text/plain'
            });
            downloadLink = document.createElement("a");
            downloadLink.download = name + ".svg";
            downloadLink.innerHTML = "Download svg";
            downloadLink.href = window.URL.createObjectURL(svgblob);
            downloadLink.onclick = function (event) {
                return document.body.removeChild(event.target);
            };
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            return downloadLink.click();
        }
    };
    return PlotCanvasView;
})(dom_view_1.DOMView);
exports.PlotCanvas = (function (superClass) {
    extend1(PlotCanvas, superClass);
    function PlotCanvas() {
        return PlotCanvas.__super__.constructor.apply(this, arguments);
    }
    PlotCanvas.prototype.type = 'PlotCanvas';
    PlotCanvas.prototype.default_view = exports.PlotCanvasView;
    PlotCanvas.prototype.initialize = function (attrs, options) {
        var ref;
        PlotCanvas.__super__.initialize.call(this, attrs, options);
        this.canvas = new canvas_1.Canvas({
            map: (ref = this.use_map) != null ? ref : false,
            initial_width: this.plot.plot_width,
            initial_height: this.plot.plot_height,
            use_hidpi: this.plot.hidpi,
            output_backend: this.plot.output_backend
        });
        this.frame = new cartesian_frame_1.CartesianFrame({
            x_range: this.plot.x_range,
            extra_x_ranges: this.plot.extra_x_ranges,
            x_scale: this.plot.x_scale,
            y_range: this.plot.y_range,
            extra_y_ranges: this.plot.extra_y_ranges,
            y_scale: this.plot.y_scale
        });
        this.above_panel = new layout_canvas_1.LayoutCanvas();
        this.below_panel = new layout_canvas_1.LayoutCanvas();
        this.left_panel = new layout_canvas_1.LayoutCanvas();
        this.right_panel = new layout_canvas_1.LayoutCanvas();
        return logging_1.logger.debug("PlotCanvas initialized");
    };
    PlotCanvas.prototype._doc_attached = function () {
        this.canvas.attach_document(this.document);
        this.frame.attach_document(this.document);
        this.above_panel.attach_document(this.document);
        this.below_panel.attach_document(this.document);
        this.left_panel.attach_document(this.document);
        this.right_panel.attach_document(this.document);
        PlotCanvas.__super__._doc_attached.call(this);
        return logging_1.logger.debug("PlotCanvas attached to document");
    };
    PlotCanvas.override({
        sizing_mode: 'stretch_both'
    });
    PlotCanvas.internal({
        plot: [p.Instance],
        toolbar: [p.Instance],
        canvas: [p.Instance],
        frame: [p.Instance]
    });
    PlotCanvas.prototype.get_layoutable_children = function () {
        var children, collect_panels;
        children = [this.above_panel, this.below_panel, this.left_panel, this.right_panel, this.canvas, this.frame];
        collect_panels = function (layout_renderers) {
            var j, len, r, results;
            results = [];
            for (j = 0, len = layout_renderers.length; j < len; j++) {
                r = layout_renderers[j];
                if (r.panel != null) {
                    results.push(children.push(r.panel));
                }
                else {
                    results.push(void 0);
                }
            }
            return results;
        };
        collect_panels(this.plot.above);
        collect_panels(this.plot.below);
        collect_panels(this.plot.left);
        collect_panels(this.plot.right);
        return children;
    };
    PlotCanvas.prototype.get_edit_variables = function () {
        var child, edit_variables, j, len, ref;
        edit_variables = [];
        ref = this.get_layoutable_children();
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            edit_variables = edit_variables.concat(child.get_edit_variables());
        }
        return edit_variables;
    };
    PlotCanvas.prototype.get_constraints = function () {
        var child, constraints, j, len, ref;
        constraints = PlotCanvas.__super__.get_constraints.call(this);
        constraints = constraints.concat(this._get_constant_constraints());
        constraints = constraints.concat(this._get_side_constraints());
        ref = this.get_layoutable_children();
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            constraints = constraints.concat(child.get_constraints());
        }
        return constraints;
    };
    PlotCanvas.prototype._get_constant_constraints = function () {
        return [solver_1.GE(this.above_panel._height, -this.plot.min_border_top), solver_1.GE(this.below_panel._height, -this.plot.min_border_bottom), solver_1.GE(this.left_panel._width, -this.plot.min_border_left), solver_1.GE(this.right_panel._width, -this.plot.min_border_right), solver_1.EQ(this.above_panel._top, [-1, this.canvas._top]), solver_1.EQ(this.above_panel._bottom, [-1, this.frame._top]), solver_1.EQ(this.below_panel._bottom, [-1, this.canvas._bottom]), solver_1.EQ(this.below_panel._top, [-1, this.frame._bottom]), solver_1.EQ(this.left_panel._left, [-1, this.canvas._left]), solver_1.EQ(this.left_panel._right, [-1, this.frame._left]), solver_1.EQ(this.right_panel._right, [-1, this.canvas._right]), solver_1.EQ(this.right_panel._left, [-1, this.frame._right]), solver_1.EQ(this.above_panel._height, [-1, this._top]), solver_1.EQ(this.above_panel._height, [-1, this.canvas._top], this.frame._top), solver_1.EQ(this.below_panel._height, [-1, this._height], this._bottom), solver_1.EQ(this.below_panel._height, [-1, this.frame._bottom]), solver_1.EQ(this.left_panel._width, [-1, this._left]), solver_1.EQ(this.left_panel._width, [-1, this.frame._left]), solver_1.EQ(this.right_panel._width, [-1, this._width], this._right), solver_1.EQ(this.right_panel._width, [-1, this.canvas._right], this.frame._right)];
    };
    PlotCanvas.prototype._get_side_constraints = function () {
        var constraint, constraints, j, l, last, layout_renderers, len, len1, r, ref, side, sides;
        constraints = [];
        sides = [['above', this.plot.above], ['below', this.plot.below], ['left', this.plot.left], ['right', this.plot.right]];
        for (j = 0, len = sides.length; j < len; j++) {
            ref = sides[j], side = ref[0], layout_renderers = ref[1];
            last = this.frame;
            for (l = 0, len1 = layout_renderers.length; l < len1; l++) {
                r = layout_renderers[l];
                constraint = (function () {
                    switch (side) {
                        case "above":
                            return solver_1.EQ(last.panel._top, [-1, r.panel._bottom]);
                        case "below":
                            return solver_1.EQ(last.panel._bottom, [-1, r.panel._top]);
                        case "left":
                            return solver_1.EQ(last.panel._left, [-1, r.panel._right]);
                        case "right":
                            return solver_1.EQ(last.panel._right, [-1, r.panel._left]);
                    }
                })();
                constraints.push(constraint);
                last = r;
            }
            if (layout_renderers.length !== 0) {
                constraint = (function () {
                    switch (side) {
                        case "above":
                            return solver_1.EQ(last.panel._top, [-1, this.above_panel._top]);
                        case "below":
                            return solver_1.EQ(last.panel._bottom, [-1, this.below_panel._bottom]);
                        case "left":
                            return solver_1.EQ(last.panel._left, [-1, this.left_panel._left]);
                        case "right":
                            return solver_1.EQ(last.panel._right, [-1, this.right_panel._right]);
                    }
                }).call(this);
                constraints.push(constraint);
            }
        }
        return constraints;
    };
    return PlotCanvas;
})(layout_dom_1.LayoutDOM);

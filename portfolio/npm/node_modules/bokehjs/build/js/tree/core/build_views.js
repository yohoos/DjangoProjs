"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_1 = require("./util/array");
var object_1 = require("./util/object");
exports.build_views = function (view_storage, view_models, options, view_types) {
    var created_views, i, j, k, len, len1, model, model_id, new_models, ref, to_remove, view, view_cls, view_options;
    if (view_types == null) {
        view_types = [];
    }
    to_remove = array_1.difference(Object.keys(view_storage), (function () {
        var j, len, results;
        results = [];
        for (j = 0, len = view_models.length; j < len; j++) {
            model = view_models[j];
            results.push(model.id);
        }
        return results;
    })());
    for (j = 0, len = to_remove.length; j < len; j++) {
        model_id = to_remove[j];
        view_storage[model_id].remove();
        delete view_storage[model_id];
    }
    created_views = [];
    new_models = view_models.filter(function (model) {
        return view_storage[model.id] == null;
    });
    for (i = k = 0, len1 = new_models.length; k < len1; i = ++k) {
        model = new_models[i];
        view_cls = (ref = view_types[i]) != null ? ref : model.default_view;
        view_options = object_1.extend({
            model: model
        }, options);
        view_storage[model.id] = view = new view_cls(view_options);
        created_views.push(view);
    }
    return created_views;
};
exports.remove_views = function (view_storage) {
    var id, j, len, ref, results;
    ref = object_1.keys(view_storage);
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
        id = ref[j];
        view_storage[id].remove();
        results.push(delete view_storage[id]);
    }
    return results;
};

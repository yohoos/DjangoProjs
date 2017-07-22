var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  HasProps
} from "./has_props";

import {
  logger
} from "./logging";

import {
  Selector
} from "./selector";

import * as hittest from "./hittest";

import * as p from "./properties";

export var SelectionManager = (function(superClass) {
  extend(SelectionManager, superClass);

  function SelectionManager() {
    return SelectionManager.__super__.constructor.apply(this, arguments);
  }

  SelectionManager.prototype.type = 'SelectionManager';

  SelectionManager.internal({
    source: [p.Any]
  });

  SelectionManager.prototype.initialize = function(attrs, options) {
    SelectionManager.__super__.initialize.call(this, attrs, options);
    this.selector = new Selector();
    this.inspectors = {};
    return this.last_inspection_was_empty = {};
  };

  SelectionManager.prototype.select = function(tool, renderer_views, geometry, final, append) {
    var i, indices, indices_other, indices_renderers, j, len, r, source;
    if (append == null) {
      append = false;
    }
    source = this.source;
    if (source !== renderer_views[0].model.data_source) {
      logger.warn('select called with mis-matched data sources');
    }
    indices_renderers = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = renderer_views.length; j < len; j++) {
        r = renderer_views[j];
        results.push(r.hit_test(geometry));
      }
      return results;
    })();
    indices_renderers = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = indices_renderers.length; j < len; j++) {
        i = indices_renderers[j];
        if (i !== null) {
          results.push(i);
        }
      }
      return results;
    })();
    if (indices_renderers.length === 0) {
      return false;
    }
    if (indices_renderers != null) {
      indices = indices_renderers[0];
      for (j = 0, len = indices_renderers.length; j < len; j++) {
        indices_other = indices_renderers[j];
        indices.update_through_union(indices_other);
      }
      this.selector.update(indices, final, append);
      this.source.selected = this.selector.indices;
      source.select.emit();
      return !indices.is_empty();
    } else {
      return false;
    }
  };

  SelectionManager.prototype.inspect = function(tool, renderer_view, geometry, data) {
    var indices, inspector, r_id, source;
    source = this.source;
    if (source !== renderer_view.model.data_source) {
      logger.warn('inspect called with mis-matched data sources');
    }
    indices = renderer_view.hit_test(geometry);
    if (indices != null) {
      r_id = renderer_view.model.id;
      if (indices.is_empty()) {
        if (this.last_inspection_was_empty[r_id] == null) {
          this.last_inspection_was_empty[r_id] = false;
        }
        if (this.last_inspection_was_empty[r_id]) {
          return;
        } else {
          this.last_inspection_was_empty[r_id] = true;
        }
      } else {
        this.last_inspection_was_empty[r_id] = false;
      }
      inspector = this._get_inspector(renderer_view);
      inspector.update(indices, true, false, true);
      this.source.setv({
        inspected: inspector.indices
      }, {
        "silent": true
      });
      source.inspect.emit([indices, tool, renderer_view, source, data]);
      return !indices.is_empty();
    } else {
      return false;
    }
  };

  SelectionManager.prototype.clear = function(rview) {
    this.selector.clear();
    return this.source.selected = hittest.create_hit_test_result();
  };

  SelectionManager.prototype._get_inspector = function(rview) {
    var id;
    id = rview.model.id;
    if (this.inspectors[id] != null) {
      return this.inspectors[id];
    } else {
      return this.inspectors[id] = new Selector();
    }
  };

  return SelectionManager;

})(HasProps);

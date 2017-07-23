var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  Signal,
  Signalable
} from "./signaling";

import {
  uniqueId
} from "./util/string";

export var View = (function() {
  extend(View.prototype, Signalable);

  View.getters = function(specs) {
    var fn, name, results;
    results = [];
    for (name in specs) {
      fn = specs[name];
      results.push(Object.defineProperty(this.prototype, name, {
        get: fn
      }));
    }
    return results;
  };

  function View(options) {
    var ref;
    if (options == null) {
      options = {};
    }
    this.removed = new Signal(this, "removed");
    if (options.model != null) {
      this.model = options.model;
    } else {
      throw new Error("model of a view wasn't configured");
    }
    this._parent = options.parent;
    this.id = (ref = options.id) != null ? ref : uniqueId();
    this.initialize(options);
  }

  View.prototype.initialize = function(options) {};

  View.prototype.remove = function() {
    this._parent = void 0;
    this.disconnect_signals();
    return this.removed.emit();
  };

  View.prototype.toString = function() {
    return this.model.type + "View(" + this.id + ")";
  };

  View.getters({
    parent: function() {
      if (this._parent !== void 0) {
        return this._parent;
      } else {
        throw new Error("parent of a view wasn't configured");
      }
    },
    is_root: function() {
      return this.parent === null;
    },
    root: function() {
      if (this.is_root) {
        return this;
      } else {
        return this.parent.root;
      }
    }
  });

  View.prototype.connect_signals = function() {};

  View.prototype.disconnect_signals = function() {
    return Signal.disconnectReceiver(this);
  };

  return View;

})();

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

import {
  ColumnarDataSource
} from "./columnar_data_source";

import {
  HasProps
} from "core/has_props";

import * as p from "core/properties";

import {
  Set
} from "core/util/data_structures";

import * as serialization from "core/util/serialization";

import {
  isArray,
  isNumber,
  isObject
} from "core/util/types";

export var concat_typed_arrays = function(a, b) {
  var c;
  c = new a.constructor(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
};

export var stream_to_column = function(col, new_col, rollover) {
  var end, i, l, m, ref, ref1, ref2, start, tmp, total_len;
  if (col.concat != null) {
    col = col.concat(new_col);
    if (col.length > rollover) {
      col = col.slice(-rollover);
    }
    return col;
  }
  total_len = col.length + new_col.length;
  if ((rollover != null) && total_len > rollover) {
    start = total_len - rollover;
    end = col.length;
    if (col.length < rollover) {
      tmp = new col.constructor(rollover);
      tmp.set(col, 0);
      col = tmp;
    }
    for (i = l = ref = start, ref1 = end; ref <= ref1 ? l < ref1 : l > ref1; i = ref <= ref1 ? ++l : --l) {
      col[i - start] = col[i];
    }
    for (i = m = 0, ref2 = new_col.length; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
      col[i + (end - start)] = new_col[i];
    }
    return col;
  }
  tmp = new col.constructor(new_col);
  return concat_typed_arrays(col, tmp);
};

export var slice = function(ind, length) {
  var ref, ref1, ref2, ref3, start, step, stop;
  if (isObject(ind)) {
    return [(ref = ind.start) != null ? ref : 0, (ref1 = ind.stop) != null ? ref1 : length, (ref2 = ind.step) != null ? ref2 : 1];
  }
  return ref3 = [ind, ind + 1, 1], start = ref3[0], stop = ref3[1], step = ref3[2], ref3;
};

export var patch_to_column = function(col, patch, shapes) {
  var flat_index, i, ind, istart, istep, istop, item, j, jstart, jstep, jstop, l, len, m, n, patched, patched_range, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, shape, value;
  patched = new Set();
  patched_range = false;
  for (l = 0, len = patch.length; l < len; l++) {
    ref = patch[l], ind = ref[0], value = ref[1];
    if (!isArray(ind)) {
      if (isNumber(ind)) {
        value = [value];
        patched.push(ind);
      } else {
        patched_range = true;
      }
      ind = [0, 0, ind];
      shape = [1, col.length];
      item = col;
    } else {
      patched.push(ind[0]);
      shape = shapes[ind[0]];
      item = col[ind[0]];
    }
    if (ind.length === 2) {
      shape = [1, shape[0]];
      ind = [ind[0], 0, ind[1]];
    }
    flat_index = 0;
    ref1 = slice(ind[1], shape[0]), istart = ref1[0], istop = ref1[1], istep = ref1[2];
    ref2 = slice(ind[2], shape[1]), jstart = ref2[0], jstop = ref2[1], jstep = ref2[2];
    for (i = m = ref3 = istart, ref4 = istop, ref5 = istep; ref5 > 0 ? m < ref4 : m > ref4; i = m += ref5) {
      for (j = n = ref6 = jstart, ref7 = jstop, ref8 = jstep; ref8 > 0 ? n < ref7 : n > ref7; j = n += ref8) {
        if (patched_range) {
          patched.push(j);
        }
        item[i * shape[1] + j] = value[flat_index];
        flat_index++;
      }
    }
  }
  return patched;
};

export var ColumnDataSource = (function(superClass) {
  extend(ColumnDataSource, superClass);

  function ColumnDataSource() {
    return ColumnDataSource.__super__.constructor.apply(this, arguments);
  }

  ColumnDataSource.prototype.type = 'ColumnDataSource';

  ColumnDataSource.prototype.initialize = function(options) {
    var ref;
    ColumnDataSource.__super__.initialize.call(this, options);
    return ref = serialization.decode_column_data(this.data), this.data = ref[0], this._shapes = ref[1], ref;
  };

  ColumnDataSource.define({
    data: [p.Any, {}]
  });

  ColumnDataSource.prototype.attributes_as_json = function(include_defaults, value_to_json) {
    var attrs, key, ref, value;
    if (include_defaults == null) {
      include_defaults = true;
    }
    if (value_to_json == null) {
      value_to_json = ColumnDataSource._value_to_json;
    }
    attrs = {};
    ref = this.serializable_attributes();
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      value = ref[key];
      if (key === 'data') {
        value = serialization.encode_column_data(value, this._shapes);
      }
      if (include_defaults) {
        attrs[key] = value;
      } else if (key in this._set_after_defaults) {
        attrs[key] = value;
      }
    }
    return value_to_json("attributes", attrs, this);
  };

  ColumnDataSource._value_to_json = function(key, value, optional_parent_object) {
    if (isObject(value) && key === 'data') {
      return serialization.encode_column_data(value, optional_parent_object._shapes);
    } else {
      return HasProps._value_to_json(key, value, optional_parent_object);
    }
  };

  ColumnDataSource.prototype.stream = function(new_data, rollover) {
    var data, k, v;
    data = this.data;
    for (k in new_data) {
      v = new_data[k];
      data[k] = stream_to_column(data[k], new_data[k], rollover);
    }
    this.setv('data', data, {
      silent: true
    });
    return this.streaming.emit();
  };

  ColumnDataSource.prototype.patch = function(patches) {
    var data, k, patch, patched;
    data = this.data;
    patched = new Set();
    for (k in patches) {
      patch = patches[k];
      patched = patched.union(patch_to_column(data[k], patch, this._shapes[k]));
    }
    this.setv('data', data, {
      silent: true
    });
    return this.patching.emit(patched.values);
  };

  return ColumnDataSource;

})(ColumnarDataSource);

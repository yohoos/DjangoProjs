"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extend = function (child, parent) { for (var key in parent) {
    if (hasProp.call(parent, key))
        child[key] = parent[key];
} function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
require("jquery-ui/sortable");
var SlickGrid = require("slick_grid/slick.grid");
var RowSelectionModel = require("slick_grid/plugins/slick.rowselectionmodel");
var CheckboxSelectColumn = require("slick_grid/plugins/slick.checkboxselectcolumn");
var hittest = require("core/hittest");
var p = require("core/properties");
var string_1 = require("core/util/string");
var array_1 = require("core/util/array");
var table_widget_1 = require("./table_widget");
var widget_1 = require("./widget");
exports.DTINDEX_NAME = "__bkdt_internal_index__";
exports.DataProvider = (function () {
    function DataProvider(source) {
        var j, ref, results;
        this.source = source;
        if (exports.DTINDEX_NAME in this.source.data) {
            throw new Error("special name " + exports.DTINDEX_NAME + " cannot be used as a data table column");
        }
        this.index = (function () {
            results = [];
            for (var j = 0, ref = this.getLength(); 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--) {
                results.push(j);
            }
            return results;
        }).apply(this);
    }
    DataProvider.prototype.getLength = function () {
        return this.source.get_length();
    };
    DataProvider.prototype.getItem = function (offset) {
        var field, item, j, len, ref;
        item = {};
        ref = Object.keys(this.source.data);
        for (j = 0, len = ref.length; j < len; j++) {
            field = ref[j];
            item[field] = this.source.data[field][this.index[offset]];
        }
        item[exports.DTINDEX_NAME] = this.index[offset];
        return item;
    };
    DataProvider.prototype.setItem = function (offset, item) {
        var field, value;
        for (field in item) {
            value = item[field];
            if (field !== exports.DTINDEX_NAME) {
                this.source.data[field][this.index[offset]] = value;
            }
        }
        this._update_source_inplace();
        return null;
    };
    DataProvider.prototype.getField = function (offset, field) {
        if (field === exports.DTINDEX_NAME) {
            return this.index[offset];
        }
        return this.source.data[field][this.index[offset]];
    };
    DataProvider.prototype.setField = function (offset, field, value) {
        this.source.data[field][this.index[offset]] = value;
        this._update_source_inplace();
        return null;
    };
    DataProvider.prototype.getItemMetadata = function (index) {
        return null;
    };
    DataProvider.prototype.getRecords = function () {
        var i;
        return (function () {
            var j, ref, results;
            results = [];
            for (i = j = 0, ref = this.getLength(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                results.push(this.getItem(i));
            }
            return results;
        }).call(this);
    };
    DataProvider.prototype.sort = function (columns) {
        var cols, column, old_index, records;
        cols = (function () {
            var j, len, results;
            results = [];
            for (j = 0, len = columns.length; j < len; j++) {
                column = columns[j];
                results.push([column.sortCol.field, column.sortAsc ? 1 : -1]);
            }
            return results;
        })();
        if (cols.length === 0) {
            cols = [[exports.DTINDEX_NAME, 1]];
        }
        records = this.getRecords();
        old_index = this.index.slice();
        return this.index.sort(function (i1, i2) {
            var field, j, len, ref, result, sign, value1, value2;
            for (j = 0, len = cols.length; j < len; j++) {
                ref = cols[j], field = ref[0], sign = ref[1];
                value1 = records[old_index.indexOf(i1)][field];
                value2 = records[old_index.indexOf(i2)][field];
                result = value1 === value2 ? 0 : value1 > value2 ? sign : -sign;
                if (result !== 0) {
                    return result;
                }
            }
            return 0;
        });
    };
    DataProvider.prototype._update_source_inplace = function () {
        this.source.properties.data.change.emit(this, this.source.attributes['data']);
    };
    return DataProvider;
})();
exports.DataTableView = (function (superClass) {
    extend(DataTableView, superClass);
    function DataTableView() {
        return DataTableView.__super__.constructor.apply(this, arguments);
    }
    DataTableView.prototype.className = "bk-data-table";
    DataTableView.prototype.initialize = function (options) {
        DataTableView.__super__.initialize.call(this, options);
        return this.in_selection_update = false;
    };
    DataTableView.prototype.connect_signals = function () {
        this.connect(this.model.change, (function (_this) {
            return function () {
                return _this.render();
            };
        })(this));
        this.connect(this.model.source.properties.data.change, (function (_this) {
            return function () {
                return _this.updateGrid();
            };
        })(this));
        this.connect(this.model.source.streaming, (function (_this) {
            return function () {
                return _this.updateGrid();
            };
        })(this));
        this.connect(this.model.source.patching, (function (_this) {
            return function () {
                return _this.updateGrid();
            };
        })(this));
        return this.connect(this.model.source.properties.selected.change, (function (_this) {
            return function () {
                return _this.updateSelection();
            };
        })(this));
    };
    DataTableView.prototype.updateGrid = function () {
        this.data.constructor(this.model.source);
        this.grid.invalidate();
        return this.grid.render();
    };
    DataTableView.prototype.updateSelection = function () {
        var cur_grid_range, min_index, permuted_indices, selected, selected_indices, x;
        if (this.in_selection_update) {
            return;
        }
        selected = this.model.source.selected;
        selected_indices = selected['1d'].indices;
        permuted_indices = (function () {
            var j, len, results;
            results = [];
            for (j = 0, len = selected_indices.length; j < len; j++) {
                x = selected_indices[j];
                results.push(this.data.index.indexOf(x));
            }
            return results;
        }).call(this);
        this.in_selection_update = true;
        this.grid.setSelectedRows(permuted_indices);
        this.in_selection_update = false;
        cur_grid_range = this.grid.getViewport();
        if (this.model.scroll_to_selection && !array_1.any(permuted_indices, function (i) {
            return (cur_grid_range.top <= i && i <= cur_grid_range.bottom);
        })) {
            min_index = Math.max(0, Math.min.apply(null, permuted_indices) - 1);
            return this.grid.scrollRowToTop(min_index);
        }
    };
    DataTableView.prototype.newIndexColumn = function () {
        return {
            id: string_1.uniqueId(),
            name: "#",
            field: exports.DTINDEX_NAME,
            width: 40,
            behavior: "select",
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            sortable: true,
            cssClass: "bk-cell-index"
        };
    };
    DataTableView.prototype.render = function () {
        var checkboxSelector, column, columns, options;
        columns = (function () {
            var j, len, ref, results;
            ref = this.model.columns;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
                column = ref[j];
                results.push(column.toColumn());
            }
            return results;
        }).call(this);
        if (this.model.selectable === "checkbox") {
            checkboxSelector = new CheckboxSelectColumn({
                cssClass: "bk-cell-select"
            });
            columns.unshift(checkboxSelector.getColumnDefinition());
        }
        if (this.model.row_headers) {
            columns.unshift(this.newIndexColumn());
        }
        options = {
            enableCellNavigation: this.model.selectable !== false,
            enableColumnReorder: this.model.reorderable,
            forceFitColumns: this.model.fit_columns,
            autoHeight: this.model.height === "auto",
            multiColumnSort: this.model.sortable,
            editable: this.model.editable,
            autoEdit: false
        };
        if (this.model.width != null) {
            this.el.style.width = this.model.width + "px";
        }
        else {
            this.el.style.width = this.model.default_width + "px";
        }
        if ((this.model.height != null) && this.model.height !== "auto") {
            this.el.style.height = this.model.height + "px";
        }
        this.data = new exports.DataProvider(this.model.source);
        this.grid = new SlickGrid(this.el, this.data, columns, options);
        this.grid.onSort.subscribe((function (_this) {
            return function (event, args) {
                columns = args.sortCols;
                _this.data.sort(columns);
                _this.grid.invalidate();
                _this.updateSelection();
                return _this.grid.render();
            };
        })(this));
        if (this.model.selectable !== false) {
            this.grid.setSelectionModel(new RowSelectionModel({
                selectActiveRow: checkboxSelector == null
            }));
            if (checkboxSelector != null) {
                this.grid.registerPlugin(checkboxSelector);
            }
            this.grid.onSelectedRowsChanged.subscribe((function (_this) {
                return function (event, args) {
                    var i, selected;
                    if (_this.in_selection_update) {
                        return;
                    }
                    selected = hittest.create_hit_test_result();
                    selected['1d'].indices = (function () {
                        var j, len, ref, results;
                        ref = args.rows;
                        results = [];
                        for (j = 0, len = ref.length; j < len; j++) {
                            i = ref[j];
                            results.push(this.data.index[i]);
                        }
                        return results;
                    }).call(_this);
                    return _this.model.source.selected = selected;
                };
            })(this));
        }
        this._prefix_ui();
        return this;
    };
    return DataTableView;
})(widget_1.WidgetView);
exports.DataTable = (function (superClass) {
    extend(DataTable, superClass);
    function DataTable() {
        return DataTable.__super__.constructor.apply(this, arguments);
    }
    DataTable.prototype.type = 'DataTable';
    DataTable.prototype.default_view = exports.DataTableView;
    DataTable.define({
        columns: [p.Array, []],
        fit_columns: [p.Bool, true],
        sortable: [p.Bool, true],
        reorderable: [p.Bool, true],
        editable: [p.Bool, false],
        selectable: [p.Bool, true],
        row_headers: [p.Bool, true],
        scroll_to_selection: [p.Bool, true]
    });
    DataTable.override({
        height: 400
    });
    DataTable.internal({
        default_width: [p.Number, 600]
    });
    return DataTable;
})(table_widget_1.TableWidget);

"use strict";
/**
 * Row Definition for Grid Compoent
 */
var GridRow = (function () {
    function GridRow() {
    }
    /**
     * returns the rowId
     */
    GridRow.prototype.getRowId = function () {
        return this.rowId;
    };
    /**
     * returns the cells
     */
    GridRow.prototype.getCells = function () {
        return this.cells;
    };
    /**
     * set the cells
     */
    GridRow.prototype.setCells = function (_cells) {
        this.cells = _cells;
    };
    /**
     * returns the rowStyle
     */
    GridRow.prototype.getRowStyle = function () {
        return this.rowStyle;
    };
    /**
     * set the rowStyle
     */
    GridRow.prototype.setRowStyle = function (_rowStyle) {
        this.rowStyle = _rowStyle;
    };
    /**
     * set the rowId
     * @param rowId
     */
    GridRow.prototype.setRowId = function (rowId) {
        this.rowId = rowId;
    };
    /**
     * returns the rowTitle
     */
    GridRow.prototype.getRowTitle = function () {
        return this.rowTitle;
    };
    /**
     * returns the rowTitle
     */
    GridRow.prototype.setRowTitle = function (title) {
        this.rowTitle = title;
    };
    /**
     * returns the additional row Element
     */
    GridRow.prototype.getAdditionalElement = function () {
        return this.additionalElement;
    };
    /**
     * returns the additional row Element
     */
    GridRow.prototype.setAdditionalElement = function (_additionalElement) {
        this.additionalElement = _additionalElement;
    };
    return GridRow;
}());
module.exports = GridRow;
//# sourceMappingURL=gridrow.js.map
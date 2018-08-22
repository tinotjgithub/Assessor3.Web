"use strict";
/**
 * Cell for GridControl Compoent
 */
var GridCell = (function () {
    function GridCell() {
        this.comparerName = undefined;
        this.sortDirection = undefined;
        this.isSortable = true;
    }
    /**
     * returns the cell style
     */
    GridCell.prototype.getCellStyle = function () {
        return this.cellStyle;
    };
    /**
     * set the cell style
     * @param {string} _cellStyle
     */
    GridCell.prototype.setCellStyle = function (_cellStyle) {
        this.cellStyle = _cellStyle;
    };
    /**
     * returns the additional cell Element
     */
    GridCell.prototype.getAdditionalElement = function () {
        return this.additionalElement;
    };
    /**
     * sets the additional cell Element
     * @param _additionalElement
     */
    GridCell.prototype.setAdditionalElement = function (_additionalElement) {
        this.additionalElement = _additionalElement;
    };
    return GridCell;
}());
module.exports = GridCell;
//# sourceMappingURL=gridcell.js.map
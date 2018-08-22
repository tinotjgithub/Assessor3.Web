"use strict";
/**
 * Helper class for table element
 */
var TableHelper = (function () {
    function TableHelper() {
    }
    /**
     * This method will set column widths
     * Implemented based on spike #55912
     * @private
     * @memberof TableHelper
     */
    TableHelper.setColumnWidthsForTable = function (gridControlId, columnHeaderPrefix, rowHeaderPrefix) {
        // Remove the earlier applied inline styles
        var columnHeaderId = columnHeaderPrefix + gridControlId;
        // Get the widths of header columns
        var widths = new Array();
        if (document.getElementById(columnHeaderId)) {
            for (var i = 0; i < document.getElementById(columnHeaderId).querySelectorAll('th').length; i++) {
                // Removing the earlier applied inline styles
                document.querySelectorAll('#' + columnHeaderId + ' th .header-data')[i].removeAttribute('style');
                var rowColumn = document.querySelectorAll('#' + rowHeaderPrefix + gridControlId
                    + ' tr:nth-of-type(1) td .cell-data')[i];
                if (rowColumn) {
                    rowColumn.removeAttribute('style');
                }
                widths.push(document.getElementById(columnHeaderId).querySelectorAll('th')[i].clientWidth);
            }
            // Compare the header columns width with the respective column in the first row and find the highest among them
            var trs = document.getElementById(rowHeaderPrefix + gridControlId) ?
                document.getElementById(rowHeaderPrefix + gridControlId).querySelectorAll(' tr') : [];
            if (trs.length > 0) {
                var lentd = trs[0].querySelectorAll('td').length;
                for (var col = 0; col < lentd; col++) {
                    var curEl = trs[0].querySelectorAll('td')[col];
                    var divWidth = curEl.clientWidth;
                    if (divWidth > widths[col]) {
                        widths[col] = divWidth;
                    }
                }
            }
            // Apply the highest width calculated to header / column as min-width
            // We have to avoid last cell in header and row inorder to avoid setting maximum length for last column
            for (var j = 0; j < widths.length; j++) {
                var headerColumn = document.querySelectorAll('#' + columnHeaderId + ' th:not(.last-cell-header):nth-of-type(' + (j + 1) + ') .header-data')[0];
                if (headerColumn) {
                    headerColumn.style.minWidth = (widths[j] + 5) + 'px';
                }
                var rowColumn = document.querySelectorAll('#' + rowHeaderPrefix + gridControlId + ' tr:nth-of-type(1) td:not(.last-cell):nth-of-type(' + (j + 1) + ') .cell-data')[0];
                if (rowColumn) {
                    rowColumn.style.minWidth = (widths[j] + 5) + 'px';
                }
            }
        }
    };
    return TableHelper;
}());
module.exports = TableHelper;
//# sourceMappingURL=tablehelper.js.map
/**
 * Helper class for table element
 */
class TableHelper {

    /**
     * This method will set column widths
     * Implemented based on spike #55912
     * @private
     * @memberof TableHelper
     */
    public static setColumnWidthsForTable = (gridControlId: string, columnHeaderPrefix: string, rowHeaderPrefix: string) => {
        // Remove the earlier applied inline styles
        let columnHeaderId: string = columnHeaderPrefix + gridControlId;

        // Get the widths of header columns
        let widths: number[] = new Array<number>();
        if (document.getElementById(columnHeaderId)) {
        for (var i = 0; i < document.getElementById(columnHeaderId).querySelectorAll('th').length; i++) {
            // Removing the earlier applied inline styles
            document.querySelectorAll('#' + columnHeaderId + ' th .header-data')[i].removeAttribute('style');
            let rowColumn = document.querySelectorAll('#'  + rowHeaderPrefix + gridControlId
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
        for (let j = 0; j < widths.length; j++) {
            let headerColumn = document.querySelectorAll
                            ('#' + columnHeaderId + ' th:not(.last-cell-header):nth-of-type(' + (j + 1) + ') .header-data')[0];
            if (headerColumn) {
                (headerColumn as HTMLElement).style.minWidth = (widths[j] + 5) + 'px';
            }
            let rowColumn = document.querySelectorAll
            ('#' + rowHeaderPrefix + gridControlId + ' tr:nth-of-type(1) td:not(.last-cell):nth-of-type(' + (j + 1) + ') .cell-data')[0];
            if (rowColumn) {
                (rowColumn as HTMLElement).style.minWidth = (widths[j] + 5) + 'px';
            }

        }
    }
}
}

export = TableHelper;
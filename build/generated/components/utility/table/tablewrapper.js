"use strict";
var _this = this;
var React = require('react');
var classNames = require('classnames');
/* tslint:disable:no-reserved-keywords */
/* tslint:disable:variable-name */
var TableControl = function (props) {
    var header = (props.tableHeader) ? React.createElement("thead", null, props.tableHeader) : React.createElement("thead", null);
    var body = (props.tableBody) ? React.createElement("tbody", {id: 'table_body'}, props.tableBody) : React.createElement("tbody", null);
    var tableStyle = {};
    tableStyle = {
        width: '100%',
    };
    return (React.createElement("table", {style: tableStyle, cellPadding: '0', cellSpacing: '0', id: props.id, key: 'key_' + props.id, className: props.class}, header, body));
};
/* tslint:disable:variable-name */
var TableRow = function (props) {
    var onClickHandler = function (event) {
        if (props.onClick) {
            props.onClick(event);
        }
    };
    var onMouseClickHandler = function (event, rowId) {
        if (props.onMouseDown) {
            props.onMouseDown(rowId);
        }
    };
    var onMouseUpClickHandler = function (event, rowId) {
        if (props.onMouseUp) {
            props.onMouseUp(rowId);
        }
    };
    var onTouchStartHandler = function (event, rowId) {
        if (props.onTouchStart) {
            props.onTouchStart(rowId);
        }
    };
    var additionalElement = (props.additionalElement) ? props.additionalElement : null;
    return (React.createElement("tr", {id: props.id, className: props.class, onClick: onClickHandler, onMouseDown: onMouseClickHandler.bind(_this, props.rowId), onMouseUp: onMouseUpClickHandler.bind(_this, props.rowId), onTouchStart: onTouchStartHandler.bind(_this, props.rowId)}, props.tableCells, additionalElement));
};
/* tslint:disable:variable-name */
var TableBodyCell = function (props) {
    var additionalElement = (props.additionalElement) ? props.additionalElement : null;
    return (React.createElement("td", {className: props.class, id: props.id}, React.createElement("div", {className: 'cell-data'}, props.cellElement, props.additionalElement)));
};
/* tslint:disable:variable-name */
var TableHeaderCell = function (props) {
    var onClickHandler = function (event) {
        if (props.onClick && props.comparerName && props.isSortable) {
            props.onClick(props.comparerName, props.sortDirection);
        }
    };
    var additionalElement = (props.additionalElement) ? props.additionalElement : null;
    return (React.createElement("th", {className: props.class, id: props.id}, React.createElement("span", {className: 'visually-hidden'}, " visually hidden text "), React.createElement("div", {className: classNames('header-data', { 'hand': props.onClick && props.comparerName && props.isSortable }), onClick: onClickHandler}, props.cellElement, additionalElement)));
};
/**
 * Helper fucntions for the table statless components
 */
var TableHelper = (function () {
    function TableHelper() {
    }
    /**
     * This method will call callback function for mouse up click of row.
     */
    TableHelper.mouseUpClick = function (props, rowId) {
        if (props.onMouseUp) {
            props.onMouseUp(rowId);
        }
    };
    /**
     * This method will call callback function for touch start of row.
     */
    TableHelper.touchStart = function (props, rowId) {
        if (props.onTouchStart) {
            props.onTouchStart(rowId);
        }
    };
    /**
     * returns the table row (tr) collection based on the given list of row data
     * @param rows - collection of rows
     * @param isHeader - whethere the row is a header row or not
     */
    TableHelper.getRows = function (rows, isHeader, props) {
        var tableId = props.id;
        var that = this;
        var rowSeq = rows.keySeq();
        var seqIndex = 0;
        //Creating table rows - tr
        var tableElement = rows.map(function (tableRow) {
            var rowSeqKey = rowSeq.get(seqIndex++);
            var additionalRowElement = tableRow.getAdditionalElement();
            var cellIndex = 0;
            //Creating td/th elements
            var rowElement = tableRow.getCells().map(function (gridCell) {
                var gridCellElement = gridCell.columnElement;
                var cellAdditionalElement = gridCell.getAdditionalElement();
                cellIndex++;
                var style = gridCell.getCellStyle();
                style = (style) ? style : '';
                if (gridCell.isHidden !== true) {
                    if (isHeader === true) {
                        return (React.createElement(TableHeaderCell, {cellElement: gridCellElement, class: style, additionalElement: cellAdditionalElement, key: tableId + '_th_' + rowSeqKey + '_' + cellIndex, id: 'th_' + rowSeqKey + '_' + cellIndex, onClick: props.onSortClick, comparerName: gridCell.comparerName, sortDirection: gridCell.sortDirection, isSortable: gridCell.isSortable, renderedOn: props.renderedOn}));
                    }
                    else {
                        return (React.createElement(TableBodyCell, {cellElement: gridCellElement, class: style, additionalElement: cellAdditionalElement, key: tableId + '_td_' + rowSeqKey + '_' + cellIndex, id: 'td_' + rowSeqKey + '_' + cellIndex, renderedOn: props.renderedOn}));
                    }
                }
            });
            if (!props.avoidLastColumn) {
                if (isHeader) {
                    rowElement.push(React.createElement("th", {className: 'last-cell-header', key: tableId + '_th_' + rowSeqKey + '_empty', id: 'th_' + rowSeqKey + '_empty'}, React.createElement("span", {className: 'visually-hidden'}, " visually hidden text "), React.createElement("div", {className: 'header-data'})));
                }
                else {
                    rowElement.push(React.createElement("td", {className: 'last-cell', key: tableId + '_td_' + rowSeqKey + '_empty', id: 'td_' + rowSeqKey + '_empty'}, React.createElement("div", {className: 'cell-data'})));
                }
            }
            return (React.createElement(TableRow, {class: classNames((_a = {}, _a[tableRow.getRowStyle()] = true, _a), {
                'draggable': !props.isDraggableRow ?
                    (props.selectedRowIdToDrag ? tableRow.getRowId() === props.selectedRowIdToDrag : false) : false
            }), title: tableRow.getRowTitle(), tableCells: rowElement, key: tableId + '_tableRow_Key_' + rowSeqKey, id: 'tableRow_' + rowSeqKey, additionalElement: additionalRowElement, onClick: that.handleClick.bind(that, props, tableRow.getRowId()), renderedOn: props.renderedOn, onMouseDown: that.mouseDownClick.bind(that, props, tableRow.getRowId()), onMouseUp: that.mouseUpClick.bind(that, props, tableRow.getRowId()), onTouchStart: that.touchStart.bind(that, props, tableRow.getRowId())}));
            var _a;
        });
        return tableElement;
    };
    /**
     * This method will call callback function
     */
    TableHelper.handleClick = function (props, rowId) {
        if (props.onRowClick) {
            props.onRowClick(rowId);
        }
    };
    /**
     * This method will call callback function for mouse down click of row.
     */
    TableHelper.mouseDownClick = function (props, rowId) {
        if (props.onMouseDown) {
            props.onMouseDown(rowId);
        }
    };
    return TableHelper;
}());
/**
 * Represents the table Component
 */
var TableWrapper = function (props) {
    var headerRows;
    var bodyRows;
    if (props.tableHeaderRows) {
        headerRows = TableHelper.getRows(props.tableHeaderRows, true, props);
    }
    if (props.tableBodyRows) {
        bodyRows = TableHelper.getRows(props.tableBodyRows, false, props);
    }
    if (headerRows || bodyRows) {
        return (React.createElement(TableControl, {tableHeader: headerRows, tableBody: bodyRows, class: props.gridStyle, id: props.id, key: 'key_' + props.id, renderedOn: props.renderedOn}));
    }
    else {
        return null;
    }
};
module.exports = TableWrapper;
//# sourceMappingURL=tablewrapper.js.map
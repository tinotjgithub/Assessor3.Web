"use strict";
var React = require('react');
var gridRow = require('../../../utility/grid/gridrow');
var Immutable = require('immutable');
var gridCell = require('../../../utility/grid/gridcell');
var localeStore = require('../../../../stores/locale/localestore');
var enums = require('../../enums');
var ColumnHeader = require('../../../worklist/shared/columnheader');
var gridColumnNames = require('../gridcolumnnames');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var SupportExaminerTextColumn = require('../../../adminsupport/shared/supportexaminertextcolumn');
var adminSupportGridColumnsJson = require('../../../utility/grid/adminsupportgridcolumns.json');
/**
 * class for Admin Support Helper implementation
 */
var AdminSupportHelperBase = (function () {
    function AdminSupportHelperBase() {
        this._dateLengthInPixel = 0;
    }
    /**
     * GenerateTableHeader is used for generating header collection.
     * @param comparerName
     * @param sortDirection
     */
    AdminSupportHelperBase.prototype.generateTableHeader = function (comparerName, sortDirection) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(adminSupportGridColumnsJson);
        var _tableHeaderCollection = this.getTableHeader(comparerName, sortDirection);
        return _tableHeaderCollection;
    };
    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    AdminSupportHelperBase.prototype.getColumnHeaderElement = function (seq, headerText, gridColumn, isCurrentSort, isSortRequired, sortDirection) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            headerText: headerText,
            sortDirection: sortDirection,
            isCurrentSort: isCurrentSort,
            isSortingRequired: isSortRequired
        };
        return React.createElement(ColumnHeader, componentProps);
    };
    /**
     * returns the table row collection for table header.
     */
    AdminSupportHelperBase.prototype.getTableHeader = function (comparerName, sortDirection) {
        var _columnHeaderCollection = Array();
        var _cell;
        var _row = new gridRow();
        var _columnHeaderCellcollection = new Array();
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson);
        var gridColumnLength = gridColumns.length;
        this.resetDynamicColumnSettings();
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _cell = new gridCell();
            var _supportExaminerColumn = gridColumns[gridColumnCount].GridColumn;
            var headerText = gridColumns[gridColumnCount].ColumnHeader;
            var _comparerName = gridColumns[gridColumnCount].ComparerName;
            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            var key = 'columnHeader_' + gridColumnCount;
            _cell.columnElement = this.getColumnHeaderElement(key, headerText, _supportExaminerColumn, (comparerName === _comparerName), (gridColumns[gridColumnCount].Sortable === 'true'), sortDirection);
            _cell.comparerName = _comparerName;
            _cell.sortDirection = this.getSortDirection((comparerName === _comparerName), sortDirection);
            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _cell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _columnHeaderCellcollection.push(_cell);
        }
        _row.setCells(_columnHeaderCellcollection);
        _columnHeaderCollection.push(_row);
        var _supportAdminTableHeaderCollection = Immutable.fromJS(_columnHeaderCollection);
        return _supportAdminTableHeaderCollection;
    };
    /**
     * returns the gridcolumns
     * @param resolvedGridColumnsJson
     */
    AdminSupportHelperBase.prototype.getGridColumns = function (resolvedGridColumnsJson) {
        var gridColumns;
        gridColumns = resolvedGridColumnsJson.adminsupport.AdminSupportExaminer.GridColumns;
        return gridColumns;
    };
    /**
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * @param isCurrentSort
     * @param sortDirection
     */
    AdminSupportHelperBase.prototype.getSortDirection = function (isCurrentSort, sortDirection) {
        return ((isCurrentSort === true) ?
            ((sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending)
            : enums.SortDirection.Ascending);
    };
    /**
     * Reset dynamic column
     */
    AdminSupportHelperBase.prototype.resetDynamicColumnSettings = function () {
        this._dateLengthInPixel = 0;
    };
    /**
     * creating grid row
     * @param uniqueId
     * @param gridCells
     * @param additionalComponent
     */
    AdminSupportHelperBase.prototype.getGridRow = function (uniqueId, gridCells, additionalComponent, cssClass) {
        var _gridRow = new gridRow();
        var className = this.setRowStyle();
        className = (cssClass) ? (className + ' ' + cssClass) : className;
        _gridRow.setRowStyle(className);
        _gridRow.setRowId(parseFloat(uniqueId));
        _gridRow.setCells(gridCells);
        _gridRow.setAdditionalElement(additionalComponent);
        return _gridRow;
    };
    /**
     * Set row style to amber if the response has blocking exceptions or other reasons
     * @param responseStatus
     */
    AdminSupportHelperBase.prototype.setRowStyle = function () {
        return 'row';
    };
    /**
     * Generate Examiners Row Definition
     * @param adminSupportExaminerList
     */
    AdminSupportHelperBase.prototype.generateExaminersRowDefinition = function (adminSupportExaminerList) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(adminSupportGridColumnsJson);
        this._supportExaminerListCollection = Immutable.List();
        var _supportExaminerRowCollection = Array();
        var _supportExaminerRowHeaderCellcollection = Array();
        var _supportExaminerColumn;
        var _examinerListCell;
        var key;
        if (adminSupportExaminerList != null) {
            var gridSeq = adminSupportExaminerList.getSupportExaminerList.keySeq();
            var _supportExaminerListData = adminSupportExaminerList.getSupportExaminerList.toArray();
            var supportExaminerListLength = _supportExaminerListData.length;
            for (var supportExaminerListCount = 0; supportExaminerListCount < supportExaminerListLength; supportExaminerListCount++) {
                // Getting the supportExaminer data row
                var gridColumns = this.resolvedGridColumnsJson.adminsupport.AdminSupportExaminer.GridColumns;
                var gridColumnLength = gridColumns.length;
                _supportExaminerRowHeaderCellcollection = new Array();
                // instead of accessing _supportExaminerListData[supportExaminerListCount] collection inside loop, its accessed
                // outside the loop globally
                var supportExaminerData = _supportExaminerListData[supportExaminerListCount];
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _supportExaminerColumn = gridColumns[gridColumnCount].GridColumn;
                    _examinerListCell = new gridCell();
                    switch (_supportExaminerColumn) {
                        case gridColumnNames.Name:
                            key = gridSeq.get(supportExaminerListCount) + '_Name_' + gridColumnCount;
                            _examinerListCell.columnElement = (this.getGenericTextElement(supportExaminerData.initials + ' ' + supportExaminerData.surname, key, false));
                            break;
                        case gridColumnNames.Username:
                            key = gridSeq.get(supportExaminerListCount) + '_Username_' + gridColumnCount;
                            _examinerListCell.columnElement = (this.getGenericTextElement(supportExaminerData.liveUserName, key, false));
                            break;
                        case gridColumnNames.ExaminerCode:
                            key = gridSeq.get(supportExaminerListCount) + '_ExaminerCode_' + gridColumnCount;
                            _examinerListCell.columnElement = (this.getGenericTextElement(supportExaminerData.employeeNum, key, true));
                            break;
                        default:
                    }
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _examinerListCell.setCellStyle(cellStyle);
                    _supportExaminerRowHeaderCellcollection.push(_examinerListCell);
                }
                _supportExaminerRowCollection.push(this.getGridRow(supportExaminerData.examinerId.toString(), _supportExaminerRowHeaderCellcollection, undefined, (supportExaminerData.isSelected ? 'selected' : '')));
            }
        }
        this._supportExaminerListCollection = Immutable.fromJS(_supportExaminerRowCollection);
        return this._supportExaminerListCollection;
    };
    /**
     * Get the text value for Grid Column
     * @param textValue
     * @param seq
     */
    AdminSupportHelperBase.prototype.getGenericTextElement = function (textValue, seq, classText) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue,
            classText: classText
        };
        return React.createElement(SupportExaminerTextColumn, componentProps);
    };
    return AdminSupportHelperBase;
}());
module.exports = AdminSupportHelperBase;
//# sourceMappingURL=adminsupporthelperbase.js.map
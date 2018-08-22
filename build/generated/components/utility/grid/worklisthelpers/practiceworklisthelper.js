"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gridRow = require('../../../utility/grid/gridrow');
var Immutable = require('immutable');
var gridCell = require('../../../utility/grid/gridcell');
var worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');
var worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');
var worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
var enums = require('../../enums');
var gridColumnNames = require('../gridcolumnnames');
var worklistHelperBase = require('./worklisthelperbase');
var localeStore = require('../../../../stores/locale/localestore');
var josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var qigStore = require('../../../../stores/qigselector/qigstore');
/**
 * class for WorkList Helper implementation
 */
var PracticeWorklistHelper = (function (_super) {
    __extends(PracticeWorklistHelper, _super);
    function PracticeWorklistHelper() {
        _super.apply(this, arguments);
    }
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of practice open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    PracticeWorklistHelper.prototype.generateRowDefinion = function (responseListData, responseType, gridType) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(worklistGridColumnsJson);
        this._immutableWorkListCollection = Immutable.List();
        switch (responseType) {
            case enums.ResponseMode.open:
                switch (gridType) {
                    case enums.GridType.detailed:
                        this._immutableWorkListCollection = this.getRowDefinionForOpenDetail(responseListData);
                        break;
                    case enums.GridType.tiled:
                        this._immutableWorkListCollection = this.getRowDefinionForOpenTiled(responseListData);
                        break;
                    default:
                }
                break;
            case enums.ResponseMode.closed:
                switch (gridType) {
                    case enums.GridType.detailed:
                        this._immutableWorkListCollection = this.getRowDefinionForClosedDetail(responseListData);
                        break;
                    case enums.GridType.tiled:
                        this._immutableWorkListCollection = this.getRowDefinionForClosedTiled(responseListData);
                        break;
                    default:
                }
                break;
        }
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForpracticeOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of practice open responses
     * @returns grid row collection.
     */
    PracticeWorklistHelper.prototype.getRowDefinionForClosedTiled = function (responseListData) {
        var _workListCellcollection = Array();
        var _worklistRow;
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            for (var responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();
                var gridColumns = this.resolvedGridColumnsJson.marking.practiceworklist.closed.tileview.GridColumns;
                var gridColumnLength = gridColumns.length;
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.closed, localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title') + ' ');
                            break;
                        case gridColumnNames.MarksDifference:
                            key = gridSeq.get(responseListCount) + '_MarksDifference_' + gridColumnCount;
                            _workListCell.columnElement = this.getMarksDifferenceColumnElement(responseData, componentPropsJson, key, true);
                            break;
                        default:
                            break;
                    }
                    _workListCellcollection.push(_workListCell);
                }
                // setting row style and row title according to its accuracy type
                _worklistRow.setRowStyle(this.setRowStyle(Immutable.List().push(enums.ResponseStatus.none), responseData.accuracyIndicatorTypeID));
                _worklistRow.setRowTitle(this.setRowTitle(responseData.accuracyIndicatorTypeID));
                _worklistRow.setRowId(parseFloat(responseData.displayId));
                _worklistRow.setCells(_workListCellcollection);
                _workListRowCollection.push(_worklistRow);
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForpracticeOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of practice open responses
     * @returns grid row collection.
     */
    PracticeWorklistHelper.prototype.getRowDefinionForOpenTiled = function (responseListData) {
        var _workListCellcollection = Array();
        var _worklistRow;
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            for (var responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);
                var gridColumns = this.resolvedGridColumnsJson.marking.practiceworklist.open.tileview.GridColumns;
                var gridColumnLength = gridColumns.length;
                this.emptyGroupColumns();
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.MarkingProgress:
                            key = gridSeq.get(responseListCount) + '_MarkingProgress_' + gridColumnCount;
                            var element = this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.practice);
                            this.mapGroupColumns('worklist-tile-footer', element);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.open, localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title') + ' ');
                            break;
                        case gridColumnNames.AllPageAnnotedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllPageAnnotated_' + gridColumnCount;
                            // Create annotation indicator element.
                            var allPageElement = this.getAllPageAnnotationIndicatorElement(responseData, componentPropsJson, key);
                            // Checking whether the indicator is valid to display.
                            if (allPageElement !== undefined) {
                                this.mapGroupColumns('icon-holder', allPageElement);
                            }
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData, componentPropsJson, key, true, true));
                            break;
                        case gridColumnNames.AllFilesNotViewedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllFilesNotViewedIndicator_' + gridColumnCount;
                            var allFilesNotViewedElement = (this.getAllFilesNotViewedIndicatorElement(responseData, componentPropsJson, key));
                            this.mapGroupColumns('worklist-tile-footer', allFilesNotViewedElement);
                            break;
                        default:
                    }
                    _workListCellcollection.push(_workListCell);
                }
                // If there are elements queued to group, then group the elements.
                if (this.groupColumns) {
                    _workListCell = new gridCell();
                    key = gridSeq.get(responseListCount) + '_Tile_Group_';
                    _workListCell.columnElement = this.groupColumnElements('worklist-tile-footer', key);
                    _workListCellcollection.push(_workListCell);
                }
                _worklistRow.setRowStyle(this.setRowStyle(responseStatus));
                _worklistRow.setRowId(parseFloat(responseData.displayId));
                _worklistRow.setCells(_workListCellcollection);
                _workListRowCollection.push(_worklistRow);
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForpracticeOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of practice open responses
     * @returns grid row collection.
     */
    PracticeWorklistHelper.prototype.getRowDefinionForClosedDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var key;
        var _workListRowCellCollection = Array();
        var _worklistRow;
        var _workListCell;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.practiceworklist.closed.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowCellCollection = new Array();
                _worklistRow = new gridRow();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _workListCell = new gridCell();
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = this.getTotalMarkElement(responseData, responseListData.hasNumericMark, responseListData.maximumMark, componentPropsJson, key);
                            break;
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = this.getAllocatedDate(responseData, componentPropsJson, key, true);
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.closed, false));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = this.getLinkedMessageElement(responseData, componentPropsJson, key, false);
                            break;
                        case gridColumnNames.AccuracyIndicator:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_AccuracyIndicator_' + gridColumnCount;
                                _workListCell.columnElement = this.getAccuracyIndicatorElement(responseData, componentPropsJson, key, false);
                            }
                            break;
                        case gridColumnNames.AbsoluteMarksDifference:
                            key = gridSeq.get(responseListCount) + '_AbsoluteMarksDifference_' + gridColumnCount;
                            _workListCell.columnElement = (this.getMarksDifferenceElement(responseData, componentPropsJson, key, enums.MarksDifferenceType.AbsoluteMarksDifference, false));
                            break;
                        case gridColumnNames.TotalMarksDifference:
                            key = gridSeq.get(responseListCount) + '_TotalMarksDifference_' + gridColumnCount;
                            _workListCell.columnElement = (this.getMarksDifferenceElement(responseData, componentPropsJson, key, enums.MarksDifferenceType.TotalMarksDifference, false));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData, componentPropsJson, key, true, false));
                            break;
                        case gridColumnNames.AllPageAnnotedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllPageAnnotatedIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllPageAnnotatedIndicatorElement(responseData, componentPropsJson, key, true, false));
                            break;
                        default:
                            break;
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowCellCollection.push(_workListCell);
                }
                // Creating the grid row collection.
                // Added parameters to set new column 'gridRightColumn' and set marksdifference value to that column
                _workListRowCollection.push(this.getGridRow(Immutable.List().push(enums.ResponseStatus.none), responseData.displayId, _workListRowCellCollection, responseData.accuracyIndicatorTypeID));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForpracticeOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of practice open responses
     * @returns grid row collection.
     */
    PracticeWorklistHelper.prototype.getRowDefinionForOpenDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var key;
        var _workListRowCellCollection = Array();
        var _worklistRow;
        var _workListCell;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.practiceworklist.open.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowCellCollection = new Array();
                _worklistRow = new gridRow();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _workListCell = new gridCell();
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.MarkingProgress:
                            key = gridSeq.get(responseListCount) + '_MarkingProgress_' + gridColumnCount;
                            _workListCell.columnElement = this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.practice, false);
                            break;
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = this.getTotalMarkElement(responseData, responseListData.hasNumericMark, responseListData.maximumMark, componentPropsJson, key);
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.open, true));
                            break;
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = this.getAllocatedDate(responseData, componentPropsJson, key, true);
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = this.getLinkedMessageElement(responseData, componentPropsJson, key, false);
                            break;
                        case gridColumnNames.AllPageAnnotedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllPageAnnotatedIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllPageAnnotatedIndicatorElement(responseData, componentPropsJson, key, true, false));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData, componentPropsJson, key, true, false));
                            break;
                        case gridColumnNames.AllFilesNotViewedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllFilesNotViewedIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllFilesNotViewedIndicatorElement(responseData, componentPropsJson, key, false));
                            break;
                        default:
                            break;
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowCellCollection.push(_workListCell);
                }
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowCellCollection));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * returns the resposne staus based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    PracticeWorklistHelper.prototype.getResponseStatus = function (responseData, responseMode) {
        var responseStatus;
        switch (responseMode) {
            case enums.ResponseMode.open:
                responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.practiceOpen).
                    submitButtonValidate(responseData);
                break;
            case enums.ResponseMode.closed:
                responseStatus = Immutable.List().push(enums.ResponseStatus.none);
                break;
        }
        return responseStatus;
    };
    /**
     * returns the grdicolumns based on the response mode and worklist type
     * @param responseMode
     */
    PracticeWorklistHelper.prototype.getGridColumns = function (resolvedGridColumnsJson, worklistType, responseMode, isFrozen) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        switch (responseMode) {
            case enums.ResponseMode.open:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.practiceworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.practiceworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.practiceworklist.closed.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.practiceworklist.closed.frozenRows.GridColumns;
                break;
        }
        return gridColumns;
    };
    /**
     * returns the accuracy type based on accuracy  and CC values
     * @param responseMode
     * @param responseData
     */
    PracticeWorklistHelper.prototype.getAccuracyType = function (responseMode, responseData) {
        if (responseMode === enums.ResponseMode.closed) {
            return responseData.accuracyIndicatorTypeID;
        }
        else {
            return enums.AccuracyIndicatorType.Unknown;
        }
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    PracticeWorklistHelper.prototype.getCellVisibility = function (column) {
        var isHidden = false;
        switch (column) {
            case gridColumnNames.SLAOIndicator:
                if (this.isStructuredQIG() === false) {
                    isHidden = true;
                }
                break;
            case gridColumnNames.AllPageAnnotedIndicator:
                if (this.isStructuredQIG() === true) {
                    isHidden = true;
                }
                break;
        }
        return isHidden;
    };
    return PracticeWorklistHelper;
}(worklistHelperBase));
module.exports = PracticeWorklistHelper;
//# sourceMappingURL=practiceworklisthelper.js.map
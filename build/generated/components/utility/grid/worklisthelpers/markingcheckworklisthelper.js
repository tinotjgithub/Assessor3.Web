"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enums = require('../../enums');
var Immutable = require('immutable');
var gridColumnNames = require('../gridcolumnnames');
var worklistHelperBase = require('./worklisthelperbase');
var gridCell = require('../../../utility/grid/gridcell');
var qigStore = require('../../../../stores/qigselector/qigstore');
var josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
var worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');
var worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');
/**
 * class for Marking Check WorkList Helper implementation
 */
var MarkingCheckWorklistHelper = (function (_super) {
    __extends(MarkingCheckWorklistHelper, _super);
    function MarkingCheckWorklistHelper() {
        _super.apply(this, arguments);
    }
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of live open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    MarkingCheckWorklistHelper.prototype.generateRowDefinion = function (responseListData, responseType, gridType) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(worklistGridColumnsJson);
        this._immutableWorkListCollection = Immutable.List();
        switch (responseType) {
            case enums.ResponseMode.open:
                if (gridType === enums.GridType.detailed) {
                    this._immutableWorkListCollection = this.getRowDefinionForOpenDetail(responseListData);
                }
                break;
            case enums.ResponseMode.closed:
                if (gridType === enums.GridType.detailed) {
                    this._immutableWorkListCollection = this.getRowDefinionForClosedDetail(responseListData);
                }
                break;
            case enums.ResponseMode.pending:
                if (gridType === enums.GridType.detailed) {
                    this._immutableWorkListCollection = this.getRowDefinionForPendingDetail(responseListData);
                }
                break;
        }
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForLiveOpenDetail is used for generating row collection for closed WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    MarkingCheckWorklistHelper.prototype.getRowDefinionForClosedDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var key;
        var _workListRowHeaderCellcollection = Array();
        var _workListCell;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.markingcheckworklist.closed.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.closed);
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();
                    switch (_responseColumn) {
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData, responseListData.hasNumericMark, responseListData.maximumMark, componentPropsJson, key));
                            if (this.isNonNumeric() === true) {
                                _workListCell.isHidden = true;
                            }
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.closed, false));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData, componentPropsJson, key, false));
                            break;
                    }
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.closed, responseData), undefined));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForLiveOpenDetail is used for generating row collection for open WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    MarkingCheckWorklistHelper.prototype.getRowDefinionForOpenDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _workListRowHeaderCellcollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.markingcheckworklist.open.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();
                    switch (_responseColumn) {
                        case gridColumnNames.MarkingProgress:
                            key = gridSeq.get(responseListCount) + '_MarkingProgress_' + gridColumnCount;
                            _workListCell.columnElement = (this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.live, false));
                            break;
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData, responseListData.hasNumericMark, responseListData.maximumMark, componentPropsJson, key));
                            if (this.isNonNumeric() === true) {
                                _workListCell.isHidden = true;
                            }
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.open, true));
                            break;
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllocatedDate(responseData, componentPropsJson, key, true));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData, componentPropsJson, key, false));
                            break;
                    }
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }
                var additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.live);
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.open, responseData), additionalComponent));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * Generate row defenitions for pending detailed worklist in live
     * @param responseListData
     */
    MarkingCheckWorklistHelper.prototype.getRowDefinionForPendingDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var key;
        var _workListRowHeaderCellcollection = Array();
        var _workListCell;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.markingcheckworklist.pending.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.pending);
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();
                    switch (_responseColumn) {
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + 'TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData, responseListData.hasNumericMark, responseListData.maximumMark, componentPropsJson, key));
                            if (this.isNonNumeric() === true) {
                                _workListCell.isHidden = true;
                            }
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.pending, true));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + 'LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.GracePeriodTime:
                            key = gridSeq.get(responseListCount) + 'GracePeriodTime_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGracePeriodElement(responseData, componentPropsJson, key, false));
                            break;
                    }
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }
                var additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.live);
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.pending, responseData), additionalComponent));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * returns the response status based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    MarkingCheckWorklistHelper.prototype.getResponseStatus = function (responseData, responseMode) {
        var responseStatus;
        responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.liveOpen).
            submitButtonValidate(responseData);
        return responseStatus;
    };
    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    MarkingCheckWorklistHelper.prototype.getGridColumns = function (resolvedGridColumnsJson, worklistType, responseMode, isFrozen) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        switch (responseMode) {
            case enums.ResponseMode.open:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.markingcheckworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.markingcheckworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.pending:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.markingcheckworklist.pending.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.markingcheckworklist.pending.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.markingcheckworklist.closed.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.markingcheckworklist.closed.frozenRows.GridColumns;
                break;
        }
        return gridColumns;
    };
    return MarkingCheckWorklistHelper;
}(worklistHelperBase));
module.exports = MarkingCheckWorklistHelper;
//# sourceMappingURL=markingcheckworklisthelper.js.map
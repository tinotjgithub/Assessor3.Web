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
var josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var qigStore = require('../../../../stores/qigselector/qigstore');
/**
 * class for WorkList Helper implementation
 */
var SimulationWorklistHelper = (function (_super) {
    __extends(SimulationWorklistHelper, _super);
    function SimulationWorklistHelper() {
        _super.apply(this, arguments);
    }
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of simulation open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    SimulationWorklistHelper.prototype.generateRowDefinion = function (responseListData, responseType, gridType) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(worklistGridColumnsJson);
        this._immutableWorkListCollection = Immutable.List();
        switch (gridType) {
            case enums.GridType.detailed:
                this._immutableWorkListCollection = this.getRowDefinionForOpenDetail(responseListData);
                break;
            case enums.GridType.tiled:
                this._immutableWorkListCollection = this.getRowDefinionForOpenTiled(responseListData);
                break;
            default:
        }
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForSimulationOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of simulation open responses
     * @returns grid row collection.
     */
    SimulationWorklistHelper.prototype.getRowDefinionForOpenTiled = function (responseListData) {
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
                var gridColumns = this.resolvedGridColumnsJson.marking.simulationworklist.open.tileview.GridColumns;
                var gridColumnLength = gridColumns.length;
                // Get fresh set of groups for every columns
                this.emptyGroupColumns();
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.MarkingProgress:
                            key = gridSeq.get(responseListCount) + '_MarkingProgress_' + gridColumnCount;
                            var element = this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.simulation);
                            this.mapGroupColumns('worklist-tile-footer', element);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.open);
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
                        default:
                            break;
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
     * getRowDefinionForSimulationOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of simulation open responses
     * @returns grid row collection.
     */
    SimulationWorklistHelper.prototype.getRowDefinionForOpenDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _workListRowHeaderCellcollection = Array();
        var _worklistRow;
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        var isSeedResponse;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.simulationworklist.open.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId =
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
                            _workListCell.columnElement = (this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.simulation, false));
                            break;
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData, responseListData.hasNumericMark, responseListData.maximumMark, componentPropsJson, key));
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.open, true));
                            break;
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllocatedDate(responseData, componentPropsJson, key, true));
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
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }
                var additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.simulation);
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.open, responseData), additionalComponent));
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
    SimulationWorklistHelper.prototype.getResponseStatus = function (responseData, responseMode) {
        var responseStatus;
        responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.liveOpen).
            submitButtonValidate(responseData);
        return responseStatus;
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    SimulationWorklistHelper.prototype.getCellVisibility = function (column) {
        var isHidden = false;
        switch (column) {
            case gridColumnNames.SLAOIndicator:
                isHidden = !this.isStructuredQIG();
                break;
            case gridColumnNames.AllPageAnnotedIndicator:
                isHidden = this.isStructuredQIG();
                break;
            case gridColumnNames.TotalMark:
                if (this.isNonNumeric() === true) {
                    isHidden = true;
                }
                break;
        }
        return isHidden;
    };
    /**
     * returns the grdicolumns based on the response mode and worklist type
     * @param responseMode
     */
    SimulationWorklistHelper.prototype.getGridColumns = function (resolvedGridColumnsJson, worklistType, responseMode, isFrozen) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.simulationworklist.open.detailview.GridColumns
            : resolvedGridColumnsJson.marking.simulationworklist.open.frozenRows.GridColumns;
        return gridColumns;
    };
    return SimulationWorklistHelper;
}(worklistHelperBase));
module.exports = SimulationWorklistHelper;
//# sourceMappingURL=simulationworklisthelper.js.map
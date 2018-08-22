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
var configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var qualityFeedbackHelper = require('../../../../utility/qualityfeedback/qualityfeedbackhelper');
var markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
var qigStore = require('../../../../stores/qigselector/qigstore');
var tagStore = require('../../../../stores/tags/tagstore');
var examinerStore = require('../../../../stores/markerinformation/examinerstore');
var localeStore = require('../../../../stores/locale/localestore');
/**
 * class for WorkList Helper implementation
 */
var LiveWorklistHelper = (function (_super) {
    __extends(LiveWorklistHelper, _super);
    function LiveWorklistHelper() {
        _super.apply(this, arguments);
        /* variable to holds the response type for showing the response type label*/
        this._responseType = enums.ResponseType.None;
    }
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of live open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    LiveWorklistHelper.prototype.generateRowDefinion = function (responseListData, responseType, gridType) {
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
            case enums.ResponseMode.pending:
                switch (gridType) {
                    case enums.GridType.detailed:
                        this._immutableWorkListCollection = this.getRowDefinionForPendingDetail(responseListData);
                        break;
                    case enums.GridType.tiled:
                        this._immutableWorkListCollection = this.getRowDefinionForPendingTiled(responseListData);
                        break;
                }
        }
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForLiveOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    LiveWorklistHelper.prototype.getRowDefinionForClosedTiled = function (responseListData) {
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
            var isSeedHighlighted = false;
            for (var responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.closed.tileview.GridColumns;
                var gridColumnLength = gridColumns.length;
                var isSeedResponse = responseData.seedTypeId !== enums.SeedType.None ? true : false;
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.closed);
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.closed, undefined, true, isSeedResponse, true, this._responseType);
                            break;
                        case gridColumnNames.MarksDifference:
                            if (isSeedResponse === true) {
                                key = gridSeq.get(responseListCount) + '_MarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = this.getMarksDifferenceColumnElement(responseData, componentPropsJson, key, true);
                            }
                            break;
                        default:
                            break;
                    }
                    _workListCellcollection.push(_workListCell);
                }
                var _rowStyle = this.setRowStyle(Immutable.List().push(enums.ResponseStatus.none), isSeedResponse === true ? responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);
                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }
                if (isSeedResponse && this.showSeedLabel) {
                    _rowStyle += ' seed';
                }
                if (!isSeedHighlighted
                    && qualityFeedbackHelper.isSeedNeededToBeHighlighted(responseData.qualityFeedbackStatusId, isSeedResponse)) {
                    _rowStyle += ' highlight-seed';
                    isSeedHighlighted = true;
                }
                _worklistRow.setRowStyle(_rowStyle);
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
     * getRowDefinionForLiveOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    LiveWorklistHelper.prototype.getRowDefinionForOpenTiled = function (responseListData) {
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
                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);
                var gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.open.tileview.GridColumns;
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
                            var element = this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.live);
                            this.mapGroupColumns('worklist-tile-footer', element);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.open);
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.open);
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;
                            // show only if there are blocking exceptions or zoning exceptions
                            if (responseData[componentPropsJson.hasBlockingExceptions]
                                || responseData[componentPropsJson.hasZoningExceptions]) {
                                var element_1 = this.getLinkedExceptionElement(responseData, componentPropsJson, key);
                                this.mapGroupColumns('icon-holder', element_1);
                            }
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
                var _rowStyle = this.setRowStyle(responseStatus);
                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }
                _worklistRow.setRowStyle(_rowStyle);
                _worklistRow.setRowId(parseFloat(responseData.displayId));
                _worklistRow.setCells(_workListCellcollection);
                _workListRowCollection.push(_worklistRow);
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForLiveOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    LiveWorklistHelper.prototype.getRowDefinionForClosedDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _responseColumn;
        var _worklistRow;
        var componentPropsJson;
        var key;
        // Grid columns
        var gridLeftColumn = Array();
        var gridMiddleColumn = Array();
        var _workListRowHeaderCellcollection = Array();
        var _workListCell;
        var cssClass;
        var isResponseTypeLabelVisible;
        var isSeedResponse;
        var isSeedHighlighted = false;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.closed.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.closed);
                gridLeftColumn = new Array();
                gridMiddleColumn = new Array();
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();
                    switch (_responseColumn) {
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData, responseListData.hasNumericMark, responseListData.maximumMark, componentPropsJson, key));
                            break;
                        case gridColumnNames.SpecialistType:
                            key = gridSeq.get(responseListCount) + '_SpecialistType_' + gridColumnCount;
                            _workListCell.columnElement =
                                (this.getGenericTextElement(responseData.specialistType ===
                                    localeStore.instance.TranslateText('marking.worklist.response-data.specialisttype-' + responseData.specialistType) ?
                                    localeStore.instance.TranslateText('marking.worklist.response-data.specialisttype-' + responseData.specialistType)
                                    : responseData.specialistType, key));
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.closed, false));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedExceptionElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData, componentPropsJson, key, true, false));
                            break;
                        case gridColumnNames.ResponseTypeLabel:
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.closed);
                            isResponseTypeLabelVisible = this._responseType !== enums.ResponseType.None;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isResponseTypeLabelVisible, this._responseType));
                            if (!isSeedHighlighted && qualityFeedbackHelper.isSeedNeededToBeHighlighted(responseData.qualityFeedbackStatusId, isResponseTypeLabelVisible)) {
                                cssClass = 'highlight-seed';
                                isSeedHighlighted = true;
                            }
                            else {
                                cssClass = '';
                            }
                            break;
                        case gridColumnNames.AccuracyIndicator:
                            // accuracy indicator is shown only when its values is set
                            isSeedResponse = markerOperationModeFactory.operationMode.isSeedResponse(responseData);
                            if (isSeedResponse) {
                                key = gridSeq.get(responseListCount) + '_AccuracyIndicator_' + gridColumnCount;
                                _workListCell.columnElement = (this.getAccuracyIndicatorElement(responseData, componentPropsJson, key, false));
                            }
                            break;
                        case gridColumnNames.AbsoluteMarksDifference:
                            isSeedResponse = markerOperationModeFactory.operationMode.isSeedResponse(responseData);
                            if (isSeedResponse) {
                                key = gridSeq.get(responseListCount) + '_AbsoluteMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData, componentPropsJson, key, enums.MarksDifferenceType.AbsoluteMarksDifference, false));
                            }
                            break;
                        case gridColumnNames.TotalMarksDifference:
                            isSeedResponse = markerOperationModeFactory.operationMode.isSeedResponse(responseData);
                            if (isSeedResponse) {
                                key = gridSeq.get(responseListCount) + '_TotalMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData, componentPropsJson, key, enums.MarksDifferenceType.TotalMarksDifference, false));
                            }
                            break;
                        case gridColumnNames.SampleLabel:
                            key = gridSeq.get(responseListCount) + '_SampleLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSampleLabel(key, responseData.sampleCommentId));
                            break;
                        case gridColumnNames.ReviewedByLabel:
                            key = gridSeq.get(responseListCount) + '_ReviewedByLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getReviewedByLabel(key, responseData));
                            break;
                        case gridColumnNames.CentreNum:
                            if (!markerOperationModeFactory.operationMode.shouldDisplayCenterNumber &&
                                !markerOperationModeFactory.operationMode.isSeedResponse(responseData)) {
                                key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber, key));
                            }
                            break;
                        case gridColumnNames.TagIndicator:
                            key = gridSeq.get(responseListCount) + '_TagIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTag(key, responseData.tagId, tagStore.instance.tags, responseData.markGroupId));
                            break;
                        case gridColumnNames.SupervisorReviewComment:
                            key = gridSeq.get(responseListCount) + '_SupervisorReviewComment_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSupervisorReviewComment(key, responseData));
                            break;
                        default:
                            break;
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.closed, responseData), undefined, cssClass));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * Get the response label type for worklist
     * @param responseData
     * @param responseMode
     */
    LiveWorklistHelper.prototype.getResponseLabelType = function (responseData, responseMode) {
        var isPEOrAPE = markerOperationModeFactory.operationMode.isSelectedExaminerPEOrAPE;
        var isSTM = markerOperationModeFactory.operationMode.isLoggedInExaminerSTM;
        var showSeedResponsLabel = responseData.seedTypeId !== enums.SeedType.None;
        var showPromotedSeedResponseLabel = responseData.isCurrentMarkGroupPromotedAsSeed && isSTM;
        var showDefinitiveResponseLabel;
        if ((responseData).isWholeResponse) {
            return enums.ResponseType.WholeResponse;
        }
        if (responseData.isPromotedSeed) {
            showDefinitiveResponseLabel = responseData.isCurrentMarkGroupPromotedAsSeed && isPEOrAPE;
        }
        else {
            showDefinitiveResponseLabel = responseData.hasDefinitiveMarks && isPEOrAPE;
        }
        if (responseMode === enums.ResponseMode.open) {
            return showSeedResponsLabel ? enums.ResponseType.Seed : enums.ResponseType.None;
        }
        else {
            return showSeedResponsLabel ? enums.ResponseType.Seed
                : showDefinitiveResponseLabel ? enums.ResponseType.Definitive
                    : showPromotedSeedResponseLabel ? enums.ResponseType.PromotedSeed : enums.ResponseType.None;
        }
    };
    /**
     * getRowDefinionForLiveOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    LiveWorklistHelper.prototype.getRowDefinionForOpenDetail = function (responseListData) {
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
                var gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.open.detailview.GridColumns;
                //this.resolvedGridColumnsJson.marking.liveworklist.open.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();
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
                        case gridColumnNames.SpecialistType:
                            key = gridSeq.get(responseListCount) + '_SpecialistType_' + gridColumnCount;
                            _workListCell.columnElement =
                                (this.getGenericTextElement(responseData.specialistType ===
                                    localeStore.instance.TranslateText('marking.worklist.response-data.specialisttype-' + responseData.specialistType) ?
                                    localeStore.instance.TranslateText('marking.worklist.response-data.specialisttype-' + responseData.specialistType)
                                    : responseData.specialistType, key));
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
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedExceptionElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.ResponseTypeLabel:
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.open);
                            isSeedResponse = this._responseType !== enums.ResponseType.None;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isSeedResponse, this._responseType));
                            break;
                        case gridColumnNames.SampleLabel:
                            key = gridSeq.get(responseListCount) + '_SampleLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSampleLabel(key, responseData.sampleCommentId));
                            break;
                        case gridColumnNames.TagIndicator:
                            key = gridSeq.get(responseListCount) + '_TagIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTag(key, responseData.tagId, tagStore.instance.tags, responseData.markGroupId));
                            break;
                        case gridColumnNames.AllFilesNotViewedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllFilesNotViewedIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllFilesNotViewedIndicatorElement(responseData, componentPropsJson, key, false));
                            break;
                        default:
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
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
    LiveWorklistHelper.prototype.getRowDefinionForPendingDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _responseColumn;
        var _worklistRow;
        var componentPropsJson;
        var key;
        var isResponseTypeLabelVisible;
        // Grid columns
        var gridLeftColumn = Array();
        var gridMiddleColumn = Array();
        var _workListRowHeaderCellcollection = Array();
        var _workListCell;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.pending.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();
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
                            break;
                        case gridColumnNames.SpecialistType:
                            key = gridSeq.get(responseListCount) + '_SpecialistType_' + gridColumnCount;
                            _workListCell.columnElement =
                                (this.getGenericTextElement(responseData.specialistType ===
                                    localeStore.instance.TranslateText('marking.worklist.response-data.specialisttype-' + responseData.specialistType) ?
                                    localeStore.instance.TranslateText('marking.worklist.response-data.specialisttype-' + responseData.specialistType)
                                    : responseData.specialistType, key));
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData, componentPropsJson, key, enums.ResponseMode.pending, true));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + 'LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + 'LinkedException_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedExceptionElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.GracePeriodTime:
                            key = gridSeq.get(responseListCount) + 'GracePeriodTime_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGracePeriodElement(responseData, componentPropsJson, key, false));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData, componentPropsJson, key, true, false));
                            break;
                        case gridColumnNames.ResponseTypeLabel:
                            // for pending tab there is only whole respones label is used
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.pending);
                            isResponseTypeLabelVisible = this._responseType === enums.ResponseType.WholeResponse;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isResponseTypeLabelVisible, this._responseType));
                            break;
                        case gridColumnNames.SampleLabel:
                            key = gridSeq.get(responseListCount) + '_SampleLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSampleLabel(key, responseData.sampleCommentId));
                            break;
                        case gridColumnNames.TagIndicator:
                            key = gridSeq.get(responseListCount) + '_TagIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTag(key, responseData.tagId, tagStore.instance.tags, responseData.markGroupId));
                            break;
                        default:
                            break;
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
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
     * Generate row defenitions for pending tiled worklist in live
     * @param responseListData
     */
    LiveWorklistHelper.prototype.getRowDefinionForPendingTiled = function (responseListData) {
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
                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                var gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.pending.tileview.GridColumns;
                var gridColumnLength = gridColumns.length;
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.pending);
                            key = gridSeq.get(responseListCount) + 'ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.pending);
                            break;
                        case gridColumnNames.GracePeriodTime:
                            key = gridSeq.get(responseListCount) + 'GracePeriodTime_' + gridColumnCount;
                            _workListCell.columnElement = this.getAllocatedDateElement(responseData, componentPropsJson, key, false, false, true);
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
                var _rowStyle = this.setRowStyle(Immutable.List().push(enums.ResponseStatus.none), undefined);
                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }
                _worklistRow.setRowStyle(_rowStyle);
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
     * returns the resposne staus based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    LiveWorklistHelper.prototype.getResponseStatus = function (responseData, responseMode) {
        var responseStatus;
        responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.liveOpen).
            submitButtonValidate(responseData);
        return responseStatus;
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    LiveWorklistHelper.prototype.getCellVisibility = function (column) {
        var isHidden = false;
        var specialistResponseCC = (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.SpecialistResponseMarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId).toLowerCase() === 'true');
        switch (column) {
            case gridColumnNames.AbsoluteMarksDifference:
            case gridColumnNames.TotalMarksDifference:
            case gridColumnNames.AccuracyIndicator:
                isHidden = markerOperationModeFactory.operationMode.isQualityFeedbackWorklistColumnsHidden;
                break;
            case gridColumnNames.SLAOIndicator:
                isHidden = markerOperationModeFactory.operationMode.isSLAOIndicatorHidden(this.isStructuredQIG());
                break;
            case gridColumnNames.AllPageAnnotedIndicator:
                isHidden = markerOperationModeFactory.operationMode.isAllPageAnnotedIndicatorHidden(this.isStructuredQIG());
                break;
            case gridColumnNames.LinkedExceptionIndicator:
                isHidden = markerOperationModeFactory.operationMode.isLinkedExceptionIndicatorHidden;
                break;
            case gridColumnNames.TotalMark:
                if (this.isNonNumeric() === true) {
                    isHidden = true;
                }
                break;
            case gridColumnNames.ResponseTypeLabel:
                isHidden = (this._responseType === enums.ResponseType.Seed) ?
                    markerOperationModeFactory.operationMode.isSeedLabelHidden : false;
                break;
            case gridColumnNames.SampleLabel:
                isHidden = markerOperationModeFactory.operationMode.isSampleLabelHidden(enums.WorklistType.live);
                break;
            case gridColumnNames.ReviewedByLabel:
                isHidden = markerOperationModeFactory.operationMode.isReviewedByLabelHidden;
                break;
            case gridColumnNames.CentreNum:
                isHidden = markerOperationModeFactory.operationMode.isHelpExaminersView ?
                    true : markerOperationModeFactory.operationMode.shouldDisplayCenterNumber;
                break;
            case gridColumnNames.SpecialistType:
                isHidden = !((examinerStore.instance.getMarkerInformation.isSpecialist
                    || (qigStore.instance.selectedQIGForMarkerOperation &&
                        qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer))
                    && specialistResponseCC);
                break;
            case gridColumnNames.SupervisorReviewComment:
                isHidden = markerOperationModeFactory.operationMode.isSupervisorReviewCommentColumnHidden;
                break;
        }
        return isHidden;
    };
    /**
     * returns the grdicolumns based on the response mode and worklist type
     * @param responseMode
     */
    LiveWorklistHelper.prototype.getGridColumns = function (resolvedGridColumnsJson, worklistType, responseMode, isFrozen) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        switch (responseMode) {
            case enums.ResponseMode.open:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.liveworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.pending:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.liveworklist.pending.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.pending.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.liveworklist.closed.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.closed.frozenRows.GridColumns;
                break;
        }
        return gridColumns;
    };
    /**
     * returns the accuracy type based on accuracy  and CC values
     * @param responseMode
     * @param responseData
     */
    LiveWorklistHelper.prototype.getAccuracyType = function (responseMode, responseData) {
        var accuracyType;
        switch (responseMode) {
            case enums.ResponseMode.open:
            case enums.ResponseMode.pending:
                accuracyType = enums.AccuracyIndicatorType.Unknown;
                break;
            case enums.ResponseMode.closed:
                var qualityFeedbackCC = (configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');
                var isSeedResponse = (responseData.seedTypeId !== enums.SeedType.None) &&
                    (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown);
                accuracyType = ((isSeedResponse === true && (qualityFeedbackCC === true ||
                    markerOperationModeFactory.operationMode.isTeamManagementMode)) ?
                    responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);
                break;
        }
        return accuracyType;
    };
    return LiveWorklistHelper;
}(worklistHelperBase));
module.exports = LiveWorklistHelper;
//# sourceMappingURL=liveworklisthelper.js.map
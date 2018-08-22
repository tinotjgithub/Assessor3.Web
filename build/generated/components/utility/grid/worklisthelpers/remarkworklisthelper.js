"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var gridRow = require('../../../utility/grid/gridrow');
var Immutable = require('immutable');
var gridCell = require('../../../utility/grid/gridcell');
var worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');
var worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');
var worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
var enums = require('../../enums');
var gridColumnNames = require('../gridcolumnnames');
var worklistHelperBase = require('./worklisthelperbase');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var xmlHelper = require('../../../../utility/generic/xmlhelper');
var worklistStore = require('../../../../stores/worklist/workliststore');
var qigStore = require('../../../../stores/qigselector/qigstore');
var localeStore = require('../../../../stores/locale/localestore');
var MarkChangeReason = require('../../../markschemestructure/markchangereason');
var SupervisorRemarkDecisionIcon = require('../../../markschemestructure/supervisorremarkdecisionicon');
var qualityFeedbackHelper = require('../../../../utility/qualityfeedback/qualityfeedbackhelper');
var markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
var tagStore = require('../../../../stores/tags/tagstore');
var examinerStore = require('../../../../stores/markerinformation/examinerstore');
/**
 * class for WorkList Helper implementation
 */
var RemarkWorklistHelper = (function (_super) {
    __extends(RemarkWorklistHelper, _super);
    function RemarkWorklistHelper() {
        _super.apply(this, arguments);
        /* variable to holds the response type for showing the response type label*/
        this._responseType = enums.ResponseType.None;
    }
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of directed remark open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    RemarkWorklistHelper.prototype.generateRowDefinion = function (responseListData, responseType, gridType) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);
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
                break;
        }
        return this._immutableWorkListCollection;
    };
    /**
     * getRowDefinionForDirectedRemarkOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of directed remark open responses
     * @returns grid row collection.
     */
    RemarkWorklistHelper.prototype.getRowDefinionForOpenTiled = function (responseListData) {
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
                var gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.open.tileview.GridColumns;
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
                            var element = this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.directedRemark);
                            this.mapGroupColumns('worklist-tile-footer', element);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.open, undefined, false, false, true);
                            break;
                        case gridColumnNames.MarkChangeReason:
                            if (responseData[componentPropsJson.markingProgress] === 100 &&
                                responseData.markChangeReasonVisible
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Accurate
                                && !responseData.markChangeReason) {
                                key = gridSeq.get(responseListCount) + '_MarkChangeReason_' + gridColumnCount;
                                var element_1 = this.getMarkChangeReasonColumnElement(responseData, componentPropsJson, key, enums.ResponseMode.open);
                                this.mapGroupColumns('icon-holder', element_1);
                            }
                            break;
                        case gridColumnNames.SupervisorRemarkDecision:
                            if (this.isSupervisorRemarkDecisionVisible() &&
                                (responseData.supervisorRemarkMarkChangeReasonID === 0) &&
                                responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_RemarkdecisonButton_' + gridColumnCount;
                                var element_2 = this.getSupervisorDecisionColumnElement(responseData, key, true);
                                this.mapGroupColumns('icon-holder', element_2);
                            }
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;
                            // show only if there are blocking exceptions
                            if (responseData[componentPropsJson.hasBlockingExceptions]) {
                                var element_3 = this.getLinkedExceptionElement(responseData, componentPropsJson, key);
                                this.mapGroupColumns('icon-holder', element_3);
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
     * Gets the response label type for remark worklist
     * @param responseData
     */
    RemarkWorklistHelper.prototype.getResponseLabelType = function (responseData) {
        var isSeedResponse = ((responseData).seedTypeId !== enums.SeedType.None)
            && (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown);
        return isSeedResponse ? enums.ResponseType.Seed : enums.ResponseType.None;
    };
    /**
     * getRowDefinionForClosedTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of directed open responses
     * @returns grid row collection.
     */
    RemarkWorklistHelper.prototype.getRowDefinionForClosedTiled = function (responseListData) {
        var _workListCellcollection = Array();
        var _worklistRow;
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        var isSeedHighlighted = false;
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
                var gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.closed.tileview.GridColumns;
                var gridColumnLength = gridColumns.length;
                // Get fresh set of groups for every columns
                this.emptyGroupColumns();
                var isSeedResponse = responseData.seedTypeId !==
                    enums.SeedType.None ? true : false;
                var isEurSeedResponse = responseData.seedTypeId ===
                    enums.SeedType.EUR;
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData);
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData, componentPropsJson, key, responseListData.hasNumericMark, enums.ResponseMode.closed, undefined, false, isEurSeedResponse, true, this._responseType);
                            break;
                        case gridColumnNames.MarksDifference:
                            if (isEurSeedResponse === true && markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn) {
                                key = gridSeq.get(responseListCount) + '_MarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = this.getMarksDifferenceColumnElement(responseData, componentPropsJson, key, true);
                            }
                            break;
                        default:
                            break;
                    }
                    _workListCellcollection.push(_workListCell);
                }
                var _rowStyle = this.setRowStyle(Immutable.List().push(enums.ResponseStatus.none), isEurSeedResponse === true ? responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);
                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }
                if (isSeedResponse && this.showSeedLabel) {
                    _rowStyle += ' seed';
                }
                if (!isSeedHighlighted
                    && qualityFeedbackHelper.isSeedNeededToBeHighlighted(responseData.
                        qualityFeedbackStatusId, isEurSeedResponse)) {
                    _rowStyle += ' highlight-seed';
                    isSeedHighlighted = true;
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
     * Get directed remark pending worklist details.
     * @param {WorklistBase} responseListData
     * @returns
     */
    RemarkWorklistHelper.prototype.getRowDefinionForPendingTiled = function (responseListData) {
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
                var gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.pending.tileview.GridColumns;
                var gridColumnLength = gridColumns.length;
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
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
                _worklistRow.setRowStyle(this.setRowStyle(Immutable.List().push(enums.ResponseStatus.none), undefined));
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
     * getRowDefinionForLiveOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    RemarkWorklistHelper.prototype.getRowDefinionForOpenDetail = function (responseListData) {
        var _workListRowCollection = Array();
        var _workListRowHeaderCellcollection = Array();
        var _worklistRow;
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        var isSeedResponseVisible;
        if (responseListData != null) {
            this.setShowOriginalMarkerName(responseListData);
            this.setNonNumeric(!responseListData.hasNumericMark);
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.open.detailview.GridColumns;
                //this.resolvedGridColumnsJson.marking.directedremarkworklist.open.detailview.GridColumns;
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
                            _workListCell.columnElement = (this.getMarkingProgressElement(responseData, componentPropsJson, key, responseStatus, enums.WorklistType.directedRemark, false));
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
                        case gridColumnNames.OriginalMarkerName:
                            key = gridSeq.get(responseListCount) + '_OriginalMarker_' + gridColumnCount;
                            var originalMarkerName = this.getFormattedName(responseData.originalMarkerInitials, responseData.originalMarkerSurname);
                            _workListCell.columnElement = (this.getGenericTextElement(originalMarkerName, key));
                            break;
                        case gridColumnNames.CentreNum:
                            if (this.getRemarkSeedingCCValue() === false) {
                                key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber, key));
                            }
                            break;
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber, key));
                            break;
                        case gridColumnNames.MarkChangeReason:
                            if (responseData[componentPropsJson.markingProgress] === 100 &&
                                responseData.markChangeReasonVisible
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Accurate
                                && !responseData.markChangeReason) {
                                key = gridSeq.get(responseListCount) + '_MarkChangeReason_' + gridColumnCount;
                                _workListCell.columnElement = this.getMarkChangeReasonColumnElement(responseData, componentPropsJson, key, enums.ResponseMode.open);
                            }
                            break;
                        case gridColumnNames.SupervisorRemarkDecision:
                            if (this.isSupervisorRemarkDecisionVisible() &&
                                (responseData.supervisorRemarkMarkChangeReasonID === 0) &&
                                responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_RemarkdecisonButton_' + gridColumnCount;
                                _workListCell.columnElement = this.getSupervisorDecisionColumnElement(responseData, key);
                            }
                            break;
                        case gridColumnNames.ResponseTypeLabel:
                            isSeedResponseVisible = responseData.seedTypeId !== enums.SeedType.None;
                            var responseType = isSeedResponseVisible ? enums.ResponseType.Seed : enums.ResponseType.None;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isSeedResponseVisible, responseType));
                            break;
                        case gridColumnNames.OriginalMark:
                            if (responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_OriginalMark_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkElement(key, responseData, componentPropsJson, (responseData.markingProgress === 100)));
                            }
                            break;
                        case gridColumnNames.OriginalMarkAccuracy:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown
                                && responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_OriginalMarkAccuracy_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkAccuracyElement(key, responseData, componentPropsJson, (responseData.markingProgress === 100)));
                            }
                            break;
                        case gridColumnNames.Finalmarkselected:
                            var decisionType = this.getSupervisorRemarkDecisionType(responseData);
                            if (this.isSupervisorRemarkDecisionVisible() && decisionType !== null) {
                                key = gridSeq.get(responseListCount) + '_Finalmarkselected_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(decisionType, key));
                            }
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
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.open, responseData), undefined));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * get supervisor remark decision type
     * @param response
     */
    RemarkWorklistHelper.prototype.getSupervisorRemarkDecisionType = function (response) {
        var supervisorRemarkFinalMarkSetID = response.supervisorRemarkFinalMarkSetID;
        if (supervisorRemarkFinalMarkSetID === 2) {
            return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.original-marks-chosen');
        }
        else if (supervisorRemarkFinalMarkSetID === 1) {
            return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.remark-chosen');
        }
        else {
            return '';
        }
    };
    /**
     * Generate row defenitions for pending detailed worklist in live
     * @param responseListData
     */
    RemarkWorklistHelper.prototype.getRowDefinionForPendingDetail = function (responseListData) {
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
        if (responseListData != null) {
            this.setShowOriginalMarkerName(responseListData);
            this.setNonNumeric(!responseListData.hasNumericMark);
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.pending.detailview.GridColumns;
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
                        case gridColumnNames.OriginalMarkerName:
                            key = gridSeq.get(responseListCount) + '_OriginalMarker_' + gridColumnCount;
                            var originalMarkerName = this.getFormattedName(responseData.originalMarkerInitials, responseData.originalMarkerSurname);
                            _workListCell.columnElement = (this.getGenericTextElement(originalMarkerName, key));
                            break;
                        case gridColumnNames.CentreNum:
                            key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber, key));
                            break;
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber, key));
                            break;
                        case gridColumnNames.OriginalMark:
                            key = gridSeq.get(responseListCount) + '_OriginalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getOriginalMarkElement(key, responseData, componentPropsJson, true));
                            break;
                        case gridColumnNames.OriginalMarkAccuracy:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_OriginalMarkAccuracy_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkAccuracyElement(key, responseData, componentPropsJson, true));
                            }
                            break;
                        case gridColumnNames.Finalmarkselected:
                            var decisionType = this.getSupervisorRemarkDecisionType(responseData);
                            if (this.isSupervisorRemarkDecisionVisible()) {
                                key = gridSeq.get(responseListCount) + '_Finalmarkselected_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(decisionType, key));
                            }
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
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.pending, responseData), undefined));
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
    RemarkWorklistHelper.prototype.getRowDefinionForClosedDetail = function (responseListData) {
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
        var isSeedResponse;
        var isSeedHighlighted = false;
        var cssClass;
        if (responseListData != null) {
            this.setShowOriginalMarkerName(responseListData);
            this.setNonNumeric(!responseListData.hasNumericMark);
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            var responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.closed.detailview.GridColumns;
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
                var isEurSeedResponse = responseData.seedTypeId ===
                    enums.SeedType.EUR;
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
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllocatedDateElement(responseData, componentPropsJson, key, false, false, false));
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
                        case gridColumnNames.OriginalMarkerName:
                            key = gridSeq.get(responseListCount) + '_OriginalMarker_' + gridColumnCount;
                            var originalMarkerName = this.getFormattedName(responseData.originalMarkerInitials, responseData.originalMarkerSurname);
                            _workListCell.columnElement = (this.getGenericTextElement(originalMarkerName, key));
                            break;
                        case gridColumnNames.CentreNum:
                            key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber, key));
                            break;
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber, key));
                            break;
                        case gridColumnNames.AccuracyIndicator:
                            // accuracy indicator is shown only when its values is set
                            if (isEurSeedResponse === true
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_AccuracyIndicator_' + gridColumnCount;
                                _workListCell.columnElement = (this.getAccuracyIndicatorElement(responseData, componentPropsJson, key, false));
                            }
                            break;
                        case gridColumnNames.AbsoluteMarksDifference:
                            if (isEurSeedResponse === true) {
                                key = gridSeq.get(responseListCount) + '_AbsoluteMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData, componentPropsJson, key, enums.MarksDifferenceType.AbsoluteMarksDifference, false));
                            }
                            break;
                        case gridColumnNames.TotalMarksDifference:
                            if (isEurSeedResponse === true) {
                                key = gridSeq.get(responseListCount) + '_TotalMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData, componentPropsJson, key, enums.MarksDifferenceType.TotalMarksDifference, false));
                            }
                            break;
                        case gridColumnNames.ResponseTypeLabel:
                            var responseType = this.getResponseLabelType(responseData);
                            var isResponseTypeLabelVisible = responseType !== enums.ResponseType.None;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isResponseTypeLabelVisible, responseType));
                            if (!isSeedHighlighted && qualityFeedbackHelper.isSeedNeededToBeHighlighted(responseData.qualityFeedbackStatusId, isResponseTypeLabelVisible)) {
                                cssClass = 'highlight-seed';
                                isSeedHighlighted = true;
                            }
                            else {
                                cssClass = '';
                            }
                            break;
                        case gridColumnNames.OriginalMark:
                            key = gridSeq.get(responseListCount) + '_OriginalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getOriginalMarkElement(key, responseData, componentPropsJson, true));
                            break;
                        case gridColumnNames.OriginalMarkAccuracy:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_OriginalMarkAccuracy_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkAccuracyElement(key, responseData, componentPropsJson, true));
                            }
                            break;
                        case gridColumnNames.Finalmarkselected:
                            var decisionType = this.getSupervisorRemarkDecisionType(responseData);
                            if (this.isSupervisorRemarkDecisionVisible() && decisionType !== null) {
                                key = gridSeq.get(responseListCount) + '_Finalmarkselected_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(decisionType, key));
                            }
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
                var additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.directedRemark);
                // Creating the grid row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(enums.ResponseMode.closed, responseData), additionalComponent, cssClass));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    };
    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    RemarkWorklistHelper.prototype.getFormattedName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    RemarkWorklistHelper.prototype.getCellVisibility = function (column) {
        var isHidden = false;
        var specialistResponseCC = (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.SpecialistResponseMarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId).toLowerCase() === 'true');
        switch (column) {
            case gridColumnNames.AbsoluteMarksDifference:
            case gridColumnNames.TotalMarksDifference:
            case gridColumnNames.AccuracyIndicator:
                isHidden = !((configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true')
                    && (this.getRemarkSeedingCCValue() === true));
                break;
            case gridColumnNames.OriginalMarkerName:
                isHidden = (this.getRemarkSeedingCCValue() === true) || (this.showOriginalMarkerName === false);
                break;
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
            case gridColumnNames.TotalMark:
                if (this.isNonNumeric() === true) {
                    isHidden = true;
                }
                break;
            case gridColumnNames.ResponseTypeLabel:
                isHidden = markerOperationModeFactory.operationMode.isSeedLabelHidden;
                break;
            case gridColumnNames.SupervisorRemarkDecision:
            case gridColumnNames.Finalmarkselected:
                isHidden = !this.isSupervisorRemarkColumnsVisible;
                break;
            case gridColumnNames.OriginalMark:
            case gridColumnNames.OriginalMarkAccuracy:
                isHidden = !this.isSupervisorRemarkColumnsVisible || this.isNonNumeric();
                break;
            case gridColumnNames.CentreNum:
                isHidden = (worklistStore.instance.getResponseMode === enums.ResponseMode.open) &&
                    (this.getRemarkSeedingCCValue() === true) ? true : false;
                break;
            case gridColumnNames.SpecialistType:
                isHidden = !((examinerStore.instance.getMarkerInformation.isSpecialist
                    || (qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                        qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer))
                    && specialistResponseCC);
                break;
        }
        return isHidden;
    };
    Object.defineProperty(RemarkWorklistHelper.prototype, "isSupervisorRemarkColumnsVisible", {
        /**
         * return whether we need to show/hide the supervisor remark worklist columns
         */
        get: function () {
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            var isSupervisorRemarkDecisionCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
            return (isSupervisorRemarkDecisionCCOn
                && worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns the grdicolumns based on the response mode and worklist type
     * @param responseMode
     */
    RemarkWorklistHelper.prototype.getGridColumns = function (resolvedGridColumnsJson, worklistType, responseMode, isFrozen) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        switch (responseMode) {
            case enums.ResponseMode.open:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.directedremarkworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.pending:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.directedremarkworklist.pending.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.pending.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.directedremarkworklist.closed.detailview.GridColumns
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
    RemarkWorklistHelper.prototype.getAccuracyType = function (responseMode, responseData) {
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
                accuracyType = ((isSeedResponse === true && qualityFeedbackCC === true && this.getRemarkSeedingCCValue() === true) ?
                    responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);
                break;
        }
        return accuracyType;
    };
    /**
     * returns the resposne staus based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    RemarkWorklistHelper.prototype.getResponseStatus = function (responseData, responseMode) {
        var responseStatus;
        switch (responseMode) {
            case enums.ResponseMode.open:
                responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.directedRemarkOpen).
                    submitButtonValidate(responseData);
                break;
            case enums.ResponseMode.closed:
            case enums.ResponseMode.pending:
                responseStatus = Immutable.List().push(enums.ResponseStatus.none);
                break;
        }
        return responseStatus;
    };
    /**
     * set the variable of showOriginalMarkerName based on the value in worklist data.
     * @param responseListData
     */
    RemarkWorklistHelper.prototype.setShowOriginalMarkerName = function (responseListData) {
        var _responseListData = responseListData.responses.toArray();
        for (var _responseCount = 0; _responseCount < _responseListData.length; _responseCount++) {
            if (_responseListData[_responseCount].showOriginalMarkerName === true) {
                this.showOriginalMarkerName = true;
                return;
            }
        }
        this.showOriginalMarkerName = false;
    };
    /**
     * get the value of remark seeding cc based on the remark type.
     */
    RemarkWorklistHelper.prototype.getRemarkSeedingCCValue = function () {
        var ccValue = configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.RemarkSeeding, qigStore.instance.selectedQIGForMarkerOperation.examSessionId);
        if (ccValue && ccValue !== '') {
            var xmlHelperObj = new xmlHelper(ccValue);
            var remarkType = xmlHelperObj.getNodeValueByName('RemarkType');
            remarkType = (remarkType) ? remarkType.replace(/ /g, '') : '';
            return (enums.RemarkRequestType[worklistStore.instance.getRemarkRequestType] === remarkType);
        }
        else {
            return false;
        }
    };
    /**
     * creating react element for the  MarkChangeReason component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     * @param responseMode - response mode
     * @returns JSX.Element.
     */
    RemarkWorklistHelper.prototype.getMarkChangeReasonColumnElement = function (responseData, propsNames, seq, responseMode) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            isInResponse: false,
            markChangeReason: responseData.markChangeReason
        };
        var markChangeReason = Immutable.List([React.createElement(MarkChangeReason, componentProps)]);
        return this.getWrappedColumn(markChangeReason, 'col wl-eur-reason-holder', seq + 'wrapped').columnElement;
    };
    /**
     * get supervisor remark decision visibility
     * @param response
     */
    RemarkWorklistHelper.prototype.isSupervisorRemarkDecisionVisible = function () {
        var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        var isSupervisorRemarkDecisionCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        return (isSupervisorRemarkDecisionCCOn
            && worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark);
    };
    /**
     * creating react element for the  Supervisordecision component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     */
    RemarkWorklistHelper.prototype.getSupervisorDecisionColumnElement = function (responseData, seq, isTileView) {
        if (isTileView === void 0) { isTileView = false; }
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            isTileView: isTileView,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(SupervisorRemarkDecisionIcon, componentProps);
    };
    return RemarkWorklistHelper;
}(worklistHelperBase));
module.exports = RemarkWorklistHelper;
//# sourceMappingURL=remarkworklisthelper.js.map
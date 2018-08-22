"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var gridRow = require('../../../utility/grid/gridrow');
var gridCell = require('../../../utility/grid/gridcell');
var enums = require('../../enums');
var localeStore = require('../../../../stores/locale/localestore');
var standardisationsetuphelperbase = require('./standardisationsetuphelperbase');
var josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var Immutable = require('immutable');
var standardisationGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
var gridColumnNames = require('../gridcolumnnames');
var scriptStatusGridElement = require('../../../standardisationsetup/shared/scriptstatusgridelement');
var standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var ReuseButton = require('../../../standardisationsetup/shared/reusebutton');
var ToggleButton = require('../../../utility/togglebutton');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var sortHelper = require('../../../../utility/sorting/sorthelper');
var standardisationActionCreator = require('../../../../actions/standardisationsetup/standardisationactioncreator');
/**
 * Helper class for select response grid view
 */
var SelectResponseHelper = (function (_super) {
    __extends(SelectResponseHelper, _super);
    function SelectResponseHelper() {
        _super.apply(this, arguments);
    }
    /**
     * Generate Centre Row Definition
     * @param standardisationCentreList
     */
    SelectResponseHelper.prototype.generateCentreRowDefinition = function (standardisationCentreList) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(standardisationGridColumnsJson);
        this._stdSetUpWorkListCollection = Immutable.List();
        var _workListRowCollection = Array();
        var _workListRowHeaderCellcollection = Array();
        var _worklistRow;
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        var isSeedResponse;
        if (standardisationCentreList != null) {
            var gridSeq = standardisationCentreList.centreList.keySeq();
            var _responseListData = standardisationCentreList.centreList.toArray();
            var responseListLength = _responseListData.length;
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.standardisationsetup.SelectResponse.Centre.GridColumns;
                var gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();
                    switch (_responseColumn) {
                        case gridColumnNames.Centre:
                            key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber, key));
                            break;
                        case gridColumnNames.Scripts:
                            key = gridSeq.get(responseListCount) + '_Scripts_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.totalScripts.toString(), key));
                            break;
                        case gridColumnNames.ScriptsAvailable:
                            key = gridSeq.get(responseListCount) + '_ScriptsAvailable_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.availableScripts.toString(), key));
                            break;
                        case gridColumnNames.FirstScanned:
                            key = gridSeq.get(responseListCount) + '_FirstScanned_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericFormattedDateElement(responseData.firstScanned, key));
                            break;
                        default:
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }
                _workListRowCollection.push(this.getGridRow(responseData.uniqueId.toString(), _workListRowHeaderCellcollection, undefined, standardisationSetupStore.instance.selectedCentreId === responseData.uniqueId ? 'row selected' : 'row'));
            }
        }
        this._stdSetUpWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Method for getting the frozen row body for STD worklist
     * @param standardisationResponseData
     */
    SelectResponseHelper.prototype.generateStandardisationFrozenRowBodyReusableGrid = function (reusableResponsesList, comparerName, sortDirection) {
        var _stdWorkListRowHeaderCellcollection = Array();
        var _stdWorkListRowCollection = Array();
        var _reusableResponseListData;
        var _stdResponseColumn;
        var componentPropsJson;
        var _stdWorkListCell;
        var key;
        var cssClass;
        _reusableResponseListData = reusableResponsesList.toArray();
        var _comparerName = (sortDirection === enums.SortDirection.Ascending) ? comparerName : comparerName + 'Desc';
        var sortedData = Immutable.List(sortHelper.sort(_reusableResponseListData, comparerList[_comparerName]));
        _reusableResponseListData = sortedData.toArray();
        if (_reusableResponseListData != null) {
            var previousMarkingMode = enums.MarkingMode.None;
            var gridSeq = Immutable.List(_reusableResponseListData).keySeq();
            var responseListLength = _reusableResponseListData.length;
            for (var stdResponseCount = 0; stdResponseCount < responseListLength; stdResponseCount++) {
                // Getting the std worklist data row
                _stdWorkListRowHeaderCellcollection = new Array();
                // instead of accessing _standardisationResponseListData[standardisationResponseListCount]
                // collection inside loop, its accessed
                // outside the loop globally
                var stdResponseData = _reusableResponseListData[stdResponseCount];
                var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, enums.StandardisationSetup.SelectResponse, true, null, enums.StandardisationSessionTab.PreviousSession);
                var gridColumnLength = gridColumns.length;
                // Getting the STD worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;
                    _stdWorkListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    switch (_stdResponseColumn) {
                        case gridColumnNames.ScriptId:
                            key = gridSeq.get(stdResponseCount) + '_ScriptId_' + stdResponseCount;
                            _stdWorkListCell.columnElement =
                                (this.getGenericTextElement(stdResponseData.candidateScriptId.toString(), key));
                            _stdWorkListCell.setCellStyle('col-script-id header-col');
                            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                            break;
                        case gridColumnNames.Status:
                            key = 'reusableresponse' + '_Is_Reused_' + stdResponseCount;
                            var responseStatuses = Immutable.List();
                            _stdWorkListCell.columnElement = this.reuseButton(stdResponseData.reUsedQIG, stdResponseCount);
                            _stdWorkListCell.setCellStyle('col-re-use');
                            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                            break;
                        case gridColumnNames.OrginalSession:
                            key = gridSeq.get(stdResponseCount) + '_Orginal_Session_' + stdResponseCount;
                            _stdWorkListCell.columnElement = (this.getGenericTextElement(stdResponseData.originalSession.toString(), key));
                            _stdWorkListCell.setCellStyle('col-org-session');
                            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                            break;
                        case gridColumnNames.OrginalClassification:
                            key = gridSeq.get(stdResponseCount) + '_Orginal_Classification_' + stdResponseCount;
                            _stdWorkListCell.columnElement = (this.getGenericTextElement(stdResponseData.originalClassification.toString(), key));
                            _stdWorkListCell.setCellStyle('col-org-classification');
                            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                            break;
                    }
                }
                // Creating the table row collection.
                _stdWorkListRowCollection.push(this.getGridRow(stdResponseData.displayId.toString(), _stdWorkListRowHeaderCellcollection));
            }
        }
        var _stdWorkListFrozenRowBodyCollection = Immutable.fromJS(_stdWorkListRowCollection);
        return _stdWorkListFrozenRowBodyCollection;
    };
    /**
     * Reuse button return
     * @param isDisabled
     */
    SelectResponseHelper.prototype.reuseButton = function (isDisabled, id) {
        var componentProps;
        componentProps = {
            isDisabled: isDisabled,
            id: id,
            renderedOn: Date.now()
        };
        return React.createElement(ReuseButton, componentProps);
    };
    /**
     * Onclick hide response
     */
    SelectResponseHelper.prototype.hideResponse = function (isChecked, displayID, key) {
        var componentProps;
        componentProps = {
            id: key + '_id',
            key: key + '_key',
            isChecked: isChecked,
            selectedLanguage: localeStore.instance.Locale,
            index: 0,
            onChange: this.onHideResponseToggleChange,
            style: null,
            className: 'form-component',
            title: 'Hide Response',
            isDisabled: false,
            onText: localeStore.instance.TranslateText('generic.toggle-button-states.yes'),
            offText: localeStore.instance.TranslateText('generic.toggle-button-states.no'),
            displayId: displayID
        };
        return React.createElement(ToggleButton, componentProps);
    };
    /**
     * for handling the hide response toggle change event.
     */
    SelectResponseHelper.prototype.onHideResponseToggleChange = function (evt, isChecked, displayId) {
        standardisationActionCreator.updateHideResponseStatus(!isChecked, displayId);
    };
    /**
     * Generate reusable response row definition
     * @param reusableResponsesList
     */
    SelectResponseHelper.prototype.generateReusableResponsesRowDefinition = function (reusableResponsesList, comparerName, sortDirection) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(standardisationGridColumnsJson);
        this._stdSetUpWorkListCollection = Immutable.List();
        var _workListRowCollection = Array();
        var _workListRowHeaderCellcollection = Array();
        var _worklistRow;
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        var _reusableResponseListData = reusableResponsesList.toArray();
        var _comparerName = (sortDirection === enums.SortDirection.Ascending) ? comparerName : comparerName + 'Desc';
        var sortedData = Immutable.List(sortHelper.sort(_reusableResponseListData, comparerList[_comparerName]));
        _reusableResponseListData = sortedData.toArray();
        var responseListLength = _reusableResponseListData.length;
        for (var reusableResponseCount = 0; reusableResponseCount < responseListLength; reusableResponseCount++) {
            // Getting the worklist data row
            var gridColumns = this.resolvedGridColumnsJson.standardisationsetup.PreviousSession.ReusableResponse.GridColumns;
            var gridColumnLength = gridColumns.length;
            _workListRowHeaderCellcollection = new Array();
            _worklistRow = new gridRow();
            // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
            // outside the loop globally
            var responseData = _reusableResponseListData[reusableResponseCount];
            for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                _responseColumn = gridColumns[gridColumnCount].GridColumn;
                componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                _workListCell = new gridCell();
                switch (_responseColumn) {
                    case gridColumnNames.Centre:
                        key = 'reusableresponse' + '_Centre_' + reusableResponseCount;
                        _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber.toString(), key));
                        break;
                    case gridColumnNames.CentreCandidateNum:
                        key = 'reusableresponse' + '_Candidate_' + reusableResponseCount;
                        _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber.toString(), key));
                        break;
                    case gridColumnNames.Mark:
                        key = 'reusableresponse' + '_Mark_' + reusableResponseCount;
                        _workListCell.columnElement = (this.getGenericTextElement(responseData.totalMarkValue.toString(), key));
                        break;
                    case gridColumnNames.OrginalMarksUpdated:
                        key = 'reusableresponse' + '_Orginal_Marks_Updated_' + reusableResponseCount;
                        _workListCell.columnElement = (this.getConvertTextElement(responseData.originalMarksUpdated.toString(), key));
                        break;
                    case gridColumnNames.HideResponse:
                        key = 'reusableresponse' + '_HideResponse_' + reusableResponseCount;
                        _workListCell.columnElement = (this.hideResponse(responseData.hidden, responseData.displayId, key));
                        break;
                    case gridColumnNames.Totaltimereused:
                        key = 'reusableresponse' + '_Totaltimereused_' + reusableResponseCount;
                        var toolTip = this.getToolTipTotalTimeReused(responseData.reusedComponentTooltipData, false);
                        _workListCell.columnElement = (this.getGenericTextElement(responseData.timesReUsed.toString(), key, toolTip));
                        break;
                    case gridColumnNames.LastUsed:
                        key = 'reusableresponse' + '_LastUsed_' + reusableResponseCount;
                        _workListCell.columnElement = (this.getGenericTextElement(responseData.lastUsed.toString(), key));
                        break;
                    case gridColumnNames.TimesReusedInThisSession:
                        key = 'reusableresponse' + '_Times_Reused_In_This_Session_' + reusableResponseCount;
                        var sessionToolTip = this.getToolTipTotalTimeReused(responseData.reusedSessionTooltipData, true);
                        _workListCell.columnElement =
                            (this.getGenericTextElement(responseData.timesReUsedSession.toString(), key, sessionToolTip));
                        break;
                    case gridColumnNames.UpdatePending:
                        key = 'reusableresponse' + '_Update_Pending_' + reusableResponseCount;
                        _workListCell.columnElement = (this.getConvertTextElement(responseData.updatesPending.toString(), key));
                        break;
                    case gridColumnNames.IsReusedInThisQIG:
                        key = 'reusableresponse' + '_Is_Reused_In_This_QIG' + reusableResponseCount;
                        _workListCell.columnElement = (this.getConvertTextElement(responseData.reUsedQIG.toString(), key));
                        break;
                    default:
                }
                var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                _workListCell.setCellStyle(cellStyle);
                _workListRowHeaderCellcollection.push(_workListCell);
            }
            _workListRowCollection.push(this.getGridRow(responseData.candidateScriptId.toString(), _workListRowHeaderCellcollection, undefined));
        }
        this._stdSetUpWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Get Tooltip for total time reused coulumn
     * @param totalTimesReusedTooltip
     */
    SelectResponseHelper.prototype.getToolTipTotalTimeReused = function (totalTimesReusedTooltip, isTooltipForthisSession) {
        var toolTipData = localeStore.instance.TranslateText('standardisation-setup.previous-session.reused-tooltip.not-reused');
        var toolTipList = Immutable.List(totalTimesReusedTooltip).toArray();
        var toolTipListLength = toolTipList.length;
        if (toolTipListLength !== null && toolTipListLength > 0) {
            toolTipData = isTooltipForthisSession ?
                localeStore.instance.TranslateText('standardisation-setup.previous-session.reused-tooltip.reused-in-this-session-tooltip') :
                localeStore.instance.TranslateText('standardisation-setup.previous-session.reused-tooltip.reused-overall-tooltip');
            for (var a = 0; a < toolTipListLength; a++) {
                var rr = toolTipList[a];
                if (rr.marking_Mode === 'ES Team Approval') {
                    rr.marking_Mode = 'ES_TeamApproval';
                }
                else if (rr.marking_Mode === 'Pre_Standardisation' || rr.marking_Mode === 'Pre Standardisation') {
                    rr.marking_Mode = 'PreStandardisation';
                }
                toolTipData = toolTipData + ' '
                    + localeStore.instance.TranslateText('standardisation-setup.previous-session.reused-tooltip.' + rr.marking_Mode)
                    + '(' + rr.timesUsed
                    + (isTooltipForthisSession ? (')') : ('/' + rr.session + ')'))
                    + (a < toolTipListLength - 1 ? ',' : '');
            }
        }
        return toolTipData;
    };
    /**
     * generate Script Row definition
     * @param standardisationScriptList
     */
    SelectResponseHelper.prototype.generateScriptRowDefinition = function (standardisationScriptList) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(standardisationGridColumnsJson);
        this._stdSetUpWorkListCollection = Immutable.List();
        var _rowCollection = Array();
        var _rowHeaderCellcollection = Array();
        var _row;
        var _responseColumn;
        var componentPropsJson;
        var _cell;
        var key;
        var isSeedResponse;
        if (standardisationScriptList != null) {
            var gridSeq = standardisationScriptList.centreScriptList.keySeq();
            var _responseListData = standardisationScriptList.centreScriptList.toArray();
            var responseListLength = _responseListData.length;
            for (var responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                var gridColumns = this.resolvedGridColumnsJson.standardisationsetup.SelectResponse.Script.GridColumns;
                var gridColumnLength = gridColumns.length;
                _rowHeaderCellcollection = new Array();
                _row = new gridRow();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _cell = new gridCell();
                    switch (_responseColumn) {
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidateNo_' + gridColumnCount;
                            _cell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber, key));
                            break;
                        case gridColumnNames.Status:
                            key = gridSeq.get(responseListCount) + '_Status_' + gridColumnCount;
                            _cell.columnElement = this.getScriptStatusElement(responseData, key);
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _cell.columnElement = (this.getSLAOIndicatorElement(responseData, componentPropsJson, key, false, false));
                            break;
                        case gridColumnNames.QuestionItems:
                            if (configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false) {
                                key = gridSeq.get(responseListCount) + '_QuestionItems_' + gridColumnCount;
                                _cell.columnElement = (this.getGenericTextElement(responseData.questionItems.toString(), key));
                            }
                            break;
                        default:
                            break;
                    }
                    _cell.isHidden = this.getCellVisibility(_responseColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _cell.setCellStyle(cellStyle);
                    _rowHeaderCellcollection.push(_cell);
                }
                _rowCollection.push(this.getGridRow(responseData.candidateScriptId.toString(), _rowHeaderCellcollection, undefined));
            }
        }
        this._stdSetUpWorkListCollection = Immutable.fromJS(_rowCollection);
        return this._stdSetUpWorkListCollection;
    };
    /**
     * get Script status element for worklist
     * @param standardisationScriptDetails Get the script status element
     * @param seq
     */
    SelectResponseHelper.prototype.getScriptStatusElement = function (standardisationScriptDetails, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            isAllocatedALive: standardisationScriptDetails.isAllocatedALive,
            isUsedForProvisionalMarking: standardisationScriptDetails.isUsedForProvisionalMarking,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(scriptStatusGridElement, componentProps);
    };
    return SelectResponseHelper;
}(standardisationsetuphelperbase));
module.exports = SelectResponseHelper;
//# sourceMappingURL=selectresponsehelper.js.map
import React = require('react');
import gridRow = require('../../../utility/grid/gridrow');
import gridCell = require('../../../utility/grid/gridcell');
import enums = require('../../enums');
import localeStore = require('../../../../stores/locale/localestore');
import standardisationsetuphelperbase = require('./standardisationsetuphelperbase');
import josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import Immutable = require('immutable');
let standardisationGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
import gridColumnNames = require('../gridcolumnnames');
import scriptStatusGridElement = require('../../../standardisationsetup/shared/scriptstatusgridelement');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import ecourseWorkHelper = require('../../ecoursework/ecourseworkhelper');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import ReuseButton = require('../../../standardisationsetup/shared/reusebutton');
import ToggleButton = require('../../../utility/togglebutton');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import sortHelper = require('../../../../utility/sorting/sorthelper');
import standardisationActionCreator = require('../../../../actions/standardisationsetup/standardisationactioncreator');

/**
 * Helper class for select response grid view
 */
class SelectResponseHelper extends standardisationsetuphelperbase {

    /**
     * Generate Centre Row Definition
     * @param standardisationCentreList
     */
    public generateCentreRowDefinition(standardisationCentreList: StandardisationCentreDetailsList) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(standardisationGridColumnsJson);
        this._stdSetUpWorkListCollection = Immutable.List<gridRow>();

        let _workListRowCollection = Array<gridRow>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;
        let isSeedResponse: boolean;
        if (standardisationCentreList != null) {
            let gridSeq = standardisationCentreList.centreList.keySeq();
            let _responseListData = standardisationCentreList.centreList.toArray();
            let responseListLength = _responseListData.length;
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.standardisationsetup.SelectResponse.Centre.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: StandardisationCentreDetails = _responseListData[responseListCount];
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
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
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }
                _workListRowCollection.push(
                    this.getGridRow(
                        responseData.uniqueId.toString(),
                        _workListRowHeaderCellcollection, undefined,
                        standardisationSetupStore.instance.selectedCentreId === responseData.uniqueId ? 'row selected' : 'row'
                    ));
            }
        }
        this._stdSetUpWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._stdSetUpWorkListCollection;
    }

    /**
     * Method for getting the frozen row body for STD worklist
     * @param standardisationResponseData
     */
    public generateStandardisationFrozenRowBodyReusableGrid(reusableResponsesList: Immutable.List<StandardisationResponseDetails>,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<gridRow> {

        let _stdWorkListRowHeaderCellcollection = Array<gridCell>();
        let _stdWorkListRowCollection = Array<gridRow>();
        let _reusableResponseListData: StandardisationResponseDetails[];
        let _stdResponseColumn: any;
        let componentPropsJson: any;
        let _stdWorkListCell: gridCell;
        let key: string;
        let cssClass: string;

        _reusableResponseListData = reusableResponsesList.toArray();
        let _comparerName = (sortDirection === enums.SortDirection.Ascending) ? comparerName : comparerName + 'Desc';
        let sortedData: Immutable.List<StandardisationResponseDetails> = Immutable.List<StandardisationResponseDetails>(
            sortHelper.sort(_reusableResponseListData, comparerList[_comparerName]));
        _reusableResponseListData = sortedData.toArray();

        if (_reusableResponseListData != null) {
            let previousMarkingMode: enums.MarkingMode = enums.MarkingMode.None;
            let gridSeq = Immutable.List<StandardisationResponseDetails>(_reusableResponseListData).keySeq();
            let responseListLength = _reusableResponseListData.length;
            for (let stdResponseCount = 0; stdResponseCount < responseListLength; stdResponseCount++) {
                // Getting the std worklist data row
                _stdWorkListRowHeaderCellcollection = new Array();

                // instead of accessing _standardisationResponseListData[standardisationResponseListCount]
                // collection inside loop, its accessed
                // outside the loop globally
                let stdResponseData: StandardisationResponseDetails = _reusableResponseListData[stdResponseCount];
                let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, enums.StandardisationSetup.SelectResponse, true, null,
                    enums.StandardisationSessionTab.PreviousSession);
                let gridColumnLength = gridColumns.length;

                // Getting the STD worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;
                    _stdWorkListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;

                    //Switch statement for adding frozen columns in future.
                    switch (_stdResponseColumn) {
                        case gridColumnNames.ScriptId:
                            key = gridSeq.get(stdResponseCount) + '_ScriptId_' + stdResponseCount;
                            _stdWorkListCell.columnElement =
                                this.getResponseIdColumnElement(stdResponseData,
                                    key,
                                    true,
                                    true,
                                    stdResponseData.candidateScriptId.toString());
                            _stdWorkListCell.setCellStyle('col-script-id header-col');
                            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                            break;
                        case gridColumnNames.Status:
                            key = 'reusableresponse' + '_Is_Reused_' + stdResponseCount;
                            let responseStatuses = Immutable.List<enums.ResponseStatus>();
                            _stdWorkListCell.columnElement = this.reuseButton
                            (stdResponseData.reUsedQIG, stdResponseCount, stdResponseData.displayId);
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
                            _stdWorkListCell.columnElement = (this.getGenericTextElement(
                                stdResponseData.originalClassification.toString(), key));
                            _stdWorkListCell.setCellStyle('col-org-classification');
                            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                            break;
                    }
                }

                // Creating the table row collection.
                _stdWorkListRowCollection.push(
                    this.getGridRow(
                        stdResponseData.displayId.toString(),
                        _stdWorkListRowHeaderCellcollection
                    ));
            }
        }
        let _stdWorkListFrozenRowBodyCollection = Immutable.fromJS(_stdWorkListRowCollection);
        return _stdWorkListFrozenRowBodyCollection;
    }

    /**
     * Reuse button return 
     * @param isDisabled
     * @param id
     * @param displayId
     */
    private reuseButton(isDisabled: boolean, id: number, displayId: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            isDisabled: isDisabled,
            id: id,
            renderedOn: Date.now(),
            displayId: displayId
        };
        return React.createElement(ReuseButton, componentProps);
    }

    /**
     * Onclick hide response
     */
    private hideResponse(isChecked: boolean, displayID: string, key: string): JSX.Element {
        let componentProps: any;
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
    }

    /**
     * for handling the hide response toggle change event.
     */
    private onHideResponseToggleChange(evt: any, isChecked: boolean, displayId: string): void {
        standardisationActionCreator.updateHideResponseStatus(!isChecked, displayId);
    }

    /**
     * Generate reusable response row definition
     * @param reusableResponsesList
     */
    public generateReusableResponsesRowDefinition(reusableResponsesList: Immutable.List<StandardisationResponseDetails>,
        comparerName?: string,
        sortDirection?: enums.SortDirection) {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(standardisationGridColumnsJson);
        this._stdSetUpWorkListCollection = Immutable.List<gridRow>();

        let _workListRowCollection = Array<gridRow>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;

        let _reusableResponseListData = reusableResponsesList.toArray();
        let _comparerName = (sortDirection === enums.SortDirection.Ascending) ? comparerName : comparerName + 'Desc';
        let sortedData = Immutable.List<any>(
            sortHelper.sort(_reusableResponseListData, comparerList[_comparerName]));
        _reusableResponseListData = sortedData.toArray();
        let responseListLength = _reusableResponseListData.length;

        for (let reusableResponseCount = 0; reusableResponseCount < responseListLength; reusableResponseCount++) {
            // Getting the worklist data row
            let gridColumns = this.resolvedGridColumnsJson.standardisationsetup.PreviousSession.ReusableResponse.GridColumns;
            let gridColumnLength = gridColumns.length;
            _workListRowHeaderCellcollection = new Array();
            _worklistRow = new gridRow();

            // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
            // outside the loop globally
            let responseData: StandardisationResponseDetails = _reusableResponseListData[reusableResponseCount];
            for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
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
                        let toolTip = this.getToolTipTotalTimeReused(responseData.reusedComponentTooltipData, false);
                        _workListCell.columnElement = (this.getGenericTextElement(responseData.timesReUsed.toString(), key,
                            toolTip));
                        break;
                    case gridColumnNames.LastUsed:
                        key = 'reusableresponse' + '_LastUsed_' + reusableResponseCount;
                        _workListCell.columnElement = (this.getGenericTextElement(responseData.lastUsed.toString(), key));
                        break;
                    case gridColumnNames.TimesReusedInThisSession:
                        key = 'reusableresponse' + '_Times_Reused_In_This_Session_' + reusableResponseCount;
                        let sessionToolTip = this.getToolTipTotalTimeReused(responseData.reusedSessionTooltipData, true);
                        _workListCell.columnElement =
                            (this.getGenericTextElement(responseData.timesReUsedSession.toString(), key,
                                sessionToolTip));
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
                let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                _workListCell.setCellStyle(cellStyle);
                _workListRowHeaderCellcollection.push(_workListCell);
            }
            _workListRowCollection.push(
                this.getGridRow(
                    responseData.candidateScriptId.toString(),
                    _workListRowHeaderCellcollection, undefined
                ));
        }
        this._stdSetUpWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._stdSetUpWorkListCollection;
    }

    /**
     * Get Tooltip for total time reused coulumn
     * @param totalTimesReusedTooltip
     */
    private getToolTipTotalTimeReused(totalTimesReusedTooltip: Immutable.List<ComponentTooltip>, isTooltipForthisSession: boolean): string {
        let toolTipData = localeStore.instance.TranslateText
            ('standardisation-setup.previous-session.reused-tooltip.not-reused');
        let toolTipList = Immutable.List<ComponentTooltip>(totalTimesReusedTooltip).toArray();
        let toolTipListLength = toolTipList.length;
        if (toolTipListLength !== null && toolTipListLength > 0) {
            toolTipData = isTooltipForthisSession ?
                localeStore.instance.TranslateText
                    ('standardisation-setup.previous-session.reused-tooltip.reused-in-this-session-tooltip') :
                localeStore.instance.TranslateText
                    ('standardisation-setup.previous-session.reused-tooltip.reused-overall-tooltip');
            for (let a = 0; a < toolTipListLength; a++) {
                let rr = toolTipList[a];
                if (rr.marking_Mode === 'ES Team Approval') {
                    rr.marking_Mode = 'ES_TeamApproval';
                } else if (rr.marking_Mode === 'Pre_Standardisation' || rr.marking_Mode === 'Pre Standardisation') {
                    rr.marking_Mode = 'PreStandardisation';
                }
                toolTipData = toolTipData + ' '
                    + localeStore.instance.TranslateText
                        ('standardisation-setup.previous-session.reused-tooltip.' + rr.marking_Mode)
                    + '(' + rr.timesUsed
                    + (isTooltipForthisSession ? (')') : ('/' + rr.session + ')'))
                    + (a < toolTipListLength - 1 ? ',' : '');
            }
        }
        return toolTipData;
    }

	/**
	 * generate Script Row definition
	 * @param standardisationScriptList 
	 */
    public generateScriptRowDefinition(standardisationScriptList: StandardisationScriptDetailsList): Immutable.List<gridRow> {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(standardisationGridColumnsJson);
        this._stdSetUpWorkListCollection = Immutable.List<gridRow>();

        let _rowCollection = Array<gridRow>();
        let _rowHeaderCellcollection = Array<gridCell>();
        let _row: gridRow;
        let _responseColumn: any;
        let componentPropsJson: any;
        let _cell: gridCell;
        let key: string;
        let isSeedResponse: boolean;
        if (standardisationScriptList != null) {
            let gridSeq = standardisationScriptList.centreScriptList.keySeq();
            let _responseListData = standardisationScriptList.centreScriptList.toArray();
            let responseListLength = _responseListData.length;
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.standardisationsetup.SelectResponse.Script.GridColumns;
                let gridColumnLength = gridColumns.length;
                _rowHeaderCellcollection = new Array();
                _row = new gridRow();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: StandardisationScriptDetails = _responseListData[responseListCount];

                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
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
                            _cell.columnElement = (this.getSLAOIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                false,
                                false));
                            break;
                        case gridColumnNames.QuestionItems:
                            if (configurableCharacteristicsHelper.getCharacteristicValue(
                                configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false) {
                                key = gridSeq.get(responseListCount) + '_QuestionItems_' + gridColumnCount;
                                _cell.columnElement = (this.getGenericTextElement(responseData.questionItems.toString(), key));
                            }
                            break;
                        default:
                            break;
                    }
                    _cell.isHidden = this.getCellVisibility(_responseColumn);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _cell.setCellStyle(cellStyle);
                    _rowHeaderCellcollection.push(_cell);
                }
                _rowCollection.push(
                    this.getGridRow(
                        responseData.candidateScriptId.toString(),
                        _rowHeaderCellcollection, undefined));
            }
        }
        this._stdSetUpWorkListCollection = Immutable.fromJS(_rowCollection);
        return this._stdSetUpWorkListCollection;
    }

	/**
	 * get Script status element for worklist
	 * @param standardisationScriptDetails Get the script status element
	 * @param seq 
	 */
    private getScriptStatusElement(standardisationScriptDetails: StandardisationScriptDetails, seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            isAllocatedALive: standardisationScriptDetails.isAllocatedALive,
            isUsedForProvisionalMarking: standardisationScriptDetails.isUsedForProvisionalMarking,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(scriptStatusGridElement, componentProps);
    }
}

export = SelectResponseHelper;
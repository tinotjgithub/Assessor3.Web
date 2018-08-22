import React = require('react');
import teamManagementHelperBase = require('./teammanagementhelperbase');
import gridRow = require('../../../utility/grid/gridrow');
import gridCell = require('../../../utility/grid/gridcell');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
let teamManagementGridColumnsJson = require('../../../utility/grid/teammanagementgridcolumns.json');
import localeStore = require('../../../../stores/locale/localestore');
import gridColumnNames = require('../gridcolumnnames');
import enums = require('../../enums');
import Immutable = require('immutable');
import State = require('../../../teammanagement/shared/helpexaminerstate');
import classNames = require('classnames');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import timeFormatHelper = require('../../../../utility/generic/timeformathelper');
type HelpExaminerColumnData = { textValue: string, classValue: string };
import qigStore = require('../../../../stores/qigselector/qigstore');
import SEPAction = require('../../../teammanagement/shared/sepaction');
import stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
import loginSession = require('../../../../app/loginsession');

/**
 * Helper class for MyTeam grid view
 */
class HelpExaminersHelper extends teamManagementHelperBase {

    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    public generateRowDefinion(teamManagementTabData: Immutable.List<GridData>,
        teamManagementTab: enums.TeamManagement): Immutable.List<gridRow> {

        this._teamManagementListCollection = Immutable.List<gridRow>();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        this._teamManagementListCollection =
            this.getRowDefinionForHelpExaminer(teamManagementTabData as Immutable.List<ExaminerDataForHelpExaminer>);
        return this._teamManagementListCollection;
    }

    /**
     * Generate frozen row body is used for generating row collection for my team or help other examiners grid
     * @param examinerListData - type of the examiner data
     * @param teamManagementTab - type of team management tab
     * @returns grid row collection.
     */
    public generateFrozenRowBody(examinerListData: any, teamManagementTab: enums.TeamManagement): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);

        let _teamManagementListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(examinerListData, teamManagementTab);

        return _teamManagementListFrozenRowBodyCollection;
    }

    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    public getFrozenRowBodyForListView(teamManagementTabData: Immutable.List<GridData>,
        teamMangementTab: enums.TeamManagement): Immutable.List<gridRow> {
        let _teamManagementListRowHeaderCellcollection = Array<gridCell>();
        let _teamManagementRowCollection = Array<gridRow>();
        let _frozenColumn: any;
        let componentPropsJson: any;
        let _teamManagementListCell: gridCell;
        let key: string;
        let cssClass: string;
        if (teamManagementTabData != null) {
            let gridSeq = teamManagementTabData.keySeq();
            teamManagementTabData.map((teamGridData: ExaminerDataForHelpExaminer, index) => {
                _teamManagementListRowHeaderCellcollection = new Array();
                let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, teamMangementTab, true);
                let gridColumnLength = gridColumns.length;

                // Getting the team management list columns columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _frozenColumn = gridColumns[gridColumnCount].GridColumn;
                    _teamManagementListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    switch (_frozenColumn) {
                        case gridColumnNames.Examiner:
                            key = gridSeq.get(index) + '_Examiner_' + gridColumnCount;
                            _teamManagementListCell.columnElement =
                                this.getHelpExaminerColumnElement(teamGridData, componentPropsJson, key);
                            let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                            _teamManagementListCell.setCellStyle(cellStyle);
                            _teamManagementListRowHeaderCellcollection.push(_teamManagementListCell);
                            cssClass = 'row';
                            break;
                    }

                }

                // Creating the table row collection.
                _teamManagementRowCollection.push(
                    this.getGridRow(
                        teamGridData.examinerId,
                        _teamManagementListRowHeaderCellcollection,
                        undefined,
                        cssClass
                    ));
            });
        }
        let _teamManagementListFrozenRowBodyCollection = Immutable.fromJS(_teamManagementRowCollection);
        return _teamManagementListFrozenRowBodyCollection;
    }

    /**
     * Returns the row definition for my team data
     * @param teamManagementTabData
     */
    private getRowDefinionForHelpExaminer(teamManagementTabData: Immutable.List<ExaminerDataForHelpExaminer>): Immutable.List<gridRow> {
        let _teamManagementRowCollection = Array<gridRow>();
        let _teamManagementRowHeaderCellcollection = Array<gridCell>();

        let _helpExaminerColumn: any;
        let componentPropsJson: any;
        let _helpExaminerCell: gridCell;
        let key: string;

        if (teamManagementTabData != null) {
            let gridSeq = teamManagementTabData.keySeq();
            teamManagementTabData.map((examinerData: ExaminerDataForHelpExaminer, index) => {
                // Getting the team management data row
                let gridColumns = this.resolvedGridColumnsJson.teammanagement.helpexaminers.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _teamManagementRowHeaderCellcollection = new Array();
                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _helpExaminerColumn = gridColumns[gridColumnCount].GridColumn;


                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _helpExaminerCell = new gridCell();
                    switch (_helpExaminerColumn) {
                        case gridColumnNames.SEPAction:
                            key = gridSeq.get(index) + '_SEPAction_' + gridColumnCount;
                            _helpExaminerCell.columnElement = this.getSEPActionElement(key, examinerData);
                            break;
                        case gridColumnNames.State:
                            key = gridSeq.get(index) + '_State_' + gridColumnCount;
                            _helpExaminerCell.columnElement = (this.getHelpExaminerStateElement(
                                examinerData.workflowStateId,
                                examinerData.autoSuspensionCount,
                                componentPropsJson,
                                key));
                            break;
                        case gridColumnNames.Role:
                        case gridColumnNames.Supervisor:
                        case gridColumnNames.LockedDuration:
                        case gridColumnNames.TimeInCurrentState:
                        case gridColumnNames.LockedBy:
                        case gridColumnNames.TotalQigsActive:
                        case gridColumnNames.TotalQigsRequiring:
                            let helpExaminerColumnData: HelpExaminerColumnData =
                                this.getHelpExaminerData(examinerData, _helpExaminerColumn);
                            key = gridSeq.get(index) + '_' + _helpExaminerColumn + '_' + gridColumnCount;
                            _helpExaminerCell.columnElement = (this.getGenericTeamElement(
                                helpExaminerColumnData.textValue,
                                helpExaminerColumnData.classValue,
                                key));
                            break;
                    }

                    _helpExaminerCell.isHidden = this.getCellVisibility(_helpExaminerColumn);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _helpExaminerCell.setCellStyle(cellStyle);
                    _teamManagementRowHeaderCellcollection.push(_helpExaminerCell);
                }


                // Creating the grid row collection.
                _teamManagementRowCollection.push(
                    this.getGridRow(
                        examinerData.examinerId,
                        _teamManagementRowHeaderCellcollection,
                        null,
                        'row'
                    ));
            });
        }

        this._teamManagementListCollection = Immutable.fromJS(_teamManagementRowCollection);
        return this._teamManagementListCollection;
    }

    /**
     * Returns the state element
     * @param examinerState
     */
    public getStateElement(examinerState: string,
        suspendedCount: number,
        propsNames: any,
        seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            examinerState: examinerState,
            suspendedCount: suspendedCount,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(State, componentProps);
    }

    /**
     * Return the help examiner column
     * @param helpExaminerData
     * @param helpExaminerColumn
     */
    private getHelpExaminerData(helpExaminerData: ExaminerDataForHelpExaminer, helpExaminerColumn: any): HelpExaminerColumnData {
        let textValue: string;
        let classValue: string;
        switch (helpExaminerColumn) {
            case gridColumnNames.Role:
                textValue = this.getRoleText(helpExaminerData.roleId as enums.ExaminerRole);
                break;
            case gridColumnNames.Supervisor:
                textValue = this.getFormattedExaminerName(helpExaminerData.parentInitials, helpExaminerData.parentSurname);
                classValue = 'small-text';
                break;
            case gridColumnNames.LockedDuration:
                textValue = helpExaminerData.locked ? timeFormatHelper.convertMinutesToHoursOrDays(Math.floor(((new Date().getTime() -
                    new Date(helpExaminerData.lockTimeStamp.toString()).getTime()) / 1000) / 60)) : '';
                classValue = 'small-text dim-text';
                break;
            case gridColumnNames.TimeInCurrentState:
                textValue = timeFormatHelper.convertMinutesToHoursOrDays(Math.floor(((new Date().getTime() -
                    new Date(helpExaminerData.workflowStateTimeStamp.toString()).getTime()) / 1000) / 60));
                classValue = 'small-text';
                break;
            case gridColumnNames.LockedBy:
                // 'Locked by' column shall be blank for all examiners not having 'Unlock' button. So Apply value only if unlock presents
                if (helpExaminerData.actions.indexOf(enums.SEPAction.Unlock) > -1) {
                    textValue = stringFormatHelper.getFormattedExaminerName
                        (helpExaminerData.lockedByInitials, helpExaminerData.lockedBySurname);
                } else if (helpExaminerData.lockedByExaminerId === loginSession.EXAMINER_ID) {
                    textValue = localeStore.instance.TranslateText('team-management.my-team.my-team-data.locked-by-me');
                }
                classValue = 'col-locked-by';
                break;
            case gridColumnNames.TotalQigsActive:
                textValue = helpExaminerData.activeQigCount.toString();
                classValue = 'small-text dim-text';
                break;
            case gridColumnNames.TotalQigsRequiring:
                textValue = helpExaminerData.actionRequireQigCount.toString();
                classValue = 'small-text dim-text';
                break;
            default:
                return null;
        }

        return { textValue: textValue, classValue: classValue };
    }

    /**
     * Returns the state element
     * @param examinerState
     */
    public getHelpExaminerStateElement(examinerState: number,
        suspendedCount: number,
        propsNames: any,
        seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            examinerState: examinerState,
            suspendedCount: suspendedCount,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(State, componentProps);
    }

    /**
     * Get SEP Action Element
     * @param seq
     * @param examinerData
     */
    public getSEPActionElement(
        seq: string,
        examinerData: ExaminerDataForHelpExaminer): JSX.Element {

        let sepAction: number = 0;

        if (examinerData.actions.indexOf(enums.SEPAction.Lock) > -1) {
            sepAction = enums.SEPAction.Lock;
        } else if (examinerData.actions.indexOf(enums.SEPAction.Unlock) > -1) {
            sepAction = enums.SEPAction.Unlock;
        }

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            sepAction: sepAction,
            examinerRoleId: examinerData.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            requestedByExaminerRoleId: qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
        };

        return React.createElement(SEPAction, componentProps);
    }
}

export = HelpExaminersHelper;
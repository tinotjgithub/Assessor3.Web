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
import State = require('../../../teammanagement/shared/state');
import classNames = require('classnames');
import qigStore = require('../../../../stores/qigselector/qigstore');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');

/**
 * Helper class for MyTeam grid view
 */
class MyTeamHelper extends teamManagementHelperBase {

    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    public generateRowDefinion(teamManagementTabData: Immutable.List<GridData>,
        teamManagementTab: enums.TeamManagement): Immutable.List<gridRow> {

        this._teamManagementListCollection = Immutable.List<gridRow>();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        this._teamManagementListCollection = this.getRowDefinionForMyTeam(teamManagementTabData as Immutable.List<ExaminerViewDataItem>);
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
            teamManagementTabData.map((teamGridData: ExaminerViewDataItem, index) => {
                _teamManagementListRowHeaderCellcollection = new Array();
                let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, teamMangementTab, true);
                let gridColumnLength = gridColumns.length;

                // Getting the team management list columns columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _frozenColumn = gridColumns[gridColumnCount].GridColumn;
                    _teamManagementListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    // As per the requirement we need to implement the examiner tree level untill '6'
                    // above level 6 we will treat it as level 6
                    // Adding class to 'l' as decrement of examiner level since we are removing the PE from tree
                    // as per story 30995-Display examiner state column in My Team
                    switch (_frozenColumn) {
                        case gridColumnNames.Examiner:
                            key = gridSeq.get(index) + '_Examiner_' + gridColumnCount;
                            _teamManagementListCell.columnElement = this.getExaminerColumnElement(teamGridData, componentPropsJson, key);
                            let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                            _teamManagementListCell.setCellStyle(cellStyle);
                            _teamManagementListRowHeaderCellcollection.push(_teamManagementListCell);
                            cssClass = classNames('row show', {
                                'has-sub': teamGridData.hasSubordinates, 'open': teamGridData.isExpanded
                            },
                                'l' + (teamGridData.examinerLevel <= 6 ? (teamGridData.examinerLevel - 1) : 6));
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
    private getRowDefinionForMyTeam(teamManagementTabData: Immutable.List<ExaminerViewDataItem>): Immutable.List<gridRow> {
        let _teamManagementRowCollection = Array<gridRow>();
        let _teamManagementRowHeaderCellcollection = Array<gridCell>();

        let _myTeamColumn: any;
        let componentPropsJson: any;
        let _myTeamCell: gridCell;
        let key: string;

        if (teamManagementTabData != null) {
            let gridSeq = teamManagementTabData.keySeq();
            teamManagementTabData.map((examinerData: ExaminerViewDataItem, index) => {
                // Getting the team management data row
                let gridColumns = this.resolvedGridColumnsJson.teammanagement.myteam.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _teamManagementRowHeaderCellcollection = new Array();
                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _myTeamColumn = gridColumns[gridColumnCount].GridColumn;

                    let markSchemGroupId: number = qigStore.instance.selectedQIGForMarkerOperation ?
                        qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;

                    // Add the LockedDuration and LockedBy column only if the Senior examiner pool CC is on.
                    if ((_myTeamColumn === 'LockedDuration' || _myTeamColumn === 'LockedBy')
                        && configurableCharacteristicsHelper.getCharacteristicValue(ccNames.SeniorExaminerPool,
                            markSchemGroupId) !== 'true') {
                        continue;
                    }

                    // Add the ResponsesToReview column only if the Senior examiner pool CC is OFF.
                    if (_myTeamColumn === 'ResponsesToReview'
                        && configurableCharacteristicsHelper.getCharacteristicValue(ccNames.SeniorExaminerPool,
                            markSchemGroupId) === 'true') {
                        continue;
                    }

                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _myTeamCell = new gridCell();
                    switch (_myTeamColumn) {
                        case gridColumnNames.TargetProgress:
                            // not displaying target and progress for examiners in awaiting standardisation state.
                            // Target progress to be displayed even if standardisation for qig is not complete

                            key = gridSeq.get(index) + '_TargetProgress_' + gridColumnCount;
                            _myTeamCell.columnElement = (this.getTargetProgressElement(
                                examinerData.examinerProgress,
                                examinerData.examinerTarget,
                                examinerData.markingTargetName,
                                examinerData.markingModeId,
                                componentPropsJson,
                                key));
                            break;
                        case gridColumnNames.State:
                            key = gridSeq.get(index) + '_State_' + gridColumnCount;
                            _myTeamCell.columnElement = (this.getStateElement(
                                examinerData.examinerState,
                                componentPropsJson,
                                key));
                            break;
                        case gridColumnNames.LockedDuration:
                            key = gridSeq.get(index) + '_LockedDuration_' + gridColumnCount;
                            _myTeamCell.columnElement = this.getLockedDurationElement(
                                examinerData.lockedDuration
                            );
                            break;
                        case gridColumnNames.LockedBy:
                            key = gridSeq.get(index) + '_LockedBy_' + gridColumnCount;
                            _myTeamCell.columnElement = this.getLockedByElement(
                                examinerData.lockedByExaminerName
                            );
                            break;
                        case gridColumnNames.ResponsesToReview:
                            key = gridSeq.get(index) + '_ResponsesToReview_' + gridColumnCount;
                            _myTeamCell.columnElement = (this.getGenericTeamElement(
                                this.getResponsesToReviewCount(examinerData),
                                gridColumns[gridColumnCount].CssClass,
                                key));
                            break;
                        case gridColumnNames.TimesSuspended:
                            key = gridSeq.get(index) + '_TimesSuspended_' + gridColumnCount;
                            _myTeamCell.columnElement = (this.getGenericTeamElement(
                                examinerData.suspendedCount.toString(),
                                gridColumns[gridColumnCount].CssClass,
                                key));
                            break;
                        default:
                    }
                    _myTeamCell.isHidden = this.getCellVisibility(_myTeamColumn);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _myTeamCell.setCellStyle(cellStyle);
                    _teamManagementRowHeaderCellcollection.push(_myTeamCell);
                }

                // As per the requirement we need to implement the examiner tree level untill '6'
                // above level 6 we will treat it as level 6
                let cssClass: string = classNames('row show', {
                    'has-sub': examinerData.hasSubordinates, 'open': examinerData.isExpanded
                }, 'l' + (examinerData.examinerLevel <= 6 ? (examinerData.examinerLevel - 1) : 6));

                // Creating the grid row collection.
                _teamManagementRowCollection.push(
                    this.getGridRow(
                        examinerData.examinerId,
                        _teamManagementRowHeaderCellcollection,
                        null,
                        cssClass
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
        propsNames: any,
        seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            examinerState: examinerState,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(State, componentProps);
    }

    /**
     * Gets the number of responses to be reviewed for a particular examiner
     * @param examinerData
     */
    private getResponsesToReviewCount(examinerData: ExaminerViewDataItem): string {
        if (!examinerData ||
            examinerData.responsesToReviewCount === undefined ||
            examinerData.responsesToReviewCount === null ||
            examinerData.responsesToReviewCount === 0) {

            return '';
        } else {
            return examinerData.responsesToReviewCount.toString();
        }
    }
}

export = MyTeamHelper;
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var teamManagementHelperBase = require('./teammanagementhelperbase');
var gridCell = require('../../../utility/grid/gridcell');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var teamManagementGridColumnsJson = require('../../../utility/grid/teammanagementgridcolumns.json');
var localeStore = require('../../../../stores/locale/localestore');
var gridColumnNames = require('../gridcolumnnames');
var enums = require('../../enums');
var Immutable = require('immutable');
var State = require('../../../teammanagement/shared/helpexaminerstate');
var timeFormatHelper = require('../../../../utility/generic/timeformathelper');
var qigStore = require('../../../../stores/qigselector/qigstore');
var SEPAction = require('../../../teammanagement/shared/sepaction');
var stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
var loginSession = require('../../../../app/loginsession');
/**
 * Helper class for MyTeam grid view
 */
var HelpExaminersHelper = (function (_super) {
    __extends(HelpExaminersHelper, _super);
    function HelpExaminersHelper() {
        _super.apply(this, arguments);
    }
    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    HelpExaminersHelper.prototype.generateRowDefinion = function (teamManagementTabData, teamManagementTab) {
        this._teamManagementListCollection = Immutable.List();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        this._teamManagementListCollection =
            this.getRowDefinionForHelpExaminer(teamManagementTabData);
        return this._teamManagementListCollection;
    };
    /**
     * Generate frozen row body is used for generating row collection for my team or help other examiners grid
     * @param examinerListData - type of the examiner data
     * @param teamManagementTab - type of team management tab
     * @returns grid row collection.
     */
    HelpExaminersHelper.prototype.generateFrozenRowBody = function (examinerListData, teamManagementTab) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        var _teamManagementListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(examinerListData, teamManagementTab);
        return _teamManagementListFrozenRowBodyCollection;
    };
    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    HelpExaminersHelper.prototype.getFrozenRowBodyForListView = function (teamManagementTabData, teamMangementTab) {
        var _this = this;
        var _teamManagementListRowHeaderCellcollection = Array();
        var _teamManagementRowCollection = Array();
        var _frozenColumn;
        var componentPropsJson;
        var _teamManagementListCell;
        var key;
        var cssClass;
        if (teamManagementTabData != null) {
            var gridSeq_1 = teamManagementTabData.keySeq();
            teamManagementTabData.map(function (teamGridData, index) {
                _teamManagementListRowHeaderCellcollection = new Array();
                var gridColumns = _this.getGridColumns(_this.resolvedGridColumnsJson, teamMangementTab, true);
                var gridColumnLength = gridColumns.length;
                // Getting the team management list columns columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _frozenColumn = gridColumns[gridColumnCount].GridColumn;
                    _teamManagementListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    switch (_frozenColumn) {
                        case gridColumnNames.Examiner:
                            key = gridSeq_1.get(index) + '_Examiner_' + gridColumnCount;
                            _teamManagementListCell.columnElement =
                                _this.getHelpExaminerColumnElement(teamGridData, componentPropsJson, key);
                            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                            _teamManagementListCell.setCellStyle(cellStyle);
                            _teamManagementListRowHeaderCellcollection.push(_teamManagementListCell);
                            cssClass = 'row';
                            break;
                    }
                }
                // Creating the table row collection.
                _teamManagementRowCollection.push(_this.getGridRow(teamGridData.examinerId, _teamManagementListRowHeaderCellcollection, undefined, cssClass));
            });
        }
        var _teamManagementListFrozenRowBodyCollection = Immutable.fromJS(_teamManagementRowCollection);
        return _teamManagementListFrozenRowBodyCollection;
    };
    /**
     * Returns the row definition for my team data
     * @param teamManagementTabData
     */
    HelpExaminersHelper.prototype.getRowDefinionForHelpExaminer = function (teamManagementTabData) {
        var _this = this;
        var _teamManagementRowCollection = Array();
        var _teamManagementRowHeaderCellcollection = Array();
        var _helpExaminerColumn;
        var componentPropsJson;
        var _helpExaminerCell;
        var key;
        if (teamManagementTabData != null) {
            var gridSeq_2 = teamManagementTabData.keySeq();
            teamManagementTabData.map(function (examinerData, index) {
                // Getting the team management data row
                var gridColumns = _this.resolvedGridColumnsJson.teammanagement.helpexaminers.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _teamManagementRowHeaderCellcollection = new Array();
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _helpExaminerColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _helpExaminerCell = new gridCell();
                    switch (_helpExaminerColumn) {
                        case gridColumnNames.SEPAction:
                            key = gridSeq_2.get(index) + '_SEPAction_' + gridColumnCount;
                            _helpExaminerCell.columnElement = _this.getSEPActionElement(key, examinerData);
                            break;
                        case gridColumnNames.State:
                            key = gridSeq_2.get(index) + '_State_' + gridColumnCount;
                            _helpExaminerCell.columnElement = (_this.getHelpExaminerStateElement(examinerData.workflowStateId, examinerData.autoSuspensionCount, componentPropsJson, key));
                            break;
                        case gridColumnNames.Role:
                        case gridColumnNames.Supervisor:
                        case gridColumnNames.LockedDuration:
                        case gridColumnNames.TimeInCurrentState:
                        case gridColumnNames.LockedBy:
                        case gridColumnNames.TotalQigsActive:
                        case gridColumnNames.TotalQigsRequiring:
                            var helpExaminerColumnData = _this.getHelpExaminerData(examinerData, _helpExaminerColumn);
                            key = gridSeq_2.get(index) + '_' + _helpExaminerColumn + '_' + gridColumnCount;
                            _helpExaminerCell.columnElement = (_this.getGenericTeamElement(helpExaminerColumnData.textValue, helpExaminerColumnData.classValue, key));
                            break;
                    }
                    _helpExaminerCell.isHidden = _this.getCellVisibility(_helpExaminerColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _helpExaminerCell.setCellStyle(cellStyle);
                    _teamManagementRowHeaderCellcollection.push(_helpExaminerCell);
                }
                // Creating the grid row collection.
                _teamManagementRowCollection.push(_this.getGridRow(examinerData.examinerId, _teamManagementRowHeaderCellcollection, null, 'row'));
            });
        }
        this._teamManagementListCollection = Immutable.fromJS(_teamManagementRowCollection);
        return this._teamManagementListCollection;
    };
    /**
     * Returns the state element
     * @param examinerState
     */
    HelpExaminersHelper.prototype.getStateElement = function (examinerState, suspendedCount, propsNames, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            examinerState: examinerState,
            suspendedCount: suspendedCount,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(State, componentProps);
    };
    /**
     * Return the help examiner column
     * @param helpExaminerData
     * @param helpExaminerColumn
     */
    HelpExaminersHelper.prototype.getHelpExaminerData = function (helpExaminerData, helpExaminerColumn) {
        var textValue;
        var classValue;
        switch (helpExaminerColumn) {
            case gridColumnNames.Role:
                textValue = this.getRoleText(helpExaminerData.roleId);
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
                    textValue = stringFormatHelper.getFormattedExaminerName(helpExaminerData.lockedByInitials, helpExaminerData.lockedBySurname);
                }
                else if (helpExaminerData.lockedByExaminerId === loginSession.EXAMINER_ID) {
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
    };
    /**
     * Returns the state element
     * @param examinerState
     */
    HelpExaminersHelper.prototype.getHelpExaminerStateElement = function (examinerState, suspendedCount, propsNames, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            examinerState: examinerState,
            suspendedCount: suspendedCount,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(State, componentProps);
    };
    /**
     * Get SEP Action Element
     * @param seq
     * @param examinerData
     */
    HelpExaminersHelper.prototype.getSEPActionElement = function (seq, examinerData) {
        var sepAction = 0;
        if (examinerData.actions.indexOf(enums.SEPAction.Lock) > -1) {
            sepAction = enums.SEPAction.Lock;
        }
        else if (examinerData.actions.indexOf(enums.SEPAction.Unlock) > -1) {
            sepAction = enums.SEPAction.Unlock;
        }
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            sepAction: sepAction,
            examinerRoleId: examinerData.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            requestedByExaminerRoleId: qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
        };
        return React.createElement(SEPAction, componentProps);
    };
    return HelpExaminersHelper;
}(teamManagementHelperBase));
module.exports = HelpExaminersHelper;
//# sourceMappingURL=helpexaminershelper.js.map
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
var Immutable = require('immutable');
var State = require('../../../teammanagement/shared/state');
var classNames = require('classnames');
var qigStore = require('../../../../stores/qigselector/qigstore');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
/**
 * Helper class for MyTeam grid view
 */
var MyTeamHelper = (function (_super) {
    __extends(MyTeamHelper, _super);
    function MyTeamHelper() {
        _super.apply(this, arguments);
    }
    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    MyTeamHelper.prototype.generateRowDefinion = function (teamManagementTabData, teamManagementTab) {
        this._teamManagementListCollection = Immutable.List();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        this._teamManagementListCollection = this.getRowDefinionForMyTeam(teamManagementTabData);
        return this._teamManagementListCollection;
    };
    /**
     * Generate frozen row body is used for generating row collection for my team or help other examiners grid
     * @param examinerListData - type of the examiner data
     * @param teamManagementTab - type of team management tab
     * @returns grid row collection.
     */
    MyTeamHelper.prototype.generateFrozenRowBody = function (examinerListData, teamManagementTab) {
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
    MyTeamHelper.prototype.getFrozenRowBodyForListView = function (teamManagementTabData, teamMangementTab) {
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
                    // As per the requirement we need to implement the examiner tree level untill '6'
                    // above level 6 we will treat it as level 6
                    // Adding class to 'l' as decrement of examiner level since we are removing the PE from tree
                    // as per story 30995-Display examiner state column in My Team
                    switch (_frozenColumn) {
                        case gridColumnNames.Examiner:
                            key = gridSeq_1.get(index) + '_Examiner_' + gridColumnCount;
                            _teamManagementListCell.columnElement = _this.getExaminerColumnElement(teamGridData, componentPropsJson, key);
                            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                            _teamManagementListCell.setCellStyle(cellStyle);
                            _teamManagementListRowHeaderCellcollection.push(_teamManagementListCell);
                            cssClass = classNames('row show', {
                                'has-sub': teamGridData.hasSubordinates, 'open': teamGridData.isExpanded
                            }, 'l' + (teamGridData.examinerLevel <= 6 ? (teamGridData.examinerLevel - 1) : 6));
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
    MyTeamHelper.prototype.getRowDefinionForMyTeam = function (teamManagementTabData) {
        var _this = this;
        var _teamManagementRowCollection = Array();
        var _teamManagementRowHeaderCellcollection = Array();
        var _myTeamColumn;
        var componentPropsJson;
        var _myTeamCell;
        var key;
        if (teamManagementTabData != null) {
            var gridSeq_2 = teamManagementTabData.keySeq();
            teamManagementTabData.map(function (examinerData, index) {
                // Getting the team management data row
                var gridColumns = _this.resolvedGridColumnsJson.teammanagement.myteam.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _teamManagementRowHeaderCellcollection = new Array();
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _myTeamColumn = gridColumns[gridColumnCount].GridColumn;
                    var markSchemGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
                        qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
                    // Add the LockedDuration and LockedBy column only if the Senior examiner pool CC is on.
                    if ((_myTeamColumn === 'LockedDuration' || _myTeamColumn === 'LockedBy')
                        && configurableCharacteristicsHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, markSchemGroupId) !== 'true') {
                        continue;
                    }
                    // Add the ResponsesToReview column only if the Senior examiner pool CC is OFF.
                    if (_myTeamColumn === 'ResponsesToReview'
                        && configurableCharacteristicsHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, markSchemGroupId) === 'true') {
                        continue;
                    }
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _myTeamCell = new gridCell();
                    switch (_myTeamColumn) {
                        case gridColumnNames.TargetProgress:
                            // not displaying target and progress for examiners in awaiting standardisation state.
                            // Target progress to be displayed even if standardisation for qig is not complete
                            key = gridSeq_2.get(index) + '_TargetProgress_' + gridColumnCount;
                            _myTeamCell.columnElement = (_this.getTargetProgressElement(examinerData.examinerProgress, examinerData.examinerTarget, examinerData.markingTargetName, examinerData.markingModeId, componentPropsJson, key));
                            break;
                        case gridColumnNames.State:
                            key = gridSeq_2.get(index) + '_State_' + gridColumnCount;
                            _myTeamCell.columnElement = (_this.getStateElement(examinerData.examinerState, componentPropsJson, key));
                            break;
                        case gridColumnNames.LockedDuration:
                            key = gridSeq_2.get(index) + '_LockedDuration_' + gridColumnCount;
                            _myTeamCell.columnElement = _this.getLockedDurationElement(examinerData.lockedDuration);
                            break;
                        case gridColumnNames.LockedBy:
                            key = gridSeq_2.get(index) + '_LockedBy_' + gridColumnCount;
                            _myTeamCell.columnElement = _this.getLockedByElement(examinerData.lockedByExaminerName);
                            break;
                        case gridColumnNames.ResponsesToReview:
                            key = gridSeq_2.get(index) + '_ResponsesToReview_' + gridColumnCount;
                            _myTeamCell.columnElement = (_this.getGenericTeamElement(_this.getResponsesToReviewCount(examinerData), gridColumns[gridColumnCount].CssClass, key));
                            break;
                        case gridColumnNames.TimesSuspended:
                            key = gridSeq_2.get(index) + '_TimesSuspended_' + gridColumnCount;
                            _myTeamCell.columnElement = (_this.getGenericTeamElement(examinerData.suspendedCount.toString(), gridColumns[gridColumnCount].CssClass, key));
                            break;
                        default:
                    }
                    _myTeamCell.isHidden = _this.getCellVisibility(_myTeamColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _myTeamCell.setCellStyle(cellStyle);
                    _teamManagementRowHeaderCellcollection.push(_myTeamCell);
                }
                // As per the requirement we need to implement the examiner tree level untill '6'
                // above level 6 we will treat it as level 6
                var cssClass = classNames('row show', {
                    'has-sub': examinerData.hasSubordinates, 'open': examinerData.isExpanded
                }, 'l' + (examinerData.examinerLevel <= 6 ? (examinerData.examinerLevel - 1) : 6));
                // Creating the grid row collection.
                _teamManagementRowCollection.push(_this.getGridRow(examinerData.examinerId, _teamManagementRowHeaderCellcollection, null, cssClass));
            });
        }
        this._teamManagementListCollection = Immutable.fromJS(_teamManagementRowCollection);
        return this._teamManagementListCollection;
    };
    /**
     * Returns the state element
     * @param examinerState
     */
    MyTeamHelper.prototype.getStateElement = function (examinerState, propsNames, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            examinerState: examinerState,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(State, componentProps);
    };
    /**
     * Gets the number of responses to be reviewed for a particular examiner
     * @param examinerData
     */
    MyTeamHelper.prototype.getResponsesToReviewCount = function (examinerData) {
        if (!examinerData ||
            examinerData.responsesToReviewCount === undefined ||
            examinerData.responsesToReviewCount === null ||
            examinerData.responsesToReviewCount === 0) {
            return '';
        }
        else {
            return examinerData.responsesToReviewCount.toString();
        }
    };
    return MyTeamHelper;
}(teamManagementHelperBase));
module.exports = MyTeamHelper;
//# sourceMappingURL=myteamhelper.js.map
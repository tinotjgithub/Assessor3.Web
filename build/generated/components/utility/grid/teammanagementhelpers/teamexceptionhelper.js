"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var teamManagementHelperBase = require('./teammanagementhelperbase');
var gridCell = require('../../../utility/grid/gridcell');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var teamManagementGridColumnsJson = require('../../../utility/grid/teammanagementgridcolumns.json');
var gridColumnNames = require('../gridcolumnnames');
var Immutable = require('immutable');
var localeStore = require('../../../../stores/locale/localestore');
var timeFormatHelper = require('../../../../utility/generic/timeformathelper');
/**
 * The Helper class for loading the excption List
 * @param {Immutable.List<GridData>} teamManagementTabData
 * @param {enums.TeamManagement} teamManagementTab
 * @returns
 */
var TeamExceptionHelper = (function (_super) {
    __extends(TeamExceptionHelper, _super);
    function TeamExceptionHelper() {
        _super.apply(this, arguments);
    }
    /**
     * Generate row definition for Exceptions
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    TeamExceptionHelper.prototype.generateRowDefinion = function (teamManagementTabData, teamManagementTab) {
        this._teamManagementListCollection = Immutable.List();
        // Get the grid columns and rows from the teammanagement Json
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        this._teamManagementListCollection =
            this.getRowDefinionForExceptions(teamManagementTabData);
        return this._teamManagementListCollection;
    };
    /**
     * Returns the row definition for my team data
     * @param teamManagementTabData
     */
    TeamExceptionHelper.prototype.getRowDefinionForExceptions = function (teamManagementTabData) {
        var _this = this;
        var _teamManagementRowCollection = Array();
        var _teamManagementRowHeaderCellcollection = Array();
        var _exceptionColumn;
        var componentPropsJson;
        var _exceptionCell;
        var key;
        if (teamManagementTabData != null) {
            var gridSeq_1 = teamManagementTabData.keySeq();
            teamManagementTabData.map(function (exceptionData, index) {
                // Getting the team management data row
                var gridColumns = _this.resolvedGridColumnsJson.teammanagement.exceptions.detailview.GridColumns;
                var gridColumnLength = gridColumns.length;
                _teamManagementRowHeaderCellcollection = new Array();
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _exceptionColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _exceptionCell = new gridCell();
                    key = gridSeq_1.get(index) + '_' + _exceptionColumn + '_' + gridColumnCount;
                    _exceptionCell.columnElement = (_this.getGenericTeamElement(_this.getExceptionData(exceptionData, _exceptionColumn), gridColumns[gridColumnCount].CssClass, key));
                    _exceptionCell.isHidden = _this.getCellVisibility(_exceptionColumn);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _exceptionCell.setCellStyle(cellStyle);
                    _teamManagementRowHeaderCellcollection.push(_exceptionCell);
                }
                //
                // Creating the grid row collection.
                _teamManagementRowCollection.push(_this.getGridRow(exceptionData.exceptionId, _teamManagementRowHeaderCellcollection, null, 'row'));
            });
        }
        this._teamManagementListCollection = Immutable.fromJS(_teamManagementRowCollection);
        return this._teamManagementListCollection;
    };
    /**
     * Generate frozen row body is used for generating row collection for my team or help other examiners grid
     * @param examinerListData - type of the examiner data
     * @param teamManagementTab - type of team management tab
     * @returns grid row collection.
     */
    TeamExceptionHelper.prototype.generateFrozenRowBody = function (exceptionData, teamManagementTab) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        var _exceptionListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(exceptionData, teamManagementTab);
        return _exceptionListFrozenRowBodyCollection;
    };
    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    TeamExceptionHelper.prototype.getFrozenRowBodyForListView = function (teamManagementTabData, teamMangementTab) {
        var _this = this;
        var _exceptionListRowHeaderCellcollection = Array();
        var _teamManagementRowCollection = Array();
        var _frozenColumn;
        var componentPropsJson;
        var _exceptionListCell;
        var key;
        var cssClass;
        if (teamManagementTabData != null) {
            var gridSeq_2 = teamManagementTabData.keySeq();
            teamManagementTabData.map(function (teamGridData, index) {
                _exceptionListRowHeaderCellcollection = new Array();
                var gridColumns = _this.getGridColumns(_this.resolvedGridColumnsJson, teamMangementTab, true);
                var gridColumnLength = gridColumns.length;
                // Getting the team management list columns columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _frozenColumn = gridColumns[gridColumnCount].GridColumn;
                    _exceptionListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    // As per the requirement we need to implement the examiner tree level untill '6'
                    // above level 6 we will treat it as level 6
                    // Adding class to 'l' as decrement of examiner level since we are removing the PE from tree 
                    // as per story 30995-Display examiner state column in My Team
                    key = gridSeq_2.get(index) + '_' + gridColumns[gridColumnCount].GridColumn + '_' + gridColumnCount;
                    var componentProps = void 0;
                    componentProps = {
                        id: key,
                        key: key,
                        elementId: '5' + teamGridData.exceptionId,
                        className: (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '',
                        componentName: gridColumns[gridColumnCount].GridColumn
                    };
                    _exceptionListCell.columnElement = _this.getTeamHyperLinkElement(componentProps);
                    var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _exceptionListCell.setCellStyle(cellStyle);
                    _exceptionListRowHeaderCellcollection.push(_exceptionListCell);
                    break;
                }
                // Creating the table row collection.
                _teamManagementRowCollection.push(_this.getGridRow(teamGridData.exceptionId, _exceptionListRowHeaderCellcollection, undefined, 'row'));
            });
        }
        var _exceptionListFrozenRowBodyCollection = Immutable.fromJS(_teamManagementRowCollection);
        return _exceptionListFrozenRowBodyCollection;
    };
    /**
     * Get the data based on the column
     * @param {UnActionedExceptionDetails} exceptionData
     * @param {any} exceptionColumn
     * @returns
     */
    TeamExceptionHelper.prototype.getExceptionData = function (exceptionData, exceptionColumn) {
        switch (exceptionColumn) {
            case gridColumnNames.Examiner:
                if (exceptionData.initials && exceptionData.surname) {
                    return this.getFormattedExaminerName(exceptionData.initials, exceptionData.surname);
                }
                return '';
            case gridColumnNames.ExceptionId:
                return exceptionData.exceptionId.toString();
            case gridColumnNames.ExceptionType:
                return localeStore.instance.TranslateText('generic.exception-types.' +
                    exceptionData.exceptionType.toString() + '.name');
            case gridColumnNames.TimeOpen:
                return timeFormatHelper.convertMinutesToHoursOrDays(exceptionData.timeOpen);
            default:
                return null;
        }
    };
    return TeamExceptionHelper;
}(teamManagementHelperBase));
module.exports = TeamExceptionHelper;
//# sourceMappingURL=teamexceptionhelper.js.map
"use strict";
var React = require('react');
var gridRow = require('../../../utility/grid/gridrow');
var Immutable = require('immutable');
var gridCell = require('../../../utility/grid/gridcell');
var enums = require('../../enums');
var GenericComponentWrapper = require('../genericcomponentwrapper');
var ColumnHeader = require('../../../worklist/shared/columnheader');
var gridColumnNames = require('../gridcolumnnames');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var teamManagementGridColumnsJson = require('../../../utility/grid/teammanagementgridcolumns.json');
var teamCellElement = require('../../../teammanagement/shared/teamcellelement');
var localeStore = require('../../../../stores/locale/localestore');
var Examiner = require('../../../teammanagement/shared/examiner');
var TeamHyperLinkElement = require('../../../teammanagement/shared/teamhyperlinkelement');
var TargetProgress = require('../../../teammanagement/shared/targetprogress');
var classNames = require('classnames');
var State = require('../../../teammanagement/shared/state');
var LockedBy = require('../../../teammanagement/shared/lockedby');
var qigStore = require('../../../../stores/qigselector/qigstore');
var LockedDuration = require('../../../teammanagement/shared/lockedduration');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
var loginSession = require('../../../../app/loginsession');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var ccValues = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');
/**
 * Helper class for Team management implementation.
 */
var TeamManagementHelperBase = (function () {
    function TeamManagementHelperBase() {
        this._dateLengthInPixel = 0;
    }
    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    TeamManagementHelperBase.prototype.generateRowDefinion = function (teamManagementTabData, teamManagementTab) {
        return this._teamManagementListCollection;
    };
    /**
     * Generates the header Table headers for myTeam and Help other examiners tab
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    TeamManagementHelperBase.prototype.generateTableHeader = function (teamManagementTab, comparerName, sortDirection, tabData) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        var _teamManagementTabHeaderCollection = this.getTableHeader(teamManagementTab, comparerName, sortDirection, tabData);
        return _teamManagementTabHeaderCollection;
    };
    /**
     * Is used for generating row header collection for team management tabs
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     */
    TeamManagementHelperBase.prototype.generateFrozenRowHeader = function (teamManagementTab, comparerName, sortDirection, isSortable) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        var _teamMangementFrozenRowHeaderCollection = this.getFrozenRowHeaderForListView(teamManagementTab, comparerName, sortDirection, isSortable);
        return _teamMangementFrozenRowHeaderCollection;
    };
    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    TeamManagementHelperBase.prototype.getGenericTeamElement = function (textValue, classValue, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue,
            classValue: classValue
        };
        return React.createElement(teamCellElement, componentProps);
    };
    /**
     * Get the HyperLink element
     * @param {any} componentProps
     * @returns
     */
    TeamManagementHelperBase.prototype.getTeamHyperLinkElement = function (componentProps) {
        return React.createElement(TeamHyperLinkElement, componentProps);
    };
    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    TeamManagementHelperBase.prototype.getExaminerColumnElement = function (examinerData, propsNames, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            examinerId: examinerData.examinerId,
            examinerRoleId: examinerData.examinerRoleId,
            examinerName: examinerData.examinerName,
            hasSub: examinerData.hasSubordinates,
            isCoordinationCompleted: examinerData.coordinationComplete,
            isExpanded: examinerData.isExpanded,
            examinerState: examinerData.examinerState
        };
        return React.createElement(Examiner, componentProps);
    };
    /**
     * create a wraper for grid column
     * @param elements
     * @param className
     * @param seq
     */
    TeamManagementHelperBase.prototype.getWrappedColumn = function (elements, className, seq) {
        var componentProps;
        var _workListCell;
        var _gridCell = new gridCell();
        var element;
        componentProps = {
            key: seq,
            divClassName: className,
            componentList: elements
        };
        _workListCell = new gridCell();
        _workListCell.columnElement = React.createElement(GenericComponentWrapper, componentProps);
        return _workListCell;
    };
    /**
     * creating grid columns collection
     * @param gridgridLeftColumn
     * @param gridMiddleColumn
     * @param key
     * @param gridRightColumn - to display AMD and TMD based on Accuracy Indicator
     * @returns grid cell collection.
     */
    TeamManagementHelperBase.prototype.getGridCells = function (gridgridLeftColumn, gridMiddleColumn, key, gridRightColumn) {
        var _gridCells = new Array();
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridgridLeftColumn), 'col left-col', 'Grid_left_' + key));
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridMiddleColumn), 'col centre-col', 'Grid_centre_' + key));
        // create column for AMD and TMD only if gridRightColumn is not null
        if (gridRightColumn !== null) {
            _gridCells.push(this.getWrappedColumn(Immutable.List(gridRightColumn), 'col right-col', 'Grid_right_' + key));
        }
        return _gridCells;
    };
    /**
     * creating grid row
     * @param responseStatus
     * @param displayId
     * @param gridCells
     * @param accuracyType - to display AMD and TMD based on Accuracy Indicator
     * @returns grid row.
     */
    TeamManagementHelperBase.prototype.getGridRow = function (rowId, gridCells, additionalComponent, cssClass) {
        var _gridRow = new gridRow();
        var className = '';
        className = (cssClass) ? (className + ' ' + cssClass) : className;
        _gridRow.setRowStyle(className);
        _gridRow.setRowId(rowId);
        _gridRow.setCells(gridCells);
        _gridRow.setAdditionalElement(additionalComponent);
        return _gridRow;
    };
    /**
     * Group the elements based on the classNames.
     * @param {string} groupClassName
     * @param {string} seq
     * @returns the grouped JSX.Element.
     * @Summary groupClassName is the root element className and the column list may contain
     * the key same as groupClassName. Then that will not group the elements instead add it as
     * immediate child node.
     */
    TeamManagementHelperBase.prototype.groupColumnElements = function (groupClassName, seq) {
        var elements = Immutable.List();
        // loop through the class group names to find the child and group.
        for (var key in this._groupColumns) {
            if (this._groupColumns[key].values) {
                var componentProps_1 = {
                    id: this._groupColumns[key] + seq,
                    key: this._groupColumns[key] + seq,
                    divClassName: key,
                    componentList: this._groupColumns[key].values
                };
                // If the key same as main group className then we dont need to create a childnode.
                // treating it as immediate child of the main element.
                if (key !== groupClassName) {
                    elements = elements.push(React.createElement(GenericComponentWrapper, componentProps_1));
                }
                else {
                    this._groupColumns[key].values.map(function (x) {
                        elements = elements.push(x);
                    });
                }
            }
        }
        var componentProps = {
            id: groupClassName + seq,
            key: groupClassName + seq,
            divClassName: groupClassName,
            componentList: elements
        };
        return React.createElement(GenericComponentWrapper, componentProps);
    };
    /**
     * Start with fresh group.
     */
    TeamManagementHelperBase.prototype.emptyGroupColumns = function () {
        // start with a fresh list of column group set.
        this._groupColumns = {};
    };
    Object.defineProperty(TeamManagementHelperBase.prototype, "groupColumns", {
        /**
         * Return the group columns
         * @returns
         */
        get: function () {
            return this._groupColumns;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Mapping the each elements to a group.
     * This add the elements to a dictionary which has className as key
     * and list of elements that  grouped under the className.
     * @param {string} className
     * @param {JSX.Element} element
     */
    TeamManagementHelperBase.prototype.mapGroupColumns = function (className, element) {
        // If not group class has been added create a new object
        // otherwise add to the existing.
        if (this._groupColumns[className] === undefined) {
            this._groupColumns[className] = { values: Immutable.List() };
        }
        this._groupColumns[className].values = this._groupColumns[className].values.push(element);
    };
    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    TeamManagementHelperBase.prototype.getColumnHeaderElement = function (seq, headerText, gridColumn, isCurrentSort, isSortRequired, sortDirection, sortOption, tabData, teamManagementTab) {
        var componentProps;
        var width;
        if (gridColumn) {
            switch (gridColumn) {
                // we can specify the custom width against each columns
                case gridColumnNames.Supervisor:
                    if (teamManagementTab === enums.TeamManagement.HelpExaminers) {
                        width = { width: this.getMaxSupervisorColumnWidth(tabData) };
                    }
                    break;
                case gridColumnNames.Examiner:
                    if (teamManagementTab === enums.TeamManagement.Exceptions) {
                        width = { width: this.getMaxExaminerColumnWidth(tabData) };
                    }
                    break;
                case gridColumnNames.LockedBy:
                    if (teamManagementTab === enums.TeamManagement.HelpExaminers) {
                        width = { width: this.getMaxLockedByColumnWidth(tabData) };
                    }
                    break;
            }
        }
        componentProps = {
            key: seq,
            id: seq,
            headerText: headerText,
            width: width,
            sortDirection: sortDirection,
            isCurrentSort: isCurrentSort,
            isSortingRequired: isSortRequired,
            sortOption: sortOption
        };
        return React.createElement(ColumnHeader, componentProps);
    };
    /**
     * Returns the table headers for team management grids
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    TeamManagementHelperBase.prototype.getTableHeader = function (teamManagementTab, comparerName, sortDirection, tabData) {
        var _teamManagementListColumnHeaderCollection = Array();
        var _teamManagementListCell;
        var _teamManagementListRow = new gridRow();
        var _teamManagementListColumnHeaderCellcollection = new Array();
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, teamManagementTab);
        var gridColumnLength = gridColumns.length;
        // Getting the team management columns
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _teamManagementListCell = new gridCell();
            var _responseColumn = gridColumns[gridColumnCount].GridColumn;
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            // Add the LockedDuration and LockedBy column only if the Senior examiner pool CC is on.
            if ((_responseColumn === 'LockedDuration' || _responseColumn === 'LockedBy')
                && configurableCharacteristicsHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, markSchemeGroupId) !== 'true') {
                continue;
            }
            // Add the ResponsesToReview column only if the Senior examiner pool CC is OFF.
            if (_responseColumn === 'ResponsesToReview'
                && configurableCharacteristicsHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, markSchemeGroupId) === 'true') {
                continue;
            }
            var headerText = gridColumns[gridColumnCount].ColumnHeader;
            var _comparerName = gridColumns[gridColumnCount].ComparerName;
            var sortOption = gridColumns[gridColumnCount].SortOption;
            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            var key = 'columnHeader_' + gridColumnCount;
            _teamManagementListCell.columnElement = this.getColumnHeaderElement(key, headerText, _responseColumn, (comparerName === _comparerName), (gridColumns[gridColumnCount].Sortable === 'true'), sortDirection, enums.SortOption[sortOption], tabData, teamManagementTab);
            _teamManagementListCell.isHidden = this.getCellVisibility(_responseColumn);
            _teamManagementListCell.comparerName = _comparerName;
            _teamManagementListCell.sortDirection =
                this.getSortDirection((comparerName === _comparerName), sortDirection, enums.SortOption[sortOption]);
            _teamManagementListCell.isSortable = gridColumns[gridColumnCount].Sortable === 'true';
            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _teamManagementListCell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _teamManagementListColumnHeaderCellcollection.push(_teamManagementListCell);
        }
        _teamManagementListRow.setRowId(1);
        _teamManagementListRow.setCells(_teamManagementListColumnHeaderCellcollection);
        _teamManagementListColumnHeaderCollection.push(_teamManagementListRow);
        var _teamManagementListTableHeaderCollection = Immutable.fromJS(_teamManagementListColumnHeaderCollection);
        return _teamManagementListTableHeaderCollection;
    };
    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    TeamManagementHelperBase.prototype.getFrozenRowBodyForListView = function (teamManagementTabData, teamMangementTab) {
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
     * returns the table header elements for frozen table
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     */
    TeamManagementHelperBase.prototype.getFrozenRowHeaderForListView = function (teamManagementTab, comparerName, sortDirection, isSortable) {
        var _teamManagementListColumnHeaderCollection = Array();
        var _teamManagementListCell;
        var _teamManagementListRow = new gridRow();
        var _teamManagementListColumnHeaderCellcollection = new Array();
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, teamManagementTab, true);
        var key = 'frozenRowHeader';
        var gridColumnLength = gridColumns.length;
        // Getting the team management columns
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _teamManagementListCell = new gridCell();
            var headerColumn = gridColumns[gridColumnCount].GridColumn;
            var _comparerName = gridColumns[gridColumnCount].ComparerName;
            var hasSort = isSortable ? isSortable : gridColumns[gridColumnCount].Sortable === 'true';
            var sortOption = gridColumns[gridColumnCount].SortOption;
            _teamManagementListCell.columnElement = this.getColumnHeaderElement(key, localeStore.instance.TranslateText(gridColumns[gridColumnCount].ColumnHeader), headerColumn, (comparerName === _comparerName), hasSort, sortDirection, enums.SortOption[sortOption]);
            _teamManagementListCell.comparerName = _comparerName;
            _teamManagementListCell.sortDirection =
                this.getSortDirection((comparerName === _comparerName), sortDirection, enums.SortOption[sortOption]);
            _teamManagementListCell.isSortable = gridColumns[gridColumnCount].Sortable === 'true';
            _teamManagementListCell.setCellStyle(gridColumns[gridColumnCount].CssClass);
            // Creating the grid row collection.
            _teamManagementListColumnHeaderCellcollection.push(_teamManagementListCell);
        }
        _teamManagementListRow.setRowId(1);
        _teamManagementListRow.setCells(_teamManagementListColumnHeaderCellcollection);
        _teamManagementListColumnHeaderCollection.push(_teamManagementListRow);
        var _teamManagementFrozenRowHeaderCollection = Immutable.fromJS(_teamManagementListColumnHeaderCollection);
        return _teamManagementFrozenRowHeaderCollection;
    };
    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    TeamManagementHelperBase.prototype.getGridColumns = function (resolvedGridColumnsJson, teamManagementTab, isFrozen) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        switch (teamManagementTab) {
            case enums.TeamManagement.MyTeam:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.teammanagement.myteam.detailview.GridColumns
                    : resolvedGridColumnsJson.teammanagement.myteam.frozenRows.GridColumns;
                break;
            case enums.TeamManagement.Exceptions:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.teammanagement.exceptions.detailview.GridColumns
                    : resolvedGridColumnsJson.teammanagement.exceptions.frozenRows.GridColumns;
                break;
            case enums.TeamManagement.HelpExaminers:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.teammanagement.helpexaminers.detailview.GridColumns
                    : resolvedGridColumnsJson.teammanagement.helpexaminers.frozenRows.GridColumns;
                break;
        }
        return gridColumns;
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    TeamManagementHelperBase.prototype.getCellVisibility = function (column) {
        var isHidden = false;
        switch (column) {
            case gridColumnNames.TotalQigsActive:
            case gridColumnNames.TotalQigsRequiring:
                isHidden = !ccValues.sepQuestionPaperManagement || !this.isMultiQig();
                break;
        }
        return isHidden;
    };
    /**
     * Returns the target progress element
     * @param examinerProgress
     * @param examinerTarget
     * @param markingTargetName
     * @param propsNames
     * @param seq
     */
    TeamManagementHelperBase.prototype.getTargetProgressElement = function (examinerProgress, examinerTarget, markingTargetName, markingModeId, propsNames, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            examinerProgress: examinerProgress,
            examinerTarget: examinerTarget,
            markingTargetName: markingTargetName,
            markingModeId: markingModeId,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(TargetProgress, componentProps);
    };
    /**
     * Returns the state element
     * @param examinerState
     */
    TeamManagementHelperBase.prototype.getStateElement = function (examinerState, suspendedCount, propsNames, seq) {
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
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * Returns the Locked Duration Element
     * @param lockedDuration
     */
    TeamManagementHelperBase.prototype.getLockedDurationElement = function (lockedDuration) {
        var componentProps;
        componentProps = {
            lockedDuration: lockedDuration
        };
        return React.createElement(LockedDuration, componentProps);
    };
    /**
     * Returns locked by Examiner Element
     * @param lockedByExaminerID
     */
    TeamManagementHelperBase.prototype.getLockedByElement = function (lockedByExaminerName) {
        var componentProps;
        componentProps = {
            lockedByExaminerName: lockedByExaminerName
        };
        return React.createElement(LockedBy, componentProps);
    };
    /**
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * @param isCurrentSort
     * @param sortDirection
     */
    TeamManagementHelperBase.prototype.getSortDirection = function (isCurrentSort, sortDirection, sortOption) {
        if (isCurrentSort) {
            if (sortOption === undefined || sortOption === enums.SortOption.Both) {
                return (sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending;
            }
            else if (sortOption === enums.SortOption.Up) {
                return enums.SortDirection.Ascending;
            }
            else {
                return enums.SortDirection.Descending;
            }
        }
        else {
            return (sortOption === undefined || sortOption === enums.SortOption.Both) ? enums.SortDirection.Ascending :
                ((sortOption === enums.SortOption.Up) ? enums.SortDirection.Ascending : enums.SortDirection.Descending);
        }
    };
    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    TeamManagementHelperBase.prototype.getHelpExaminerColumnElement = function (examinerData, propsNames, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            examinerId: examinerData.examinerId,
            examinerRoleId: examinerData.examinerRoleId,
            examinerName: this.getFormattedExaminerName(examinerData.initials, examinerData.surname),
            isLockedByCurrentExaminer: examinerData.locked && examinerData.lockedByExaminerId === loginSession.EXAMINER_ID
        };
        return React.createElement(Examiner, componentProps);
    };
    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    TeamManagementHelperBase.prototype.getFormattedExaminerName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    /**
     * Return the Role text.(localized)
     */
    TeamManagementHelperBase.prototype.getRoleText = function (examinerRole) {
        var roleText = '';
        roleText = 'examiner-roles.' + enums.ExaminerRole[examinerRole];
        return localeStore.instance.TranslateText('generic.' + roleText);
    };
    /**
     * return the max width of supervisor column
     * @param tabData
     */
    TeamManagementHelperBase.prototype.getMaxSupervisorColumnWidth = function (tabData) {
        var maxWidth = 0;
        var examinerColumnClassName = 'small-text';
        if (tabData) {
            tabData.map(function (data, index) {
                var length = htmlUtilities.pixelLength(examinerColumnClassName, data.parentInitials + ' ' + data.parentSurname);
                if (length > maxWidth) {
                    maxWidth = length;
                }
            });
        }
        return maxWidth;
    };
    /**
     * return the max width of examiner column
     * @param teamManagementTab
     * @param tabData
     */
    TeamManagementHelperBase.prototype.getMaxExaminerColumnWidth = function (tabData) {
        var maxWidth = 0;
        var examinerColumnClassName = 'col-examiner';
        if (tabData) {
            tabData.map(function (data, index) {
                var length = htmlUtilities.pixelLength(examinerColumnClassName, data.initials + ' ' + data.surname);
                if (length > maxWidth) {
                    maxWidth = length;
                }
            });
        }
        return maxWidth;
    };
    /**
     * return the max width of lockedby column
     * @param teamManagementTab
     * @param tabData
     */
    TeamManagementHelperBase.prototype.getMaxLockedByColumnWidth = function (tabData) {
        var maxWidth = 0;
        var lockedbyExaminerColumn = 'col-locked-by';
        if (tabData) {
            tabData.map(function (data, index) {
                var length = htmlUtilities.pixelLength(lockedbyExaminerColumn, data.lockedByInitials + ' ' + data.lockedBySurname);
                if (length > maxWidth) {
                    maxWidth = length;
                }
            });
        }
        return maxWidth;
    };
    /**
     * return true only if the selected question paper is multi QIG.
     */
    TeamManagementHelperBase.prototype.isMultiQig = function () {
        var qigDetails = teamManagementStore.instance.teamOverviewCountData &&
            teamManagementStore.instance.teamOverviewCountData.qigDetails;
        return qigDetails && qigDetails.length > 1;
    };
    return TeamManagementHelperBase;
}());
module.exports = TeamManagementHelperBase;
//# sourceMappingURL=teammanagementhelperbase.js.map
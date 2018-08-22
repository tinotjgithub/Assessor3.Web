import React = require('react');
import gridRow = require('../../../utility/grid/gridrow');
import Immutable = require('immutable');
import gridCell = require('../../../utility/grid/gridcell');
import enums = require('../../enums');
import GenericComponentWrapper = require('../genericcomponentwrapper');
import ColumnHeader = require('../../../worklist/shared/columnheader');
import gridColumnNames = require('../gridcolumnnames');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
let teamManagementGridColumnsJson = require('../../../utility/grid/teammanagementgridcolumns.json');
import teamCellElement = require('../../../teammanagement/shared/teamcellelement');
import localHelper = require('../../../../utility/locale/localehelper');
import htmUtilities = require('../../../../utility/generic/htmlutilities');
import constants = require('../../constants');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import localeStore = require('../../../../stores/locale/localestore');
import Examiner = require('../../../teammanagement/shared/examiner');
import TeamHyperLinkElement = require('../../../teammanagement/shared/teamhyperlinkelement');
import TargetProgress = require('../../../teammanagement/shared/targetprogress');
import classNames = require('classnames');
import State = require('../../../teammanagement/shared/state');
import LockedBy = require('../../../teammanagement/shared/lockedby');
import qigStore = require('../../../../stores/qigselector/qigstore');
import LockedDuration = require('../../../teammanagement/shared/lockedduration');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
import loginSession = require('../../../../app/loginsession');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import ccValues = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import qigDetails = require('../../../../dataservices/teammanagement/typings/qigdetails');
import teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');

/**
 * Helper class for Team management implementation.
 */
class TeamManagementHelperBase {

    /* variable to holds the column details JSON*/
    public resolvedGridColumnsJson: any;

    /* Grid rows collection */
    public _teamManagementListCollection: Immutable.List<gridRow>;


    // Elements to hold a dictionary with key as class name to group and collection
    // of elements
    private _groupColumns: { [id: string]: { values: Immutable.List<JSX.Element> } };

    private _dateLengthInPixel: number = 0;


    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    public generateRowDefinion(teamManagementTabData: Immutable.List<GridData>,
        teamManagementTab: enums.TeamManagement): Immutable.List<gridRow> {
        return this._teamManagementListCollection;
    }

    /**
     * Generates the header Table headers for myTeam and Help other examiners tab
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    public generateTableHeader(teamManagementTab: enums.TeamManagement, comparerName: string,
        sortDirection: enums.SortDirection, tabData?: any): Immutable.List<gridRow> {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        let _teamManagementTabHeaderCollection = this.getTableHeader(teamManagementTab, comparerName, sortDirection, tabData);
        return _teamManagementTabHeaderCollection;
    }



    /**
     * Is used for generating row header collection for team management tabs
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     */
    public generateFrozenRowHeader(teamManagementTab: enums.TeamManagement,
        comparerName: string, sortDirection: enums.SortDirection, isSortable: boolean): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        let _teamMangementFrozenRowHeaderCollection = this.getFrozenRowHeaderForListView
            (teamManagementTab, comparerName, sortDirection, isSortable);

        return _teamMangementFrozenRowHeaderCollection;
    }

    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    public getGenericTeamElement(textValue: string, classValue: string, seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue,
            classValue: classValue
        };
        return React.createElement(teamCellElement, componentProps);
    }

    /**
     * Get the HyperLink element
     * @param {any} componentProps
     * @returns
     */
    public getTeamHyperLinkElement(componentProps: any): JSX.Element {

        return React.createElement(TeamHyperLinkElement, componentProps);
    }

    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    public getExaminerColumnElement(examinerData: ExaminerViewDataItem, propsNames: any, seq: string): JSX.Element {
        let componentProps: any;
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

    }

    /**
     * create a wraper for grid column
     * @param elements
     * @param className
     * @param seq
     */
    public getWrappedColumn(elements: Immutable.List<JSX.Element>, className: string, seq: string): gridCell {
        let componentProps: any;
        let _workListCell: gridCell;
        let _gridCell = new gridCell();
        let element: gridCell;

        componentProps = {
            key: seq,
            divClassName: className,
            componentList: elements
        };
        _workListCell = new gridCell();
        _workListCell.columnElement = React.createElement(GenericComponentWrapper, componentProps);
        return _workListCell;
    }

    /**
     * creating grid columns collection
     * @param gridgridLeftColumn
     * @param gridMiddleColumn
     * @param key
     * @param gridRightColumn - to display AMD and TMD based on Accuracy Indicator
     * @returns grid cell collection.
     */
    public getGridCells(
        gridgridLeftColumn: Array<JSX.Element>,
        gridMiddleColumn: Array<JSX.Element>,
        key: string,
        gridRightColumn?: Array<JSX.Element>): Array<gridCell> {
        let _gridCells: Array<gridCell> = new Array();
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridgridLeftColumn), 'col left-col', 'Grid_left_' + key));
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridMiddleColumn), 'col centre-col', 'Grid_centre_' + key));
        // create column for AMD and TMD only if gridRightColumn is not null
        if (gridRightColumn !== null) {
            _gridCells.push(this.getWrappedColumn(Immutable.List(gridRightColumn), 'col right-col', 'Grid_right_' + key));
        }
        return _gridCells;
    }

    /**
     * creating grid row
     * @param responseStatus
     * @param displayId
     * @param gridCells
     * @param accuracyType - to display AMD and TMD based on Accuracy Indicator
     * @returns grid row.
     */
    public getGridRow(
        rowId: number,
        gridCells: Array<gridCell>,
        additionalComponent?: JSX.Element,
        cssClass?: string): gridRow {

        let _gridRow: gridRow = new gridRow();
        let className = '';
        className = (cssClass) ? (className + ' ' + cssClass) : className;

        _gridRow.setRowStyle(className);
        _gridRow.setRowId(rowId);
        _gridRow.setCells(gridCells);
        _gridRow.setAdditionalElement(additionalComponent);
        return _gridRow;
    }

    /**
     * Group the elements based on the classNames.
     * @param {string} groupClassName
     * @param {string} seq
     * @returns the grouped JSX.Element.
     * @Summary groupClassName is the root element className and the column list may contain
     * the key same as groupClassName. Then that will not group the elements instead add it as
     * immediate child node.
     */
    public groupColumnElements(groupClassName: string, seq: string): JSX.Element {

        let elements = Immutable.List<JSX.Element>();

        // loop through the class group names to find the child and group.
        for (let key in this._groupColumns) {
            if (this._groupColumns[key].values) {
                let componentProps = {
                    id: this._groupColumns[key] + seq,
                    key: this._groupColumns[key] + seq,
                    divClassName: key,
                    componentList: this._groupColumns[key].values
                };

                // If the key same as main group className then we dont need to create a childnode.
                // treating it as immediate child of the main element.
                if (key !== groupClassName) {
                    elements = elements.push(React.createElement(GenericComponentWrapper, componentProps));
                } else {
                    this._groupColumns[key].values.map((x: JSX.Element) => {
                        elements = elements.push(x);
                    });
                }
            }
        }

        let componentProps = {
            id: groupClassName + seq,
            key: groupClassName + seq,
            divClassName: groupClassName,
            componentList: elements
        };
        return React.createElement(GenericComponentWrapper, componentProps);
    }

    /**
     * Start with fresh group.
     */
    public emptyGroupColumns(): void {
        // start with a fresh list of column group set.
        this._groupColumns = {};
    }

    /**
     * Return the group columns
     * @returns
     */
    public get groupColumns(): any {
        return this._groupColumns;
    }

    /**
     * Mapping the each elements to a group.
     * This add the elements to a dictionary which has className as key
     * and list of elements that  grouped under the className.
     * @param {string} className
     * @param {JSX.Element} element
     */
    public mapGroupColumns(className: string, element: JSX.Element): void {

        // If not group class has been added create a new object
        // otherwise add to the existing.
        if (this._groupColumns[className] === undefined) {
            this._groupColumns[className] = { values: Immutable.List<JSX.Element>() };
        }
        this._groupColumns[className].values = this._groupColumns[className].values.push(element);
    }

    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    protected getColumnHeaderElement(seq: string, headerText?: string, gridColumn?: string,
        isCurrentSort?: boolean, isSortRequired?: boolean, sortDirection?: enums.SortDirection,
        sortOption?: enums.SortOption, tabData?: any, teamManagementTab?: enums.TeamManagement): JSX.Element {

        let componentProps: any;
        let width: React.CSSProperties;
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
    }

    /**
     * Returns the table headers for team management grids
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    public getTableHeader(teamManagementTab: enums.TeamManagement, comparerName: string,
        sortDirection: enums.SortDirection, tabData: any): Immutable.List<gridRow> {

        let _teamManagementListColumnHeaderCollection = Array<gridRow>();
        let _teamManagementListCell: gridCell;
        let _teamManagementListRow = new gridRow();
        let _teamManagementListColumnHeaderCellcollection: Array<gridCell> = new Array();
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, teamManagementTab);
        let gridColumnLength = gridColumns.length;

        // Getting the team management columns
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {

            _teamManagementListCell = new gridCell();
            let _responseColumn = gridColumns[gridColumnCount].GridColumn;
            let markSchemeGroupId: number = qigStore.instance.selectedQIGForMarkerOperation ?
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

            let headerText = gridColumns[gridColumnCount].ColumnHeader;
            let _comparerName = gridColumns[gridColumnCount].ComparerName;
            let sortOption: string = gridColumns[gridColumnCount].SortOption;

            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            let key = 'columnHeader_' + gridColumnCount;


            _teamManagementListCell.columnElement = this.getColumnHeaderElement(
                key,
                headerText,
                _responseColumn,
                (comparerName === _comparerName),
                (gridColumns[gridColumnCount].Sortable === 'true'),
                sortDirection,
                enums.SortOption[sortOption],
                tabData,
                teamManagementTab
            );

            _teamManagementListCell.isHidden = this.getCellVisibility(_responseColumn);

            _teamManagementListCell.comparerName = _comparerName;
            _teamManagementListCell.sortDirection =
                this.getSortDirection((comparerName === _comparerName), sortDirection, enums.SortOption[sortOption]);
            _teamManagementListCell.isSortable = gridColumns[gridColumnCount].Sortable === 'true';

            let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _teamManagementListCell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _teamManagementListColumnHeaderCellcollection.push(_teamManagementListCell);
        }

        _teamManagementListRow.setRowId(1);
        _teamManagementListRow.setCells(_teamManagementListColumnHeaderCellcollection);
        _teamManagementListColumnHeaderCollection.push(_teamManagementListRow);

        let _teamManagementListTableHeaderCollection = Immutable.fromJS(_teamManagementListColumnHeaderCollection);
        return _teamManagementListTableHeaderCollection;
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
     * returns the table header elements for frozen table
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     */
    public getFrozenRowHeaderForListView(teamManagementTab: enums.TeamManagement,
        comparerName: string, sortDirection: enums.SortDirection, isSortable: boolean): Immutable.List<gridRow> {

        let _teamManagementListColumnHeaderCollection = Array<gridRow>();
        let _teamManagementListCell: gridCell;
        let _teamManagementListRow = new gridRow();
        let _teamManagementListColumnHeaderCellcollection: Array<gridCell> = new Array();
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, teamManagementTab, true);
        let key = 'frozenRowHeader';

        let gridColumnLength = gridColumns.length;

        // Getting the team management columns
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _teamManagementListCell = new gridCell();
            let headerColumn = gridColumns[gridColumnCount].GridColumn;
            let _comparerName = gridColumns[gridColumnCount].ComparerName;
            let hasSort = isSortable ? isSortable : gridColumns[gridColumnCount].Sortable === 'true';
            let sortOption: string = gridColumns[gridColumnCount].SortOption;

            _teamManagementListCell.columnElement = this.getColumnHeaderElement(
                key,
                localeStore.instance.TranslateText(gridColumns[gridColumnCount].ColumnHeader),
                headerColumn,
                (comparerName === _comparerName),
                hasSort,
                sortDirection,
                enums.SortOption[sortOption]
            );
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

        let _teamManagementFrozenRowHeaderCollection = Immutable.fromJS(_teamManagementListColumnHeaderCollection);

        return _teamManagementFrozenRowHeaderCollection;
    }

    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    protected getGridColumns(resolvedGridColumnsJson: any, teamManagementTab: enums.TeamManagement, isFrozen: boolean = false) {
        let gridColumns: any;
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
    }

    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    protected getCellVisibility(column: string): boolean {
        let isHidden: boolean = false;
        switch (column) {
            case gridColumnNames.TotalQigsActive:
            case gridColumnNames.TotalQigsRequiring:
                isHidden = !ccValues.sepQuestionPaperManagement || !this.isMultiQig();
                break;
        }
        return isHidden;
    }

    /**
     * Returns the target progress element
     * @param examinerProgress
     * @param examinerTarget
     * @param markingTargetName
     * @param propsNames
     * @param seq
     */
    public getTargetProgressElement(examinerProgress: number,
        examinerTarget: number,
        markingTargetName: string,
        markingModeId: enums.MarkingMode,
        propsNames: any,
        seq: string): JSX.Element {
        let componentProps: any;
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
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * Returns the Locked Duration Element
     * @param lockedDuration
     */
    public getLockedDurationElement(lockedDuration: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            lockedDuration: lockedDuration
        };
        return React.createElement(LockedDuration, componentProps);
    }

    /**
     * Returns locked by Examiner Element
     * @param lockedByExaminerID
     */
    public getLockedByElement(lockedByExaminerName: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            lockedByExaminerName: lockedByExaminerName
        };
        return React.createElement(LockedBy, componentProps);
    }

    /**
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * @param isCurrentSort
     * @param sortDirection
     */
    protected getSortDirection(isCurrentSort: boolean, sortDirection: enums.SortDirection, sortOption: enums.SortOption):
        enums.SortDirection {
        if (isCurrentSort) {
            if (sortOption === undefined || sortOption === enums.SortOption.Both) {
                return (sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending;
            } else if (sortOption === enums.SortOption.Up) {
                return enums.SortDirection.Ascending;
            } else {
                return enums.SortDirection.Descending;
            }
        } else {
            return (sortOption === undefined || sortOption === enums.SortOption.Both) ? enums.SortDirection.Ascending :
                ((sortOption === enums.SortOption.Up) ? enums.SortDirection.Ascending : enums.SortDirection.Descending);
        }
    }

    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    public getHelpExaminerColumnElement(examinerData: ExaminerDataForHelpExaminer, propsNames: any, seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            examinerId: examinerData.examinerId,
            examinerRoleId: examinerData.examinerRoleId,
            examinerName: this.getFormattedExaminerName(examinerData.initials, examinerData.surname),
            isLockedByCurrentExaminer: examinerData.locked && examinerData.lockedByExaminerId === loginSession.EXAMINER_ID
        };

        return React.createElement(Examiner, componentProps);
    }

    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    protected getFormattedExaminerName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    }

    /**
     * Return the Role text.(localized)
     */
    protected getRoleText(examinerRole: enums.ExaminerRole) {
        let roleText = '';
        roleText = 'examiner-roles.' + enums.ExaminerRole[examinerRole];
        return localeStore.instance.TranslateText('generic.' + roleText);
    }

    /**
     * return the max width of supervisor column
     * @param tabData
     */
    private getMaxSupervisorColumnWidth(tabData: any) {
        let maxWidth = 0;
        let examinerColumnClassName = 'small-text';
        if (tabData) {
            tabData.map((data: any, index: number) => {
                let length = htmlUtilities.pixelLength(examinerColumnClassName, data.parentInitials + ' ' + data.parentSurname);
                if (length > maxWidth) {
                    maxWidth = length;
                }
            });
        }
        return maxWidth;
    }

    /**
     * return the max width of examiner column
     * @param teamManagementTab
     * @param tabData
     */
    private getMaxExaminerColumnWidth(tabData: any) {
        let maxWidth = 0;
        let examinerColumnClassName = 'col-examiner';
        if (tabData) {
            tabData.map((data: any, index: number) => {
                let length = htmlUtilities.pixelLength(examinerColumnClassName, data.initials + ' ' + data.surname);
                if (length > maxWidth) {
                    maxWidth = length;
                }
            });
        }
        return maxWidth;
    }

    /**
     * return the max width of lockedby column
     * @param teamManagementTab
     * @param tabData
     */
    private getMaxLockedByColumnWidth(tabData: any) {
        let maxWidth = 0;
        let lockedbyExaminerColumn = 'col-locked-by';
        if (tabData) {
            tabData.map((data: any, index: number) => {
                let length = htmlUtilities.pixelLength(lockedbyExaminerColumn, data.lockedByInitials + ' ' + data.lockedBySurname);
                if (length > maxWidth) {
                    maxWidth = length;
                }
            });
        }
        return maxWidth;
    }

    /**
     * return true only if the selected question paper is multi QIG.
     */
    private isMultiQig(): boolean {
        let qigDetails: any = teamManagementStore.instance.teamOverviewCountData &&
            teamManagementStore.instance.teamOverviewCountData.qigDetails;
        return qigDetails && qigDetails.length > 1;
    }
}
export = TeamManagementHelperBase;
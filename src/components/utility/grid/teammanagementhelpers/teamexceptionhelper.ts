import teamManagementHelperBase = require('./teammanagementhelperbase');
import gridRow = require('../../../utility/grid/gridrow');
import gridCell = require('../../../utility/grid/gridcell');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
let teamManagementGridColumnsJson = require('../../../utility/grid/teammanagementgridcolumns.json');
import gridColumnNames = require('../gridcolumnnames');
import enums = require('../../enums');
import Immutable = require('immutable');
import classNames = require('classnames');
import localeStore = require('../../../../stores/locale/localestore');
import timeFormatHelper = require('../../../../utility/generic/timeformathelper');

/**
 * The Helper class for loading the excption List
 * @param {Immutable.List<GridData>} teamManagementTabData
 * @param {enums.TeamManagement} teamManagementTab
 * @returns
 */
class TeamExceptionHelper extends teamManagementHelperBase {
  /**
   * Generate row definition for Exceptions
   * @param teamManagementTabData - collection of examiner data
   * @param teamManagementTab - MyTeam or HelpOtherExaminers
   */
    public generateRowDefinion(teamManagementTabData: Immutable.List<GridData>,
        teamManagementTab: enums.TeamManagement): Immutable.List<gridRow> {

        this._teamManagementListCollection = Immutable.List<gridRow>();

        // Get the grid columns and rows from the teammanagement Json
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);
        this._teamManagementListCollection =
            this.getRowDefinionForExceptions(teamManagementTabData as Immutable.List<UnActionedExceptionDetails>);
        return this._teamManagementListCollection;
    }

    /**
     * Returns the row definition for my team data
     * @param teamManagementTabData
     */
    private getRowDefinionForExceptions(teamManagementTabData: Immutable.List<UnActionedExceptionDetails>): Immutable.List<gridRow> {
        let _teamManagementRowCollection = Array<gridRow>();
        let _teamManagementRowHeaderCellcollection = Array<gridCell>();

        let _exceptionColumn: any;
        let componentPropsJson: any;
        let _exceptionCell: gridCell;
        let key: string;

        if (teamManagementTabData != null) {
            let gridSeq = teamManagementTabData.keySeq();
            teamManagementTabData.map((exceptionData: UnActionedExceptionDetails, index) => {
                // Getting the team management data row
                let gridColumns = this.resolvedGridColumnsJson.teammanagement.exceptions.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _teamManagementRowHeaderCellcollection = new Array();
                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _exceptionColumn = gridColumns[gridColumnCount].GridColumn;

                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _exceptionCell = new gridCell();
                    key = gridSeq.get(index) + '_' + _exceptionColumn + '_' + gridColumnCount;
                    _exceptionCell.columnElement = (this.getGenericTeamElement(
                        this.getExceptionData(exceptionData, _exceptionColumn),
                        gridColumns[gridColumnCount].CssClass,
                        key));

                    _exceptionCell.isHidden = this.getCellVisibility(_exceptionColumn);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _exceptionCell.setCellStyle(cellStyle);
                    _teamManagementRowHeaderCellcollection.push(_exceptionCell);
                }

                //
                // Creating the grid row collection.
                _teamManagementRowCollection.push(
                    this.getGridRow(
                        exceptionData.exceptionId,
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
     * Generate frozen row body is used for generating row collection for my team or help other examiners grid
     * @param examinerListData - type of the examiner data
     * @param teamManagementTab - type of team management tab
     * @returns grid row collection.
     */
    public generateFrozenRowBody(exceptionData: any, teamManagementTab: enums.TeamManagement): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(teamManagementGridColumnsJson);

        let _exceptionListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(exceptionData, teamManagementTab);

        return _exceptionListFrozenRowBodyCollection;
    }

    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    public getFrozenRowBodyForListView(teamManagementTabData: Immutable.List<UnActionedExceptionDetails>,
        teamMangementTab: enums.TeamManagement): Immutable.List<gridRow> {
        let _exceptionListRowHeaderCellcollection = Array<gridCell>();
        let _teamManagementRowCollection = Array<gridRow>();
        let _frozenColumn: any;
        let componentPropsJson: any;
        let _exceptionListCell: gridCell;
        let key: string;
        let cssClass: string;
        if (teamManagementTabData != null) {
            let gridSeq = teamManagementTabData.keySeq();
            teamManagementTabData.map((teamGridData: UnActionedExceptionDetails, index) => {
                _exceptionListRowHeaderCellcollection = new Array();
                let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, teamMangementTab, true);
                let gridColumnLength = gridColumns.length;

                // Getting the team management list columns columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _frozenColumn = gridColumns[gridColumnCount].GridColumn;
                    _exceptionListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    // As per the requirement we need to implement the examiner tree level untill '6'
                    // above level 6 we will treat it as level 6
                    // Adding class to 'l' as decrement of examiner level since we are removing the PE from tree 
                    // as per story 30995-Display examiner state column in My Team

                    key = gridSeq.get(index) + '_' + gridColumns[gridColumnCount].GridColumn + '_' + gridColumnCount;
                    let componentProps: any;
                    componentProps = {
                        id: key,
                        key: key,
                        elementId: '5' + teamGridData.exceptionId,
                        className: (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '',
                        componentName: gridColumns[gridColumnCount].GridColumn
                    };
                    _exceptionListCell.columnElement = this.getTeamHyperLinkElement(componentProps);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _exceptionListCell.setCellStyle(cellStyle);
                    _exceptionListRowHeaderCellcollection.push(_exceptionListCell);
                    break;

                }

                // Creating the table row collection.
                _teamManagementRowCollection.push(
                    this.getGridRow(
                        teamGridData.exceptionId,
                        _exceptionListRowHeaderCellcollection,
                        undefined,
                        'row'
                    ));
            });
        }
        let _exceptionListFrozenRowBodyCollection = Immutable.fromJS(_teamManagementRowCollection);
        return _exceptionListFrozenRowBodyCollection;
    }

    /**
     * Get the data based on the column
     * @param {UnActionedExceptionDetails} exceptionData
     * @param {any} exceptionColumn
     * @returns
     */
    private getExceptionData(exceptionData: UnActionedExceptionDetails, exceptionColumn: any): string {
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
    }
}
export = TeamExceptionHelper;
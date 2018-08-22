import React = require('react');
import gridRow = require('../../../utility/grid/gridrow');
import Immutable = require('immutable');
import gridCell = require('../../../utility/grid/gridcell');
import localeStore = require('../../../../stores/locale/localestore');
import enums = require('../../enums');
import ColumnHeader = require('../../../worklist/shared/columnheader');
import gridColumnNames = require('../gridcolumnnames');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import SupportExaminerTextColumn = require('../../../adminsupport/shared/supportexaminertextcolumn');
import adminSupportInterface = require('../../../../utility/adminsupport/adminsupportinterface');
let adminSupportGridColumnsJson = require('../../../utility/grid/adminsupportgridcolumns.json');

/**
 * class for Admin Support Helper implementation
 */
class AdminSupportHelperBase implements adminSupportInterface {

	/* variable to holds the column details JSON*/
	public resolvedGridColumnsJson: any;

	/* Grid rows collection */
	public _supportExaminerListCollection: Immutable.List<gridRow>;

	private _dateLengthInPixel: number = 0;

    /**
     * GenerateTableHeader is used for generating header collection.
     * @param comparerName
     * @param sortDirection
     */
	public generateTableHeader(comparerName: string,
		sortDirection: enums.SortDirection): Immutable.List<gridRow> {
		this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(adminSupportGridColumnsJson);
		let _tableHeaderCollection = this.getTableHeader(comparerName, sortDirection);
		return _tableHeaderCollection;
	}

    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
	protected getColumnHeaderElement(seq: string, headerText?: string, gridColumn?: string,
		isCurrentSort?: boolean, isSortRequired?: boolean, sortDirection?: enums.SortDirection ): JSX.Element {

		let componentProps: any;
		componentProps = {
			key: seq,
			id: seq,
			headerText: headerText,
			sortDirection: sortDirection,
			isCurrentSort: isCurrentSort,
			isSortingRequired: isSortRequired
		};

		return React.createElement(ColumnHeader, componentProps);
	}

    /**
     * returns the table row collection for table header.
     */
	public getTableHeader(comparerName: string, sortDirection: enums.SortDirection): Immutable.List<gridRow> {
		let _columnHeaderCollection = Array<gridRow>();
		let _cell: gridCell;
		let _row = new gridRow();
		let _columnHeaderCellcollection: Array<gridCell> = new Array();
		let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson);
		let gridColumnLength = gridColumns.length;

		this.resetDynamicColumnSettings();

		for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {

			_cell = new gridCell();
			let _supportExaminerColumn = gridColumns[gridColumnCount].GridColumn;

			let headerText = gridColumns[gridColumnCount].ColumnHeader;
			let _comparerName = gridColumns[gridColumnCount].ComparerName;

			headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
			let key = 'columnHeader_' + gridColumnCount;


			_cell.columnElement = this.getColumnHeaderElement(
				key,
				headerText,
				_supportExaminerColumn,
				(comparerName === _comparerName),
				(gridColumns[gridColumnCount].Sortable === 'true'),
				sortDirection
			);

			_cell.comparerName = _comparerName;
			_cell.sortDirection = this.getSortDirection((comparerName === _comparerName), sortDirection);
			let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
			_cell.setCellStyle(cellStyle);
			// Creating the grid row collection.

			_columnHeaderCellcollection.push(_cell);
		}
		_row.setCells(_columnHeaderCellcollection);
		_columnHeaderCollection.push(_row);

		let _supportAdminTableHeaderCollection = Immutable.fromJS(_columnHeaderCollection);
		return _supportAdminTableHeaderCollection;
	}

    /**
     * returns the gridcolumns
     * @param resolvedGridColumnsJson
     */
	protected getGridColumns(resolvedGridColumnsJson: any) {
		let gridColumns: any;
		gridColumns = resolvedGridColumnsJson.adminsupport.AdminSupportExaminer.GridColumns;
		return gridColumns;
	}

	/**
	 * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
	 * @param isCurrentSort
	 * @param sortDirection
	 */
	protected getSortDirection(isCurrentSort: boolean, sortDirection: enums.SortDirection): enums.SortDirection {
		return ((isCurrentSort === true) ?
			((sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending)
			: enums.SortDirection.Ascending);
	}

    /**
     * Reset dynamic column
     */
	protected resetDynamicColumnSettings() {
		this._dateLengthInPixel = 0;
	}

    /**
     * creating grid row
     * @param uniqueId
     * @param gridCells
     * @param additionalComponent
     */
	public getGridRow(
		uniqueId: string,
		gridCells: Array<gridCell>,
        additionalComponent?: JSX.Element,
        cssClass?: string): gridRow {
        let _gridRow: gridRow = new gridRow();
        let className = this.setRowStyle();
        className = (cssClass) ? (className + ' ' + cssClass) : className;

        _gridRow.setRowStyle(className);
		_gridRow.setRowId(parseFloat(uniqueId));
		_gridRow.setCells(gridCells);
		_gridRow.setAdditionalElement(additionalComponent);
		return _gridRow;
    }

    /**
     * Set row style to amber if the response has blocking exceptions or other reasons
     * @param responseStatus
     */
    public setRowStyle(): string {
        return 'row';
    }

	/**
	 * Generate Examiners Row Definition
	 * @param adminSupportExaminerList
	 */
	public generateExaminersRowDefinition(adminSupportExaminerList: SupportAdminExaminerList) {
		this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(adminSupportGridColumnsJson);
		this._supportExaminerListCollection = Immutable.List<gridRow>();

		let _supportExaminerRowCollection = Array<gridRow>();
		let _supportExaminerRowHeaderCellcollection = Array<gridCell>();
		let _supportExaminerColumn: any;
		let _examinerListCell: gridCell;
		let key: string;
		if (adminSupportExaminerList != null) {
			let gridSeq = adminSupportExaminerList.getSupportExaminerList.keySeq();
			let _supportExaminerListData = adminSupportExaminerList.getSupportExaminerList.toArray();
			let supportExaminerListLength = _supportExaminerListData.length;
			for (let supportExaminerListCount = 0; supportExaminerListCount < supportExaminerListLength; supportExaminerListCount++) {
				// Getting the supportExaminer data row
				let gridColumns = this.resolvedGridColumnsJson.adminsupport.AdminSupportExaminer.GridColumns;
				let gridColumnLength = gridColumns.length;
				_supportExaminerRowHeaderCellcollection = new Array();

				// instead of accessing _supportExaminerListData[supportExaminerListCount] collection inside loop, its accessed
				// outside the loop globally
				let supportExaminerData: SupportAdminExaminers = _supportExaminerListData[supportExaminerListCount];
				for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
					_supportExaminerColumn = gridColumns[gridColumnCount].GridColumn;
					_examinerListCell = new gridCell();
					switch (_supportExaminerColumn) {
						case gridColumnNames.Name:
							key = gridSeq.get(supportExaminerListCount) + '_Name_' + gridColumnCount;
							_examinerListCell.columnElement = (this.getGenericTextElement(supportExaminerData.initials + ' ' + supportExaminerData.surname,
								key, false));
							break;
						case gridColumnNames.Username:
							key = gridSeq.get(supportExaminerListCount) + '_Username_' + gridColumnCount;
							_examinerListCell.columnElement = (this.getGenericTextElement(supportExaminerData.liveUserName, key, false));
							break;
						case gridColumnNames.ExaminerCode:
							key = gridSeq.get(supportExaminerListCount) + '_ExaminerCode_' + gridColumnCount;
							_examinerListCell.columnElement = (this.getGenericTextElement(supportExaminerData.employeeNum, key, true));
							break;
						default:
					}
					let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
					_examinerListCell.setCellStyle(cellStyle);
					_supportExaminerRowHeaderCellcollection.push(_examinerListCell);
				}
				_supportExaminerRowCollection.push(
					this.getGridRow(
						supportExaminerData.examinerId.toString(),
                        _supportExaminerRowHeaderCellcollection, undefined, (supportExaminerData.isSelected ? 'selected' : '')
					));
			}
		}
		this._supportExaminerListCollection = Immutable.fromJS(_supportExaminerRowCollection);
		return this._supportExaminerListCollection;
	}

	/**
	 * Get the text value for Grid Column
	 * @param textValue
	 * @param seq
	 */
	public getGenericTextElement(textValue: string, seq: string, classText: boolean): JSX.Element {
		let componentProps: any;
		componentProps = {
			key: seq,
			id: seq,
			textValue: textValue,
			classText: classText
		};
		return React.createElement(SupportExaminerTextColumn, componentProps);
	}
}
export = AdminSupportHelperBase;
import React = require('react');
import gridRow = require('../../../utility/grid/gridrow');
import gridCell = require('../../../utility/grid/gridcell');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
let awardingCandidateGridColumnsJson = require('../../../utility/grid/awardingcandidatedetailscolumns.json');
import localeStore = require('../../../../stores/locale/localestore');
import awardingStore = require('../../../../stores/awarding/awardingstore');
import gridColumnNames = require('../../grid/gridcolumnnames');
import enums = require('../../enums');
import Immutable = require('immutable');
import classNames = require('classnames');
import ColumnHeader = require('../../../worklist/shared/columnheader');
import AwardingFrozenComponent = require('../../../awarding/shared/awardingfrozencomponent');
import CenterNumberColumn = require('../../../awarding/shared/awardingcenternumbercolumn');
import AwardingGenericTextColumn = require('../../../awarding/shared/awardinggenerictextcolumn');
import awardingActionCreator = require('../../../../actions/awarding/awardingactioncreator');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import awardingHelper = require('../awardinghelper');

/**
 * AwardingCandidateDetailsHelper
 */
class AwardingCandidateDetailsHelper {

    private _awardingCandidateDetailsCollection: Immutable.List<gridRow>;

    /* variable to holds the column details JSON*/
    public resolvedGridColumnsJson: any;

    private _expandedOrCollapsedItemList = Immutable.Map<string, Immutable.Map<string, boolean>>();
    private _canBindTotalmarkCell: boolean = false;
    private _canBindGradeCell: boolean = false;

    /**
     * set teh awarding collection
     * @param awardingCanidateDetailsItems
     */
    public generateAwardingGridItems(awardingCanidateDetailsItems: Immutable.List<AwardingCandidateDetails>,
        viewType: enums.AwardingViewType,
        expandedItemList: Immutable.Map<string, Immutable.Map<string, boolean>>,
        callback: Function): any {
        let sortedAwardingDetailsItem: Immutable.List<GridData>;
        let _awardingCandidateFrozenBodyRowCellCollection = Array<gridCell>();
        let _awardingFrozenBodyRowCollection = Array<gridRow>();
        let _awardingCandidateBodyRow = Array<gridRow>();
        let _awardingBodyRowCollection = Array<gridRow>();
        let _frozenColumn: any;
        let componentPropsJson: any;
        let key: string;
        let cssClass: string;
        let previousGrade: any;
        let previousTotalmark: any;
        let awardingBodyRows: [Array<gridRow>, Array<gridRow>];
        let awardingDetailsItem: any;

        if (viewType === enums.AwardingViewType.Grade) {
            // ordering the collection based on grade and total mark
            awardingDetailsItem = awardingCanidateDetailsItems.sort(function (x, y) {
                return x.grade.localeCompare(y.grade) || x.totalMark - y.totalMark;
            });
        } else {
            // ordering the collection based on grade and total mark
            awardingDetailsItem = awardingCanidateDetailsItems.sort(function (x, y) {
                return x.totalMark - y.totalMark || x.grade.localeCompare(y.grade);
            });
        }
        sortedAwardingDetailsItem = Immutable.List<GridData>(awardingDetailsItem);
        this._expandedOrCollapsedItemList = expandedItemList;

        let gridSeq = sortedAwardingDetailsItem.keySeq();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(awardingCandidateGridColumnsJson);
        sortedAwardingDetailsItem.map((awardingGridData: AwardingCandidateDetails, index) => {

            // creating the awarding frozen body rows as per the orderby type
            // and also creating the empty row for details view
            if (viewType === enums.AwardingViewType.Grade) {
                awardingBodyRows = this.generateFrozenBodyRowsForGradeView
                    (awardingGridData, index, gridSeq, previousGrade, previousTotalmark, expandedItemList, callback);
            } else if (viewType === enums.AwardingViewType.Totalmark) {
                awardingBodyRows = this.generateFrozenBodyRowsForTotalmarkView
                    (awardingGridData, index, gridSeq, previousGrade, previousTotalmark, expandedItemList, callback);
            }

            // adding frozen body row collection
            _awardingFrozenBodyRowCollection = _awardingFrozenBodyRowCollection.concat(awardingBodyRows[0]);
            // adding empty rows for details table cells while creating the frozen columns
            _awardingBodyRowCollection = _awardingBodyRowCollection.concat(awardingBodyRows[1]);


            // adding the awardiging details body row ,
            // we need to change the logic of getting the details body row while implementing expand option
            let isExpanded: boolean = false;
            switch (viewType) {
                case enums.AwardingViewType.Grade:
                    if (expandedItemList.count() > 0) {
                        let keys = expandedItemList.get(awardingGridData.grade);
                        isExpanded = keys ? !keys.get(awardingGridData.grade) ? false :
                            keys.get(awardingGridData.totalMark.toString()) : false;
                    }
                    break;
                case enums.AwardingViewType.Totalmark:
                    if (expandedItemList.count() > 0) {
                        let keys = expandedItemList.get(awardingGridData.totalMark.toString());
                        isExpanded = keys ? !keys.get(awardingGridData.totalMark.toString()) ?
                            false : keys.get(awardingGridData.grade) : false;
                    }
                    break;
            }

            if (isExpanded) {
                _awardingCandidateBodyRow = this.generateAwardingDetailsRow(
                    gridSeq, index, awardingGridData, 'row', this.resolvedGridColumnsJson, false, expandedItemList, true);

                // adding the table row collection.
                if (_awardingCandidateBodyRow[0]) {
                    _awardingBodyRowCollection.push(_awardingCandidateBodyRow[0]);
                }

                if (_awardingCandidateBodyRow[1]) {
                    _awardingFrozenBodyRowCollection.push(_awardingCandidateBodyRow[1]);
                }
            }

            // resetting the previous grade and total mark value
            previousGrade = awardingGridData.grade;
            previousTotalmark = awardingGridData.totalMark;
        });

        this._canBindGradeCell = false;
        this._canBindTotalmarkCell = false;
        return [Immutable.List<gridRow>(_awardingFrozenBodyRowCollection), Immutable.List<gridRow>(_awardingBodyRowCollection)];
    }

    /**
     *  generate awarding gradeview grid rows
     * @param awardingGridData
     * @param index
     * @param gridSeq
     */
    private generateFrozenBodyRowsForGradeView(awardingGridData: AwardingCandidateDetails, index: number,
        gridSeq: any, previousGrade: any, previousTotalmark: number,
        expandedItemList: Immutable.Map<string, Immutable.Map<string, boolean>>, callback: Function):
        [Array<gridRow>, Array<gridRow>] {
        let _awardingCandidateFrozenBodyRowCellCollection = Array<gridCell>();
        let _awardingFrozenBodyRowCollection = Array<gridRow>();
        let _awardingCandidateBodyRow = Array<gridRow>();
        let _awardingBodyRowCollection = Array<gridRow>();
        let _frozenColumn: any;
        let componentPropsJson: any;
        let key: string;
        let cssClass: string;
        let _previousGrade;
        let _previousTotalmark;

        // get columns for frozen table 
        let gridFrozenColumns = this.getGridColumns(this.resolvedGridColumnsJson, true, enums.AwardingViewType.Grade);
        let gridFrozenColumnLength = gridFrozenColumns.GridColumns.length;

        // get the column for normal table
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, false, enums.AwardingViewType.Totalmark);
        let gridColumnLength = gridColumns.length;

        for (let gridColumnCount = 0; gridColumnCount < gridFrozenColumnLength; gridColumnCount++) {
            _awardingCandidateFrozenBodyRowCellCollection = new Array();
            _frozenColumn = gridFrozenColumns.GridColumns[gridColumnCount].GridColumn;
            componentPropsJson = gridFrozenColumns.GridColumns[gridColumnCount].ComponentProps;
            switch (_frozenColumn) {
                case 'Grade':
                    if (previousGrade !== awardingGridData.grade) {
                        let isExpanded: boolean = false;
                        if (expandedItemList.count() > 0) {
                            let keys = expandedItemList.get(awardingGridData.grade);
                            isExpanded = keys ? keys.get(awardingGridData.grade) : false;
                            this._canBindTotalmarkCell = isExpanded;
                        }
                        cssClass = classNames('row classify-items-row', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l0');
                        _awardingCandidateFrozenBodyRowCellCollection.push(this.generateGradeCell
                            (gridSeq, index, gridColumnCount, key, gridFrozenColumns,
                            previousGrade, awardingGridData.grade, enums.AwardingViewType.Grade,
                            awardingGridData, isExpanded, true, awardingGridData.grade, false,
                            callback));

                        // Creating the table row collection for frozen.
                        _awardingFrozenBodyRowCollection.push(
                            this.getGridRow(
                                awardingGridData.awardingCandidateID,
                                _awardingCandidateFrozenBodyRowCellCollection,
                                undefined,
                                cssClass
                            ));

                        _awardingCandidateBodyRow = this.generateAwardingDetailsRow(
                            gridSeq, index, awardingGridData, classNames('row classify-items-row'),
                            this.resolvedGridColumnsJson, true, expandedItemList, false);

                        // Creating the table row collection for detail list.
                        if (_awardingCandidateBodyRow[0]) {
                            _awardingBodyRowCollection.push(_awardingCandidateBodyRow[0]);
                        }
                    }
                    break;
                case 'Total mark':

                    if (this._canBindTotalmarkCell) {
                        let isExpanded: boolean = false;
                        if (expandedItemList.count() > 0) {
                            let keys = expandedItemList.get(awardingGridData.grade);
                            isExpanded = keys ? keys.get(awardingGridData.totalMark.toString()) : false;
                        }

                        cssClass = classNames('row classify-items-row show', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l1');

                        if (previousTotalmark !== awardingGridData.totalMark ||
                            previousGrade !== awardingGridData.grade) {
                            _awardingCandidateFrozenBodyRowCellCollection.push(this.generateTotalmarkCell
                                (gridSeq, index, gridColumnCount, key, gridFrozenColumns, previousTotalmark,
                                awardingGridData.totalMark, enums.AwardingViewType.Grade,
                                awardingGridData, isExpanded, false, awardingGridData.grade, true, callback));
                            // Creating the table row collection.
                            _awardingFrozenBodyRowCollection.push(
                                this.getGridRow(
                                    awardingGridData.awardingCandidateID,
                                    _awardingCandidateFrozenBodyRowCellCollection,
                                    undefined,
                                    cssClass
                                ));

                            // adding the awardiging details body row ,
                            // we need to change the logic of getting the details body row while implementing expand option
                            _awardingCandidateBodyRow = this.generateAwardingDetailsRow(
                                gridSeq, index, awardingGridData, classNames('row classify-items-row'),
                                this.resolvedGridColumnsJson, true, expandedItemList, false);

                            // Creating the table row collection.
                            if (_awardingCandidateBodyRow[0]) {
                                _awardingBodyRowCollection.push(_awardingCandidateBodyRow[0]);
                            }
                        }
                    }
                    break;
            }
        }
        return [_awardingFrozenBodyRowCollection, _awardingBodyRowCollection];
    }

    /**
     * generateFrozenBodyRowsForTotalmarkView
     * @param awardingGridData
     * @param index
     * @param gridSeq
     * @param previousGrade
     */
    private generateFrozenBodyRowsForTotalmarkView(awardingGridData: AwardingCandidateDetails,
        index: number, gridSeq: any, previousGrade, previousTotalmark: any,
        expandedItemList: Immutable.Map<string, Immutable.Map<string, boolean>>, callback: Function): [Array<gridRow>, Array<gridRow>] {

        let _awardingCandidateFrozenBodyRowCellCollection = Array<gridCell>();
        let _awardingFrozenBodyRowCollection = Array<gridRow>();
        let _awardingCandidateBodyRow = Array<gridRow>();
        let _awardingBodyRowCollection = Array<gridRow>();
        let _frozenColumn: any;
        let componentPropsJson: any;
        let key: string;
        let cssClass: string;

        // get columns for frozen table 
        let gridFrozenColumns = this.getGridColumns(this.resolvedGridColumnsJson, true, enums.AwardingViewType.Totalmark);
        let gridFrozenColumnLength = gridFrozenColumns.GridColumns.length;

        // get the column for normal table
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, false);
        let gridColumnLength = gridColumns.length;

        for (let gridColumnCount = 0; gridColumnCount < gridFrozenColumnLength; gridColumnCount++) {
            _awardingCandidateFrozenBodyRowCellCollection = new Array();
            _frozenColumn = gridFrozenColumns.GridColumns[gridColumnCount].GridColumn;
            componentPropsJson = gridFrozenColumns.GridColumns[gridColumnCount].ComponentProps;
            switch (_frozenColumn) {
                case 'Total mark':
                    if (previousTotalmark !== awardingGridData.totalMark) {
                        let isExpanded: boolean = false;
                        if (expandedItemList.count() > 0) {
                            let keys = expandedItemList.get(awardingGridData.totalMark.toString());
                            isExpanded = keys ? keys.get(awardingGridData.totalMark.toString()) : false;
                            this._canBindGradeCell = isExpanded;
                        }

                        cssClass = classNames('row classify-items-row', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l0');

                        _awardingCandidateFrozenBodyRowCellCollection.push(this.generateTotalmarkCell
                            (gridSeq, index, gridColumnCount, key, gridFrozenColumns,
                            previousTotalmark, awardingGridData.totalMark, enums.AwardingViewType.Totalmark,
                            awardingGridData, isExpanded, true, awardingGridData.totalMark.toString(), false, callback));

                        // Creating the table row collection for frozen.
                        _awardingFrozenBodyRowCollection.push(
                            this.getGridRow(
                                awardingGridData.awardingCandidateID,
                                _awardingCandidateFrozenBodyRowCellCollection,
                                undefined,
                                cssClass
                            ));

                        _awardingCandidateBodyRow = this.generateAwardingDetailsRow(
                            gridSeq, index, awardingGridData, classNames('row classify-items-row'),
                            this.resolvedGridColumnsJson, true, expandedItemList, false);

                        // Creating the table row collection for detail list.
                        if (_awardingCandidateBodyRow[0]) {
                            _awardingBodyRowCollection.push(_awardingCandidateBodyRow[0]);
                        }
                    }

                    break;
                case 'Grade':
                    if (this._canBindGradeCell) {
                        let isExpanded: boolean = false;

                        if (expandedItemList.count() > 0) {
                            let keys = expandedItemList.get(awardingGridData.totalMark.toString());
                            isExpanded = keys ? keys.get(awardingGridData.grade) : false;
                        }
                        cssClass = classNames('row classify-items-row show', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l1');

                        if (previousGrade !== awardingGridData.grade ||
                            previousTotalmark !== awardingGridData.totalMark) {
                            _awardingCandidateFrozenBodyRowCellCollection.push(this.generateGradeCell
                                (gridSeq, index, gridColumnCount, key, gridFrozenColumns,
                                previousGrade, awardingGridData.grade,
                                enums.AwardingViewType.Totalmark,
                                awardingGridData,
                                isExpanded, false, awardingGridData.totalMark.toString(), true, callback));

                            // Creating the table row collection.
                            _awardingFrozenBodyRowCollection.push(
                                this.getGridRow(
                                    awardingGridData.awardingCandidateID,
                                    _awardingCandidateFrozenBodyRowCellCollection,
                                    undefined,
                                    cssClass
                                ));

                            // adding the awardiging details body row ,
                            // we need to change the logic of getting the details body row while implementing expand option
                            _awardingCandidateBodyRow = this.generateAwardingDetailsRow(
                                gridSeq, index, awardingGridData, classNames('row classify-items-row'),
                                this.resolvedGridColumnsJson, true, expandedItemList, false);

                            // Creating the table row collection.
                            _awardingBodyRowCollection.push(_awardingCandidateBodyRow[0]);

                            if (_awardingCandidateBodyRow[1]) {
                                _awardingFrozenBodyRowCollection.push(_awardingCandidateBodyRow[1]);
                            }
                        }
                    }
                    break;
            }
        }

        return [_awardingFrozenBodyRowCollection, _awardingBodyRowCollection];
    }

    /**
     * generate the grade cell
     * @param gridSeq
     * @param index
     * @param gridColumnCount
     * @param key
     * @param gridFrozenColumns
     * @param previousGrade
     * @param currentGrade
     * @param viewType
     */
    private generateGradeCell(gridSeq: any, index: number,
        gridColumnCount: number, key: any, gridFrozenColumns: any,
        previousGrade: string,
        currentGrade: string,
        viewType: enums.AwardingViewType,
        awardingGridData: AwardingCandidateDetails,
        isExpanded: boolean,
        isParentItem: boolean,
        parentItemName: string,
        canRenderGradeInTotalmarkView: boolean,
        callback: Function): gridCell {
        let _awardingListCell: gridCell;
        let cellStyle: any;
        _awardingListCell = new gridCell();
        key = gridSeq.get(index) + '_AwardingGrade_' + gridColumnCount;
        if (canRenderGradeInTotalmarkView || previousGrade !== currentGrade) {
            // need to creating the element while new grade comes in the loop
            _awardingListCell.columnElement = this.getAwardingFrozenColumnElement(awardingGridData, key, true, isExpanded,
                enums.AwardingViewType.Grade,
                isParentItem,
                parentItemName,
                callback);
        } else if (viewType === enums.AwardingViewType.Totalmark) {
            // need to creating the empty cell for 
            // same grade comes in the loop when order by totaol mark view type
            _awardingListCell.columnElement = null;
        }
        cellStyle = (gridFrozenColumns.GridColumns[gridColumnCount].CssClass) ?
            gridFrozenColumns.GridColumns[gridColumnCount].CssClass : '';
        _awardingListCell.setCellStyle(cellStyle);
        return _awardingListCell;
    }

    /**
     * generate the total mark cell 
     * @param gridSeq
     * @param index
     * @param gridColumnCount
     * @param key
     * @param gridFrozenColumns
     * @param previousTotalmark
     * @param currentTotalmark
     */
    private generateTotalmarkCell(gridSeq: any, index: number,
        gridColumnCount: number, key: any, gridFrozenColumns: any,
        previousTotalmark: number, currentTotalmark: number,
        viewType: enums.AwardingViewType, awardingGridData: AwardingCandidateDetails,
        isExpanded: boolean,
        isParentItem: boolean,
        parentItemName: string,
        canRenderIngradeView: boolean,
        callback: Function): gridCell {
        let _awardingListCell: gridCell;
        let cellStyle: any;
        _awardingListCell = new gridCell();
        key = gridSeq.get(index) + '_AwardingTotalmark_' + gridColumnCount;
        cellStyle = (gridFrozenColumns.GridColumns[gridColumnCount].CssClass) ?
            gridFrozenColumns.GridColumns[gridColumnCount].CssClass : '';

        if (canRenderIngradeView || previousTotalmark !== currentTotalmark) {
            // need to create the element
            _awardingListCell.columnElement = this.getAwardingFrozenColumnElement(awardingGridData, key, true, isExpanded,
                enums.AwardingViewType.Totalmark,
                isParentItem,
                parentItemName,
                callback);
        } else if (viewType === enums.AwardingViewType.Grade) {
            // creating empty cell for same total mark value come in the loop
            _awardingListCell.columnElement = null;
        }
        _awardingListCell.setCellStyle(cellStyle);
        return _awardingListCell;
    }

    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    private getCenterNumberColumn(awardingGridData: AwardingCandidateDetails, key: string, propsNames: any): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: key,
            id: key,
            centerNumber: awardingGridData.centreNumber,
            awardingCandidateId: awardingGridData.awardingCandidateID
        };
        return React.createElement(CenterNumberColumn, componentProps);
    }

    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    public getGenericTextElement(textValue: string, seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue
        };
        return React.createElement(AwardingGenericTextColumn, componentProps);
    }
    /**
     * generate teh awarding details row
     * @param gridSeq
     * @param index
     * @param awardingGridData
     * @param cssClassNames
     * @param resolvedGridColumnsJson
     * @param isDetailsCellForFrozen
     */
    private generateAwardingDetailsRow(gridSeq: any, index: number,
        awardingGridData: AwardingCandidateDetails, cssClassNames: string, resolvedGridColumnsJson: any,
        isDetailsCellForFrozen: boolean,
        expandedItemList: Immutable.Map<string, Immutable.Map<string, boolean>>, canGenerateEmptyFrozenCell: boolean): Array<gridRow> {

        let _awardingRowCollection = Array<gridRow>();
        let _normalColumn: any;
        let componentPropsJson: any;
        let _awardingListCell: gridCell;
        let _emptyFrozenListCell: gridCell;
        let _awardingCandidateListDetailsRowHeaderCellCollection = Array<gridCell>();
        let _awardingEmptyFrozenCellCollection = Array<gridCell>();
        let key: string;
        let cellStyle: any;
        let cssClass: string;
        let gridColumns = this.getGridColumns(resolvedGridColumnsJson, false);
        let gridColumnLength = gridColumns.length;
        let _awardingGridRow: gridRow;
        let _emptyGridRowFrozen: gridRow;

        _emptyFrozenListCell = new gridCell();
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _normalColumn = gridColumns[gridColumnCount].GridColumn;
            componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
            _awardingListCell = new gridCell();
            switch (_normalColumn) {
                case 'Centre':
                    key = gridSeq.get(index) + '_AwardingCentre_' + gridColumnCount;
                    if (isDetailsCellForFrozen) {
                        // creating empty cells for forzen values comes in the loop
                        _awardingListCell.columnElement = null;
                    } else {
                        // need to create the proper element for the details list
                        _awardingListCell.columnElement = this.getCenterNumberColumn(awardingGridData,
                            key,
                            componentPropsJson
                        );
                    }
                    cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _awardingListCell.setCellStyle(cellStyle);
                    _awardingCandidateListDetailsRowHeaderCellCollection.push(_awardingListCell);
                    break;
                case 'Candidate No':
                    if (isDetailsCellForFrozen) {
                        // creating empty cells for forzen values comes in the loop
                        _awardingListCell.columnElement = null;
                    } else {
                        // need to create the proper element for the details list
                        _awardingListCell.columnElement = this.getGenericTextElement(awardingGridData.centreCandidateNo,
                            key
                        );
                    }
                    cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _awardingListCell.setCellStyle(cellStyle);
                    _awardingCandidateListDetailsRowHeaderCellCollection.push(_awardingListCell);
                    break;
				case 'My judgement':
					if (isDetailsCellForFrozen) {
						// creating empty cells for forzen values comes in the loop
						_awardingListCell.columnElement = null;
					} else {
						// need to create the proper element for the details list
						_awardingListCell.columnElement = this.getGenericTextElement
							(
							awardingHelper.getUserDefinedJudgementStatusName
								(awardingGridData.awardingJudgementStatusID, awardingGridData.awardingJudgementStatusName),
							key
							);
					}
                    cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _awardingListCell.setCellStyle(cellStyle);
                    _awardingCandidateListDetailsRowHeaderCellCollection.push(_awardingListCell);
                    _awardingListCell.isHidden = this.getCellVisibility(_normalColumn);
                    break;
                case 'Total judgements':
                    if (isDetailsCellForFrozen) {
                        // creating empty cells for forzen values comes in the loop
                        _awardingListCell.columnElement = null;
                    } else {
                        // need to create the proper element for the details list
                        _awardingListCell.columnElement = this.getGenericTextElement(awardingGridData.awardingJudgementCount.toString(),
                            key
                        );
                    }
                    cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _awardingListCell.setCellStyle(cellStyle);
                    _awardingCandidateListDetailsRowHeaderCellCollection.push(_awardingListCell);
                    _awardingListCell.isHidden = this.getCellVisibility(_normalColumn);
                    break;
                default:
                    break;
            }
        }

        // creating new grid row
        _awardingGridRow = this.getGridRow(parseInt(awardingGridData.centreNumber),
            _awardingCandidateListDetailsRowHeaderCellCollection,
            undefined,
            classNames('row classify-items-row')
        );

        if (canGenerateEmptyFrozenCell) {
            //// setting empty row for frozen rows        
            _emptyFrozenListCell.columnElement = null;
            _awardingEmptyFrozenCellCollection.push(_emptyFrozenListCell);
            _emptyGridRowFrozen = this.getGridRow(parseInt(awardingGridData.centreNumber),
                _awardingEmptyFrozenCellCollection,
                undefined,
                classNames('row classify-items-row')
            );
        }

        return [_awardingGridRow, _emptyGridRowFrozen];
    }

    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    private getCellVisibility(column: string): boolean {

        let columnIsHidden: boolean = false;
        let awardingJudementCC = (configurableCharacteristicsHelper.getExamSessionCCValue(
            configurableCharacteristicsNames.AwardingJudgements,
            awardingStore.instance.selectedSession.examSessionId).toLowerCase() === 'true');
        switch (column) {
            case 'Total judgements':
            case 'My judgement':
                columnIsHidden = awardingJudementCC ? false : true;
            break;
        }
        return columnIsHidden;
    }


    /**
     * Returns the table headers for awarding grids
     * @param comparerName
     * @param sortDirection
     * @param awardingCadidateDetails
     * @param viewType
     */
    public generateTableHeader(comparerName: string,
        sortDirection: enums.SortDirection, awardingCadidateDetails: any, viewType: number): Immutable.List<gridRow> {

        let _awardingCandidateListColumnHeaderCollection = Array<gridRow>();
        let _awardingListCell: gridCell;
        let _awardingCandidateListRow = new gridRow();
        let _awardingCandidateListColumnHeaderCellcollection: Array<gridCell> = new Array();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(awardingCandidateGridColumnsJson);
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, false);
        let gridColumnLength = gridColumns.length;

        // Getting the awarding columns
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {

            _awardingListCell = new gridCell();
            let _responseColumn = gridColumns[gridColumnCount].GridColumn;

            let headerText = gridColumns[gridColumnCount].ColumnHeader;
            let _comparerName = gridColumns[gridColumnCount].ComparerName;

            //headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            let key = 'columnHeader_' + gridColumnCount;

            _awardingListCell.columnElement = this.getColumnHeaderElement(
                key,
                gridColumns[gridColumnCount].ColumnHeader,
                headerText,
                (comparerName === _comparerName),
                false
            );

            _awardingListCell.isHidden = this.getCellVisibility(_responseColumn);

            _awardingListCell.comparerName = _comparerName;

            let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
			_awardingListCell.setCellStyle(cellStyle);
			_awardingListCell.isSortable = false;
            // Creating the grid row collection.
            _awardingCandidateListColumnHeaderCellcollection.push(_awardingListCell);
        }


        _awardingCandidateListRow.setRowId(1);
        _awardingCandidateListRow.setCells(_awardingCandidateListColumnHeaderCellcollection);
        _awardingCandidateListColumnHeaderCollection.push(_awardingCandidateListRow);

        let _awardingCandidateListTableHeaderCollection = Immutable.fromJS(_awardingCandidateListColumnHeaderCollection);
        return _awardingCandidateListTableHeaderCollection;
    }

    /**
     * Is used for generating row header collection for awarding candidate details
     * @param viewType
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     */
    public generateFrozenRowHeader(viewType: enums.AwardingViewType,
        comparerName: string, sortDirection: enums.SortDirection, isSortable: boolean): Immutable.List<gridRow> {

        let _awardingCandidateListColumnHeaderCollection = Array<gridRow>();
        let _awardingListCell: gridCell;
        let _awardingCandidateListRow = new gridRow();
        let _awardingCandidateListColumnHeaderCellcollection: Array<gridCell> = new Array();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(awardingCandidateGridColumnsJson);
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, true, viewType);
        let key = 'frozenRowHeader';

        let gridColumnLength = gridColumns.GridColumns.length;

        // Getting the awardingt columns
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {

            if ((viewType === enums.AwardingViewType.Grade && gridColumns.GridColumns[gridColumnCount].GridColumn === 'Grade') ||
                (viewType === enums.AwardingViewType.Totalmark && gridColumns.GridColumns[gridColumnCount].GridColumn === 'Total mark')) {
                _awardingListCell = new gridCell();
                let headerColumn = gridColumns.GridColumns[gridColumnCount].GridColumn;
                let _comparerName = gridColumns.GridColumns[gridColumnCount].ComparerName;

                _awardingListCell.columnElement = this.getColumnHeaderElement(
                    key,
                    gridColumns.GridColumns[gridColumnCount].ColumnHeader,
                    headerColumn,
                    (comparerName === _comparerName)
                );
                _awardingListCell.comparerName = _comparerName;
                _awardingListCell.isSortable = false;
                _awardingListCell.setCellStyle(gridColumns.GridColumns[gridColumnCount].CssClass);
                // Creating the grid row collection.
                _awardingCandidateListColumnHeaderCellcollection.push(_awardingListCell);
            }
        }

        _awardingCandidateListRow.setRowId(1);
        _awardingCandidateListRow.setCells(_awardingCandidateListColumnHeaderCellcollection);
        _awardingCandidateListColumnHeaderCollection.push(_awardingCandidateListRow);

        let _awardingFrozenRowHeaderCollection = Immutable.fromJS(_awardingCandidateListColumnHeaderCollection);

        return _awardingFrozenRowHeaderCollection;
    }

    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    protected getColumnHeaderElement(seq: string, headerText?: string, gridColumn?: string,
        isCurrentSort?: boolean, isSortRequired?: boolean, sortDirection?: enums.SortDirection,
        sortOption?: enums.SortOption, awardingCandidateData?: any, viewType?: enums.AwardingViewType): JSX.Element {

        let componentProps: any;
        let width: React.CSSProperties;

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
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    private getGridColumns(resolvedGridColumnsJson: any, isFrozen: boolean = false, viewType?: enums.AwardingViewType) {
        let gridColumns: any;
        gridColumns = (isFrozen === false) ?
            resolvedGridColumnsJson.awardingcandidatedetails.gradeview.detailsview.GridColumns
            : viewType && viewType === enums.AwardingViewType.Grade ?
                resolvedGridColumnsJson.awardingcandidatedetails.gradeview.frozenrowsgrade :
                resolvedGridColumnsJson.awardingcandidatedetails.gradeview.frozenrowstotalmark;
        return gridColumns;
    }

    /**
     * creating react element for the awarding frozen columns as per the view type
     * @param awardingGridData
     * @param seq
     * @param hasSub
     * @param isExpanded
     * @param viewType
     */
    public getAwardingFrozenColumnElement(awardingGridData: AwardingCandidateDetails,
        seq: string, hasSub: boolean, isExpanded: boolean,
        viewType: enums.AwardingViewType, isParentItem: boolean, parentItemName,
        _callback: Function): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            viewType: viewType,
            frozenColumn: viewType === enums.AwardingViewType.Grade ? awardingGridData.grade : awardingGridData.totalMark.toString(),
            hasSub: hasSub,
            isExpanded: isExpanded,
            isParentItem: isParentItem,
            parentItemName: parentItemName,
            callback: _callback
        };
        return React.createElement(AwardingFrozenComponent, componentProps);
    }
}
export = AwardingCandidateDetailsHelper;
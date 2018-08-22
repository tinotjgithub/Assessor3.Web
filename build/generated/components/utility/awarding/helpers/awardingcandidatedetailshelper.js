"use strict";
var React = require('react');
var gridRow = require('../../../utility/grid/gridrow');
var gridCell = require('../../../utility/grid/gridcell');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var awardingCandidateGridColumnsJson = require('../../../utility/grid/awardingcandidatedetailscolumns.json');
var awardingStore = require('../../../../stores/awarding/awardingstore');
var enums = require('../../enums');
var Immutable = require('immutable');
var classNames = require('classnames');
var ColumnHeader = require('../../../worklist/shared/columnheader');
var AwardingFrozenComponent = require('../../../awarding/shared/awardingfrozencomponent');
var CenterNumberColumn = require('../../../awarding/shared/awardingcenternumbercolumn');
var AwardingGenericTextColumn = require('../../../awarding/shared/awardinggenerictextcolumn');
var configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
/**
 * AwardingCandidateDetailsHelper
 */
var AwardingCandidateDetailsHelper = (function () {
    function AwardingCandidateDetailsHelper() {
        this._expandedOrCollapsedItemList = Immutable.Map();
        this._canBindTotalmarkCell = false;
        this._canBindGradeCell = false;
    }
    /**
     * set teh awarding collection
     * @param awardingCanidateDetailsItems
     */
    AwardingCandidateDetailsHelper.prototype.generateAwardingGridItems = function (awardingCanidateDetailsItems, viewType, expandedItemList, callback) {
        var _this = this;
        var sortedAwardingDetailsItem;
        var _awardingCandidateFrozenBodyRowCellCollection = Array();
        var _awardingFrozenBodyRowCollection = Array();
        var _awardingCandidateBodyRow = Array();
        var _awardingBodyRowCollection = Array();
        var _frozenColumn;
        var componentPropsJson;
        var key;
        var cssClass;
        var previousGrade;
        var previousTotalmark;
        var awardingBodyRows;
        var awardingDetailsItem;
        if (viewType === enums.AwardingViewType.Grade) {
            // ordering the collection based on grade and total mark
            awardingDetailsItem = awardingCanidateDetailsItems.sort(function (x, y) {
                return x.grade.localeCompare(y.grade) || x.totalMark - y.totalMark;
            });
        }
        else {
            // ordering the collection based on grade and total mark
            awardingDetailsItem = awardingCanidateDetailsItems.sort(function (x, y) {
                return x.totalMark - y.totalMark || x.grade.localeCompare(y.grade);
            });
        }
        sortedAwardingDetailsItem = Immutable.List(awardingDetailsItem);
        this._expandedOrCollapsedItemList = expandedItemList;
        var gridSeq = sortedAwardingDetailsItem.keySeq();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(awardingCandidateGridColumnsJson);
        sortedAwardingDetailsItem.map(function (awardingGridData, index) {
            // creating the awarding frozen body rows as per the orderby type
            // and also creating the empty row for details view
            if (viewType === enums.AwardingViewType.Grade) {
                awardingBodyRows = _this.generateFrozenBodyRowsForGradeView(awardingGridData, index, gridSeq, previousGrade, previousTotalmark, expandedItemList, callback);
            }
            else if (viewType === enums.AwardingViewType.Totalmark) {
                awardingBodyRows = _this.generateFrozenBodyRowsForTotalmarkView(awardingGridData, index, gridSeq, previousGrade, previousTotalmark, expandedItemList, callback);
            }
            // adding frozen body row collection
            _awardingFrozenBodyRowCollection = _awardingFrozenBodyRowCollection.concat(awardingBodyRows[0]);
            // adding empty rows for details table cells while creating the frozen columns
            _awardingBodyRowCollection = _awardingBodyRowCollection.concat(awardingBodyRows[1]);
            // adding the awardiging details body row ,
            // we need to change the logic of getting the details body row while implementing expand option
            var isExpanded = false;
            switch (viewType) {
                case enums.AwardingViewType.Grade:
                    if (expandedItemList.count() > 0) {
                        var keys = expandedItemList.get(awardingGridData.grade);
                        isExpanded = keys ? !keys.get(awardingGridData.grade) ? false :
                            keys.get(awardingGridData.totalMark.toString()) : false;
                    }
                    break;
                case enums.AwardingViewType.Totalmark:
                    if (expandedItemList.count() > 0) {
                        var keys = expandedItemList.get(awardingGridData.totalMark.toString());
                        isExpanded = keys ? !keys.get(awardingGridData.totalMark.toString()) ?
                            false : keys.get(awardingGridData.grade) : false;
                    }
                    break;
            }
            if (isExpanded) {
                _awardingCandidateBodyRow = _this.generateAwardingDetailsRow(gridSeq, index, awardingGridData, 'row', _this.resolvedGridColumnsJson, false, expandedItemList, true);
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
        return [Immutable.List(_awardingFrozenBodyRowCollection), Immutable.List(_awardingBodyRowCollection)];
    };
    /**
     *  generate awarding gradeview grid rows
     * @param awardingGridData
     * @param index
     * @param gridSeq
     */
    AwardingCandidateDetailsHelper.prototype.generateFrozenBodyRowsForGradeView = function (awardingGridData, index, gridSeq, previousGrade, previousTotalmark, expandedItemList, callback) {
        var _awardingCandidateFrozenBodyRowCellCollection = Array();
        var _awardingFrozenBodyRowCollection = Array();
        var _awardingCandidateBodyRow = Array();
        var _awardingBodyRowCollection = Array();
        var _frozenColumn;
        var componentPropsJson;
        var key;
        var cssClass;
        var _previousGrade;
        var _previousTotalmark;
        // get columns for frozen table 
        var gridFrozenColumns = this.getGridColumns(this.resolvedGridColumnsJson, true, enums.AwardingViewType.Grade);
        var gridFrozenColumnLength = gridFrozenColumns.GridColumns.length;
        // get the column for normal table
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, false, enums.AwardingViewType.Totalmark);
        var gridColumnLength = gridColumns.length;
        for (var gridColumnCount = 0; gridColumnCount < gridFrozenColumnLength; gridColumnCount++) {
            _awardingCandidateFrozenBodyRowCellCollection = new Array();
            _frozenColumn = gridFrozenColumns.GridColumns[gridColumnCount].GridColumn;
            componentPropsJson = gridFrozenColumns.GridColumns[gridColumnCount].ComponentProps;
            switch (_frozenColumn) {
                case 'Grade':
                    if (previousGrade !== awardingGridData.grade) {
                        var isExpanded = false;
                        if (expandedItemList.count() > 0) {
                            var keys = expandedItemList.get(awardingGridData.grade);
                            isExpanded = keys ? keys.get(awardingGridData.grade) : false;
                            this._canBindTotalmarkCell = isExpanded;
                        }
                        cssClass = classNames('row classify-items-row', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l0');
                        _awardingCandidateFrozenBodyRowCellCollection.push(this.generateGradeCell(gridSeq, index, gridColumnCount, key, gridFrozenColumns, previousGrade, awardingGridData.grade, enums.AwardingViewType.Grade, awardingGridData, isExpanded, true, awardingGridData.grade, false, callback));
                        // Creating the table row collection for frozen.
                        _awardingFrozenBodyRowCollection.push(this.getGridRow(awardingGridData.awardingCandidateID, _awardingCandidateFrozenBodyRowCellCollection, undefined, cssClass));
                        _awardingCandidateBodyRow = this.generateAwardingDetailsRow(gridSeq, index, awardingGridData, classNames('row classify-items-row'), this.resolvedGridColumnsJson, true, expandedItemList, false);
                        // Creating the table row collection for detail list.
                        if (_awardingCandidateBodyRow[0]) {
                            _awardingBodyRowCollection.push(_awardingCandidateBodyRow[0]);
                        }
                    }
                    break;
                case 'Total mark':
                    if (this._canBindTotalmarkCell) {
                        var isExpanded = false;
                        if (expandedItemList.count() > 0) {
                            var keys = expandedItemList.get(awardingGridData.grade);
                            isExpanded = keys ? keys.get(awardingGridData.totalMark.toString()) : false;
                        }
                        cssClass = classNames('row classify-items-row show', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l1');
                        if (previousTotalmark !== awardingGridData.totalMark ||
                            previousGrade !== awardingGridData.grade) {
                            _awardingCandidateFrozenBodyRowCellCollection.push(this.generateTotalmarkCell(gridSeq, index, gridColumnCount, key, gridFrozenColumns, previousTotalmark, awardingGridData.totalMark, enums.AwardingViewType.Grade, awardingGridData, isExpanded, false, awardingGridData.grade, true, callback));
                            // Creating the table row collection.
                            _awardingFrozenBodyRowCollection.push(this.getGridRow(awardingGridData.awardingCandidateID, _awardingCandidateFrozenBodyRowCellCollection, undefined, cssClass));
                            // adding the awardiging details body row ,
                            // we need to change the logic of getting the details body row while implementing expand option
                            _awardingCandidateBodyRow = this.generateAwardingDetailsRow(gridSeq, index, awardingGridData, classNames('row classify-items-row'), this.resolvedGridColumnsJson, true, expandedItemList, false);
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
    };
    /**
     * generateFrozenBodyRowsForTotalmarkView
     * @param awardingGridData
     * @param index
     * @param gridSeq
     * @param previousGrade
     */
    AwardingCandidateDetailsHelper.prototype.generateFrozenBodyRowsForTotalmarkView = function (awardingGridData, index, gridSeq, previousGrade, previousTotalmark, expandedItemList, callback) {
        var _awardingCandidateFrozenBodyRowCellCollection = Array();
        var _awardingFrozenBodyRowCollection = Array();
        var _awardingCandidateBodyRow = Array();
        var _awardingBodyRowCollection = Array();
        var _frozenColumn;
        var componentPropsJson;
        var key;
        var cssClass;
        // get columns for frozen table 
        var gridFrozenColumns = this.getGridColumns(this.resolvedGridColumnsJson, true, enums.AwardingViewType.Totalmark);
        var gridFrozenColumnLength = gridFrozenColumns.GridColumns.length;
        // get the column for normal table
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, false);
        var gridColumnLength = gridColumns.length;
        for (var gridColumnCount = 0; gridColumnCount < gridFrozenColumnLength; gridColumnCount++) {
            _awardingCandidateFrozenBodyRowCellCollection = new Array();
            _frozenColumn = gridFrozenColumns.GridColumns[gridColumnCount].GridColumn;
            componentPropsJson = gridFrozenColumns.GridColumns[gridColumnCount].ComponentProps;
            switch (_frozenColumn) {
                case 'Total mark':
                    if (previousTotalmark !== awardingGridData.totalMark) {
                        var isExpanded = false;
                        if (expandedItemList.count() > 0) {
                            var keys = expandedItemList.get(awardingGridData.totalMark.toString());
                            isExpanded = keys ? keys.get(awardingGridData.totalMark.toString()) : false;
                            this._canBindGradeCell = isExpanded;
                        }
                        cssClass = classNames('row classify-items-row', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l0');
                        _awardingCandidateFrozenBodyRowCellCollection.push(this.generateTotalmarkCell(gridSeq, index, gridColumnCount, key, gridFrozenColumns, previousTotalmark, awardingGridData.totalMark, enums.AwardingViewType.Totalmark, awardingGridData, isExpanded, true, awardingGridData.totalMark.toString(), false, callback));
                        // Creating the table row collection for frozen.
                        _awardingFrozenBodyRowCollection.push(this.getGridRow(awardingGridData.awardingCandidateID, _awardingCandidateFrozenBodyRowCellCollection, undefined, cssClass));
                        _awardingCandidateBodyRow = this.generateAwardingDetailsRow(gridSeq, index, awardingGridData, classNames('row classify-items-row'), this.resolvedGridColumnsJson, true, expandedItemList, false);
                        // Creating the table row collection for detail list.
                        if (_awardingCandidateBodyRow[0]) {
                            _awardingBodyRowCollection.push(_awardingCandidateBodyRow[0]);
                        }
                    }
                    break;
                case 'Grade':
                    if (this._canBindGradeCell) {
                        var isExpanded = false;
                        if (expandedItemList.count() > 0) {
                            var keys = expandedItemList.get(awardingGridData.totalMark.toString());
                            isExpanded = keys ? keys.get(awardingGridData.grade) : false;
                        }
                        cssClass = classNames('row classify-items-row show', {
                            'has-sub': true, 'open': isExpanded
                        }, 'l1');
                        if (previousGrade !== awardingGridData.grade ||
                            previousTotalmark !== awardingGridData.totalMark) {
                            _awardingCandidateFrozenBodyRowCellCollection.push(this.generateGradeCell(gridSeq, index, gridColumnCount, key, gridFrozenColumns, previousGrade, awardingGridData.grade, enums.AwardingViewType.Totalmark, awardingGridData, isExpanded, false, awardingGridData.totalMark.toString(), true, callback));
                            // Creating the table row collection.
                            _awardingFrozenBodyRowCollection.push(this.getGridRow(awardingGridData.awardingCandidateID, _awardingCandidateFrozenBodyRowCellCollection, undefined, cssClass));
                            // adding the awardiging details body row ,
                            // we need to change the logic of getting the details body row while implementing expand option
                            _awardingCandidateBodyRow = this.generateAwardingDetailsRow(gridSeq, index, awardingGridData, classNames('row classify-items-row'), this.resolvedGridColumnsJson, true, expandedItemList, false);
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
    };
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
    AwardingCandidateDetailsHelper.prototype.generateGradeCell = function (gridSeq, index, gridColumnCount, key, gridFrozenColumns, previousGrade, currentGrade, viewType, awardingGridData, isExpanded, isParentItem, parentItemName, canRenderGradeInTotalmarkView, callback) {
        var _awardingListCell;
        var cellStyle;
        _awardingListCell = new gridCell();
        key = gridSeq.get(index) + '_AwardingGrade_' + gridColumnCount;
        if (canRenderGradeInTotalmarkView || previousGrade !== currentGrade) {
            // need to creating the element while new grade comes in the loop
            _awardingListCell.columnElement = this.getAwardingFrozenColumnElement(awardingGridData, key, true, isExpanded, enums.AwardingViewType.Grade, awardingGridData.markGroupID, isParentItem, parentItemName, callback);
        }
        else if (viewType === enums.AwardingViewType.Totalmark) {
            // need to creating the empty cell for 
            // same grade comes in the loop when order by totaol mark view type
            _awardingListCell.columnElement = null;
        }
        cellStyle = (gridFrozenColumns.GridColumns[gridColumnCount].CssClass) ?
            gridFrozenColumns.GridColumns[gridColumnCount].CssClass : '';
        _awardingListCell.setCellStyle(cellStyle);
        return _awardingListCell;
    };
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
    AwardingCandidateDetailsHelper.prototype.generateTotalmarkCell = function (gridSeq, index, gridColumnCount, key, gridFrozenColumns, previousTotalmark, currentTotalmark, viewType, awardingGridData, isExpanded, isParentItem, parentItemName, canRenderIngradeView, callback) {
        var _awardingListCell;
        var cellStyle;
        _awardingListCell = new gridCell();
        key = gridSeq.get(index) + '_AwardingTotalmark_' + gridColumnCount;
        cellStyle = (gridFrozenColumns.GridColumns[gridColumnCount].CssClass) ?
            gridFrozenColumns.GridColumns[gridColumnCount].CssClass : '';
        if (canRenderIngradeView || previousTotalmark !== currentTotalmark) {
            // need to create the element
            _awardingListCell.columnElement = this.getAwardingFrozenColumnElement(awardingGridData, key, true, isExpanded, enums.AwardingViewType.Totalmark, awardingGridData.markGroupID, isParentItem, parentItemName, callback);
        }
        else if (viewType === enums.AwardingViewType.Grade) {
            // creating empty cell for same total mark value come in the loop
            _awardingListCell.columnElement = null;
        }
        _awardingListCell.setCellStyle(cellStyle);
        return _awardingListCell;
    };
    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    AwardingCandidateDetailsHelper.prototype.getCenterNumberColumn = function (awardingGridData, key, propsNames) {
        var componentProps;
        componentProps = {
            key: key,
            id: key,
            centerNumber: awardingGridData.centreNumber
        };
        return React.createElement(CenterNumberColumn, componentProps);
    };
    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    AwardingCandidateDetailsHelper.prototype.getGenericTextElement = function (textValue, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue
        };
        return React.createElement(AwardingGenericTextColumn, componentProps);
    };
    /**
     * generate teh awarding details row
     * @param gridSeq
     * @param index
     * @param awardingGridData
     * @param cssClassNames
     * @param resolvedGridColumnsJson
     * @param isDetailsCellForFrozen
     */
    AwardingCandidateDetailsHelper.prototype.generateAwardingDetailsRow = function (gridSeq, index, awardingGridData, cssClassNames, resolvedGridColumnsJson, isDetailsCellForFrozen, expandedItemList, canGenerateEmptyFrozenCell) {
        var _awardingRowCollection = Array();
        var _normalColumn;
        var componentPropsJson;
        var _awardingListCell;
        var _emptyFrozenListCell;
        var _awardingCandidateListDetailsRowHeaderCellCollection = Array();
        var _awardingEmptyFrozenCellCollection = Array();
        var key;
        var cellStyle;
        var cssClass;
        var gridColumns = this.getGridColumns(resolvedGridColumnsJson, false);
        var gridColumnLength = gridColumns.length;
        var _awardingGridRow;
        var _emptyGridRowFrozen;
        _emptyFrozenListCell = new gridCell();
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _normalColumn = gridColumns[gridColumnCount].GridColumn;
            componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
            _awardingListCell = new gridCell();
            switch (_normalColumn) {
                case 'Centre':
                    key = gridSeq.get(index) + '_AwardingCentre_' + gridColumnCount;
                    if (isDetailsCellForFrozen) {
                        // creating empty cells for forzen values comes in the loop
                        _awardingListCell.columnElement = null;
                    }
                    else {
                        // need to create the proper element for the details list
                        _awardingListCell.columnElement = this.getCenterNumberColumn(awardingGridData, key, componentPropsJson);
                    }
                    cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _awardingListCell.setCellStyle(cellStyle);
                    _awardingCandidateListDetailsRowHeaderCellCollection.push(_awardingListCell);
                    break;
                case 'Candidate No':
                    if (isDetailsCellForFrozen) {
                        // creating empty cells for forzen values comes in the loop
                        _awardingListCell.columnElement = null;
                    }
                    else {
                        // need to create the proper element for the details list
                        _awardingListCell.columnElement = this.getGenericTextElement(awardingGridData.centreCandidateNo, key);
                    }
                    cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _awardingListCell.setCellStyle(cellStyle);
                    _awardingCandidateListDetailsRowHeaderCellCollection.push(_awardingListCell);
                    break;
                case 'My judgement':
                    if (isDetailsCellForFrozen) {
                        // creating empty cells for forzen values comes in the loop
                        _awardingListCell.columnElement = null;
                    }
                    else {
                        // need to create the proper element for the details list
                        _awardingListCell.columnElement = this.getGenericTextElement(awardingGridData.awardingJudgementStatusID.toString(), key);
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
                    }
                    else {
                        // need to create the proper element for the details list
                        _awardingListCell.columnElement = this.getGenericTextElement(awardingGridData.awardingJudgementCount.toString(), key);
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
        _awardingGridRow = this.getGridRow(parseInt(awardingGridData.centreNum), _awardingCandidateListDetailsRowHeaderCellCollection, undefined, classNames('row classify-items-row'));
        if (canGenerateEmptyFrozenCell) {
            //// setting empty row for frozen rows        
            _emptyFrozenListCell.columnElement = null;
            _awardingEmptyFrozenCellCollection.push(_emptyFrozenListCell);
            _emptyGridRowFrozen = this.getGridRow(parseInt(awardingGridData.centreNum), _awardingEmptyFrozenCellCollection, undefined, classNames('row classify-items-row'));
        }
        return [_awardingGridRow, _emptyGridRowFrozen];
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    AwardingCandidateDetailsHelper.prototype.getCellVisibility = function (column) {
        var columnIsHidden = false;
        var awardingJudementCC = (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.AwardingJudgements, awardingStore.instance.selectedSession.examSessionId).toLowerCase() === 'true');
        switch (column) {
            case 'Total judgements':
            case 'My judgement':
                columnIsHidden = awardingJudementCC ? false : true;
                break;
        }
        return columnIsHidden;
    };
    /**
     * Returns the table headers for awarding grids
     * @param comparerName
     * @param sortDirection
     * @param awardingCadidateDetails
     * @param viewType
     */
    AwardingCandidateDetailsHelper.prototype.generateTableHeader = function (comparerName, sortDirection, awardingCadidateDetails, viewType) {
        var _awardingCandidateListColumnHeaderCollection = Array();
        var _awardingListCell;
        var _awardingCandidateListRow = new gridRow();
        var _awardingCandidateListColumnHeaderCellcollection = new Array();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(awardingCandidateGridColumnsJson);
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, false);
        var gridColumnLength = gridColumns.length;
        // Getting the awarding columns
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _awardingListCell = new gridCell();
            var _responseColumn = gridColumns[gridColumnCount].GridColumn;
            var headerText = gridColumns[gridColumnCount].ColumnHeader;
            var _comparerName = gridColumns[gridColumnCount].ComparerName;
            //headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            var key = 'columnHeader_' + gridColumnCount;
            _awardingListCell.columnElement = this.getColumnHeaderElement(key, gridColumns[gridColumnCount].ColumnHeader, headerText, (comparerName === _comparerName), false);
            _awardingListCell.isHidden = this.getCellVisibility(_responseColumn);
            _awardingListCell.comparerName = _comparerName;
            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _awardingListCell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _awardingCandidateListColumnHeaderCellcollection.push(_awardingListCell);
        }
        _awardingCandidateListRow.setRowId(1);
        _awardingCandidateListRow.setCells(_awardingCandidateListColumnHeaderCellcollection);
        _awardingCandidateListColumnHeaderCollection.push(_awardingCandidateListRow);
        var _awardingCandidateListTableHeaderCollection = Immutable.fromJS(_awardingCandidateListColumnHeaderCollection);
        return _awardingCandidateListTableHeaderCollection;
    };
    /**
     * Is used for generating row header collection for awarding candidate details
     * @param viewType
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     */
    AwardingCandidateDetailsHelper.prototype.generateFrozenRowHeader = function (viewType, comparerName, sortDirection, isSortable) {
        var _awardingCandidateListColumnHeaderCollection = Array();
        var _awardingListCell;
        var _awardingCandidateListRow = new gridRow();
        var _awardingCandidateListColumnHeaderCellcollection = new Array();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(awardingCandidateGridColumnsJson);
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, true, viewType);
        var key = 'frozenRowHeader';
        var gridColumnLength = gridColumns.GridColumns.length;
        // Getting the awardingt columns
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            if ((viewType === enums.AwardingViewType.Grade && gridColumns.GridColumns[gridColumnCount].GridColumn === 'Grade') ||
                (viewType === enums.AwardingViewType.Totalmark && gridColumns.GridColumns[gridColumnCount].GridColumn === 'Total mark')) {
                _awardingListCell = new gridCell();
                var headerColumn = gridColumns.GridColumns[gridColumnCount].GridColumn;
                var _comparerName = gridColumns.GridColumns[gridColumnCount].ComparerName;
                _awardingListCell.columnElement = this.getColumnHeaderElement(key, gridColumns.GridColumns[gridColumnCount].ColumnHeader, headerColumn, (comparerName === _comparerName));
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
        var _awardingFrozenRowHeaderCollection = Immutable.fromJS(_awardingCandidateListColumnHeaderCollection);
        return _awardingFrozenRowHeaderCollection;
    };
    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    AwardingCandidateDetailsHelper.prototype.getColumnHeaderElement = function (seq, headerText, gridColumn, isCurrentSort, isSortRequired, sortDirection, sortOption, awardingCandidateData, viewType) {
        var componentProps;
        var width;
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
     * creating grid row
     * @param responseStatus
     * @param displayId
     * @param gridCells
     * @param accuracyType - to display AMD and TMD based on Accuracy Indicator
     * @returns grid row.
     */
    AwardingCandidateDetailsHelper.prototype.getGridRow = function (rowId, gridCells, additionalComponent, cssClass) {
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
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    AwardingCandidateDetailsHelper.prototype.getGridColumns = function (resolvedGridColumnsJson, isFrozen, viewType) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        gridColumns = (isFrozen === false) ?
            resolvedGridColumnsJson.awardingcandidatedetails.gradeview.detailsview.GridColumns
            : viewType && viewType === enums.AwardingViewType.Grade ?
                resolvedGridColumnsJson.awardingcandidatedetails.gradeview.frozenrowsgrade :
                resolvedGridColumnsJson.awardingcandidatedetails.gradeview.frozenrowstotalmark;
        return gridColumns;
    };
    /**
     * creating react element for the awarding frozen columns as per the view type
     * @param awardingGridData
     * @param seq
     * @param hasSub
     * @param isExpanded
     * @param viewType
     */
    AwardingCandidateDetailsHelper.prototype.getAwardingFrozenColumnElement = function (awardingGridData, seq, hasSub, isExpanded, viewType, markGroupID, isParentItem, parentItemName, _callback) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            viewType: viewType,
            markGroupId: markGroupID,
            frozenColumn: viewType === enums.AwardingViewType.Grade ? awardingGridData.grade : awardingGridData.totalMark.toString(),
            hasSub: hasSub,
            isExpanded: isExpanded,
            isParentItem: isParentItem,
            parentItemName: parentItemName,
            callback: _callback
        };
        return React.createElement(AwardingFrozenComponent, componentProps);
    };
    return AwardingCandidateDetailsHelper;
}());
module.exports = AwardingCandidateDetailsHelper;
//# sourceMappingURL=awardingcandidatedetailshelper.js.map
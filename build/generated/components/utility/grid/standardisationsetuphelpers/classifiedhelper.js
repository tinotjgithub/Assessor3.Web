"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enums = require('../../enums');
var gridCell = require('../../../utility/grid/gridcell');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var Immutable = require('immutable');
var standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
var standardisationSetupHelperBase = require('./standardisationsetuphelperbase');
var standardisationSetupGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
/**
 * Helper class for Classified grid view
 */
var ClassifiedHelper = (function (_super) {
    __extends(ClassifiedHelper, _super);
    function ClassifiedHelper() {
        _super.apply(this, arguments);
        // Get the worklists that should be hide when the Standardisation Permission CC Configured.
        this._hiddenStdWorklists = standardisationSetupStore.instance.getHiddenWorklists();
    }
    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param classifedResponseData
     * @param tabSelection
     * @param gridType
     */
    ClassifiedHelper.prototype.generateStandardisationRowDefinion = function (comparerName, sortDirection, tabSelection, gridType) {
        this._stdSetUpWorkListCollection = Immutable.List();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        this._stdSetUpWorkListCollection = this.getRowDefinition(tabSelection, gridType);
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Returns the row definition for classifed worklist
     * @param tabSelection
     * @param gridType
     */
    ClassifiedHelper.prototype.getRowDefinition = function (tabSelection, gridType) {
        var index = 0;
        var _classifiedRowCollection = Array();
        var _classifiedRowHeaderCellcollection = Array();
        var _classifiedResponseListData;
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, tabSelection, false, gridType);
        var _stdSetupResponseDetails = standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;
        var marksCount = _stdSetupResponseDetails[0].standardisationMarks ?
            _stdSetupResponseDetails[0].standardisationMarks.length : 0;
        // 1. PRACTICE
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.Practice))) {
            // Creating the grid row collection.
            _classifiedRowCollection.push(this.getGridRow('2', this.getEmptyRows(gridColumns, marksCount, gridType), null, 'classify-items-row'));
            // Sort Response based on  rig order.
            _classifiedResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.practiceResponseDetails);
            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(this.getRowData(_classifiedResponseListData, gridColumns, gridType, index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            }
            else {
                _classifiedRowCollection.push(this.getGridRow('2', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }
        // 2. APPROVAL
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.Approval))) {
            // Creating the grid row collection.
            _classifiedRowCollection.push(this.getGridRow('3', this.getEmptyRows(gridColumns, marksCount, gridType), null, 'classify-items-row'));
            // Sort Response based on  rig order.
            _classifiedResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.standardisationResponseDetails);
            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(this.getRowData(_classifiedResponseListData, gridColumns, gridType, index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            }
            else {
                _classifiedRowCollection.push(this.getGridRow('3', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }
        // 3. ES TEAM APPROVAL
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.ES_TeamApproval))) {
            // Creating the grid row collection.
            _classifiedRowCollection.push(this.getGridRow('4', this.getEmptyRows(gridColumns, marksCount, gridType), null, 'classify-items-row'));
            // Sort Response based on  rig order.
            _classifiedResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.stmStandardisationResponseDetails);
            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(this.getRowData(_classifiedResponseListData, gridColumns, gridType, index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            }
            else {
                _classifiedRowCollection.push(this.getGridRow('4', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }
        // 4. SEED
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.Seeding))) {
            // Creating the grid row collection.
            _classifiedRowCollection.push(this.getGridRow('70', this.getEmptyRows(gridColumns, marksCount, gridType), null, 'classify-items-row'));
            // Sort Response based on  rig order.
            _classifiedResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.seedResponseDetails, true);
            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(this.getRowData(_classifiedResponseListData, gridColumns, gridType, index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            }
            else {
                _classifiedRowCollection.push(this.getGridRow('70', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }
        // Return the complete row collection.
        this._classifiedListCollection = Immutable.fromJS(_classifiedRowCollection);
        return this._classifiedListCollection;
    };
    /**
     * generateStandardisationFrozenRowBody is used for generating row collection for STD WorkList Grid
     * @param standardisationSetupType
     * @param gridType
     */
    ClassifiedHelper.prototype.generateStandardisationFrozenRowBody = function (comparerName, sortDirection, standardisationSetupType, gridType) {
        // Get frozen column collection.
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        // Get the Frozen row body for STD Worklist
        var _stdWorkListFrozenRowBodyCollection = this.getFrozenRowBody(standardisationSetupType, gridType);
        return _stdWorkListFrozenRowBodyCollection;
    };
    /**
     * Method for getting the frozen row body for STD worklist
     * @param standardisationSetupType
     * @param gridType
     */
    ClassifiedHelper.prototype.getFrozenRowBody = function (standardisationSetupType, gridType) {
        var index = 0;
        var _stdWorkListRowHeaderCellcollection = Array();
        var _stdWorkListRowCollection = Array();
        var _stdWorkListCell;
        var _stdResponseListData;
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, enums.StandardisationSetup.ClassifiedResponse, true, gridType);
        // Flag to check whether target exceeded.
        var overClassified = false;
        // 1. PRACTICE
        // Add practice response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists && !this._hiddenStdWorklists.contains(enums.MarkingMode.Practice))) {
            // Sort Response based on Rig order.
            _stdResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.practiceResponseDetails).toArray();
            _stdWorkListRowHeaderCellcollection = new Array();
            // Add Empty banner for Practice
            _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.Practice));
            if (_stdResponseListData.length > 0) {
                // Loop through response details.
                for (var pracResponseCount = 0; pracResponseCount < _stdResponseListData.length; pracResponseCount++) {
                    // Getting the std worklist data row     
                    var stdResponseData = _stdResponseListData[pracResponseCount];
                    // Check whetehr the classifcation type exceeded the current target,
                    // and Practice available in restricted target.
                    // if so highlight the exceeded last rows with amber color.
                    overClassified =
                        this.isSSUTargetsOverClassified(standardisationSetupType, enums.MarkingMode.Practice, stdResponseData.rigOrder);
                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, overClassified));
                    index++;
                }
            }
            else {
                for (var gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                    _stdWorkListCell = new gridCell();
                    var cellStyle = gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                        'col-response header-col' : 'col-std-classify-items header-col';
                    _stdWorkListCell.setCellStyle(cellStyle);
                    _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                }
                // Creating the table row collection.
                _stdWorkListRowCollection.push(this.getGridRow('2', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
            }
            // Reset to false.
            overClassified = false;
        }
        // 2. APPROVAL
        // Add standardisation response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists && !this._hiddenStdWorklists.contains(enums.MarkingMode.Approval))) {
            // Sort Response based on Rig order.
            _stdResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.standardisationResponseDetails).toArray();
            _stdWorkListRowHeaderCellcollection = new Array();
            // Add Empty banner for Approval
            _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.Approval));
            if (_stdResponseListData.length > 0) {
                // Loop through response details.
                for (var approvalResponseCount = 0; approvalResponseCount < _stdResponseListData.length; approvalResponseCount++) {
                    // Getting the std worklist data row     
                    var stdResponseData = _stdResponseListData[approvalResponseCount];
                    // Check whetehr the classifcation type exceeded the current target,
                    // and Standardisation available in restricted target.
                    // if so highlight the exceeded last rows with amber color.
                    overClassified =
                        this.isSSUTargetsOverClassified(standardisationSetupType, enums.MarkingMode.Approval, stdResponseData.rigOrder);
                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, overClassified));
                    index++;
                }
            }
            else {
                for (var gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                    _stdWorkListCell = new gridCell();
                    var cellStyle = gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                        'col-response header-col' : 'col-std-classify-items header-col';
                    _stdWorkListCell.setCellStyle(cellStyle);
                    _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                }
                // Creating the table row collection.
                _stdWorkListRowCollection.push(this.getGridRow('3', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
            }
            // Reset to false.
            overClassified = false;
        }
        // 3. ES TEAM APPROVAL
        // Add STM standardisation response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists && !this._hiddenStdWorklists.contains(enums.MarkingMode.ES_TeamApproval))) {
            // Sort Response based on Rig order.
            _stdResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.stmStandardisationResponseDetails).toArray();
            _stdWorkListRowHeaderCellcollection = new Array();
            // Add Empty banner for ES_TeamApproval
            _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.ES_TeamApproval));
            if (_stdResponseListData.length > 0) {
                // Loop through response details.
                for (var esTeamResponseCount = 0; esTeamResponseCount < _stdResponseListData.length; esTeamResponseCount++) {
                    // Getting the std worklist data row     
                    var stdResponseData = _stdResponseListData[esTeamResponseCount];
                    // Check whetehr the classifcation type exceeded the current target,
                    // and STM Standardisation available in restricted target.
                    // if so highlight the exceeded last rows with amber color.
                    overClassified =
                        this.isSSUTargetsOverClassified(standardisationSetupType, enums.MarkingMode.ES_TeamApproval, stdResponseData.rigOrder);
                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, overClassified));
                    index++;
                }
            }
            else {
                for (var gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                    _stdWorkListCell = new gridCell();
                    var cellStyle = gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                        'col-response header-col' : 'col-std-classify-items header-col';
                    _stdWorkListCell.setCellStyle(cellStyle);
                    _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                }
                // Creating the table row collection.
                _stdWorkListRowCollection.push(this.getGridRow('4', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
            }
            // Reset to false.
            overClassified = false;
        }
        // 4. SEED
        // Add Seed response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists && !this._hiddenStdWorklists.contains(enums.MarkingMode.Seeding))) {
            _stdResponseListData =
                this.sortClassifiedResponseList(standardisationSetupStore.instance.seedResponseDetails, true).toArray();
            _stdWorkListRowHeaderCellcollection = new Array();
            // Add Empty banner for Seeding
            _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.Seeding));
            if (_stdResponseListData.length > 0) {
                // Loop through response details.
                for (var seedResponseCount = 0; seedResponseCount < _stdResponseListData.length; seedResponseCount++) {
                    // Getting the std worklist data row     
                    var stdResponseData = _stdResponseListData[seedResponseCount];
                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, false));
                    index++;
                }
            }
            else {
                for (var gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                    _stdWorkListCell = new gridCell();
                    var cellStyle = gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                        'col-response header-col' : 'col-std-classify-items header-col';
                    _stdWorkListCell.setCellStyle(cellStyle);
                    _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                }
                // Creating the table row collection.
                _stdWorkListRowCollection.push(this.getGridRow('70', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
            }
            // Reset to false.
            overClassified = false;
        }
        // Return the complete row collection.
        var _stdWorkListFrozenRowBodyCollection = Immutable.fromJS(_stdWorkListRowCollection);
        return _stdWorkListFrozenRowBodyCollection;
    };
    /**
     * Method to create empty banner for Different classification Type.
     * @param classificationType
     */
    ClassifiedHelper.prototype.getFrozenEmptyBannerForClassificationType = function (classificationType) {
        var className;
        var _stdWorkListCell;
        var key;
        var _stdWorkListRowHeaderCellcollection = new Array();
        // Go through classification Type and create corresponding Banner.
        switch (classificationType) {
            case enums.MarkingMode.Practice:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_Practice';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(key, className, classificationType, undefined);
                break;
            case enums.MarkingMode.Approval:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_Standardisation';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(key, className, classificationType, undefined);
                break;
            case enums.MarkingMode.ES_TeamApproval:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_STM_Standardisation';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(key, className, classificationType, undefined);
                break;
            case enums.MarkingMode.Seeding:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_Seed';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(key, className, classificationType, undefined);
                break;
        }
        _stdWorkListCell.setCellStyle('col-std-classify-items header-col');
        _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
        // Logic to create empty frozen column for Practice/Seed/STM/Qualifcation Labels.
        var emptygridCell;
        emptygridCell = new gridCell();
        emptygridCell.setCellStyle('col-response header-col');
        _stdWorkListRowHeaderCellcollection.push(emptygridCell);
        var cssClass = 'classify-items-row';
        // Creating the table row collection.
        return this.getGridRow(classificationType.toString(), _stdWorkListRowHeaderCellcollection, undefined, cssClass);
    };
    /**
     * Get Unfrozen Empty Rows for Practice/Approval/STD.. Banners.
     * @param gridColumns
     * @param noOfQuestions
     */
    ClassifiedHelper.prototype.getEmptyRows = function (gridColumns, noOfQuestions, gridType) {
        var _classifiedCell;
        var _classifiedRowHeaderCellcollection = new Array();
        // Create cells for Columns returned from JSON File.
        for (var gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
            _classifiedCell = new gridCell();
            var cellStyle = gridColumns[gridColumnCount].CssClass ? gridColumns[gridColumnCount].CssClass : '';
            _classifiedCell.setCellStyle(cellStyle);
            _classifiedRowHeaderCellcollection.push(_classifiedCell);
        }
        // Create cells for individual questions.
        for (var gridColumnCount = 0; gridColumnCount < noOfQuestions; gridColumnCount++) {
            _classifiedCell = new gridCell();
            var cellStyle = 'col-question-item';
            _classifiedCell.setCellStyle(cellStyle);
            _classifiedRowHeaderCellcollection.push(_classifiedCell);
        }
        if (gridType === enums.GridType.markByQuestion) {
            //Adding the 'last-cell' column as this column is not added to classified worklst by default
            _classifiedCell = new gridCell();
            var cellStyle = 'last-cell';
            _classifiedCell.setCellStyle(cellStyle);
            _classifiedRowHeaderCellcollection.push(_classifiedCell);
        }
        // return the cell Collection.
        return _classifiedRowHeaderCellcollection;
    };
    /**
     * sort Classfied Response Based on Rig Order/Display Id
     * @param classifiedResponseListData
     * @param isSeed
     */
    ClassifiedHelper.prototype.sortClassifiedResponseList = function (classifiedResponseListData, isSeed) {
        if (isSeed === void 0) { isSeed = false; }
        // sort seed responses based on ascending order of display id
        // as they have no rig order.
        // for other types, use rig order as the sort column.
        if (isSeed) {
            return Immutable.List(classifiedResponseListData.sort(function (order1, order2) {
                return parseInt(order1.displayId) - parseInt(order2.displayId);
            }));
        }
        else {
            return Immutable.List(classifiedResponseListData.sort(function (order1, order2) {
                return order1.rigOrder - order2.rigOrder;
            }));
        }
    };
    return ClassifiedHelper;
}(standardisationSetupHelperBase));
module.exports = ClassifiedHelper;
//# sourceMappingURL=classifiedhelper.js.map
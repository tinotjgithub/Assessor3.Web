import React = require('react');
import enums = require('../../enums');
import gridRow = require('../../../utility/grid/gridrow');
import gridColumnNames = require('../gridcolumnnames');
import gridCell = require('../../../utility/grid/gridcell');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import Immutable = require('immutable');
import GenericTextColumn = require('../../../worklist/shared/generictextcolumn');
import localeStore = require('../../../../stores/locale/localestore');
import stdSetupPermissionHelper = require('../../../../utility/standardisationsetup/standardisationsetuppermissionhelper');
import qigStore = require('../../../../stores/qigselector/qigstore');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import standardisationSetupHelperBase = require('./standardisationsetuphelperbase');
let standardisationSetupGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import standardisationTargetDetail = require('../../../../stores/standardisationsetup/typings/standardisationtargetdetail');

/**
 * Helper class for Classified grid view
 */
class ClassifiedHelper extends standardisationSetupHelperBase {

    // Get the worklists that should be hide when the Standardisation Permission CC Configured.
    private _hiddenStdWorklists: Immutable.List<enums.MarkingMode> = standardisationSetupStore.instance.getHiddenWorklists();

    /* Grid rows collection */
    public _classifiedListCollection: Immutable.List<gridRow>;

    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param classifedResponseData 
     * @param tabSelection 
     * @param gridType 
     */
    public generateStandardisationRowDefinion(comparerName: string, sortDirection: enums.SortDirection,
        tabSelection: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        this._stdSetUpWorkListCollection = Immutable.List<gridRow>();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        this._stdSetUpWorkListCollection = this.getRowDefinition(tabSelection, gridType);
        return this._stdSetUpWorkListCollection;
    }

	/**
	 * Returns the row definition for classifed worklist
	 * @param tabSelection 
	 * @param gridType
	 */
    private getRowDefinition(tabSelection: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        let index: number = 0;
        let _classifiedRowCollection = Array<gridRow>();
        let _classifiedRowHeaderCellcollection = Array<gridCell>();
        let _classifiedResponseListData: Immutable.List<StandardisationResponseDetails>;
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, tabSelection,
            false, gridType);
        let _stdSetupResponseDetails: Immutable.List<StandardisationResponseDetails> =
            standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;

        let marksCount =
            Immutable.List(_stdSetupResponseDetails).count() > 0 && _stdSetupResponseDetails.first().standardisationMarks ?
            Immutable.List<ResponseMarkDetails>(_stdSetupResponseDetails.first().standardisationMarks).count() : 0;

        // 1. PRACTICE
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.Practice))) {

            // Creating the grid row collection.
            _classifiedRowCollection.push(
                this.getGridRow(
                    '2',
                    this.getEmptyRows(gridColumns, marksCount, gridType),
                    null,
                    'classify-items-row'
                ));

            // Sort Response based on  rig order.
            _classifiedResponseListData =
                standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.Practice);

            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(
                        this.getRowData(_classifiedResponseListData, gridColumns, gridType,
                            index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            } else {
                _classifiedRowCollection.push(
                    this.getGridRow('2', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }

        // 2. APPROVAL
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.Approval))) {

            // Creating the grid row collection.
            _classifiedRowCollection.push(
                this.getGridRow(
                    '3',
                    this.getEmptyRows(gridColumns, marksCount, gridType),
                    null,
                    'classify-items-row'
                ));

            // Sort Response based on  rig order.
            _classifiedResponseListData =
                standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.Approval);

            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(
                        this.getRowData(_classifiedResponseListData, gridColumns, gridType,
                            index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            } else {
                _classifiedRowCollection.push(
                    this.getGridRow('3', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }

        // 3. ES TEAM APPROVAL
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.ES_TeamApproval))) {

            // Creating the grid row collection.
            _classifiedRowCollection.push(
                this.getGridRow(
                    '4',
                    this.getEmptyRows(gridColumns, marksCount, gridType),
                    null,
                    'classify-items-row'
                ));

            // Sort Response based on  rig order.
            _classifiedResponseListData =
                standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.ES_TeamApproval);

            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(
                        this.getRowData(_classifiedResponseListData, gridColumns, gridType,
                            index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            } else {
                _classifiedRowCollection.push(
                    this.getGridRow('4', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }

        // 4. SEED
        // Add response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists &&
                !this._hiddenStdWorklists.contains(enums.MarkingMode.Seeding))) {

            // Creating the grid row collection.
            _classifiedRowCollection.push(
                this.getGridRow(
                    '70',
                    this.getEmptyRows(gridColumns, marksCount, gridType),
                    null,
                    'classify-items-row'
                ));

            // Sort Response based on  rig order.
            _classifiedResponseListData =
                standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.Seeding);

            // Check whether data exist, if not add empty row.
            if (_classifiedResponseListData.count() > 0) {
                _classifiedRowCollection =
                    _classifiedRowCollection.concat(
                        this.getRowData(_classifiedResponseListData, gridColumns, gridType,
                            index, enums.StandardisationSetup.ClassifiedResponse));
                index = index + _classifiedResponseListData.count();
            } else {
                _classifiedRowCollection.push(
                    this.getGridRow('70', this.getEmptyRows(gridColumns, marksCount, gridType), undefined, 'placeholder-row'));
            }
        }

        // Return the complete row collection.
        this._classifiedListCollection = Immutable.fromJS(_classifiedRowCollection);
        return this._classifiedListCollection;
    }

	/**
	 * generateStandardisationFrozenRowBody is used for generating row collection for STD WorkList Grid
	 * @param standardisationSetupType 
	 * @param gridType 
	 */
    public generateStandardisationFrozenRowBody(comparerName: string, sortDirection: enums.SortDirection,
        standardisationSetupType: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        // Get frozen column collection.
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);

        // Get the Frozen row body for STD Worklist
        let _stdWorkListFrozenRowBodyCollection = this.getFrozenRowBody(standardisationSetupType,
            gridType
        );
        return _stdWorkListFrozenRowBodyCollection;
    }

	/**
	 * Method for getting the frozen row body for STD worklist
	 * @param standardisationSetupType 
	 * @param gridType 
	 */
    public getFrozenRowBody(standardisationSetupType: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        let index: number = 0;
        let _stdWorkListRowHeaderCellcollection = Array<gridCell>();
        let _stdWorkListRowCollection = Array<gridRow>();
        let _stdWorkListCell: gridCell;
        let _stdResponseListData: any;
        let gridColumns = this.getGridColumns(
            this.resolvedGridColumnsJson,
            enums.StandardisationSetup.ClassifiedResponse,
            true,
            gridType
        );

        // Flag to check whether target exceeded.
        let overClassified: boolean = false;

        // 1. PRACTICE
        // Add practice response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists && !this._hiddenStdWorklists.contains(enums.MarkingMode.Practice))) {

            // Sort Response based on Rig order.
            _stdResponseListData =
                standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.Practice).toArray();
            _stdWorkListRowHeaderCellcollection = new Array();

            // Add Empty banner for Practice
            _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.Practice));

            if (_stdResponseListData.length > 0) {
                // Loop through response details.
                for (let pracResponseCount = 0; pracResponseCount < _stdResponseListData.length; pracResponseCount++) {
                    // Getting the std worklist data row     
                    let stdResponseData: StandardisationResponseDetails = _stdResponseListData[pracResponseCount];

                    // Check whetehr the classifcation type exceeded the current target,
                    // and Practice available in restricted target.
                    // if so highlight the exceeded last rows with amber color.
                    overClassified =
                        this.isSSUTargetsOverClassified(standardisationSetupType, enums.MarkingMode.Practice, stdResponseData.rigOrder);

                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, overClassified));
                    index++;
                }
            } else {
                for (let gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                    _stdWorkListCell = new gridCell();
                    let cellStyle =
                        gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                            'col-response header-col' : 'col-std-classify-items header-col';
                    _stdWorkListCell.setCellStyle(cellStyle);
                    _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                }

                // Creating the table row collection.
                _stdWorkListRowCollection.push(
                    this.getGridRow('2', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
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
                standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.Approval).toArray();
            _stdWorkListRowHeaderCellcollection = new Array();

            // Add Empty banner for Approval
            _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.Approval));

            if (_stdResponseListData.length > 0) {
                // Loop through response details.
                for (let approvalResponseCount = 0; approvalResponseCount < _stdResponseListData.length; approvalResponseCount++) {
                    // Getting the std worklist data row     
                    let stdResponseData: StandardisationResponseDetails = _stdResponseListData[approvalResponseCount];

                    // Check whetehr the classifcation type exceeded the current target,
                    // and Standardisation available in restricted target.
                    // if so highlight the exceeded last rows with amber color.
                    overClassified =
                        this.isSSUTargetsOverClassified(standardisationSetupType, enums.MarkingMode.Approval, stdResponseData.rigOrder);

                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, overClassified));
                    index++;
                }
            } else {
                for (
                    let gridColumnCount = 0;
                    gridColumnCount < gridColumns.length;
                    gridColumnCount++
                ) {
                    _stdWorkListCell = new gridCell();
                    let cellStyle =
                        gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                            'col-response header-col' : 'col-std-classify-items header-col';
                    _stdWorkListCell.setCellStyle(cellStyle);
                    _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                }

                // Creating the table row collection.
                _stdWorkListRowCollection.push(
                    this.getGridRow('3', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
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
                standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.ES_TeamApproval)
                    .toArray();
            _stdWorkListRowHeaderCellcollection = new Array();

            // Add Empty banner for ES_TeamApproval
            _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.ES_TeamApproval));

            if (_stdResponseListData.length > 0) {
                // Loop through response details.
                for (let esTeamResponseCount = 0; esTeamResponseCount < _stdResponseListData.length; esTeamResponseCount++) {
                    // Getting the std worklist data row     
                    let stdResponseData: StandardisationResponseDetails = _stdResponseListData[esTeamResponseCount];

                    // Check whetehr the classifcation type exceeded the current target,
                    // and STM Standardisation available in restricted target.
                    // if so highlight the exceeded last rows with amber color.
                    overClassified =
                        this.isSSUTargetsOverClassified(standardisationSetupType,
                            enums.MarkingMode.ES_TeamApproval, stdResponseData.rigOrder);

                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, overClassified));
                    index++;
                }
            } else {
                for (let gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                    _stdWorkListCell = new gridCell();
                    let cellStyle =
                        gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                            'col-response header-col' : 'col-std-classify-items header-col';
                    _stdWorkListCell.setCellStyle(cellStyle);
                    _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                }

                // Creating the table row collection.
                _stdWorkListRowCollection.push(
                    this.getGridRow('4', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
            }
            // Reset to false.
            overClassified = false;
        }

        // 4. SEED
        // Add Seed response details to grid based on permissions.
        if (!this._hiddenStdWorklists ||
            (this._hiddenStdWorklists && !this._hiddenStdWorklists.contains(enums.MarkingMode.Seeding))) {
                _stdResponseListData =
                    standardisationSetupStore.instance.getClassifiedResponsesInSortOrderByMarkingMode(enums.MarkingMode.Seeding).toArray();
                _stdWorkListRowHeaderCellcollection = new Array();

                // Add Empty banner for Seeding
                _stdWorkListRowCollection.push(this.getFrozenEmptyBannerForClassificationType(enums.MarkingMode.Seeding));

                if (_stdResponseListData.length > 0) {
                    // Loop through response details.
                    for (let seedResponseCount = 0; seedResponseCount < _stdResponseListData.length; seedResponseCount++) {
                        // Getting the std worklist data row     
                        let stdResponseData: StandardisationResponseDetails = _stdResponseListData[seedResponseCount];

                        // Creating the table row collection.
                        _stdWorkListRowCollection.push(this.getFrozenRowData(stdResponseData, gridType, gridColumns, index, false));
                        index++;
                    }
                } else {
                    for (let gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                        _stdWorkListCell = new gridCell();
                        let cellStyle =
                            gridColumns[gridColumnCount].GridColumn === 'ResponseIdColumn' ?
                                'col-response header-col' : 'col-std-classify-items header-col';
                        _stdWorkListCell.setCellStyle(cellStyle);
                        _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                    }

                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(
                        this.getGridRow('70', _stdWorkListRowHeaderCellcollection, undefined, 'placeholder-row'));
                }

                // Reset to false.
                overClassified = false;
            }

        // Return the complete row collection.
        let _stdWorkListFrozenRowBodyCollection = Immutable.fromJS(_stdWorkListRowCollection);
        return _stdWorkListFrozenRowBodyCollection;
    }

    /**
     * Method to create empty banner for Different classification Type.
     * @param classificationType
     */
    private getFrozenEmptyBannerForClassificationType(classificationType: enums.MarkingMode): gridRow {
        let className: string;
        let _stdWorkListCell: gridCell;
        let key: string;
        let _stdWorkListRowHeaderCellcollection = new Array<gridCell>();

        // Go through classification Type and create corresponding Banner.
        switch (classificationType) {
            case enums.MarkingMode.Practice:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_Practice';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(
                    key,
                    className,
                    classificationType,
                    undefined
                );
                break;
            case enums.MarkingMode.Approval:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_Standardisation';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(
                    key,
                    className,
                    classificationType,
                    undefined
                );
                break;
            case enums.MarkingMode.ES_TeamApproval:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_STM_Standardisation';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(
                    key,
                    className,
                    classificationType,
                    undefined
                );
                break;
            case enums.MarkingMode.Seeding:
                _stdWorkListCell = new gridCell();
                key = 'Empty_Banner_Seed';
                className = 'header-data classify-item-text dark-link';
                _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(
                    key,
                    className,
                    classificationType,
                    undefined
                );
                break;
        }

        _stdWorkListCell.setCellStyle('col-std-classify-items header-col');
        _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);

        // Logic to create empty frozen column for Practice/Seed/STM/Qualifcation Labels.
        let emptygridCell: gridCell;
        emptygridCell = new gridCell();

        emptygridCell.setCellStyle('col-response header-col');
        _stdWorkListRowHeaderCellcollection.push(emptygridCell);
        let cssClass = 'classify-items-row';

        // Creating the table row collection.
        return this.getGridRow(
            classificationType.toString(),
            _stdWorkListRowHeaderCellcollection,
            undefined,
            cssClass
        );
    }

    /**
     * Get Unfrozen Empty Rows for Practice/Approval/STD.. Banners.
     * @param gridColumns
     * @param noOfQuestions
     */
    private getEmptyRows(gridColumns: any, noOfQuestions: number, gridType: enums.GridType): Array<gridCell> {
        let _classifiedCell: gridCell;
        let _classifiedRowHeaderCellcollection = new Array<gridCell>();

        // Create cells for Columns returned from JSON File.
        for (let gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
            _classifiedCell = new gridCell();
            let cellStyle = gridColumns[gridColumnCount].CssClass ? gridColumns[gridColumnCount].CssClass : '';
            _classifiedCell.setCellStyle(cellStyle);
            _classifiedRowHeaderCellcollection.push(_classifiedCell);
        }

        // Create cells for individual questions.
        for (let gridColumnCount = 0; gridColumnCount < noOfQuestions; gridColumnCount++) {
            _classifiedCell = new gridCell();
            let cellStyle = 'col-question-item';
            _classifiedCell.setCellStyle(cellStyle);
            _classifiedRowHeaderCellcollection.push(_classifiedCell);
        }

        if (gridType === enums.GridType.markByQuestion) {
            //Adding the 'last-cell' column as this column is not added to classified worklst by default
            _classifiedCell = new gridCell();
            let cellStyle = 'last-cell';
            _classifiedCell.setCellStyle(cellStyle);
            _classifiedRowHeaderCellcollection.push(_classifiedCell);
        }
        // return the cell Collection.
        return _classifiedRowHeaderCellcollection;
    }
}

export = ClassifiedHelper;

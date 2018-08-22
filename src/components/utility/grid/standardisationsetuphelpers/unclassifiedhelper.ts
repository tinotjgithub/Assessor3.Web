import React = require('react');
import enums = require('../../enums');
import standardisationsetuphelperbase = require('./standardisationsetuphelperbase');
import gridRow = require('../../../utility/grid/gridrow');
import gridColumnNames = require('../gridcolumnnames');
import gridCell = require('../../../utility/grid/gridcell');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
let standardisationsetuptGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
import tagStore = require('../../../../stores/tags/tagstore');
let standardisationSetupGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
import Immutable = require('immutable');
import GenericTextColumn = require('../../../worklist/shared/generictextcolumn');
import RigOrder = require('../../../standardisationsetup/shared/rigorder');
import localeStore = require('../../../../stores/locale/localestore');
import stdSetupPermissionCCData = require('../../../../stores/standardisationsetup/typings/standardisationsetupccdata');
import stdSetupPermissionHelper = require('../../../../utility/standardisationsetup/standardisationsetuppermissionhelper');
import qigStore = require('../../../../stores/qigselector/qigstore');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import sortHelper = require('../../../../utility/sorting/sorthelper');
import submitHelper = require('../../submit/submithelper');


/**
 * Helper class for UnClassified grid view
 */
class UnClassifiedHelper extends standardisationsetuphelperbase {

    private _stdSetupPermissionCCValue: string = stdSetupPermissionHelper
        .getSTDSetupPermissionCCValueByMarkSchemeGroupId(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);

    /* Grid rows collection */
    public _unClassifiedListCollection: Immutable.List<gridRow>;

    /**
     * generateUnClassifiedFrozenRowBody is used for generating row collection for STD WorkList Grid
     * @param standardisationResponseListData
     * @param standardisationSetupType
     * @param gridType
     */
    public generateStandardisationFrozenRowBody(comparerName: string, sortDirection: enums.SortDirection,
        standardisationSetupType: enums.StandardisationSetup, gridType: enums.GridType): Immutable.List<gridRow> {

        // Get frozen column collection.
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);

        // Get the Frozen row body for STD Worklist
        let _stdWorkListFrozenRowBodyCollection = this.getFrozenRowBody(
            standardisationSetupType, gridType, comparerName);
        return _stdWorkListFrozenRowBodyCollection;
    }

    /**
     * Method for getting the frozen row body for STD worklist
     * @param comparerName 
     * @param standardisationSetupType 
     * @param gridType 
     */
    public getFrozenRowBody(standardisationSetupType: enums.StandardisationSetup,
        gridType: enums.GridType, comparerName: string): Immutable.List<gridRow> {

        let _stdWorkListRowHeaderCellcollection = Array<gridCell>();
        let _stdWorkListRowCollection = Array<gridRow>();
        let _stdResponseListData: Immutable.List<StandardisationResponseDetails>;
        let _stdResponseColumn: any;
        let componentPropsJson: any;
        let _stdWorkListCell: gridCell;
        let key: string;
        let cssClass: string;
        let submitResponseHelper: submitHelper = new submitHelper();

        _stdResponseListData = Immutable.List<StandardisationResponseDetails>(
            standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);

        if (_stdResponseListData != null) {
            let sortedUnclassifiedData = Immutable.List<StandardisationResponseDetails>(
                sortHelper.sort(_stdResponseListData.toArray(), comparerList[comparerName]));
            let previousMarkingMode: enums.MarkingMode = enums.MarkingMode.None;
            let gridSeq = Immutable.List<StandardisationResponseDetails>(_stdResponseListData).keySeq();
            let that = this;
            _stdResponseListData = sortedUnclassifiedData;
            sortedUnclassifiedData.forEach(function(stdResponseData, index){
                 // Getting the std worklist data row
                 _stdWorkListRowHeaderCellcollection = new Array();
                 // collection inside loop, its accessed
                 // outside the loop globally
                 let gridColumns = that.getGridColumns(that.resolvedGridColumnsJson, standardisationSetupType, true,
                     gridType);
                 let gridColumnLength = gridColumns.length;

                 // Getting the STD worklist columns
                 for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                     _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;
                     _stdWorkListCell = new gridCell();
                     componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                     //Switch statement for adding frozen columns in future.
                     switch (_stdResponseColumn) {
                         case gridColumnNames.ResponseIdColumn:
                             key = gridSeq.get(index) + '_ResponseIdColumn_' + gridColumnCount;
                             _stdWorkListCell.columnElement = that.getResponseIdColumnElement(stdResponseData,
                                 key,
                                 true);

                             _stdWorkListCell.setCellStyle('col-response header-col');
                             _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                             break;
                     }
                 }

                 if (stdResponseData) {
                     // Classify button enabling/disabling in unclassified worklist
                     let responseStatuses = submitResponseHelper.
                         submitButtonValidate(stdResponseData, stdResponseData.markingProgress, false, false);

                     // Creating the table row collection.
                     _stdWorkListRowCollection.push(
                         that.getGridRow(
                             stdResponseData.displayId.toString(),
                             _stdWorkListRowHeaderCellcollection,
                             undefined,
                             undefined,
                             responseStatuses
                         ));
                 }
            });
        }
        let _stdWorkListFrozenRowBodyCollection = Immutable.fromJS(_stdWorkListRowCollection);
        return _stdWorkListFrozenRowBodyCollection;
    }

    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param comparerName 
     * @param sortDirection 
     * @param tabSelection 
     * @param gridType 
     */
    public generateStandardisationRowDefinion(comparerName: string, sortDirection: enums.SortDirection,
        tabSelection: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        this._stdSetUpWorkListCollection = Immutable.List<gridRow>();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationsetuptGridColumnsJson);
        this._stdSetUpWorkListCollection = this.getRowDefinition(tabSelection, gridType, comparerName);
        return this._stdSetUpWorkListCollection;
    }

    /**
     * Returns the row definition for unclassifed worklist
     * @param tabSelection 
     * @param gridType 
     * @param comparerName 
     */
    private getRowDefinition(tabSelection: enums.StandardisationSetup, gridType: enums.GridType ,
        comparerName: string): Immutable.List<gridRow> {
        let _unClassifiedRowCollection = Array<gridRow>();
        let index = 0;
        let _unClassifiedData: any;
        let sortedData:  Immutable.List<StandardisationResponseDetails>;
        let _unClassifiedResponseListData: Immutable.List<StandardisationResponseDetails>;
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, tabSelection, false, gridType);
        _unClassifiedData = standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;
        _unClassifiedResponseListData = Immutable.List<StandardisationResponseDetails>(_unClassifiedData);
        sortedData = Immutable.List<StandardisationResponseDetails>(sortHelper.sort(
            _unClassifiedData, comparerList[comparerName]));
        if (_unClassifiedResponseListData.count() > 0){
            _unClassifiedRowCollection = this.getRowData(sortedData, gridColumns, gridType, index,
                enums.StandardisationSetup.UnClassifiedResponse);
        }
        this._unClassifiedListCollection = Immutable.fromJS(_unClassifiedRowCollection);
        return this._unClassifiedListCollection;
    }

    /**
     * Change json object to immutable list
     * @param data
     */
    private getImmutableUnclassifiedList(data: any): Immutable.List<StandardisationResponseDetails> {
        let immutableList: Immutable.List<StandardisationResponseDetails> = Immutable.List(data);
        data = immutableList;
        return data;
    }
}

export = UnClassifiedHelper;
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enums = require('../../enums');
var standardisationsetuphelperbase = require('./standardisationsetuphelperbase');
var gridColumnNames = require('../gridcolumnnames');
var gridCell = require('../../../utility/grid/gridcell');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var standardisationsetuptGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
var standardisationSetupGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
var Immutable = require('immutable');
var stdSetupPermissionHelper = require('../../../../utility/standardisationsetup/standardisationsetuppermissionhelper');
var qigStore = require('../../../../stores/qigselector/qigstore');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
var sortHelper = require('../../../../utility/sorting/sorthelper');
var submitHelper = require('../../submit/submithelper');
/**
 * Helper class for UnClassified grid view
 */
var UnClassifiedHelper = (function (_super) {
    __extends(UnClassifiedHelper, _super);
    function UnClassifiedHelper() {
        _super.apply(this, arguments);
        this._stdSetupPermissionCCValue = stdSetupPermissionHelper
            .getSTDSetupPermissionCCValueByMarkSchemeGroupId(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);
    }
    /**
     * generateUnClassifiedFrozenRowBody is used for generating row collection for STD WorkList Grid
     * @param standardisationResponseListData
     * @param standardisationSetupType
     * @param gridType
     */
    UnClassifiedHelper.prototype.generateStandardisationFrozenRowBody = function (comparerName, sortDirection, standardisationSetupType, gridType) {
        // Get frozen column collection.
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        // Get the Frozen row body for STD Worklist
        var _stdWorkListFrozenRowBodyCollection = this.getFrozenRowBody(standardisationSetupType, gridType, comparerName);
        return _stdWorkListFrozenRowBodyCollection;
    };
    /**
     * Method for getting the frozen row body for STD worklist
     * @param comparerName
     * @param standardisationSetupType
     * @param gridType
     */
    UnClassifiedHelper.prototype.getFrozenRowBody = function (standardisationSetupType, gridType, comparerName) {
        var _stdWorkListRowHeaderCellcollection = Array();
        var _stdWorkListRowCollection = Array();
        var _stdResponseListData;
        var _stdResponseColumn;
        var componentPropsJson;
        var _stdWorkListCell;
        var key;
        var cssClass;
        var submitResponseHelper = new submitHelper();
        _stdResponseListData = Immutable.List(standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);
        if (_stdResponseListData != null) {
            var sortedUnclassifiedData = Immutable.List(sortHelper.sort(_stdResponseListData.toArray(), comparerList[comparerName]));
            var previousMarkingMode = enums.MarkingMode.None;
            var gridSeq_1 = Immutable.List(_stdResponseListData).keySeq();
            var that_1 = this;
            _stdResponseListData = sortedUnclassifiedData;
            sortedUnclassifiedData.forEach(function (stdResponseData, index) {
                // Getting the std worklist data row
                _stdWorkListRowHeaderCellcollection = new Array();
                // collection inside loop, its accessed
                // outside the loop globally
                var gridColumns = that_1.getGridColumns(that_1.resolvedGridColumnsJson, standardisationSetupType, true, gridType);
                var gridColumnLength = gridColumns.length;
                // Getting the STD worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;
                    _stdWorkListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    switch (_stdResponseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq_1.get(index) + '_ResponseIdColumn_' + gridColumnCount;
                            _stdWorkListCell.columnElement = that_1.getResponseIdColumnElement(stdResponseData, key, true);
                            _stdWorkListCell.setCellStyle('col-response header-col');
                            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
                            break;
                    }
                }
                if (stdResponseData) {
                    // Classify button enabling/disabling in unclassified worklist
                    var responseStatuses = submitResponseHelper.
                        submitButtonValidate(stdResponseData, stdResponseData.markingProgress, false, false);
                    // Creating the table row collection.
                    _stdWorkListRowCollection.push(that_1.getGridRow(stdResponseData.displayId.toString(), _stdWorkListRowHeaderCellcollection, undefined, undefined, responseStatuses));
                }
            });
        }
        var _stdWorkListFrozenRowBodyCollection = Immutable.fromJS(_stdWorkListRowCollection);
        return _stdWorkListFrozenRowBodyCollection;
    };
    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param comparerName
     * @param sortDirection
     * @param tabSelection
     * @param gridType
     */
    UnClassifiedHelper.prototype.generateStandardisationRowDefinion = function (comparerName, sortDirection, tabSelection, gridType) {
        this._stdSetUpWorkListCollection = Immutable.List();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationsetuptGridColumnsJson);
        this._stdSetUpWorkListCollection = this.getRowDefinition(tabSelection, gridType, comparerName);
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Returns the row definition for unclassifed worklist
     * @param tabSelection
     * @param gridType
     * @param comparerName
     */
    UnClassifiedHelper.prototype.getRowDefinition = function (tabSelection, gridType, comparerName) {
        var _unClassifiedRowCollection = Array();
        var index = 0;
        var _unClassifiedData;
        var sortedData;
        var _unClassifiedResponseListData;
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, tabSelection, false, gridType);
        _unClassifiedData = standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;
        _unClassifiedResponseListData = Immutable.List(_unClassifiedData);
        sortedData = Immutable.List(sortHelper.sort(_unClassifiedData, comparerList[comparerName]));
        if (_unClassifiedResponseListData.count() > 0) {
            _unClassifiedRowCollection = this.getRowData(sortedData, gridColumns, gridType, index, enums.StandardisationSetup.UnClassifiedResponse);
        }
        this._unClassifiedListCollection = Immutable.fromJS(_unClassifiedRowCollection);
        return this._unClassifiedListCollection;
    };
    /**
     * Change json object to immutable list
     * @param data
     */
    UnClassifiedHelper.prototype.getImmutableUnclassifiedList = function (data) {
        var immutableList = Immutable.List(data);
        data = immutableList;
        return data;
    };
    return UnClassifiedHelper;
}(standardisationsetuphelperbase));
module.exports = UnClassifiedHelper;
//# sourceMappingURL=unclassifiedhelper.js.map
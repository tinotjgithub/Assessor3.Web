"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var standardisationsetuphelperbase = require('./standardisationsetuphelperbase');
var enums = require('../../enums');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var Immutable = require('immutable');
var standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
var standardisationSetupGridColumnsJson = require('../standardisationsetupgridcolumns.json');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var sortHelper = require('../../../../utility/sorting/sorthelper');
/**
 * Helper class for Classified grid view
 */
var ProvisionalHelper = (function (_super) {
    __extends(ProvisionalHelper, _super);
    function ProvisionalHelper() {
        _super.apply(this, arguments);
    }
    /**
     * generateStandardisationFrozenRowBody is used for generating row collection for STD WorkList Grid
     * @param standardisationSetupType
     * @param gridType
     */
    ProvisionalHelper.prototype.generateStandardisationFrozenRowBody = function (comparerName, sortDirection, standardisationSetupType, gridType) {
        // Get frozen column collection.
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        return this.generateFrozenRowBody(standardisationSetupStore.instance.standardisationSetupDetails, standardisationSetupType, gridType, comparerName, sortDirection);
    };
    /**
     * Gets Grid rows
     * @param tabSelection
     * @param gridType
     */
    ProvisionalHelper.prototype.generateStandardisationRowDefinion = function (comparerName, sortDirection, tabSelection, gridType) {
        this._stdSetUpWorkListCollection = Immutable.List();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        this._stdSetUpWorkListCollection = this.getRowDefinion(tabSelection, gridType, comparerName, sortDirection);
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Returns the row definition for provisional worklist
     * @param tabSelection
     * @param gridType
     */
    ProvisionalHelper.prototype.getRowDefinion = function (tabSelection, gridType, comparerName, sortDirection) {
        var sortedData;
        var _provisionalRowCollection = Array();
        var _provisionalRowHeaderCellcollection = Array();
        var _provisionalResponseListData;
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, tabSelection, false, gridType);
        var _stdSetupResponseDetails = standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;
        var marksCount = _stdSetupResponseDetails[0].standardisationMarks ?
            _stdSetupResponseDetails[0].standardisationMarks.length : 0;
        _provisionalResponseListData = Immutable.List(standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);
        sortedData = Immutable.List(sortHelper.sort(_provisionalResponseListData.toArray(), comparerList[comparerName]));
        _provisionalResponseListData = sortedData;
        if (_provisionalResponseListData.count() > 0) {
            _provisionalRowCollection =
                _provisionalRowCollection.concat(this.getRowData(_provisionalResponseListData, gridColumns, gridType, 0, enums.StandardisationSetup.ProvisionalResponse));
        }
        // Return the complete row collection.
        this._provisionalListCollection = Immutable.fromJS(_provisionalRowCollection);
        return this._provisionalListCollection;
    };
    return ProvisionalHelper;
}(standardisationsetuphelperbase));
module.exports = ProvisionalHelper;
//# sourceMappingURL=provisionalhelper.js.map
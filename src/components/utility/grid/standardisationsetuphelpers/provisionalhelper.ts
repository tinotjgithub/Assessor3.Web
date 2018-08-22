import React = require('react');
import standardisationsetuphelperbase = require('./standardisationsetuphelperbase');
import enums = require('../../enums');
import gridRow = require('../gridrow');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import gridCell = require('../gridcell');
import Immutable = require('immutable');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
let standardisationSetupGridColumnsJson = require('../standardisationsetupgridcolumns.json');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import sortHelper = require('../../../../utility/sorting/sorthelper');


/**
 * Helper class for Classified grid view
 */
class ProvisionalHelper extends standardisationsetuphelperbase {

    /* Grid rows collection */
    public _provisionalListCollection: Immutable.List<gridRow>;

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

        return this.generateFrozenRowBody(
            standardisationSetupStore.instance.standardisationSetupDetails,
            standardisationSetupType,
            gridType,
            comparerName,
            sortDirection);
    }

    /**
     * Gets Grid rows
     * @param tabSelection 
     * @param gridType 
     */
    public generateStandardisationRowDefinion(comparerName: string,
        sortDirection: enums.SortDirection,
        tabSelection: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        this._stdSetUpWorkListCollection = Immutable.List<gridRow>();
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        this._stdSetUpWorkListCollection = this.getRowDefinion(tabSelection, gridType, comparerName, sortDirection);
        return this._stdSetUpWorkListCollection;
    }

    /**
     * Returns the row definition for provisional worklist
     * @param tabSelection 
     * @param gridType
     */
    private getRowDefinion(tabSelection: enums.StandardisationSetup,
        gridType: enums.GridType,
        comparerName: string,
        sortDirection: enums.SortDirection): Immutable.List<gridRow> {
        let sortedData: Immutable.List<StandardisationResponseDetails>;
        let _provisionalRowCollection = Array<gridRow>();
        let _provisionalRowHeaderCellcollection = Array<gridCell>();
        let _provisionalResponseListData: Immutable.List<StandardisationResponseDetails>;
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, tabSelection, false, gridType);
        let _stdSetupResponseDetails: Immutable.List<StandardisationResponseDetails> =
            standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;
        let marksCount = _stdSetupResponseDetails.first().standardisationMarks ?
            Immutable.List<ResponseMarkDetails>(_stdSetupResponseDetails.first().standardisationMarks).count() : 0;

        _provisionalResponseListData = Immutable.List<StandardisationResponseDetails>
            (standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);
        sortedData = Immutable.List<StandardisationResponseDetails>(
            sortHelper.sort(_provisionalResponseListData.toArray(), comparerList[comparerName]));
        _provisionalResponseListData = sortedData;
        if (_provisionalResponseListData.count() > 0) {
            _provisionalRowCollection =
                _provisionalRowCollection.concat(
                    this.getRowData(_provisionalResponseListData, gridColumns, gridType, 0,
                        enums.StandardisationSetup.ProvisionalResponse));
        }

        // Return the complete row collection.
        this._provisionalListCollection = Immutable.fromJS(_provisionalRowCollection);
        return this._provisionalListCollection;
    }
}
export = ProvisionalHelper;
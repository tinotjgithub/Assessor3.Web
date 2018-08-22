/// <reference path='../../stores/markschemestructure/typings/markschemestructure.ts' />
import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class MarkSchemeStructureGetAction extends dataRetrievalAction {
    /**
     * holds list of markSchemeStructure list
     */
    private _markSchemeStructure: MarkSchemeStructure;

    /**
     * @Constructor.
     * @param {boolean} success
     * @param {any} markSchemeStructureList
     */
    constructor(success: boolean, markSchemeStructure: any) {
        // Map the collection
        super(action.Source.View, actionType.MARK_SCHEME_STRUCTURE_LOAD, success);
        this._markSchemeStructure = markSchemeStructure;
    }

    /**
     * Returns the mark Scheme Structure associated to the selected QIG.
     * @returns
     */
    public get markSchemeStructure() {
        return this._markSchemeStructure;
    }
}

export = MarkSchemeStructureGetAction;

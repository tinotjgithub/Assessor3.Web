import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class GetStandardisationSetupCentresDetailsAction extends dataRetrievalAction{

    private _standardisationCentreDetails: StandardisationCentreDetailsList;

    private _isTotalMarksViewSelected: boolean;

    /**
     * Constructor
     * @param success
     * @param json
     */
    constructor(success: boolean, stdWorklistViewType: enums.STDWorklistViewType, json?: StandardisationCentreDetailsList) {
        super(action.Source.View, actionType.GET_STANDARDISATION_CENTRE_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());

        this._standardisationCentreDetails = json;
        this._isTotalMarksViewSelected =
                stdWorklistViewType === enums.STDWorklistViewType.ViewTotalMarks ? true : false;
    }

    /**
     * returns the Standardisation Centre Details
     */
    public get StandardisationCentreDetailsList(): StandardisationCentreDetailsList {
        return this._standardisationCentreDetails;
    }

    /**
     * Returns the worklist view type
     * @readonly
     * @type {boolean}
     * @memberof GetStandardisationSetupCentresDetailsAction
     */
    public get isTotaMarksViewSelected(): boolean {
        return this._isTotalMarksViewSelected;
    }
}

export = GetStandardisationSetupCentresDetailsAction;
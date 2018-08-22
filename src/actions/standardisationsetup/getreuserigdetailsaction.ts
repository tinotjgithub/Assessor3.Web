import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class GetReuseRigDetailsAction extends dataRetrievalAction {

    private _standardisationSetupReusableDetailsList: Immutable.List<StandardisationResponseDetails>;
    private _isShowHiddenResponsesSelected: boolean;
    /**
     * Constructor
     * @param success
     * @param json
     */
    constructor(success: boolean, isShowHiddenResponse: boolean, json?: Immutable.List<StandardisationResponseDetails>) {
        super(action.Source.View, actionType.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._isShowHiddenResponsesSelected = isShowHiddenResponse;
        this._standardisationSetupReusableDetailsList = json;
    }

    /**
     * returns the Re-Use Rig Details
     */
    public get StandardisationSetupReusableDetailsList(): Immutable.List<StandardisationResponseDetails> {
        return this._standardisationSetupReusableDetailsList;
    }

    /**
     * Get show hidden response toggle value
     */
    public get ShowHiddenResponseSelected() {
        return this._isShowHiddenResponsesSelected;
    }
}
export = GetReuseRigDetailsAction;
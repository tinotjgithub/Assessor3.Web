import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class FamiliarisationAction extends dataRetrievalAction {

    private _isFamComponentsCreated: boolean;

    /**
     * Constructor
     * @param success
     */
    constructor(success: boolean,
        isFamComponentsCreated: boolean) {

        super(action.Source.View, actionType.CREATE_FAMILARISATION_DATA_ACTION, success);

        this._isFamComponentsCreated = isFamComponentsCreated;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{isCreatedSuccessfully}/g, isFamComponentsCreated.toString());
    }

    /**
     * Get the status of the Familiar data create action
     */
    public get isFamComponentsCreated() {
        return this._isFamComponentsCreated;
    }
}

export = FamiliarisationAction;
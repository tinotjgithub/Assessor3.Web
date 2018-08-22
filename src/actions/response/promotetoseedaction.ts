import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import promoteToSeedReturn = require('../../stores/response/typings/promotetoseedreturn');
/**
 * Action class for promote a response to seed
 */
class PromoteToSeedAction extends dataRetrievalAction {

    // local variable for promote to seed.
    private _promoteToSeedReturn: promoteToSeedReturn;

    /**
     * Constructor
     * @param success
     * @param promoteToSeedReturn
     */
    constructor(success: boolean, promoteToSeedReturn: promoteToSeedReturn) {
        super(action.Source.View, actionType.PROMOTE_TO_SEED, success);
        this._promoteToSeedReturn = promoteToSeedReturn;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Promote to seed return object
     */
    public get promoteToSeedReturn(): promoteToSeedReturn {
        return this._promoteToSeedReturn;
    }

}

export = PromoteToSeedAction;
